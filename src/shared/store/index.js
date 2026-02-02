import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    search: searchReducer,
    ui: uiReducer,
    favorites: favoritesReducer,
  },
});

// Types for better development experience (if using JSDoc)
// @typedef {ReturnType<typeof store.getState>} RootState
// @typedef {typeof store.dispatch} AppDispatch