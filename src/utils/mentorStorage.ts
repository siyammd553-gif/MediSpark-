import { useState, useEffect } from 'react';
import { Mentor } from '../types';

const MENTOR_IMAGES_STORAGE_KEY = 'medispark_custom_mentor_images_v1';
const MENTOR_IMAGE_UPDATE_EVENT = 'medispark_mentor_image_updated';

export function getCustomMentorImages(): Record<string, string> {
  try {
    const raw = localStorage.getItem(MENTOR_IMAGES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom mentor images from storage', e);
    return {};
  }
}

export function saveMentorCustomImage(mentorId: string, imageDataUrl: string) {
  try {
    const current = getCustomMentorImages();
    current[mentorId] = imageDataUrl;
    localStorage.setItem(MENTOR_IMAGES_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(MENTOR_IMAGE_UPDATE_EVENT, { detail: { mentorId, imageDataUrl } }));
  } catch (e) {
    console.error('Failed to save mentor image', e);
  }
}

export function removeMentorCustomImage(mentorId: string) {
  try {
    const current = getCustomMentorImages();
    delete current[mentorId];
    localStorage.setItem(MENTOR_IMAGES_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(MENTOR_IMAGE_UPDATE_EVENT, { detail: { mentorId, imageDataUrl: null } }));
  } catch (e) {
    console.error('Failed to remove custom mentor image', e);
  }
}

export function useMentorImage(mentor: Mentor): {
  currentImage: string;
  isCustom: boolean;
  updateImage: (newUrl: string) => void;
  resetImage: () => void;
} {
  const [customMap, setCustomMap] = useState<Record<string, string>>(() => getCustomMentorImages());

  useEffect(() => {
    const handleUpdate = () => {
      setCustomMap(getCustomMentorImages());
    };

    window.addEventListener(MENTOR_IMAGE_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(MENTOR_IMAGE_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const customImg = customMap[mentor.id];
  const currentImage = customImg || mentor.imagePath || '';
  const isCustom = !!customImg;

  const updateImage = (newUrl: string) => {
    saveMentorCustomImage(mentor.id, newUrl);
  };

  const resetImage = () => {
    removeMentorCustomImage(mentor.id);
  };

  return {
    currentImage,
    isCustom,
    updateImage,
    resetImage,
  };
}
