import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import {
  AuthUser,
  UserRole,
  findUserByEmail,
  findUserByPhone,
  findUserByIdentifier,
  getUsers,
  saveUsers,
  getSessions,
  saveSessions,
  pruneExpiredSessions,
  nextAccountId,
  createStudentRecord,
  getStudentRecord,
  saveStudentRecord,
  updateUserPassword,
  StudentRecord,
hashToken,
  normalizePhone,
  finalizeActiveExam,
  backfillDemoStudentEnrollments,
} from './store';
import { issueOtp, verifyOtp, checkSendAllowed } from './otp';
import { isSmsConfigured, sendSms } from './sms';

const SESSION_COOKIE = 'medispark_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PASSWORD_MIN_LENGTH = 6;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 15 * 60 * 1000;

// ---------------------------------------------------------------
// Password hashing (scrypt, salted, timing-safe verification)
// ---------------------------------------------------------------

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function createPassword(password: string): { salt: string; passwordHash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  return { salt, passwordHash: hashPassword(password, salt) };
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashPassword(password, salt), 'hex');
  const expected = Buffer.from(storedHash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

// ---------------------------------------------------------------
// Session management (HttpOnly cookie + server-side hashed token)
// ---------------------------------------------------------------

export function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function issueSession(res: Response, user: AuthUser, remember = true): string {
  pruneExpiredSessions();
  const token = crypto.randomBytes(32).toString('base64url');
  const sessions = getSessions().filter((s) => s.accountId !== user.accountId);
  sessions.push({
    tokenHash: hashToken(token),
    accountId: user.accountId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
  saveSessions(sessions);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // "Remember This Device" -> persistent cookie; otherwise session cookie
    // that is cleared when the browser closes.
    maxAge: remember ? SESSION_TTL_MS : undefined,
  });
  return token;
}

export function revokeSession(req: Request, res: Response) {
  const token = parseCookies(req)[SESSION_COOKIE];
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: 'lax', path: '/' });
  if (!token) return;
  pruneExpiredSessions();
  const tokenHash = hashToken(token);
  saveSessions(getSessions().filter((s) => s.tokenHash !== tokenHash));
}

export function getAuthenticatedUser(req: Request): AuthUser | null {
  pruneExpiredSessions();
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = hashToken(token);
  const session = getSessions().find(
    (s) => s.tokenHash === tokenHash && new Date(s.expiresAt).getTime() > Date.now()
  );
  if (!session) return null;
  return getUsers().find((u) => u.accountId === session.accountId) || null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  (req as Request & { user: AuthUser }).user = user;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & { user: AuthUser }).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: `Access denied. Requires role: ${roles.join(' or ')}.` });
    }
    next();
  };
}

export function sanitizeUser(user: AuthUser) {
  return {
    accountId: user.accountId,
    studentId: user.studentId,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    batch: user.batch,
    college: user.college,
    facebookId: user.facebookId || '',
    avatar: user.avatar || '',
    createdAt: user.createdAt,
  };
}

// ---------------------------------------------------------------
// Brute-force protection (in-memory, per email+IP)
// ---------------------------------------------------------------

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function attemptKey(req: Request, email: string): string {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  return `${email.toLowerCase()}|${ip}`;
}

function checkLoginLocked(req: Request, email: string): boolean {
  const entry = loginAttempts.get(attemptKey(req, email));
  if (!entry) return false;
  if (entry.lockedUntil > Date.now()) return true;
  loginAttempts.delete(attemptKey(req, email));
  return false;
}

function recordFailedLogin(req: Request, email: string) {
  const key = attemptKey(req, email);
  const entry = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= LOGIN_MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOGIN_LOCK_MS;
    entry.count = 0;
  }
  loginAttempts.set(key, entry);
}

function clearLoginAttempts(req: Request, email: string) {
  loginAttempts.delete(attemptKey(req, email));
}

// ---------------------------------------------------------------
// Seed accounts (created on first boot if absent)
// ---------------------------------------------------------------

