/**
 * @biosstel/auth - Integration tests: Redux store + auth slice + component that reads auth
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../data-access/store/authSlice';
import { setCredentials } from '../data-access/store/authSlice';

// Minimal component that reads auth from store via useSelector (mirrors real usage)
function AuthDisplay() {
  const user = useSelector((state: { auth: { user: { email?: string } | null; authRestored?: boolean } }) => state.auth?.user);
  const authRestored = useSelector((state: { auth: { authRestored?: boolean } }) => state.auth?.authRestored);
  if (!authRestored) return <span data-testid="auth-status">loading</span>;
  if (!user) return <span data-testid="auth-status">guest</span>;
  return <span data-testid="auth-status">user:{user.email}</span>;
}

function createStore() {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        authRestored: false,
      },
    },
  });
}

describe('auth integration', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('component shows guest when no user', () => {
    store.dispatch({ type: 'auth/setAuthRestored', payload: true });
    render(
      <Provider store={store}>
        <AuthDisplay />
      </Provider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe('guest');
  });

  it('component shows user email after setCredentials', () => {
    store.dispatch(
      setCredentials({
        user: {
          id: 'id-1',
          email: 'comercial@biosstel.com',
          name: 'Comercial',
          role: 'comercial',
        },
        token: 'jwt',
      })
    );
    render(
      <Provider store={store}>
        <AuthDisplay />
      </Provider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe(
      'user:comercial@biosstel.com'
    );
  });

  it('component shows guest after credentials cleared', () => {
    store.dispatch(
      setCredentials({
        user: { id: '1', email: 'a@b.com', name: 'A', role: 'admin' },
        token: 'jwt',
      })
    );
    store.dispatch(setCredentials({ user: null, token: null }));
    render(
      <Provider store={store}>
        <AuthDisplay />
      </Provider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe('guest');
  });
});
