import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  errors: {},
  notifications: [],
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      const { key, message } = action.payload;
      state.errors[key] = message;
    },
    clearError: (state, action) => {
      const key = action.payload;
      if (key) {
        delete state.errors[key];
      } else {
        state.errors = {};
      }
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter(notification => notification.id !== id);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addNotification,
  removeNotification,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;