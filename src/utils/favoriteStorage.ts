import { useState, useEffect } from 'react';

export interface FavoriteClassItem {
  id: string;
  type: 'class';
  title: string;
  courseTitle: string;
  subject: string;
  chapter: string;
  mentorName: string;
  duration: string;
  thumbnail: string;
  dateAdded: string;
  videoUrl?: string;
  courseId?: string;
  segmentId?: string;
  chapterId?: string;
}

export interface FavoriteDocumentItem {
  id: string;
  type: 'document';
  title: string;
  subject: string;
  category: string;
  pages: number;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  dateAdded: string;
  badge?: string;
}

export interface FavoriteExamResultItem {
  id: string;
  type: 'result';
  examTitle: string;
  subject: string;
  score: number;
  totalMarks: number;
  negativeMarks: number;
  rank: number;
  totalParticipants: number;
  date: string;
  dateAdded: string;
  accuracy: number;
  keyWeakness?: string;
}

export type FavoriteItem = FavoriteClassItem | FavoriteDocumentItem | FavoriteExamResultItem;

export interface StudentFavoritesStore {
  classes: FavoriteClassItem[];
  documents: FavoriteDocumentItem[];
  results: FavoriteExamResultItem[];
}

const STORAGE_KEY = 'medispark_student_favorites_v1';
const EVENT_KEY = 'medispark_favorites_updated';

export const INITIAL_FAVORITES: StudentFavoritesStore = {
  classes: [
    {
      id: 'fav-class-1',
      type: 'class',
      title: 'Epistasis & Non-Mendelian Genetics Ratios Demystified (9:7, 13:3, 9:3:4)',
      courseTitle: 'Medical Admission Course For HSC 28 Batch',
      subject: 'Biology (Zoology)',
      chapter: 'Chapter 11: Genetics & Evolution',
      mentorName: 'Dr. Md. Siyam Talukder (MBBS, ShSMC)',
      duration: '48 Mins',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
      dateAdded: '12 Aug 2026',
      courseId: 'medical-admission-hsc-28'
    },
    {
      id: 'fav-class-2',
      type: 'class',
      title: 'Human Heart & Cardiac Cycle Pressure Changes Masterclass',
      courseTitle: 'Complete Biology Course for HSC 28 Batch',
      subject: 'Biology (Zoology)',
      chapter: 'Chapter 04: Blood Circulation',
      mentorName: 'Dr. Md. Siyam Talukder (MBBS, ShSMC)',
      duration: '54 Mins',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
      dateAdded: '10 Aug 2026',
      courseId: 'hsc-28-complete-biology'
    },
    {
      id: 'fav-class-3',
      type: 'class',
      title: 'Organic Chemistry: Aldehyde, Ketone & Ester Elimination Shortcuts',
      courseTitle: 'Medical Chemistry High-Yield Accelerator',
      subject: 'Chemistry',
      chapter: 'Chemistry 2nd Paper Chapter 02',
      mentorName: 'Dr. Tanzim Ahmed (MBBS, DMC)',
      duration: '62 Mins',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      dateAdded: '08 Aug 2026',
      courseId: 'medical-admission-hsc-28'
    }
  ],
  documents: [
    {
      id: 'fav-doc-1',
      type: 'document',
      title: 'Dr. Siyam’s 100 Most Recurring Medical Biology Mnemonics Sheet',
      subject: 'Biology',
      category: 'Mnemonics Sheet',
      pages: 15,
      fileSize: '4.5 MB',
      fileType: 'PDF',
      downloadCount: 14200,
      badge: '🔥 Top Saved',
      dateAdded: '14 Aug 2026'
    },
    {
      id: 'fav-doc-2',
      type: 'document',
      title: 'Organic Reactions & Color Identification Diagnostic Chart',
      subject: 'Chemistry',
      category: 'Formula Sheet',
      pages: 24,
      fileSize: '6.8 MB',
      fileType: 'PDF',
      downloadCount: 9600,
      badge: '⚡ Quick Revision',
      dateAdded: '11 Aug 2026'
    },
    {
      id: 'fav-doc-3',
      type: 'document',
      title: 'Liberation War, Bangabandhu & Medical GK High-Frequency Q&A Sheet',
      subject: 'English & GK',
      category: 'Lecture Sheet',
      pages: 45,
      fileSize: '9.1 MB',
      fileType: 'PDF',
      downloadCount: 15300,
      badge: '🎯 100% Common',
      dateAdded: '07 Aug 2026'
    }
  ],
  results: [
    {
      id: 'fav-res-1',
      type: 'result',
      examTitle: 'DGHS Standard Full Medical Admission Model Test - 08',
      subject: 'All Combined (Bio + Chem + Phy + Eng + GK)',
      score: 87.25,
      totalMarks: 100,
      negativeMarks: 1.75,
      rank: 42,
      totalParticipants: 3420,
      date: '10 Aug 2026',
      accuracy: 89.0,
      keyWeakness: 'Transition elements color test (2 wrong answers)',
      dateAdded: '10 Aug 2026'
    },
    {
      id: 'fav-res-2',
      type: 'result',
      examTitle: 'Central Zoology Mega Paper Final Model Test',
      subject: 'Biology (Zoology)',
      score: 46.5,
      totalMarks: 50,
      negativeMarks: 0.5,
      rank: 18,
      totalParticipants: 2800,
      date: '03 Aug 2026',
      accuracy: 94.0,
      keyWeakness: 'Excretory nephron hormone mechanism (1 wrong answer)',
      dateAdded: '04 Aug 2026'
    }
  ]
};

