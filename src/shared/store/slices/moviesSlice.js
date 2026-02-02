import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  featured: [],
  popular: [],
  topRated: [],
  trending: [],
  loading: false,
  error: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setFeaturedMovies: (state, action) => {
      state.featured = action.payload;
    },
    setPopularMovies: (state, action) => {
      state.popular = action.payload;
    },
    setTopRatedMovies: (state, action) => {
      state.topRated = action.payload;
    },
    setTrendingMovies: (state, action) => {
      state.trending = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFeaturedMovies,
  setPopularMovies,
  setTopRatedMovies,
  setTrendingMovies,
  setLoading,
  setError,
  clearError,
} = moviesSlice.actions;

export default moviesSlice.reducer;