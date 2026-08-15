import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  authRouter,
  requireAuth,
  requireRole,
  getAuthenticatedUser,
  getStudentRecord,
  syncStudentRecordFromProfile,
  sanitizeUser,
  seedAccounts,
} from './auth';
import { createStudentRecord, listStudentRecords, getUsers, mergeStudentDashboard } from './store';
import {
  getExamAttempts,
  getActiveExam,
  setActiveExam,
  mergeActiveExamAnswers,
  finalizeActiveExam,
  buildLeaderboard,
} from './store';

dotenv.config();

const app = express();

app.use(express.json());

// Seed default Admin / Teacher / Demo-Student accounts on first boot
seedAccounts();

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'MediSpark', timestamp: new Date().toISOString() });
});

// =============================================================
// CENTRAL AUTHENTICATION SYSTEM
// - Register / Login / Logout / Session (HttpOnly cookies)
// - Secure password hashing (scrypt + salt)
// - Role-based access control (student / teacher / admin)
// - Student-specific database records keyed by Student Account ID
// =============================================================
app.use('/api/auth', authRouter);

// Current authenticated account (client bootstraps session from here)
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser((req as express.Request & { user: any }).user) });
});

// Student-specific profile record (tied to the authenticated Student Account ID)
app.get('/api/student/profile', requireAuth, requireRole('student'), (req, res) => {
  const user = (req as express.Request & { user: any }).user;
  const record = getStudentRecord(user.accountId);
  if (!record) {
    const fresh = createStudentRecord(user);
    return res.json({ profile: fresh, account: sanitizeUser(user) });
  }
  res.json({ profile: record, account: sanitizeUser(user) });
});

app.patch('/api/student/profile', requireAuth, requireRole('student'), (req, res) => {
  const user = (req as express.Request & { user: any }).user;
  const updated = syncStudentRecordFromProfile(user.accountId, req.body || {});
  if (!updated) {
    return res.status(404).json({ error: 'Student record not found.' });
  }
  res.json({ profile: updated });
});

// Student-specific dashboard record (enrolled courses, progress, favorites,
// exam results, continue-learning, recently-viewed, notifications). Only the
// authenticated student's own Account ID can read/write these records.
app.get('/api/student/dashboard', requireAuth, requireRole('student'), (req, res) => {
  const user = (req as express.Request & { user: any }).user;
  const record = getStudentRecord(user.accountId);
  if (!record) {
    const fresh = createStudentRecord(user);
    return res.json({ profile: fresh, account: sanitizeUser(user) });
  }
  res.json({ profile: record, account: sanitizeUser(user) });
});

app.patch('/api/student/dashboard', requireAuth, requireRole('student'), (req, res) => {
  const user = (req as express.Request & { user: any }).user;
  const patch = req.body && typeof req.body === 'object' ? req.body : {};
  const record = mergeStudentDashboard(user.accountId, patch);
  if (!record) {
    return res.status(404).json({ error: 'Student record not found.' });
  }
  res.json({ profile: record, dashboard: record.dashboard });
});

// Student-specific database records (all future student features keyed by Account ID)
app.get('/api/student/records', requireAuth, (req, res) => {
  const user = (req as express.Request & { user: any }).user;
  res.json({
    accountId: user.accountId,
    studentId: user.studentId,
    role: user.role,
    record: getStudentRecord(user.accountId),
    // Namespaced client storage keys for this account (per-student data separation)
    storage: {
      profileKey: `medispark_custom_student_profile_v1_${user.accountId}`,
      avatarKey: `medispark_custom_student_avatar_v1_${user.accountId}`,
      learningKey: `medispark_student_learning_state_v1_${user.accountId}`,
      favoritesKey: `medispark_student_favorites_v1_${user.accountId}`,
      qnaKey: `medispark_qna_questions_v1_${user.accountId}`,
    },
  });
});

// Role-based access: Admin only
app.get('/api/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  res.json({
    total: getUsers().length,
    users: getUsers().map((u) => ({
      accountId: u.accountId,
      studentId: u.studentId,
      role: u.role,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
    })),
  });
});

