/**
 * Redux Store for the frontend
 * Adapted to the new architecture
 */

import { configureStore } from '@reduxjs/toolkit';
import { userDataSlice } from './slices/userData';
import { adminApi } from './api/users';

export const store = configureStore({
  reducer: {
    userData: userDataSlice.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
