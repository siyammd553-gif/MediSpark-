import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FavoriteClassItem, FavoriteDocumentItem, FavoriteExamResultItem, StudentFavoritesStore } from '../types';

export type { FavoriteClassItem, FavoriteDocumentItem, FavoriteExamResultItem, FavoriteItem, StudentFavoritesStore } from '../types';

export const INITIAL_FAVORITES: StudentFavoritesStore = {
  classes: [],
  documents: [],
  results: [],
};

function dateAddedStamp(): string {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Favorites are namespaced by the authenticated Student Account ID and
// persisted on the server in that student's own dashboard record.
export function useFavorites() {
  const { accountId, dashboard, updateDashboard } = useAuth();

  const favorites: StudentFavoritesStore = {
    classes: dashboard?.favorites?.classes ?? [],
    documents: dashboard?.favorites?.documents ?? [],
    results: dashboard?.favorites?.results ?? [],
  };

  const addFavoriteClass = useCallback(
    (item: Omit<FavoriteClassItem, 'type' | 'dateAdded'>) => {
      if (!accountId) return;
      const current = favorites.classes;
      if (current.some((c) => c.id === item.id)) return;
      const newItem: FavoriteClassItem = { ...item, type: 'class', dateAdded: dateAddedStamp() };
      updateDashboard({ favorites: { ...favorites, classes: [newItem, ...current] } });
    },
    [accountId, favorites, updateDashboard]
  );

  const removeFavoriteClass = useCallback(
    (id: string) => {
      if (!accountId) return;
      updateDashboard({ favorites: { ...favorites, classes: favorites.classes.filter((c) => c.id !== id) } });
    },
    [accountId, favorites, updateDashboard]
  );

  const addFavoriteDocument = useCallback(
    (item: Omit<FavoriteDocumentItem, 'type' | 'dateAdded'>) => {
      if (!accountId) return;
      const current = favorites.documents;
      if (current.some((d) => d.id === item.id)) return;
      const newItem: FavoriteDocumentItem = { ...item, type: 'document', dateAdded: dateAddedStamp() };
      updateDashboard({ favorites: { ...favorites, documents: [newItem, ...current] } });
    },
    [accountId, favorites, updateDashboard]
  );

  const removeFavoriteDocument = useCallback(
    (id: string) => {
      if (!accountId) return;
      updateDashboard({ favorites: { ...favorites, documents: favorites.documents.filter((d) => d.id !== id) } });
    },
    [accountId, favorites, updateDashboard]
  );

  const addFavoriteResult = useCallback(
    (item: Omit<FavoriteExamResultItem, 'type' | 'dateAdded'>) => {
      if (!accountId) return;
      const current = favorites.results;
      if (current.some((r) => r.id === item.id || r.examTitle === item.examTitle)) return;
      const newItem: FavoriteExamResultItem = { ...item, type: 'result', dateAdded: dateAddedStamp() };
      updateDashboard({ favorites: { ...favorites, results: [newItem, ...current] } });
    },
    [accountId, favorites, updateDashboard]
  );

  const removeFavoriteResult = useCallback(
    (id: string) => {
      if (!accountId) return;
      updateDashboard({ favorites: { ...favorites, results: favorites.results.filter((r) => r.id !== id) } });
    },
    [accountId, favorites, updateDashboard]
  );

  const totalCount =
    (favorites.classes?.length || 0) + (favorites.documents?.length || 0) + (favorites.results?.length || 0);

  return {
    favorites: {
      classes: favorites.classes || [],
      documents: favorites.documents || [],
      results: favorites.results || [],
    },
    totalCount,
    addFavoriteClass,
    removeFavoriteClass,
    addFavoriteDocument,
    removeFavoriteDocument,
    addFavoriteResult,
    removeFavoriteResult,
  };
}