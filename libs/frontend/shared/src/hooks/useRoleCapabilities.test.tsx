/**
 * @biosstel/shared - Unit tests: useCanFichar, useCanManageFichajes with mock Redux store
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCanFichar, useCanManageFichajes, useHasAnyRole } from './useRoleCapabilities';

vi.mock('@biosstel/platform', () => ({
  canFichar: (role: string | null | undefined) =>
    role === 'COMERCIAL' || role === 'COORDINADOR' || role === 'OPERARIO',
  canManageFichajes: (role: string | null | undefined) =>
    role === 'ADMIN' || role === 'COORDINADOR',
  hasPermission: () => false,
  hasAnyRole: (role: string | null | undefined, roles: string[]) =>
    !!role && roles.includes(role),
}));

function authReducer(state: { user?: { role?: string } | null } = { user: null }, action: { type: string; payload?: unknown }) {
  if (action.type === 'auth/setUser') {
    return { ...state, user: action.payload as { role?: string } };
  }
  return state;
}

function TestCanFichar() {
  const can = useCanFichar();
  return <span data-testid="can-fichar">{can ? 'yes' : 'no'}</span>;
}

function TestCanManageFichajes() {
  const can = useCanManageFichajes();
  return <span data-testid="can-manage">{can ? 'yes' : 'no'}</span>;
}

function TestHasAnyRole({ roles }: { roles: string[] }) {
  const has = useHasAnyRole(roles);
  return <span data-testid="has-any">{has ? 'yes' : 'no'}</span>;
}

function createStore(preloadedState?: { auth?: { user?: { role?: string } | null } }) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloadedState ?? { auth: { user: null } },
  });
}

describe('useCanFichar', () => {
  it('returns false when user has no role', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <TestCanFichar />
      </Provider>
    );
    expect(screen.getByTestId('can-fichar').textContent).toBe('no');
  });

  it('returns true for COMERCIAL', () => {
    const store = createStore({ auth: { user: { role: 'COMERCIAL' } } });
    render(
      <Provider store={store}>
        <TestCanFichar />
      </Provider>
    );
    expect(screen.getByTestId('can-fichar').textContent).toBe('yes');
  });

  it('returns false for ADMIN', () => {
    const store = createStore({ auth: { user: { role: 'ADMIN' } } });
    render(
      <Provider store={store}>
        <TestCanFichar />
      </Provider>
    );
    expect(screen.getByTestId('can-fichar').textContent).toBe('no');
  });
});

describe('useCanManageFichajes', () => {
  it('returns true for ADMIN', () => {
    const store = createStore({ auth: { user: { role: 'ADMIN' } } });
    render(
      <Provider store={store}>
        <TestCanManageFichajes />
      </Provider>
    );
    expect(screen.getByTestId('can-manage').textContent).toBe('yes');
  });

  it('returns false for COMERCIAL', () => {
    const store = createStore({ auth: { user: { role: 'COMERCIAL' } } });
    render(
      <Provider store={store}>
        <TestCanManageFichajes />
      </Provider>
    );
    expect(screen.getByTestId('can-manage').textContent).toBe('no');
  });
});

describe('useHasAnyRole', () => {
  it('returns true when user role is in list', () => {
    const store = createStore({ auth: { user: { role: 'COORDINADOR' } } });
    render(
      <Provider store={store}>
        <TestHasAnyRole roles={['ADMIN', 'COORDINADOR']} />
      </Provider>
    );
    expect(screen.getByTestId('has-any').textContent).toBe('yes');
  });

  it('returns false when user role is not in list', () => {
    const store = createStore({ auth: { user: { role: 'COMERCIAL' } } });
    render(
      <Provider store={store}>
        <TestHasAnyRole roles={['ADMIN', 'COORDINADOR']} />
      </Provider>
    );
    expect(screen.getByTestId('has-any').textContent).toBe('no');
  });
});
