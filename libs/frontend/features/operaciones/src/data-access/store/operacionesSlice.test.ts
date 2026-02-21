/**
 * @biosstel/operaciones - Unit tests: operaciones slice
 */
import { describe, it, expect } from 'vitest';
import operacionesReducer from './operacionesSlice';

describe('operacionesSlice', () => {
  it('initial state', () => {
    const state = operacionesReducer(undefined, { type: 'unknown' });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