export function seedAccounts() {
  const seeds: { name: string; email: string; password: string; role: UserRole; batch?: string; college?: string; phone?: string }[] = [
    {
      name: 'Academic Director (Admin)',
      email: 'admin@medispark.edu.bd',
      password: 'Admin@2026',
      role: 'admin',
      batch: 'Administration',
      college: 'MediSpark HQ',
      phone: '+880 1999-000000',
    },
    {
      name: 'Md. Siyam Talukder',
      email: 'siyam@medispark.edu.bd',
      password: 'Mentor@2026',
      role: 'teacher',
      batch: 'Faculty / MBBS, ShSMC',
      college: 'Shaheed Suhrawardy Medical College',
      phone: '+880 1711-000000',
    },
    {
      name: 'Md. Arafat Hossain',
      email: 'arafat.hossain@medispark.edu.bd',
      password: 'Student@2026',
      role: 'student',
      batch: 'HSC 28 Batch / Medical Aspirant',
      college: 'Dhaka College, Dhaka',
      phone: '+880 1712-345678',
    },
  ];

  for (const seed of seeds) {
    if (findUserByEmail(seed.email)) continue;
    const { accountId, studentId } = nextAccountId();
    const { salt, passwordHash } = createPassword(seed.password);
    const user: AuthUser = {
      accountId,
      studentId,
      role: seed.role,
      name: seed.name,
      email: seed.email.toLowerCase(),
      phone: seed.phone || '',
      batch: seed.batch || 'HSC 28 Batch / Medical Aspirant',
      college: seed.college || 'Not Set',
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };
    const users = getUsers();
    users.push(user);
    saveUsers(users);
    if (user.role === 'student') {
      createStudentRecord(user);
    }
    console.log(`[auth] Seeded ${user.role} account: ${user.email} (${accountId})`);
  }

  // Give the demo student account its own seeded enrollments (per-account).
  backfillDemoStudentEnrollments();
}

// ---------------------------------------------------------------
// Auth router
// ---------------------------------------------------------------

export const authRouter = express.Router();

// -----------------------------------------------------------------
// Helpers: registration field validation + account creation
// -----------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+8801[3-9]\d{8}$/;

function validateRegistrationFields(body: any): { error?: string; fields?: any } {
  const { name, email, phone, batch, college, facebookId, password } = body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { error: 'Full name is required.' };
  }
  if (name.trim().length > 120) {
    return { error: 'Full name is too long.' };
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return { error: 'A valid email address is required.' };
  }
  if (!phone || typeof phone !== 'string' || !PHONE_RE.test(normalizePhone(phone))) {
    return { error: 'A valid Bangladeshi contact number (+8801XXXXXXXXX) is required.' };
  }
  if (facebookId && typeof facebookId !== 'string') {
    return { error: 'Facebook ID must be text.' };
  }
  if (!password || typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
    return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }
  const avatar = typeof body?.avatar === 'string' && body.avatar.startsWith('data:image') ? body.avatar : '';
  return {
    fields: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: normalizePhone(phone),
      batch: typeof batch === 'string' && batch.trim() ? batch.trim() : 'HSC 28 Batch / Medical Aspirant',
      college: typeof college === 'string' && college.trim() ? college.trim() : 'Not Set',
      facebookId: typeof facebookId === 'string' ? facebookId.trim() : '',
      avatar,
      password,
    },
  };
}

