import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  results: [],
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload.results;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSearchError: (state, action) => {
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.totalPages = 0;
      state.currentPage = 1;
      state.error = null;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setCurrentPage,
  setSearchLoading,
  setSearchError,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;