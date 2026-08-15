import { StudentDashboardData } from '../types';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  accountId: string; // Unique Student Account ID
  studentId: string; // Unique Student ID
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  batch: string;
  college: string;
  facebookId?: string;
  avatar?: string;
  createdAt: string;
}

export interface StudentProfileRecord {
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
  streakActiveToday?: boolean;
  rank?: number;
  totalStudents?: number;
  overallScore?: number;
  meritPercentile?: number;
  completedClasses?: number;
  totalClasses?: number;
  weeklyStreak?: { day: string; studied: boolean; hours: number }[];
  todayStudyTarget?: {
    targetMinutes: number;
    completedMinutes: number;
    topics: { id: string; title: string; subject: string; done: boolean }[];
  };
  upcomingLiveClasses?: unknown[];
  weakTopics?: unknown[];
  dashboard?: StudentDashboardData;
  updatedAt: string;
}

export interface RegistrationFields {
  name: string;
  email: string;
  phone: string;
  batch: string;
  college: string;
  facebookId?: string;
  avatar?: string;
  password: string;
}

export interface OtpResponse {
  message: string;
  expiresInSec: number;
  devOtp?: string; // present only in development (no SMS gateway)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export { request as apiRequest };

export const authApi = {
  me: () => request<{ user: AuthUser }>('/api/auth/me'),

  register: (payload: { name: string; email: string; phone?: string; password: string }) =>
    request<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sendRegisterOtp: (payload: RegistrationFields) =>
    request<OtpResponse>('/api/auth/send-register-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyRegister: (payload: RegistrationFields & { otp: string }) =>
    request<{ user: AuthUser; message: string; studentId: string }>('/api/auth/verify-register-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (identifier: string) =>
    request<OtpResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),

  resetPassword: (payload: { identifier: string; otp: string; newPassword: string }) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { identifier: string; password: string; remember?: boolean }) =>
    request<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
      body: '{}',
    }),

  getStudentProfile: () =>
    request<{ profile: StudentProfileRecord; account: AuthUser }>('/api/student/profile'),

  updateStudentProfile: (fields: Partial<StudentProfileRecord>) =>
    request<{ profile: StudentProfileRecord }>('/api/student/profile', {
      method: 'PATCH',
      body: JSON.stringify(fields),
    }),

  getStudentRecords: () =>
    request<{ accountId: string; studentId: string; role: UserRole; record: StudentProfileRecord | null }>(
      '/api/student/records'
    ),

  getStudentDashboard: () =>
    request<{ profile: StudentProfileRecord; account: AuthUser }>('/api/student/dashboard'),

  updateStudentDashboard: (patch: Partial<StudentDashboardData>) =>
    request<{ profile: StudentProfileRecord; dashboard: StudentDashboardData }>('/api/student/dashboard', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  adminListUsers: () => request<{ total: number; users: AuthUser[] }>('/api/admin/users'),

  teacherListStudents: () =>
    request<{ total: number; students: StudentProfileRecord[] }>('/api/teacher/students'),
};
