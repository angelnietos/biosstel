/**
 * @biosstel/auth - Unit tests: auth slice (reducers + thunk integration)
 * Los tests de thunk aseguran que login/forgotPassword llaman al servicio y actualizan estado.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setCredentials,
  setLoading,
  setError,
  logout,
  setAuthRestored,
  loginThunk,
  forgotPasswordThunk,
} from './authSlice';
import type { AuthState } from './authSlice';
import { login as loginApi, forgotPassword as forgotPasswordApi } from '../../api/services';

vi.mock('../../api/services', () => ({
  login: vi.fn(),
  forgotPassword: vi.fn(),
  clearRefreshToken: vi.fn(),
  getStoredRefreshToken: vi.fn(),
  refreshAuth: vi.fn(),
}));

const mockUser = {
  id: 'user-uuid',
  email: 'test@biosstel.com',
  name: 'Test User',
  role: 'comercial',
};

function createStore() {
  return configureStore({ reducer: { auth: authReducer } });
}

describe('authSlice', () => {
  let storage: Record<string, string>;
  beforeEach(() => {
    storage = {};
    vi.stubGlobal(
      'localStorage',
      {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
      }
    );
  });

  it('initial state has no user and authRestored false', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.authRestored).toBe(false);
  });

  it('setCredentials sets user, token and authRestored', () => {
    const prev: AuthState = {
      user: null,
      token: null,
      isLoading: true,
      error: 'Previous error',
      authRestored: false,
    };
    const next = authReducer(
      prev,
      setCredentials({ user: mockUser, token: 'jwt-token' })
    );
    expect(next.user).toEqual(mockUser);
    expect(next.token).toBe('jwt-token');
    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.authRestored).toBe(true);
    expect(storage['token']).toBe('jwt-token');
  });

  it('setCredentials with null token removes token from storage', () => {
    storage['token'] = 'old';
    const prev: AuthState = {
      user: mockUser,
      token: 'old',
      isLoading: false,
      error: null,
      authRestored: true,
    };
    authReducer(prev, setCredentials({ user: null, token: null }));
    expect(storage['token']).toBeUndefined();
  });

  it('setLoading updates isLoading', () => {
    const prev: AuthState = {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      authRestored: false,
    };
    expect(authReducer(prev, setLoading(true)).isLoading).toBe(true);
    expect(authReducer(prev, setLoading(false)).isLoading).toBe(false);
  });

  it('setError sets error and clears loading', () => {
    const prev: AuthState = {
      user: null,
      token: null,
      isLoading: true,
      error: null,
      authRestored: false,
    };
    const next = authReducer(prev, setError('Invalid credentials'));
    expect(next.error).toBe('Invalid credentials');
    expect(next.isLoading).toBe(false);
  });

  it('logout clears user, token, error and storage', () => {
    storage['token'] = 'jwt';
    const prev: AuthState = {
      user: mockUser,
      token: 'jwt',
      isLoading: false,
      error: null,
      authRestored: true,
    };
    const next = authReducer(prev, logout());
    expect(next.user).toBeNull();
    expect(next.token).toBeNull();
    expect(next.error).toBeNull();
    expect(next.authRestored).toBe(false);
    expect(storage['token']).toBeUndefined();
  });

  it('setAuthRestored updates authRestored', () => {
    const prev: AuthState = {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      authRestored: false,
    };
    expect(authReducer(prev, setAuthRestored(true)).authRestored).toBe(true);
  });
});

describe('auth thunks (integration)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    const storage: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => storage[k] ?? null,
      setItem: (k: string, v: string) => { storage[k] = v; },
      removeItem: (k: string) => { delete storage[k]; },
    });
    vi.mocked(loginApi).mockResolvedValue({
      user: mockUser,
      token: 'jwt-token',
      refreshToken: undefined,
      expiresIn: undefined,
    });
    vi.mocked(forgotPasswordApi).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loginThunk calls login service and sets user/token on success', async () => {
    const store = createStore();
    const result = await store.dispatch(
      loginThunk({ email: 'test@biosstel.com', password: 'secret' })
    );
    expect(loginThunk.fulfilled.match(result)).toBe(true);
    expect(loginApi).toHaveBeenCalledTimes(1);
    expect(loginApi).toHaveBeenCalledWith({
      email: 'test@biosstel.com',
      password: 'secret',
    });
    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('jwt-token');
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('loginThunk sets error when login service rejects', async () => {
    vi.mocked(loginApi).mockRejectedValueOnce(new Error('Credenciales inválidas'));
    const store = createStore();
    await store.dispatch(loginThunk({ email: 'x@x.com', password: 'wrong' }));
    const state = store.getState().auth;
    expect(state.error).toContain('Credenciales inválidas');
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('forgotPasswordThunk calls forgotPassword service', async () => {
    const store = createStore();
    await store.dispatch(forgotPasswordThunk('user@biosstel.com'));
    expect(forgotPasswordApi).toHaveBeenCalledWith('user@biosstel.com');
    expect(forgotPasswordApi).toHaveBeenCalledTimes(1);
  });
});
