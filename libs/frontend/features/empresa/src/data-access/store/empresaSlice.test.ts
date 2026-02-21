/**
 * @biosstel/empresa - Unit tests: empresa slice (reducers + extraReducers)
 */
import { describe, it, expect } from 'vitest';
import empresaReducer, { fetchEmpresa, clearError } from './empresaSlice';

describe('empresaSlice', () => {
  it('initial state', () => {
    const state = empresaReducer(undefined, { type: 'unknown' });
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchEmpresa.pending sets loading', () => {
    const state = empresaReducer(undefined, fetchEmpresa.pending('', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchEmpresa.fulfilled sets data', () => {
    const payload = { departamentos: [{ id: '1', name: 'D1' }], centros: [], cuentas: [] };
    const state = empresaReducer(undefined, fetchEmpresa.fulfilled(payload, '', undefined));
    expect(state.data).toEqual(payload);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchEmpresa.rejected sets error', () => {
    const state = empresaReducer(
      undefined,
      fetchEmpresa.rejected(new Error('Network error'), '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Network error');
  });

  it('clearError clears error', () => {
    const withError = empresaReducer(
      undefined,
      fetchEmpresa.rejected(new Error('Fail'), '', undefined)
    );
    expect(withError.error).not.toBeNull();
    const state = empresaReducer(withError, clearError());
    expect(state.error).toBeNull();
  });
});