// Role-based access: Teacher / Admin
app.get('/api/teacher/students', requireAuth, requireRole('teacher', 'admin'), (req, res) => {
  res.json({
    total: listStudentRecords().length,
    students: listStudentRecords().map((s) => ({
      accountId: s.accountId,
      studentId: s.studentId,
      name: s.name,
      batch: s.batch,
      college: s.college,
      updatedAt: s.updatedAt,
    })),
  });
});

// =============================================================
// ENROLLED COURSE EXAM SYSTEM (keyed by authenticated Student Account)
// - Active exam tracked server-side with a question snapshot
// - Every attempt is scored server-side and belongs to the student
// - Interrupted exams auto-submit; cross-device login finalizes them
// =============================================================

function activeStudentAccount(req: express.Request): string {
  return (req as express.Request & { user: any }).user.accountId as string;
}

function sanitizeQuestion(q: any) {
  return {
    id: String(q?.id || ''),
    question: String(q?.question || ''),
    options: Array.isArray(q?.options) ? q.options.map(String) : [],
    correctAnswerIndex: Number(q?.correctAnswerIndex ?? 0),
    explanation: String(q?.explanation || ''),
  };
}

// Start an exam: finalize any in-progress exam for this student first, then
// create a fresh server-side active session with the question snapshot.
app.post('/api/student/exams/start', requireAuth, requireRole('student'), (req, res) => {
  const accountId = activeStudentAccount(req);
  const body = req.body || {};

  const examId = String(body.examId || '');
  const courseId = String(body.courseId || '');
  if (!examId || !courseId) {
    return res.status(400).json({ error: 'examId and courseId are required.' });
  }

  const previousFinalized = finalizeActiveExam(accountId, 0, 'autosubmitted');

  const session = {
    examId,
    examTitle: String(body.examTitle || examId),
    courseId,
    chapterId: String(body.chapterId || ''),
    chapterTitle: String(body.chapterTitle || ''),
    subject: String(body.subject || 'Biology'),
    examType: body.examType === 'hsc' ? ('hsc' as const) : ('medical' as const),
    negativePerWrong: Number(body.negativePerWrong) || 0,
    totalQuestions: Number(body.totalQuestions) || (Array.isArray(body.questions) ? body.questions.length : 0),
    totalMarks: Number(body.totalMarks) || Number(body.totalQuestions) || 0,
    durationMinutes: Number(body.durationMinutes) || 0,
    questions: (Array.isArray(body.questions) ? body.questions : []).map(sanitizeQuestion),
    answers: {},
    startedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
  };

  const updated = setActiveExam(accountId, session);
  if (!updated) {
    return res.status(404).json({ error: 'Student record not found.' });
  }

  res.json({
    active: {
      examId: session.examId,
      examTitle: session.examTitle,
      courseId: session.courseId,
      startedAt: session.startedAt,
    },
    previousFinalized: previousFinalized
      ? {
          examTitle: previousFinalized.examTitle,
          finalScore: previousFinalized.finalScore,
          totalMarks: previousFinalized.totalMarks,
        }
      : null,
  });
});

// Live-sync the student's answers during the exam so a cross-device login
// (or interruption) can auto-submit the latest attempted answers.
app.post('/api/student/exams/sync', requireAuth, requireRole('student'), (req, res) => {
  const accountId = activeStudentAccount(req);
  const body = req.body || {};
  const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
  const updated = mergeActiveExamAnswers(accountId, answers, new Date().toISOString());
  if (!updated || !updated.activeExam) {
    return res.status(404).json({ error: 'No active exam session to sync.' });
  }
  res.json({ ok: true, synced: Object.keys(answers).length });
});

// Submit the active exam. The server scores it from the stored question
// snapshot and records the attempt for the authenticated student.
app.post('/api/student/exams/submit', requireAuth, requireRole('student'), (req, res) => {
  const accountId = activeStudentAccount(req);
  const body = req.body || {};
  const elapsedSeconds = Number(body.elapsedSeconds) || 0;
  const status: 'completed' | 'autosubmitted' = body.status === 'completed' ? 'completed' : 'autosubmitted';
  const attempt = finalizeActiveExam(accountId, elapsedSeconds, status);
  if (!attempt) {
    return res.status(404).json({ error: 'No active exam session to submit.' });
  }
  res.json({ attempt });
});

