import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const addFavorite = (termId: string) => {
    if (!favorites.includes(termId)) {
      const updated = [...favorites, termId];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const removeFavorite = (termId: string) => {
    const updated = favorites.filter(id => id !== termId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (termId: string) => {
    return favorites.includes(termId);
  };

  const toggleFavorite = (termId: string) => {
    if (isFavorite(termId)) {
      removeFavorite(termId);
    } else {
      addFavorite(termId);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};

