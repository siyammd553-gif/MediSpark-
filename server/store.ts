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

export interface StudentDashboardData {
  enrolledCourseIds: string[];
  completedClassIds: string[];
  completedExamIds: Record<string, { bestScore: number; lastScore: number; attempts: number; timestamp: string }>;
  viewedPdfIds: string[];
  lastActivePosition: {
    courseId: string;
    segmentId: string;
    chapterId: string;
    classId?: string;
    tab?: string;
    lastUpdated?: string;
  } | null;
  recentlyViewed: {
    id: string;
    type: 'class' | 'chapter' | 'course';
    courseId: string;
    chapterId?: string;
    classId?: string;
    title: string;
    viewedAt: string;
  }[];
  favorites: {
    classes: unknown[];
    documents: unknown[];
    results: unknown[];
  };
  examResults: unknown[];
  notifications: unknown[];
}

export function emptyStudentDashboard(): StudentDashboardData {
  return {
    enrolledCourseIds: [],
    completedClassIds: [],
    completedExamIds: {},
    viewedPdfIds: [],
    lastActivePosition: null,
    recentlyViewed: [],
    favorites: { classes: [], documents: [], results: [] },
    examResults: [],
    notifications: [],
  };
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
  enrolledCourseIds: string[];
  enrolledCoursesCount: number;
  streakDays: number;
  streakActiveToday: boolean;
  rank: number;
  totalStudents: number;
  overallScore: number;
  meritPercentile: number;
  completedClasses: number;
  totalClasses: number;
  weeklyStreak: { day: string; studied: boolean; hours: number }[];
  todayStudyTarget: {
    targetMinutes: number;
    completedMinutes: number;
    topics: { id: string; title: string; subject: string; done: boolean }[];
  };
  upcomingLiveClasses: unknown[];
  weakTopics: unknown[];
  dashboard: StudentDashboardData;
  examAttempts: ExamAttempt[];
  activeExam: ActiveExamSession | null;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ExamQuestionSnapshot {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type ExamType = 'medical' | 'hsc';

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  courseId: string;
  chapterId: string;
  chapterTitle: string;
  subject: string;
  examType: ExamType;
  totalQuestions: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  negativePerWrong: number;
  negativeDeduction: number;
  finalScore: number;
  accuracy: number;
  submittedInSeconds: number;
  status: 'completed' | 'autosubmitted';
  submittedAt: string;
  answers: Record<string, number>;
}

export interface ActiveExamSession {
  examId: string;
  examTitle: string;
  courseId: string;
  chapterId: string;
  chapterTitle: string;
  subject: string;
  examType: ExamType;
  negativePerWrong: number;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  questions: ExamQuestionSnapshot[];
  answers: Record<string, number>;
  startedAt: string;
  lastSyncAt: string;
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

const DATA_DIR =
  process.env.MEDISPARK_DATA_DIR ||
  (process.env.VERCEL === '1' ? '/tmp/medispark-data' : path.join(process.cwd(), 'data'));
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
// Exam attempts + active exam sessions (keyed by Student Account ID)
// ---------------------------------------------------------------

export function getExamAttempts(accountId: string): ExamAttempt[] {
  const record = getStudentRecord(accountId);
  if (!record) return [];
  return Array.isArray(record.examAttempts) ? record.examAttempts : [];
}

export function appendExamAttempt(accountId: string, attempt: ExamAttempt): StudentRecord | null {
  const record = getStudentRecord(accountId);
  if (!record) return null;
  const attempts = getExamAttempts(accountId);
  record.examAttempts = [attempt, ...attempts];
  record.updatedAt = new Date().toISOString();
  saveStudentRecord(accountId, record);
  return record;
}

export function getActiveExam(accountId: string): ActiveExamSession | null {
  const record = getStudentRecord(accountId);
  if (!record || !record.activeExam) return null;
  return record.activeExam;
}

export function setActiveExam(accountId: string, session: ActiveExamSession | null): StudentRecord | null {
  const record = getStudentRecord(accountId);
  if (!record) return null;
  record.activeExam = session;
  record.updatedAt = new Date().toISOString();
  saveStudentRecord(accountId, record);
  return record;
}

export function mergeActiveExamAnswers(accountId: string, answers: Record<string, number>, lastSyncAt: string): StudentRecord | null {
  const record = getStudentRecord(accountId);
  if (!record || !record.activeExam) return null;
  const session = record.activeExam;
  const merged: Record<string, number> = { ...session.answers };
  for (const [key, value] of Object.entries(answers || {})) {
    merged[key] = value;
  }
  session.answers = merged;
  session.lastSyncAt = lastSyncAt;
  record.updatedAt = lastSyncAt;
  saveStudentRecord(accountId, record);
  return record;
}

// Score an active exam session into a final ExamAttempt using the stored
// question snapshot. The client never supplies correctness — the server
// is the source of truth for scoring.
export function scoreSession(
  session: ActiveExamSession,
  submittedInSeconds: number,
  status: 'completed' | 'autosubmitted'
): ExamAttempt {
  const questions = session.questions || [];
  const totalQuestions = session.totalQuestions || questions.length || 0;
  const negativePerWrong = session.negativePerWrong || 0;

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q, idx) => {
    const selected = session.answers[String(idx)];
    if (selected === undefined) {
      unattemptedCount++;
    } else if (selected === q.correctAnswerIndex) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const negativeDeduction = Number((wrongCount * negativePerWrong).toFixed(2));
  const rawScore = correctCount;
  const finalScore = Math.max(0, Number((rawScore - negativeDeduction).toFixed(2)));
  const attempted = correctCount + wrongCount;
  const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;

  return {
    id: `att-${session.courseId}-${session.examId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    examId: session.examId,
    examTitle: session.examTitle,
    courseId: session.courseId,
    chapterId: session.chapterId,
    chapterTitle: session.chapterTitle,
    subject: session.subject,
    examType: session.examType,
    totalQuestions,
    totalMarks: session.totalMarks,
    correctCount,
    wrongCount,
    unattemptedCount,
    negativePerWrong,
    negativeDeduction,
    finalScore,
    accuracy,
    submittedInSeconds: Math.max(0, Math.round(submittedInSeconds || 0)),
    status,
    submittedAt: new Date().toISOString(),
    answers: { ...session.answers },
  };
}

// Finalize (score + record + clear) any active exam for a student.
// Returns the recorded attempt, or null if there was no active exam.
export function finalizeActiveExam(
  accountId: string,
  submittedInSeconds: number,
  status: 'completed' | 'autosubmitted' = 'autosubmitted'
): ExamAttempt | null {
  const session = getActiveExam(accountId);
  if (!session) return null;
  const attempt = scoreSession(session, submittedInSeconds, status);
  appendExamAttempt(accountId, attempt);
  setActiveExam(accountId, null);
  return attempt;
}

// Aggregate all students' attempts for the nationwide merit leaderboard.
export interface LeaderboardEntry {
  accountId: string;
  studentId: string;
  name: string;
  college: string;
  avatar: string;
  targetMedicalCollege: string;
  merit: number;
  totalTimeSeconds: number;
  attemptsCount: number;
  lastAttemptAt: string;
}

export function buildLeaderboard(): LeaderboardEntry[] {
  ensureDataDir();
  const records = listStudentRecords();
  const entries: LeaderboardEntry[] = [];

  for (const record of records) {
    const attempts = Array.isArray(record.examAttempts) ? record.examAttempts : [];
    if (attempts.length === 0) continue;

    // Cumulative merit = sum of each student's best finalScore per exam.
    const bestByExam = new Map<string, ExamAttempt>();
    let totalTimeSeconds = 0;
    let lastAttemptAt = '';

    for (const attempt of attempts) {
      const current = bestByExam.get(attempt.examId);
      if (!current || attempt.finalScore > current.finalScore) {
        bestByExam.set(attempt.examId, attempt);
      }
      totalTimeSeconds += attempt.submittedInSeconds || 0;
      if (attempt.submittedAt > lastAttemptAt) lastAttemptAt = attempt.submittedAt;
    }

    let merit = 0;
    for (const attempt of bestByExam.values()) {
      merit += attempt.finalScore;
    }
    merit = Number(merit.toFixed(2));

    entries.push({
      accountId: record.accountId,
      studentId: record.studentId,
      name: record.name,
      college: record.college,
      avatar: record.avatar || '',
      targetMedicalCollege: record.targetMedicalCollege || 'Dhaka Medical College (DMC)',
      merit,
      totalTimeSeconds,
      attemptsCount: attempts.length,
      lastAttemptAt,
    });
  }

  // Equal marks: shorter submission time gets higher merit. Ties resolved
  // by earlier last-attempt timestamp.
  entries.sort(
    (a, b) =>
      b.merit - a.merit ||
      a.totalTimeSeconds - b.totalTimeSeconds ||
      a.lastAttemptAt.localeCompare(b.lastAttemptAt)
  );

  return entries;
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
    enrolledCourseIds: [],
    enrolledCoursesCount: 0,
    streakDays: 0,
    streakActiveToday: false,
    rank: 0,
    totalStudents: 0,
    overallScore: 0,
    meritPercentile: 0,
    completedClasses: 0,
    totalClasses: 0,
    weeklyStreak: [],
    todayStudyTarget: { targetMinutes: 0, completedMinutes: 0, topics: [] },
    upcomingLiveClasses: [],
    weakTopics: [],
    dashboard: emptyStudentDashboard(),
    examAttempts: [],
    activeExam: null,
    updatedAt: new Date().toISOString(),
  };
  saveStudentRecord(user.accountId, record);
  return record;
}

// Merge a partial dashboard update into a student's per-account record.
// Returns the updated record, or null if the student record does not exist.
export function mergeStudentDashboard(
  accountId: string,
  patch: Partial<StudentDashboardData> | null
): StudentRecord | null {
  const record = getStudentRecord(accountId);
  if (!record) return null;
  const existing = record.dashboard || emptyStudentDashboard();
  const dashboard: StudentDashboardData = { ...existing, ...(patch || {}) };
  record.dashboard = dashboard;
  record.enrolledCourseIds = Array.isArray(dashboard.enrolledCourseIds) ? dashboard.enrolledCourseIds : [];
  record.enrolledCoursesCount = record.enrolledCourseIds.length;
  record.updatedAt = new Date().toISOString();
  saveStudentRecord(accountId, record);
  return record;
}

// ---------------------------------------------------------------
// Demo Student Account seeding (per-account enrollment demo data)
// ---------------------------------------------------------------

export const DEMO_STUDENT_EMAIL = 'arafat.hossain@medispark.edu.bd';
export const DEMO_ENROLLED_COURSES = [
  'hsc-28-complete-biology',
  'medical-admission-hsc-28',
  'hsc-biology-2nd-paper',
];

// Backfills the seeded demo Student Account with its own enrollment list so
// the demo stays populated. Never applied to any other student account.
export function backfillDemoStudentEnrollments() {
  const demo = getUsers().find((u) => u.email === DEMO_STUDENT_EMAIL);
  if (!demo) return;
  const record = getStudentRecord(demo.accountId);
  if (!record) return;
  const existing = record.dashboard?.enrolledCourseIds ?? [];
  if (existing.length > 0) return;
  record.dashboard = { ...emptyStudentDashboard(), enrolledCourseIds: [...DEMO_ENROLLED_COURSES] };
  record.enrolledCourseIds = [...DEMO_ENROLLED_COURSES];
  record.enrolledCoursesCount = record.enrolledCourseIds.length;
  record.updatedAt = new Date().toISOString();
  saveStudentRecord(demo.accountId, record);
  console.log(`[store] Seeded demo student enrollments: ${record.enrolledCourseIds.join(', ')}`);
}

ensureDataDir();