function createStudentAccount(fields: {
  name: string;
  email: string;
  phone: string;
  batch: string;
  college: string;
  facebookId: string;
  avatar: string;
  password: string;
}): { user: AuthUser } {
  const { accountId, studentId } = nextAccountId();
  const { salt, passwordHash } = createPassword(fields.password);
  const user: AuthUser = {
    accountId,
    studentId,
    role: 'student',
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    batch: fields.batch,
    college: fields.college,
    facebookId: fields.facebookId,
    avatar: fields.avatar,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  createStudentRecord(user);
  return { user };
}

// -----------------------------------------------------------------
// OTP issuance + delivery (never returns the OTP outside dev mode)
// -----------------------------------------------------------------

const DEV_OTP_CONSOLE = process.env.DEV_OTP_CONSOLE === 'true';

function deliverOtp(req: Request, phone: string, otp: string, purpose: 'register' | 'recover') {
  if (isSmsConfigured()) {
    sendSms(phone, `Your MediSpark verification code is ${otp}. It expires in 10 minutes. Never share it.`).catch(() => {});
    return;
  }
  // Development-only fallback (no SMS gateway configured). Gated so it can
  // never happen in production. The OTP is never persisted client-side.
  if (process.env.NODE_ENV !== 'production') {
    if (DEV_OTP_CONSOLE) {
      // eslint-disable-next-line no-console
      console.log(`[dev-otp] ${purpose} code for ${phone}: ${otp}`);
    }
  }
}

function isDevOtpExposed(): boolean {
  return process.env.NODE_ENV !== 'production';
}

// Register: creates a Student account with unique Account ID + Student ID
authRouter.post('/register', (req, res) => {
  const validation = validateRegistrationFields(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  const fields = validation.fields!;
  if (findUserByEmail(fields.email)) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }
  if (findUserByPhone(fields.phone)) {
    return res.status(409).json({ error: 'An account with this contact number already exists. Please log in.' });
  }
  const { user } = createStudentAccount(fields);
  issueSession(res, user);
  res.status(201).json({ user: sanitizeUser(user), message: 'Registration successful.' });
});

// Step 1 of registration: validate fields, issue SMS OTP, keep fields client-side
authRouter.post('/send-register-otp', (req, res) => {
  const validation = validateRegistrationFields(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  const fields = validation.fields!;
  if (findUserByEmail(fields.email)) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }
  if (findUserByPhone(fields.phone)) {
    return res.status(409).json({ error: 'An account with this contact number already exists. Please log in.' });
  }

  const allow = checkSendAllowed(fields.phone);
  if (!allow.allowed) {
    return res.status(429).json({ error: allow.reason, retryAfterMs: allow.retryAfterMs });
  }

  const otp = issueOtp(fields.phone, 'register');
  deliverOtp(req, fields.phone, otp, 'register');

  res.json({
    message: 'A verification code has been sent to your mobile number.',
    expiresInSec: 600,
    // Dev-only: lets testers complete the flow without a real SMS gateway.
    ...(isDevOtpExposed() ? { devOtp: otp } : {}),
  });
});

// Step 2 of registration: verify OTP, create the account, issue a session
authRouter.post('/verify-register-otp', (req, res) => {
  const { otp } = req.body || {};
  const validation = validateRegistrationFields(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  const fields = validation.fields!;
  if (!otp || typeof otp !== 'string' || otp.length !== 6) {
    return res.status(400).json({ error: 'Please enter the 6-digit verification code.' });
  }
  if (findUserByEmail(fields.email)) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }
  if (findUserByPhone(fields.phone)) {
    return res.status(409).json({ error: 'An account with this contact number already exists. Please log in.' });
  }

  const result = verifyOtp(fields.phone, 'register', otp);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const { user } = createStudentAccount(fields);
  issueSession(res, user);
  res.status(201).json({
    user: sanitizeUser(user),
    message: 'Registration successful.',
    studentId: user.studentId,
  });
});

// Forgot password step 1: find account by identifier, send OTP to registered phone
authRouter.post('/forgot-password', (req, res) => {
  const { identifier } = req.body || {};
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    return res.status(400).json({ error: 'Please enter your Student ID, email, or contact number.' });
  }
  const user = findUserByIdentifier(identifier);
  // Generic response prevents account enumeration.
  if (!user || !user.phone) {
    return res.json({
      message: 'If an account matches, a verification code has been sent to the registered mobile number.',
    });
  }

  const allow = checkSendAllowed(user.phone);
  if (!allow.allowed) {
    return res.status(429).json({ error: allow.reason, retryAfterMs: allow.retryAfterMs });
  }

  const otp = issueOtp(user.phone, 'recover');
  deliverOtp(req, user.phone, otp, 'recover');

  res.json({
    message: 'If an account matches, a verification code has been sent to the registered mobile number.',
    expiresInSec: 600,
    ...(isDevOtpExposed() ? { devOtp: otp } : {}),
  });
});

