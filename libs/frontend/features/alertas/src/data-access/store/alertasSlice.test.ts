/**
 * @biosstel/alertas - Unit tests: alertas slice (reducers + thunk integration)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import alertasReducer, { fetchAlertas } from './alertasSlice';
import * as alertasApi from '../../api/services';

const mockAlerts = [{ id: 'a1', type: 'info', title: 'Test', message: 'Msg' }] as any;

function createStore() {
  return configureStore({ reducer: { alertas: alertasReducer } });
}

describe('alertasSlice', () => {
  it('initial state', () => {
    const state = alertasReducer(undefined, { type: 'unknown' });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.alerts).toEqual([]);
  });

  it('fetchAlertas.fulfilled sets alerts (paginated payload)', () => {
    const state = alertasReducer(undefined, fetchAlertas.fulfilled({ items: mockAlerts, total: 1, page: 1, pageSize: 10 }, '', {}));
    expect(state.alerts).toEqual(mockAlerts);
    expect(state.totalAlerts).toBe(1);
    expect(state.isLoading).toBe(false);
  });
});

describe('alertas thunks (integration)', () => {
  beforeEach(() => {
    vi.spyOn(alertasApi, 'getAlertas').mockResolvedValue({ items: mockAlerts, data: mockAlerts, total: 1, page: 1, pageSize: 10 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchAlertas calls getAlertas and sets alerts', async () => {
    const store = createStore();
    const result = await store.dispatch(fetchAlertas({}));
    expect(fetchAlertas.fulfilled.match(result)).toBe(true);
    expect(alertasApi.getAlertas).toHaveBeenCalledTimes(1);
    expect(store.getState().alertas.alerts).toEqual(mockAlerts);
    expect(store.getState().alertas.isLoading).toBe(false);
  });
});
