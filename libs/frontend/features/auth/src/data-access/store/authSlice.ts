import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../api/services/models';
import type { LoginCredentials } from '../../api/services/models';
import { login as loginApi, forgotPassword as forgotPasswordApi, clearRefreshToken } from '../../api/services';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  /** True after first auth restore check (JWT) or after setCredentials (login). Used to avoid role-dependent UI flash. */
  authRestored: boolean;
}

/** Efecto: login con email/password; actualiza user y token en estado */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    return await loginApi(credentials);
  }
);

/** Efecto: envío de email para recuperar contraseña */
export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi(email);
  }
);

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,
  authRestored: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser | null; token: string | null }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;
      state.authRestored = true;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
        clearRefreshToken();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.authRestored = false;
      localStorage.removeItem('token');
      clearRefreshToken();
    },
    setAuthRestored: (state, action: PayloadAction<boolean>) => {
      state.authRestored = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user ?? null;
        state.token = token ?? null;
        state.isLoading = false;
        state.error = null;
        state.authRestored = true;
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al iniciar sesión';
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al enviar email';
      });
  },
});

export const { setCredentials, setLoading, setError, logout, setAuthRestored } = authSlice.actions;
export default authSlice.reducer;
