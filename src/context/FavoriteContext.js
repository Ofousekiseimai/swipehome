import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);
  
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const addFavorite = (propertyId) => {
    setFavorites(prev => [...prev, propertyId]);
  };
  
  const removeFavorite = (propertyId) => {
    setFavorites(prev => prev.filter(id => id !== propertyId));
  };
  
  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);