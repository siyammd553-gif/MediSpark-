import { useState, useEffect } from 'react';
import { INITIAL_STUDENT_PROFILE } from '../data/mockData';
import { StudentProfile } from '../types';

const STUDENT_AVATAR_STORAGE_KEY = 'medispark_custom_student_avatar_v1';
const STUDENT_PROFILE_STORAGE_KEY = 'medispark_custom_student_profile_v1';
const STUDENT_AVATAR_UPDATE_EVENT = 'medispark_student_avatar_updated';
const STUDENT_PROFILE_UPDATE_EVENT = 'medispark_student_profile_updated';

export function getCustomStudentAvatar(): string | null {
  try {
    return localStorage.getItem(STUDENT_AVATAR_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to load custom student avatar', e);
    return null;
  }
}

export function saveStudentAvatar(imageDataUrl: string) {
  try {
    localStorage.setItem(STUDENT_AVATAR_STORAGE_KEY, imageDataUrl);
    window.dispatchEvent(new CustomEvent(STUDENT_AVATAR_UPDATE_EVENT, { detail: { avatarUrl: imageDataUrl } }));
  } catch (e) {
    console.error('Failed to save student avatar', e);
  }
}

export function resetStudentAvatar() {
  try {
    localStorage.removeItem(STUDENT_AVATAR_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(STUDENT_AVATAR_UPDATE_EVENT, { detail: { avatarUrl: null } }));
  } catch (e) {
    console.error('Failed to reset student avatar', e);
  }
}

export function getStoredStudentProfile(): Partial<StudentProfile> {
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse student profile from storage', e);
    return {};
  }
}

export function saveStoredStudentProfile(updatedFields: Partial<StudentProfile>) {
  try {
    const current = getStoredStudentProfile();
    const merged = { ...current, ...updatedFields };
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(merged));
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
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => getCustomStudentAvatar());

  useEffect(() => {
    const handleUpdate = () => {
      setCustomAvatar(getCustomStudentAvatar());
    };

    window.addEventListener(STUDENT_AVATAR_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(STUDENT_AVATAR_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const avatarUrl = customAvatar || defaultAvatar;
  const isCustom = !!customAvatar;

  const updateAvatar = (newUrl: string) => {
    saveStudentAvatar(newUrl);
  };

  const resetAvatar = () => {
    resetStudentAvatar();
  };

  return {
    avatarUrl,
    isCustom,
    updateAvatar,
    resetAvatar,
  };
}

export function useStudentProfile(initialProfile: StudentProfile = INITIAL_STUDENT_PROFILE) {
  const { avatarUrl } = useStudentAvatar(initialProfile.avatar);
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const custom = getStoredStudentProfile();
    return {
      ...initialProfile,
      ...custom,
      avatar: getCustomStudentAvatar() || custom.avatar || initialProfile.avatar,
    };
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      const custom = getStoredStudentProfile();
      const currentAvatar = getCustomStudentAvatar() || custom.avatar || initialProfile.avatar;
      setProfile((prev) => ({
        ...prev,
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
  }, [initialProfile]);

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    saveStoredStudentProfile(updatedFields);
    setProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  return {
    profile: {
      ...profile,
      avatar: avatarUrl,
    },
    updateProfile,
  };
}

