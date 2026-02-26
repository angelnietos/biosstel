import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardAlert } from '../../api/services/models';
import type { AlertaTipo, AlertasFilters } from '../../api/services';
import { getAlertas } from '../../api/services';

export interface FetchAlertasArg {
  tipo?: AlertaTipo;
  filters?: AlertasFilters;
  page?: number;
  pageSize?: number;
}

/** Efecto: carga alertas con filtros y paginación */
export const fetchAlertas = createAsyncThunk(
  'alertas/fetchAlertas',
  async (arg: FetchAlertasArg) => {
    const { tipo, filters, page = 1, pageSize = 10 } = arg;
    return await getAlertas(tipo, filters, page, pageSize);
  }
);

export interface AlertasState {
  alerts: DashboardAlert[];
  totalAlerts: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: AlertasState = {
  alerts: [],
  totalAlerts: 0,
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  error: null,
};

export const alertasSlice = createSlice({
  name: 'alertas',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlertas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlertas.fulfilled, (state, action) => {
        const payload = action.payload as { items?: DashboardAlert[]; total?: number; page?: number; pageSize?: number } | DashboardAlert[];
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { items?: DashboardAlert[] })?.items)
            ? (payload as { items: DashboardAlert[] }).items
            : [];
        state.alerts = items;
        state.totalAlerts = Array.isArray(payload) ? payload.length : (typeof (payload as { total?: number })?.total === 'number' ? (payload as { total: number }).total : items.length);
        state.currentPage = Array.isArray(payload) ? 1 : (typeof (payload as { page?: number })?.page === 'number' ? (payload as { page: number }).page : 1);
        state.pageSize = Array.isArray(payload) ? 10 : (typeof (payload as { pageSize?: number })?.pageSize === 'number' ? (payload as { pageSize: number }).pageSize : 10);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAlertas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al cargar alertas';
      });
  },
});

export const { clearError } = alertasSlice.actions;
export default alertasSlice.reducer;
