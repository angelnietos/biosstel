/**
 * @biosstel/auth - Unit tests: auth slice (reducers + initial state)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, {
  setCredentials,
  setLoading,
  setError,
  logout,
  setAuthRestored,
} from './authSlice';
import type { AuthState } from './authSlice';

const mockUser = {
  id: 'user-uuid',
  email: 'test@biosstel.com',
  name: 'Test User',
  role: 'comercial',
};

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
