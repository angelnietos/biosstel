/**
 * @biosstel/empresa - Unit tests: empresa slice (reducers + thunk integration)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import empresaReducer, { fetchEmpresa, createWorkCenterThunk, clearError } from './empresaSlice';
import * as empresaApi from '../../api/services';

const mockData = {
  departamentos: [{ id: '1', name: 'D1' }],
  centros: [],
  cuentas: [],
};

function createStore() {
  return configureStore({ reducer: { empresa: empresaReducer } });
}

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

describe('empresa thunks (integration)', () => {
  beforeEach(() => {
    vi.spyOn(empresaApi, 'getEmpresa').mockResolvedValue(mockData as any);
    vi.spyOn(empresaApi, 'createWorkCenter').mockResolvedValue({ id: 'w1', name: 'Barakaldo' } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchEmpresa calls getEmpresa and sets data', async () => {
    const store = createStore();
    const result = await store.dispatch(fetchEmpresa());
    expect(fetchEmpresa.fulfilled.match(result)).toBe(true);
    expect(empresaApi.getEmpresa).toHaveBeenCalledTimes(1);
    expect(store.getState().empresa.data).toEqual(mockData);
    expect(store.getState().empresa.isLoading).toBe(false);
  });

  it('createWorkCenterThunk calls createWorkCenter and then fetchEmpresa', async () => {
    const store = createStore();
    await store.dispatch(createWorkCenterThunk({ name: 'Barakaldo', address: 'C/ Ejemplo' }));
    expect(empresaApi.createWorkCenter).toHaveBeenCalledWith({
      name: 'Barakaldo',
      address: 'C/ Ejemplo',
    });
    expect(empresaApi.getEmpresa).toHaveBeenCalled();
  });
});
