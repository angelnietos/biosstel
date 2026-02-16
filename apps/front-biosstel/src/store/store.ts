import { configureStore } from "@reduxjs/toolkit";
import { userDataSlice } from "./slices/userData";
import { adminApi } from "./api/users";

export const store = configureStore({
  reducer: {
    userData: userDataSlice.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware: any) => getDefaultMiddleware().concat(adminApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
