import { createContext, useContext, useState, useEffect } from "react";

const FAVORITES_KEY = "movies-favorites";
const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return context;
};

// Export nomeado para compatibilidade
export const useFavorites = useFavoritesContext;

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do localStorage
  useEffect(() => {

    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        setFavorites([]);
      }
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites(prev => {
      // Verificar se já está nos favoritos
      if (prev.some(fav => fav.id === movie.id)) {
        return prev;
      }
      const newFavorites = [...prev, movie];
      return newFavorites;
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(movie => movie.id !== movieId);
      return newFavorites;
    });
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const isFavorite = (movieId) => {
    const result = favorites.some(movie => movie.id === movieId);
    return result;
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoriteCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};