export function getFavoritesFromStorage(): StudentFavoritesStore {
  if (typeof window === 'undefined') return INITIAL_FAVORITES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAVORITES));
      return INITIAL_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return {
      classes: Array.isArray(parsed?.classes) ? parsed.classes : INITIAL_FAVORITES.classes,
      documents: Array.isArray(parsed?.documents) ? parsed.documents : INITIAL_FAVORITES.documents,
      results: Array.isArray(parsed?.results) ? parsed.results : INITIAL_FAVORITES.results,
    };
  } catch (err) {
    console.error('Failed to load favorites from localStorage', err);
    return INITIAL_FAVORITES;
  }
}

export function saveFavoritesToStorage(store: StudentFavoritesStore): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanStore: StudentFavoritesStore = {
      classes: Array.isArray(store?.classes) ? store.classes : [],
      documents: Array.isArray(store?.documents) ? store.documents : [],
      results: Array.isArray(store?.results) ? store.results : []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanStore));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: cleanStore }));
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err);
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<StudentFavoritesStore>(getFavoritesFromStorage);

  useEffect(() => {
    const handleUpdate = () => {
      setFavorites(getFavoritesFromStorage());
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addFavoriteClass = (item: Omit<FavoriteClassItem, 'type' | 'dateAdded'>) => {
    const current = getFavoritesFromStorage();
    const existingClasses = Array.isArray(current.classes) ? current.classes : [];
    if (existingClasses.some(c => c.id === item.id)) return;

    const newItem: FavoriteClassItem = {
      ...item,
      type: 'class',
      dateAdded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated: StudentFavoritesStore = {
      ...current,
      classes: [newItem, ...existingClasses]
    };
    saveFavoritesToStorage(updated);
    setFavorites(updated);
  };

  const removeFavoriteClass = (id: string) => {
    const current = getFavoritesFromStorage();
    const existingClasses = Array.isArray(current.classes) ? current.classes : [];
    const updated: StudentFavoritesStore = {
      ...current,
      classes: existingClasses.filter(c => c.id !== id)
    };
    saveFavoritesToStorage(updated);
    setFavorites(updated);
  };

  const addFavoriteDocument = (item: Omit<FavoriteDocumentItem, 'type' | 'dateAdded'>) => {
    const current = getFavoritesFromStorage();
    const existingDocs = Array.isArray(current.documents) ? current.documents : [];
    if (existingDocs.some(d => d.id === item.id)) return;

    const newItem: FavoriteDocumentItem = {
      ...item,
      type: 'document',
      dateAdded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated: StudentFavoritesStore = {
      ...current,
      documents: [newItem, ...existingDocs]
    };
    saveFavoritesToStorage(updated);
    setFavorites(updated);
  };

  const removeFavoriteDocument = (id: string) => {
    const current = getFavoritesFromStorage();
    const existingDocs = Array.isArray(current.documents) ? current.documents : [];
    const updated: StudentFavoritesStore = {
      ...current,
      documents: existingDocs.filter(d => d.id !== id)
    };
    saveFavoritesToStorage(updated);
    setFavorites(updated);
  };

  const addFavoriteResult = (item: Omit<FavoriteExamResultItem, 'type' | 'dateAdded'>) => {
    const current = getFavoritesFromStorage();
    const existingResults = Array.isArray(current.results) ? current.results : [];
    if (existingResults.some(r => r.id === item.id)) return;

    const newItem: FavoriteExamResultItem = {
      ...item,
      type: 'result',
      dateAdded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated: StudentFavoritesStore = {
      ...current,
      results: [newItem, ...existingResults]
    };
    saveFavoritesToStorage(updated);
    setFavorites(updated);
  };

  const removeFavoriteResult = (id: string) => {
    const current = getFavoritesFromStorage();
    const existingResults = Array.isArray(current.results) ? current.results : [];
    const updated: StudentFavoritesStore = {
      ...current,
      results: existingResults.filter(r => r.id !== id)
    };
    saveFavoritesToStorage(updated);
    setFavorites(updated);
  };

  const totalCount = 
    ((favorites?.classes?.length) || 0) + 
    ((favorites?.documents?.length) || 0) + 
    ((favorites?.results?.length) || 0);

  return {
    favorites: {
      classes: favorites?.classes || [],
      documents: favorites?.documents || [],
      results: favorites?.results || []
    },
    totalCount,
    addFavoriteClass,
    removeFavoriteClass,
    addFavoriteDocument,
    removeFavoriteDocument,
    addFavoriteResult,
    removeFavoriteResult
  };
}
