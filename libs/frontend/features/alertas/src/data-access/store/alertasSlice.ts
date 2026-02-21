import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardAlert } from '../../api/services/models';
import type { AlertaTipo, AlertasFilters } from '../../api/services';
import { getAlertas } from '../../api/services';

export interface FetchAlertasArg {
  tipo?: AlertaTipo;
  filters?: AlertasFilters;
}

/** Efecto: carga alertas con filtros opcionales */
export const fetchAlertas = createAsyncThunk(
  'alertas/fetchAlertas',
  async (arg: FetchAlertasArg) => {
    const { tipo, filters } = arg;
    return await getAlertas(tipo, filters);
  }
);

export interface AlertasState {
  alerts: DashboardAlert[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AlertasState = {
  alerts: [],
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
        state.alerts = Array.isArray(action.payload) ? action.payload : [];
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
