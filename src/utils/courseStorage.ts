import { useState, useEffect } from 'react';
import { Course } from '../types';

const COURSE_IMAGES_STORAGE_KEY = 'medispark_custom_course_images_v1';
const COURSE_IMAGE_UPDATE_EVENT = 'medispark_course_image_updated';

// Fallback high-quality thematic thumbnails per course ID
export const DEFAULT_COURSE_THUMBNAILS: Record<string, string> = {
  'hsc-29-complete-biology': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
  'medical-admission-hsc-29': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
  'hsc-28-complete-biology': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
  'medical-admission-hsc-28': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
};

export function getCustomCourseImages(): Record<string, string> {
  try {
    const raw = localStorage.getItem(COURSE_IMAGES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom course images from storage', e);
    return {};
  }
}

export function saveCourseCustomImage(courseId: string, imageDataUrl: string) {
  try {
    const current = getCustomCourseImages();
    current[courseId] = imageDataUrl;
    localStorage.setItem(COURSE_IMAGES_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(COURSE_IMAGE_UPDATE_EVENT, { detail: { courseId, imageDataUrl } }));
  } catch (e) {
    console.error('Failed to save course image', e);
  }
}

export function removeCourseCustomImage(courseId: string) {
  try {
    const current = getCustomCourseImages();
    delete current[courseId];
    localStorage.setItem(COURSE_IMAGES_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(COURSE_IMAGE_UPDATE_EVENT, { detail: { courseId, imageDataUrl: null } }));
  } catch (e) {
    console.error('Failed to remove custom course image', e);
  }
}

export function useCourseImage(course: Course): {
  currentImage: string;
  isCustom: boolean;
  updateImage: (newUrl: string) => void;
  resetImage: () => void;
} {
  const [customMap, setCustomMap] = useState<Record<string, string>>(() => getCustomCourseImages());

  useEffect(() => {
    const handleUpdate = () => {
      setCustomMap(getCustomCourseImages());
    };

    window.addEventListener(COURSE_IMAGE_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(COURSE_IMAGE_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const customImg = customMap[course.id];
  const currentImage =
    customImg ||
    course.thumbnail ||
    DEFAULT_COURSE_THUMBNAILS[course.id] ||
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80';

  const isCustom = !!customImg;

  const updateImage = (newUrl: string) => {
    saveCourseCustomImage(course.id, newUrl);
  };

  const resetImage = () => {
    removeCourseCustomImage(course.id);
  };

  return {
    currentImage,
    isCustom,
    updateImage,
    resetImage,
  };
}
