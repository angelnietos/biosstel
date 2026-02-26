/**
 * @biosstel/usuarios - Unit tests: user slice (reducers + thunk integration)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { fetchUsers, createUserThunk, clearError } from './userSlice';
import * as usersApi from '../../api/services';

const mockUsers = [
  { id: 'u1', email: 'a@b.com', firstName: 'A', lastName: 'B', isActive: true },
];

function createStore() {
  return configureStore({ reducer: { users: userReducer } });
}

describe('userSlice', () => {
  it('initial state', () => {
    const state = userReducer(undefined, { type: 'unknown' });
    expect(state.users).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchUsers.pending sets loading', () => {
    const state = userReducer(undefined, fetchUsers.pending('', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchUsers.fulfilled sets users', () => {
    const state = userReducer(undefined, fetchUsers.fulfilled(mockUsers, '', undefined));
    expect(state.users).toEqual(mockUsers);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchUsers.rejected sets error', () => {
    const state = userReducer(
      undefined,
      fetchUsers.rejected(new Error('Network error'), '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Network error');
  });

  it('clearError clears error', () => {
    const withError = userReducer(
      undefined,
      fetchUsers.rejected(new Error('Fail'), '', undefined)
    );
    expect(withError.error).not.toBeNull();
    const state = userReducer(withError, clearError());
    expect(state.error).toBeNull();
  });
});

describe('users thunks (integration)', () => {
  beforeEach(() => {
    vi.spyOn(usersApi, 'getUsers').mockResolvedValue(mockUsers as any);
    vi.spyOn(usersApi, 'createUser').mockResolvedValue({ id: 'u2', email: 'n@n.com' } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchUsers calls getUsers and sets users', async () => {
    const store = createStore();
    const result = await store.dispatch(fetchUsers());
    expect(fetchUsers.fulfilled.match(result)).toBe(true);
    expect(usersApi.getUsers).toHaveBeenCalledTimes(1);
    expect(store.getState().users.users).toEqual(mockUsers);
    expect(store.getState().users.isLoading).toBe(false);
  });

  it('createUserThunk calls createUser with data', async () => {
    const store = createStore();
    await store.dispatch(createUserThunk({ email: 'n@n.com', password: 'secret' }));
    expect(usersApi.createUser).toHaveBeenCalledWith({ email: 'n@n.com', password: 'secret' });
    expect(usersApi.createUser).toHaveBeenCalledTimes(1);
  });
});
