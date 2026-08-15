import { useState, useEffect } from 'react';
import { INITIAL_STUDENT_PROFILE } from '../data/mockData';
import { StudentProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { authApi, StudentProfileRecord } from './authApi';

const STUDENT_AVATAR_STORAGE_KEY = 'medispark_custom_student_avatar_v1';
const STUDENT_PROFILE_STORAGE_KEY = 'medispark_custom_student_profile_v1';
const STUDENT_AVATAR_UPDATE_EVENT = 'medispark_student_avatar_updated';
const STUDENT_PROFILE_UPDATE_EVENT = 'medispark_student_profile_updated';

// All per-student records are namespaced by the authenticated Student Account ID.
function scopedKey(baseKey: string, accountId: string | null): string {
  return accountId ? `${baseKey}_${accountId}` : baseKey;
}

function serverRecordToProfile(record: StudentProfileRecord | null): Partial<StudentProfile> {
  if (!record) return {};
  return {
    id: record.studentId,
    name: record.name,
    email: record.email,
    phone: record.phone,
    batch: record.batch,
    college: record.college,
    avatar: record.avatar || INITIAL_STUDENT_PROFILE.avatar,
    targetMedicalCollege: record.targetMedicalCollege || INITIAL_STUDENT_PROFILE.targetMedicalCollege,
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

export function getStoredStudentProfile(accountId: string | null = null): Partial<StudentProfile> {
  try {
    const raw = localStorage.getItem(scopedKey(STUDENT_PROFILE_STORAGE_KEY, accountId));
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse student profile from storage', e);
    return {};
  }
}

export function saveStoredStudentProfile(updatedFields: Partial<StudentProfile>, accountId: string | null = null) {
  try {
    const current = getStoredStudentProfile(accountId);
    const merged = { ...current, ...updatedFields };
    localStorage.setItem(scopedKey(STUDENT_PROFILE_STORAGE_KEY, accountId), JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(STUDENT_PROFILE_UPDATE_EVENT, { detail: merged }));
  } catch (e) {
    console.error('Failed to save student profile to storage', e);
  }
}

export function useStudentAvatar(defaultAvatar: string = INITIAL_STUDENT_PROFILE.avatar): {
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

export function useStudentProfile(initialProfile: StudentProfile = INITIAL_STUDENT_PROFILE) {
  const { accountId, profile: serverProfile } = useAuth();
  const { avatarUrl } = useStudentAvatar(initialProfile.avatar);
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const custom = getStoredStudentProfile(accountId);
    return {
      ...initialProfile,
      ...serverRecordToProfile(serverProfile),
      ...custom,
      avatar: getCustomStudentAvatar(accountId) || custom.avatar || serverProfile?.avatar || initialProfile.avatar,
    };
  });

  useEffect(() => {
    const custom = getStoredStudentProfile(accountId);
    setProfile((prev) => ({
      ...initialProfile,
      ...serverRecordToProfile(serverProfile),
      ...custom,
      avatar: getCustomStudentAvatar(accountId) || custom.avatar || serverProfile?.avatar || initialProfile.avatar,
    }));
  }, [accountId, serverProfile, initialProfile]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const custom = getStoredStudentProfile(accountId);
      const currentAvatar = getCustomStudentAvatar(accountId) || custom.avatar || serverProfile?.avatar || initialProfile.avatar;
      setProfile((prev) => ({
        ...prev,
        ...serverRecordToProfile(serverProfile),
        ...custom,
        avatar: currentAvatar,
      }));
    };

    window.addEventListener(STUDENT_PROFILE_UPDATE_EVENT, handleProfileUpdate);
    window.addEventListener(STUDENT_AVATAR_UPDATE_EVENT, handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener(STUDENT_PROFILE_UPDATE_EVENT, handleProfileUpdate);
      window.removeEventListener(STUDENT_AVATAR_UPDATE_EVENT, handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, [accountId, serverProfile, initialProfile]);

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    saveStoredStudentProfile(updatedFields, accountId);
    setProfile((prev) => ({ ...prev, ...updatedFields }));
    // Sync identity fields to the student's server-side record (keyed by Account ID)
    if (accountId) {
      const serverFields: Partial<StudentProfileRecord> = {};
      for (const field of ['name', 'email', 'phone', 'batch', 'college', 'avatar', 'targetMedicalCollege'] as const) {
        if (updatedFields[field] !== undefined) {
          serverFields[field] = updatedFields[field] as string;
        }
      }
      if (Object.keys(serverFields).length > 0) {
        authApi.updateStudentProfile(serverFields).catch((e) => {
          console.error('Failed to sync profile to server record', e);
        });
      }
    }
  };

  return {
    profile: {
      ...profile,
      avatar: avatarUrl,
    },
    updateProfile,
  };
}

