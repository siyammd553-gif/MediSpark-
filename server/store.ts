import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  accountId: string; // Unique Student Account ID (login identity), e.g. MSP-2026-1001
  studentId: string; // Unique Student ID (academic identity), e.g. STD-2026-0001
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  batch: string;
  college: string;
  facebookId?: string;
  avatar?: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface SessionRecord {
  tokenHash: string; // SHA-256 of the session token (token itself is only sent to the client)
  accountId: string;
  createdAt: string;
  expiresAt: string;
}

export interface StudentRecord {
  accountId: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  college: string;
  facebookId?: string;
  avatar: string;
  targetMedicalCollege: string;
  enrolledCoursesCount: number;
  streakDays: number;
  updatedAt: string;
  [key: string]: unknown;
}

export interface OtpRecord {
  id: string;
  phone: string; // normalized phone the OTP was issued for
  purpose: 'register' | 'recover';
  otpHash: string; // SHA-256 of the OTP (never stored plaintext)
  expiresAt: string;
  attemptsUsed: number;
  maxAttempts: number;
  consumed: boolean;
  createdAt: string;
  resendCooldownUntil: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const SEQUENCES_FILE = path.join(DATA_DIR, 'sequences.json');
const OTPS_FILE = path.join(DATA_DIR, 'otps.json');
const STUDENTS_DIR = path.join(DATA_DIR, 'students');

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(STUDENTS_DIR, { recursive: true });
  for (const file of [USERS_FILE, SESSIONS_FILE, SEQUENCES_FILE, OTPS_FILE]) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]');
    }
  }
  if (!fs.existsSync(SEQUENCES_FILE) || fs.readFileSync(SEQUENCES_FILE, 'utf8').trim() === '[]') {
    fs.writeFileSync(SEQUENCES_FILE, JSON.stringify({ accountSeq: 1000, studentSeq: 0 }));
  }
}

