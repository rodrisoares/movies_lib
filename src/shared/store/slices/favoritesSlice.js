import { createSlice } from '@reduxjs/toolkit';

const FAVORITES_KEY = 'favorites_movies';

const loadFavoritesFromStorage = () => {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Erro ao carregar favoritos do localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar favoritos no localStorage:', error);
  }
};

const initialState = {
  favorites: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const movie = action.payload;
      // Verificar se já está nos favoritos
      if (!state.favorites.some(fav => fav.id === movie.id)) {
        state.favorites.push(movie);
        saveFavoritesToStorage(state.favorites);
      }
    },
    removeFromFavorites: (state, action) => {
      const movieId = action.payload;
      state.favorites = state.favorites.filter(movie => movie.id !== movieId);
      saveFavoritesToStorage(state.favorites);
    },
    toggleFavorite: (state, action) => {
      const movie = action.payload;
      const isAlreadyFavorite = state.favorites.some(fav => fav.id === movie.id);
      
      if (isAlreadyFavorite) {
        state.favorites = state.favorites.filter(fav => fav.id !== movie.id);
      } else {
        state.favorites.push(movie);
      }
      
      saveFavoritesToStorage(state.favorites);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavoritesToStorage(state.favorites);
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      saveFavoritesToStorage(state.favorites);
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  setFavorites,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectFavoriteCount = (state) => state.favorites.favorites.length;
export const selectIsFavorite = (state, movieId) => 
  state.favorites.favorites.some(movie => movie.id === movieId);

export default favoritesSlice.reducer;