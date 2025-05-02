import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import API slices
import { cryptoApi } from '../services/cryptoApi';
import { cryptoNewsApi } from '../services/cryptoNewsApi';

// Import feature reducers
import themeReducer from '../features/theme/themeSlice';
import userPreferencesReducer from '../features/userPreferences/userPreferencesSlice';

// Create root reducer with combined reducers
const rootReducer = combineReducers({
  // API reducers
  [cryptoApi.reducerPath]: cryptoApi.reducer,
  [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
  
  // App state reducers
  theme: themeReducer,
  userPreferences: userPreferencesReducer,
});

// Configure Redux store with enhanced middleware
const store = configureStore({
  reducer: rootReducer,
  
  // Add middleware for API requests with conditional devtools in production
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat([
      cryptoApi.middleware,
      cryptoNewsApi.middleware,
    ]),
    
  // Enable DevTools only in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;

















// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';

// // Import API slices
// import { cryptoApi } from '../services/cryptoApi';
// import { cryptoNewsApi } from '../services/cryptoNewsApi';

// // Import potential future slices
// import themeReducer from '../features/theme/themeSlice';
// import userPreferencesReducer from '../features/userPreferences/userPreferencesSlice';

// // Create root reducer with combined reducers
// const rootReducer = combineReducers({
//   // API reducers
//   [cryptoApi.reducerPath]: cryptoApi.reducer,
//   [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
  
//   // App state reducers
//   theme: themeReducer,
//   userPreferences: userPreferencesReducer,
// });

// // Configure Redux store with enhanced middleware
// const store = configureStore({
//   reducer: rootReducer,
  
//   // Add middleware for API requests with conditional devtools in production
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types for serializability checks
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }).concat([
//       cryptoApi.middleware,
//       cryptoNewsApi.middleware,
//     ]),
    
//   // Enable DevTools only in development
//   devTools: process.env.NODE_ENV !== 'production',
// });

// // Setup listeners for RTK Query refetchOnFocus/refetchOnReconnect behaviors
// setupListeners(store.dispatch);

// // Export typed versions of state and dispatch for use in components
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;










// import { configureStore } from '@reduxjs/toolkit';

// import { cryptoApi } from '../services/cryptoApi';
// import { cryptoNewsApi } from '../services/cryptoNewsApi';

// export default configureStore({
//   reducer: {
//     [cryptoApi.reducerPath]: cryptoApi.reducer,
//     [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
//   },
// });
