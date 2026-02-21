/**
 * @biosstel/usuarios - Unit tests: user slice (fetchUsers thunk + clearError)
 */
import { describe, it, expect } from 'vitest';
import userReducer, { fetchUsers, clearError } from './userSlice';

const mockUsers = [
  { id: 'u1', email: 'a@b.com', firstName: 'A', lastName: 'B', isActive: true },
];

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
