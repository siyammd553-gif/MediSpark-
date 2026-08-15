import { useState, useEffect } from 'react';
import { StudentProfile, UpcomingClass, WeakTopic, StudentDashboardData } from '../types';
import { useAuth } from '../context/AuthContext';
import { authApi, StudentProfileRecord } from './authApi';

const STUDENT_AVATAR_STORAGE_KEY = 'medispark_custom_student_avatar_v1';
const STUDENT_AVATAR_UPDATE_EVENT = 'medispark_student_avatar_updated';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

const EMPTY_STUDENT_PROFILE: StudentProfile = {
  id: '',
  name: '',
  avatar: DEFAULT_AVATAR,
  email: '',
  phone: '',
  batch: '',
  college: '',
  targetMedicalCollege: '',
  enrolledCoursesCount: 0,
  streakDays: 0,
  streakActiveToday: false,
  weeklyStreak: [],
  todayStudyTarget: { targetMinutes: 0, completedMinutes: 0, topics: [] },
  rank: 0,
  totalStudents: 0,
  overallScore: 0,
  meritPercentile: 0,
  completedClasses: 0,
  totalClasses: 0,
  upcomingLiveClasses: [],
  recentMockResults: [],
  weakTopics: [],
  notifications: [],
};

// All per-student records are namespaced by the authenticated Student Account ID.
function scopedKey(baseKey: string, accountId: string | null): string {
  return accountId ? `${baseKey}_${accountId}` : baseKey;
}

// Build the full StudentProfile ONLY from the authenticated student's own
// server record + per-account dashboard data. No hardcoded/demo student data.
function buildStudentProfile(
  record: StudentProfileRecord | null,
  dashboard: StudentDashboardData | null
): StudentProfile {
  return {
    id: record?.studentId || '',
    name: record?.name || '',
    avatar: record?.avatar || '',
    email: record?.email || '',
    phone: record?.phone || '',
    batch: record?.batch || '',
    college: record?.college || '',
    targetMedicalCollege: record?.targetMedicalCollege || '',
    enrolledCoursesCount: record?.enrolledCoursesCount ?? 0,
    streakDays: record?.streakDays ?? 0,
    streakActiveToday: record?.streakActiveToday ?? false,
    weeklyStreak: record?.weeklyStreak ?? [],
    todayStudyTarget: record?.todayStudyTarget ?? { targetMinutes: 0, completedMinutes: 0, topics: [] },
    rank: record?.rank ?? 0,
    totalStudents: record?.totalStudents ?? 0,
    overallScore: record?.overallScore ?? 0,
    meritPercentile: record?.meritPercentile ?? 0,
    completedClasses: record?.completedClasses ?? 0,
    totalClasses: record?.totalClasses ?? 0,
    upcomingLiveClasses: (record?.upcomingLiveClasses as UpcomingClass[]) ?? [],
    recentMockResults: dashboard?.examResults ?? [],
    weakTopics: (record?.weakTopics as WeakTopic[]) ?? [],
    notifications: dashboard?.notifications ?? [],
  };
}

export function getCustomStudentAvatar(accountId: string | null = null): string | null {
  try {
    return localStorage.getItem(scopedKey(STUDENT_AVATAR_STORAGE_KEY, accountId));
  } catch (e) {
    console.error('Failed to load custom student avatar', e);
    return null;
  }
}

export function saveStudentAvatar(imageDataUrl: string, accountId: string | null = null) {
  try {
    localStorage.setItem(scopedKey(STUDENT_AVATAR_STORAGE_KEY, accountId), imageDataUrl);
    window.dispatchEvent(new CustomEvent(STUDENT_AVATAR_UPDATE_EVENT, { detail: { avatarUrl: imageDataUrl } }));
  } catch (e) {
    console.error('Failed to save student avatar', e);
  }
}

export function resetStudentAvatar(accountId: string | null = null) {
  try {
    localStorage.removeItem(scopedKey(STUDENT_AVATAR_STORAGE_KEY, accountId));
    window.dispatchEvent(new CustomEvent(STUDENT_AVATAR_UPDATE_EVENT, { detail: { avatarUrl: null } }));
  } catch (e) {
    console.error('Failed to reset student avatar', e);
  }
}

export function useStudentAvatar(defaultAvatar: string = DEFAULT_AVATAR): {
  avatarUrl: string;
  isCustom: boolean;
  updateAvatar: (newUrl: string) => void;
  resetAvatar: () => void;
} {
  const { accountId } = useAuth();
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => getCustomStudentAvatar(accountId));

  useEffect(() => {
    setCustomAvatar(getCustomStudentAvatar(accountId));
  }, [accountId]);

  useEffect(() => {
    const handleUpdate = () => {
      setCustomAvatar(getCustomStudentAvatar(accountId));
    };

    window.addEventListener(STUDENT_AVATAR_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(STUDENT_AVATAR_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [accountId]);

  const avatarUrl = customAvatar || defaultAvatar;
  const isCustom = !!customAvatar;

  const updateAvatar = (newUrl: string) => {
    saveStudentAvatar(newUrl, accountId);
  };

  const resetAvatar = () => {
    resetStudentAvatar(accountId);
  };

  return {
    avatarUrl,
    isCustom,
    updateAvatar,
    resetAvatar,
  };
}

export function useStudentProfile(initialProfile: StudentProfile = EMPTY_STUDENT_PROFILE) {
  const { accountId, profile: serverProfile, dashboard, updateProfile: syncProfile } = useAuth();
  const { avatarUrl } = useStudentAvatar(serverProfile?.avatar || initialProfile.avatar);
  const [custom, setCustom] = useState<Partial<StudentProfile>>({});

  const base = buildStudentProfile(serverProfile, dashboard);

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    setCustom((prev) => ({ ...prev, ...updatedFields }));
    // Sync identity fields to the student's own server-side record (keyed by Account ID)
    if (accountId) {
      const serverFields: Partial<StudentProfileRecord> = {};
      for (const field of ['name', 'email', 'phone', 'batch', 'college', 'avatar', 'targetMedicalCollege'] as const) {
        if (updatedFields[field] !== undefined) {
          serverFields[field] = updatedFields[field] as string;
        }
      }
      if (Object.keys(serverFields).length > 0) {
        syncProfile(serverFields).catch((e) => {
          console.error('Failed to sync profile to server record', e);
        });
      }
    }
  };

  return {
    profile: {
      ...base,
      ...custom,
      avatar: avatarUrl,
    },
    updateProfile,
  };
}