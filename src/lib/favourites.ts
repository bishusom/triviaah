// lib/favorites.ts
export interface FavoriteItem {
  id: string | number;
  title: string;
  image?: string;
  path: string;
  addedAt: string; // ISO date string
}

const FAVORITES_KEY = 'triviaah_favorites';

export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>): boolean => {
  const favorites = getFavorites();
  // Check if already exists
  if (favorites.some(fav => fav.id === item.id)) return false;
  
  const newFavorite: FavoriteItem = {
    ...item,
    addedAt: new Date().toISOString()
  };
  const updated = [newFavorite, ...favorites];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return true;
};

export const removeFavorite = (id: string | number): boolean => {
  const favorites = getFavorites();
  const updated = favorites.filter(fav => fav.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated.length !== favorites.length;
};

export const isFavorite = (id: string | number): boolean => {
  return getFavorites().some(fav => fav.id === id);
};