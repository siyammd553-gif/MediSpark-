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
} from './server/auth';
import { createStudentRecord, listStudentRecords, getUsers } from './server/store';

dotenv.config();

const app = express();
const PORT = 3000;

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

// Vite middleware for development or Static files for production
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediSpark Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