function readJsonFile<T>(file: string, fallback: T): T {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to read ${file}`, e);
    return fallback;
  }
}

function writeJsonFile(file: string, data: unknown) {
  ensureDataDir();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

// ---------------------------------------------------------------
// Users
// ---------------------------------------------------------------

export function getUsers(): AuthUser[] {
  return readJsonFile<AuthUser[]>(USERS_FILE, []);
}

export function saveUsers(users: AuthUser[]) {
  writeJsonFile(USERS_FILE, users);
}

export function findUserByEmail(email: string): AuthUser | undefined {
  const normalized = email.trim().toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === normalized);
}

export function findUserByAccountId(accountId: string): AuthUser | undefined {
  return getUsers().find((u) => u.accountId === accountId);
}

// Normalize a Bangladeshi contact number to the +8801XXXXXXXXX form.
// Accepts local (01XXXXXXXXX), with/without leading +880 or country code 880.
export function normalizePhone(phone: string): string {
  let p = (phone || '').trim();
  p = p.replace(/[\s\-()]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('880') && p.length >= 12) {
    p = p.slice(3);
    return `+880${p}`;
  }
  if (p.startsWith('0') && p.length === 11) {
    return `+880${p.slice(1)}`;
  }
  if (p.length === 10) {
    return `+880${p}`;
  }
  return p.startsWith('+880') ? p : `+880${p}`;
}

// Login identifier resolution: Student ID (STD-...), Account ID (MSP-...),
// Email, or Contact Number.
export function findUserByIdentifier(identifier: string): AuthUser | undefined {
  const value = (identifier || '').trim();
  if (!value) return undefined;
  const normalizedPhone = normalizePhone(value);
  return getUsers().find(
    (u) =>
      u.studentId.toLowerCase() === value.toLowerCase() ||
      u.accountId.toLowerCase() === value.toLowerCase() ||
      u.email.toLowerCase() === value.toLowerCase() ||
      normalizePhone(u.phone || '') === normalizedPhone ||
      u.phone === value
  );
}

export function findUserByPhone(phone: string): AuthUser | undefined {
  const normalized = normalizePhone(phone);
  return getUsers().find((u) => normalizePhone(u.phone || '') === normalized);
}

export function updateUserPassword(accountId: string, passwordHash: string, salt: string): AuthUser | undefined {
  const users = getUsers();
  const idx = users.findIndex((u) => u.accountId === accountId);
  if (idx === -1) return undefined;
  users[idx].passwordHash = passwordHash;
  users[idx].salt = salt;
  saveUsers(users);
  return users[idx];
}

// ---------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------

export function getSessions(): SessionRecord[] {
  return readJsonFile<SessionRecord[]>(SESSIONS_FILE, []);
}

export function saveSessions(sessions: SessionRecord[]) {
  writeJsonFile(SESSIONS_FILE, sessions);
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function pruneExpiredSessions() {
  const now = Date.now();
  const sessions = getSessions().filter((s) => new Date(s.expiresAt).getTime() > now);
  saveSessions(sessions);
  return sessions;
}

// ---------------------------------------------------------------
// One-Time Passwords (stored hashed; never plaintext)
// ---------------------------------------------------------------

export function getOtps(): OtpRecord[] {
  return readJsonFile<OtpRecord[]>(OTPS_FILE, []);
}

export function saveOtps(otps: OtpRecord[]) {
  writeJsonFile(OTPS_FILE, otps);
}

export function getActiveOtp(phone: string, purpose: 'register' | 'recover'): OtpRecord | undefined {
  const normalized = normalizePhone(phone);
  const now = Date.now();
  return getOtps().find(
    (o) =>
      o.phone === normalized &&
      o.purpose === purpose &&
      !o.consumed &&
      new Date(o.expiresAt).getTime() > now
  );
}

export function expireOldOtps() {
  const now = Date.now();
  const otps = getOtps().filter((o) => new Date(o.expiresAt).getTime() > now);
  saveOtps(otps);
  return otps;
}

export function saveOtpRecord(record: OtpRecord) {
  expireOldOtps();
  const otps = getOtps().filter((o) => o.id !== record.id);
  otps.push(record);
  saveOtps(otps);
}

// ---------------------------------------------------------------
// Sequences (Unique ID generation)
// ---------------------------------------------------------------

export function nextAccountId(): { accountId: string; studentId: string } {
  const seq = readJsonFile<{ accountSeq: number; studentSeq: number }>(SEQUENCES_FILE, {
    accountSeq: 1000,
    studentSeq: 0,
  });
  seq.accountSeq += 1;
  seq.studentSeq += 1;
  writeJsonFile(SEQUENCES_FILE, seq);
  const year = new Date().getFullYear();
  return {
    accountId: `MSP-${year}-${seq.accountSeq}`,
    studentId: `STD-${year}-${String(seq.studentSeq).padStart(4, '0')}`,
  };
}

// ---------------------------------------------------------------
// Student-specific records (one JSON file per student account)
// ---------------------------------------------------------------

export function getStudentRecord(accountId: string): StudentRecord | null {
  const file = path.join(STUDENTS_DIR, `${accountId}.json`);
  if (!fs.existsSync(file)) return null;
  return readJsonFile<StudentRecord>(file, null);
}

export function saveStudentRecord(accountId: string, record: StudentRecord) {
  const file = path.join(STUDENTS_DIR, `${accountId}.json`);
  writeJsonFile(file, record);
}

export function listStudentRecords(): StudentRecord[] {
  ensureDataDir();
  const files = fs.readdirSync(STUDENTS_DIR).filter((f) => f.endsWith('.json'));
  const records: StudentRecord[] = [];
  for (const file of files) {
    const record = readJsonFile<StudentRecord | null>(path.join(STUDENTS_DIR, file), null);
    if (record) records.push(record);
  }
  return records;
}

export function createStudentRecord(user: AuthUser): StudentRecord {
  const record: StudentRecord = {
    accountId: user.accountId,
    studentId: user.studentId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    batch: user.batch,
    college: user.college,
    facebookId: user.facebookId || '',
    avatar: user.avatar || '',
    targetMedicalCollege: 'Dhaka Medical College (DMC)',
    enrolledCoursesCount: 0,
    streakDays: 0,
    updatedAt: new Date().toISOString(),
  };
  saveStudentRecord(user.accountId, record);
  return record;
}

ensureDataDir();
