/**
 * @biosstel/alertas - Unit tests: alertas slice
 */
import { describe, it, expect } from 'vitest';
import alertasReducer from './alertasSlice';

describe('alertasSlice', () => {
  it('initial state', () => {
    const state = alertasReducer(undefined, { type: 'unknown' });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
