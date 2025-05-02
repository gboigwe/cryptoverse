import { createSlice } from '@reduxjs/toolkit';

// Get saved preferences from localStorage
const getSavedPreferences = () => {
  try {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error reading saved preferences:', error);
    return {};
  }
};

// Initial state
const initialState = {
  // Default crypto currency to display values in
  currency: 'USD',
  
  // Default time period for charts
  defaultTimePeriod: '7d',
  
  // Default items per page for lists
  itemsPerPage: 10,
  
  // Show/hide specific UI elements
  showGlobalStats: true,
  showPriceChanges: true,
  
  // Notification preferences
  notifications: {
    priceAlerts: false,
    newsUpdates: false,
    priceChangeThreshold: 5, // percentage
  },
  
  // Favorite cryptocurrencies
  favorites: [],
  
  // Last viewed cryptocurrencies
  recentlyViewed: [],
  
  // Load saved preferences
  ...getSavedPreferences(),
};

// Helper to save preferences to localStorage
const savePreferences = (state) => {
  try {
    localStorage.setItem('userPreferences', JSON.stringify(state));
  } catch (error) {
    // console.error('Error saving preferences:', error);
  }
};

// User preferences slice
const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    // Update currency preference
    setCurrency: (state, action) => {
      state.currency = action.payload;
      savePreferences(state);
    },
    
    // Update default time period
    setDefaultTimePeriod: (state, action) => {
      state.defaultTimePeriod = action.payload;
      savePreferences(state);
    },
    
    // Update items per page
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      savePreferences(state);
    },
    
    // Toggle UI element visibility
    toggleUiElement: (state, action) => {
      const { element } = action.payload;
      state[element] = !state[element];
      savePreferences(state);
    },
    
    // Update notification preferences
    updateNotificationSettings: (state, action) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
      savePreferences(state);
    },
    
    // Add to favorites
    addToFavorites: (state, action) => {
      const coinId = action.payload;
      if (!state.favorites.includes(coinId)) {
        state.favorites.push(coinId);
        savePreferences(state);
      }
    },
    
    // Remove from favorites
    removeFromFavorites: (state, action) => {
      const coinId = action.payload;
      state.favorites = state.favorites.filter(id => id !== coinId);
      savePreferences(state);
    },
    
    // Add to recently viewed
    addToRecentlyViewed: (state, action) => {
      const coinId = action.payload;
      
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== coinId);
      
      // Add to front of array
      state.recentlyViewed.unshift(coinId);
      
      // Limit to 10 items
      state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      
      savePreferences(state);
    },
    
    // Clear recently viewed
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
      savePreferences(state);
    },
    
    // Reset all preferences to default
    resetPreferences: () => {
      localStorage.removeItem('userPreferences');
      return { ...initialState };
    },
  },
});

// Export actions
export const {
  setCurrency,
  setDefaultTimePeriod,
  setItemsPerPage,
  toggleUiElement,
  updateNotificationSettings,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyViewed,
  clearRecentlyViewed,
  resetPreferences,
} = userPreferencesSlice.actions;

// Export selectors
export const selectCurrency = (state) => state.userPreferences.currency;
export const selectDefaultTimePeriod = (state) => state.userPreferences.defaultTimePeriod;
export const selectItemsPerPage = (state) => state.userPreferences.itemsPerPage;
export const selectFavorites = (state) => state.userPreferences.favorites;
export const selectRecentlyViewed = (state) => state.userPreferences.recentlyViewed;
export const selectNotificationSettings = (state) => state.userPreferences.notifications;

export default userPreferencesSlice.reducer;