// Forgot password step 2: verify OTP and set a new password
authRouter.post('/reset-password', (req, res) => {
  const { identifier, otp, newPassword } = req.body || {};
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    return res.status(400).json({ error: 'Please enter your Student ID, email, or contact number.' });
  }
  if (!otp || typeof otp !== 'string' || otp.length !== 6) {
    return res.status(400).json({ error: 'Please enter the 6-digit verification code.' });
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `New password must be at least ${PASSWORD_MIN_LENGTH} characters.` });
  }

  const user = findUserByIdentifier(identifier);
  if (!user || !user.phone) {
    return res.status(400).json({ error: 'Account not found. Please check your details.' });
  }

  const result = verifyOtp(user.phone, 'recover', otp);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const { salt, passwordHash } = createPassword(newPassword);
  updateUserPassword(user.accountId, passwordHash, salt);

  // Revoke all existing sessions for security after a password reset.
  saveSessions(getSessions().filter((s) => s.accountId !== user.accountId));

  res.json({ message: 'Password updated successfully. Please log in with your new password.' });
});

// Login: verifies credentials, issues a secure session cookie
authRouter.post('/login', (req, res) => {
  const { identifier, password, remember } = req.body || {};
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Student ID / Email / Contact Number and password are required.' });
  }
  if (checkLoginLocked(req, identifier)) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again after 15 minutes.' });
  }

  const user = findUserByIdentifier(identifier);
  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    recordFailedLogin(req, identifier);
    return res.status(401).json({ error: 'Invalid Student ID / Email / Contact Number or password.' });
  }

  clearLoginAttempts(req, identifier);
  issueSession(res, user, remember !== false);

  // Login from another device during an active exam: automatically submit the
  // previous exam (score + record it server-side, then clear the session).
  const previousAttempt = finalizeActiveExam(user.accountId, 0, 'autosubmitted');

  res.json({
    user: sanitizeUser(user),
    message: `Welcome back, ${user.name}!`,
    ...(previousAttempt
      ? {
          activeExamFinalized: {
            examTitle: previousAttempt.examTitle,
            finalScore: previousAttempt.finalScore,
            totalMarks: previousAttempt.totalMarks,
          },
        }
      : {}),
  });
});

// Logout: destroys the current session server-side and clears the cookie
authRouter.post('/logout', (req, res) => {
  revokeSession(req, res);
  // Any in-progress exam is treated as interrupted and auto-submitted.
  const user = getAuthenticatedUser(req);
  if (user) {
    finalizeActiveExam(user.accountId, 0, 'autosubmitted');
  }
  res.json({ message: 'Logged out successfully.' });
});

// Current session user
authRouter.get('/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });
  res.json({ user: sanitizeUser(user) });
});

// ---------------------------------------------------------------
// Student-specific records (auth required)
// ---------------------------------------------------------------

export function syncStudentRecordFromProfile(accountId: string, fields: Partial<StudentRecord>): StudentRecord | null {
  const existing = getStudentRecord(accountId);
  if (!existing) return null;
  const allowed: (keyof StudentRecord)[] = ['name', 'email', 'phone', 'batch', 'college', 'avatar', 'facebookId', 'targetMedicalCollege'];
  const updated: StudentRecord = { ...existing };
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updated[key] = fields[key] as never;
    }
  }
  updated.updatedAt = new Date().toISOString();
  saveStudentRecord(accountId, updated);
  return updated;
}

export { getStudentRecord, getSessions, saveSessions };
