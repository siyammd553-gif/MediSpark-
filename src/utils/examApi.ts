import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from './authApi';
import { useAuth } from '../context/AuthContext';
import { ExamAttempt, ExamType, LeaderboardEntry, Question } from '../types';

export interface StartExamPayload {
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
  questions: Question[];
}

export interface FinalizedSummary {
  examTitle: string;
  finalScore: number;
  totalMarks: number;
}

export interface StartExamResponse {
  active: { examId: string; examTitle: string; courseId: string; startedAt: string };
  previousFinalized: FinalizedSummary | null;
}

export interface SubmitExamResponse {
  attempt: ExamAttempt;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  myRank: number | null;
  myEntry: LeaderboardEntry | null;
}

export const EXAM_ATTEMPTS_UPDATED_EVENT = 'medispark_exam_attempts_updated';

export const examApi = {
  start: (payload: StartExamPayload) =>
    apiRequest<StartExamResponse>('/api/student/exams/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sync: (answers: Record<string, number>) =>
    apiRequest<{ ok: boolean; synced: number }>('/api/student/exams/sync', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  submit: (elapsedSeconds: number, status: 'completed' | 'autosubmitted' = 'completed') =>
    apiRequest<SubmitExamResponse>('/api/student/exams/submit', {
      method: 'POST',
      body: JSON.stringify({ elapsedSeconds, status }),
    }),

  attempts: () => apiRequest<{ attempts: ExamAttempt[] }>('/api/student/exams/attempts'),

  leaderboard: () => apiRequest<LeaderboardResponse>('/api/student/exams/leaderboard'),
};

// Notify consumers (attempts + leaderboard hooks) that new data is available.
export function notifyExamAttemptsUpdated(): void {
  window.dispatchEvent(new CustomEvent(EXAM_ATTEMPTS_UPDATED_EVENT));
}

// Fire-and-forget submit for page unload / tab close (interrupted exams).
export function beaconSubmitExam(elapsedSeconds: number): void {
  try {
    const payload = JSON.stringify({ elapsedSeconds, status: 'autosubmitted' });
    navigator.sendBeacon('/api/student/exams/submit', new Blob([payload], { type: 'application/json' }));
  } catch (e) {
    console.error('Failed to auto-submit interrupted exam via beacon', e);
  }
}

// The authenticated student's recorded exam attempts.
export function useExamAttempts() {
  const { isAuthenticated } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(() => {
    if (!isAuthenticated) {
      setAttempts([]);
      return;
    }
    setIsLoading(true);
    examApi
      .attempts()
      .then((res) => setAttempts(res.attempts || []))
      .catch((e) => console.error('Failed to load exam attempts', e))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.addEventListener(EXAM_ATTEMPTS_UPDATED_EVENT, load);
    return () => window.removeEventListener(EXAM_ATTEMPTS_UPDATED_EVENT, load);
  }, [load]);

  return { attempts, isLoading, refresh: load };
}

// Nationwide merit leaderboard (score desc; shorter submission time wins ties).
export function useLeaderboard() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(() => {
    if (!isAuthenticated) {
      setData(null);
      return;
    }
    setIsLoading(true);
    examApi
      .leaderboard()
      .then((res) => setData(res))
      .catch((e) => console.error('Failed to load leaderboard', e))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.addEventListener(EXAM_ATTEMPTS_UPDATED_EVENT, load);
    return () => window.removeEventListener(EXAM_ATTEMPTS_UPDATED_EVENT, load);
  }, [load]);

  return { leaderboard: data, isLoading, refresh: load };
}