// The authenticated student's recorded attempts (newest first).
app.get('/api/student/exams/attempts', requireAuth, requireRole('student'), (req, res) => {
  const accountId = activeStudentAccount(req);
  res.json({ attempts: getExamAttempts(accountId) });
});

// Nationwide merit leaderboard: score desc, then shorter submission time wins.
app.get('/api/student/exams/leaderboard', requireAuth, requireRole('student'), (req, res) => {
  const accountId = activeStudentAccount(req);
  const entries = buildLeaderboard();
  const myEntry = entries.find((e) => e.accountId === accountId);
  const myRank = myEntry ? entries.indexOf(myEntry) + 1 : null;
  res.json({ entries, myRank, myEntry });
});

// AI Study Assistant / Doubt Solver API endpoint
app.post('/api/ai-tutor', async (req, res) => {
  const { prompt, studentName, weakTopics, targetCollege } = req.body;

  // Authenticated student context (optional; AI tutor stays usable for guests)
  const authUser = getAuthenticatedUser(req);
  const accountId = authUser?.accountId || 'guest';
  if (authUser) {
    console.log(`[ai-tutor] Request from account ${accountId} (${authUser.name})`);
  }

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = `
You are the Lead Medical Admission & HSC Academic Mentor for "MediSpark" (Tagline: "Together we Achieve Dreams").
The student asking the question is: ${studentName || 'Aspirant'}.
Their Target Medical College is: ${targetCollege || 'Dhaka Medical College (DMC)'}.
Their current identified weak topic areas from mock exams are: ${Array.isArray(weakTopics) ? weakTopics.join(', ') : 'Genetics Non-Mendelian Ratios, Organic Chemistry named reactions'}.

Guidelines:
1. Provide accurate, high-yield, structured explanations aligned with official Bangladesh NCTB Science textbooks (Gazi Ajmal, Abul Hasan, Dr. Soroj Kanti, etc.) and DGHS Medical Admission Test standard.
2. When answering biology or chemistry questions, include high-yield memory mnemonics, important exceptions, and highlight common exam traps (with negative marking warning -0.25).
3. Keep the tone encouraging, professional, doctorly, and student-friendly. Use bold bullet points and clear formatting.
4. Keep the response concise (2-4 paragraphs max) so it is fast to read.
5. In your response, give 3 short follow-up question ideas at the end separated by a special token '|||SUGGESTIONS|||' with a comma-separated list of short suggestions.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const fullReply = response.text || '';
    const parts = fullReply.split('|||SUGGESTIONS|||');
    const mainReply = parts[0].trim();
    let nextSuggestions: string[] = [];

    if (parts[1]) {
      nextSuggestions = parts[1]
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 80)
        .slice(0, 4);
    } else {
      nextSuggestions = [
        'Give me a rapid mnemonic for this topic',
        'Show 3 past DGHS medical questions on this',
        'How to avoid negative marking on this topic?',
      ];
    }

    res.json({
      reply: mainReply,
      nextSuggestions,
    });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    // Provide a smart clinical response fallback
    res.json({
      reply: `⚕ **MediSpark AI Medical Brief:**\n\nFor **${prompt}**, focus on high-yield NCTB textbook line memory and eliminate distractor options before choosing. Be cautious of negative marking (-0.25) in DGHS examinations.\n\n*Key Principle:* Master the exception cases, because admission examiners specifically target exceptions in biological classifications and organic reaction mechanisms.`,
      nextSuggestions: [
        'Show high-yield memory mnemonic',
        'Give me 5 practice MCQs',
        'What are the common DGHS exam traps in this chapter?',
      ],
    });
  }
});

// Production static/SPA serving (works locally AND inside the Vercel function)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Vercel serverless entry point: export the Express app (no app.listen on Vercel)
export default app;