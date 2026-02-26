/**
 * @biosstel/operaciones - Unit tests: operaciones slice (reducers + thunk integration)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import operacionesReducer, { fetchOperaciones } from './operacionesSlice';
import * as operacionesApi from '../../api/services';

const mockData = { tienda: [], visitas: [], agenda: [] } as any;

function createStore() {
  return configureStore({ reducer: { operaciones: operacionesReducer } });
}

describe('operacionesSlice', () => {
  it('initial state', () => {
    const state = operacionesReducer(undefined, { type: 'unknown' });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.data).toBeNull();
  });

  it('fetchOperaciones.pending sets loading', () => {
    const state = operacionesReducer(undefined, fetchOperaciones.pending('', undefined));
    expect(state.isLoading).toBe(true);
  });

  it('fetchOperaciones.fulfilled sets data', () => {
    const state = operacionesReducer(undefined, fetchOperaciones.fulfilled(mockData, '', undefined));
    expect(state.data).toEqual(mockData);
    expect(state.isLoading).toBe(false);
  });
});

describe('operaciones thunks (integration)', () => {
  beforeEach(() => {
    vi.spyOn(operacionesApi, 'getOperaciones').mockResolvedValue(mockData);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchOperaciones calls getOperaciones and sets data', async () => {
    const store = createStore();
    const result = await store.dispatch(fetchOperaciones());
    expect(fetchOperaciones.fulfilled.match(result)).toBe(true);
    expect(operacionesApi.getOperaciones).toHaveBeenCalledTimes(1);
    expect(store.getState().operaciones.data).toEqual(mockData);
    expect(store.getState().operaciones.isLoading).toBe(false);
  });
});
