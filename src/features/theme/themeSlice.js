import { createSlice } from '@reduxjs/toolkit';

// Check if dark mode is preferred by user's system
const prefersDarkMode = window.matchMedia && 
                        window.matchMedia('(prefers-color-scheme: dark)').matches;

// Check localStorage for saved preference
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');

// Initial state
const initialState = {
  mode: initialTheme,
  systemPreference: prefersDarkMode ? 'dark' : 'light',
};

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Toggle between light and dark
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save preference to localStorage
      localStorage.setItem('theme', state.mode);
    },
    
    // Set a specific theme
    setTheme: (state, action) => {
      state.mode = action.payload;
      // Save preference to localStorage
      localStorage.setItem('theme', action.payload);
    },
    
    // Use system preference
    useSystemTheme: (state) => {
      state.mode = state.systemPreference;
      // Remove saved preference
      localStorage.removeItem('theme');
    },
    
    // Update system preference (e.g., when it changes)
    updateSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
      // If using system preference, update current theme
      if (!localStorage.getItem('theme')) {
        state.mode = action.payload;
      }
    },
  },
});

// Export actions
export const {
  toggleTheme,
  setTheme,
  useSystemTheme,
  updateSystemPreference,
} = themeSlice.actions;

// Export selectors
export const selectTheme = (state) => state.theme.mode;
export const selectIsSystemTheme = (state) => !localStorage.getItem('theme');

export default themeSlice.reducer;
