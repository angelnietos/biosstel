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
        let items: DashboardAlert[] = [];
        if (Array.isArray(payload)) {
          items = payload;
        } else if (Array.isArray((payload as { items?: DashboardAlert[] })?.items)) {
          items = (payload as { items: DashboardAlert[] }).items;
        }
        state.alerts = items;
        const totalVal = Array.isArray(payload) ? payload.length : (typeof (payload as { total?: number })?.total === 'number' ? (payload as { total: number }).total : items.length);
        state.totalAlerts = totalVal;
        const pageVal = Array.isArray(payload) ? 1 : (typeof (payload as { page?: number })?.page === 'number' ? (payload as { page: number }).page : 1);
        state.currentPage = pageVal;
        const pageSizeVal = Array.isArray(payload) ? 10 : (typeof (payload as { pageSize?: number })?.pageSize === 'number' ? (payload as { pageSize: number }).pageSize : 10);
        state.pageSize = pageSizeVal;
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
