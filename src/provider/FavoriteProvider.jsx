'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFavoriteIds } from '@/actions/server/favorite';
import { useSession } from 'next-auth/react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { status } = useSession();

  const updateFavorites = async () => {
    if (status === 'authenticated') {
      try {
        const ids = await getFavoriteIds();
        setFavorites(ids || []);
      } catch (error) {
        console.error('Failed to update favorites:', error);
      }
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    updateFavorites();
  }, [status]);

  const isFavorite = (productId) => favorites.includes(productId.toString());

  return (
    <FavoriteContext.Provider value={{ favorites, favoriteCount: favorites.length, updateFavorites, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
