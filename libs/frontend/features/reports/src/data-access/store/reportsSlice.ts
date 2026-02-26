import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ReportsSummaryResponse } from '../../api/services/models';
import { getReportsSummary } from '../../api/services/reports';

/** Efecto: carga resumen de reportes */
export const fetchReportsSummary = createAsyncThunk(
  'reports/fetchReportsSummary',
  async () => {
    return await getReportsSummary();
  }
);

export interface ReportsState {
  data: ReportsSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  data: null,
  isLoading: false,
  error: null,
};

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportsSummary.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchReportsSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al cargar informes';
      });
  },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
