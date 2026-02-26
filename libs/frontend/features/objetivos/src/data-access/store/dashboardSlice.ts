import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardHomeResponse, TerminalObjectivesResponse } from '../../api/services/models';
import { getDashboardHome, getTerminalObjectives, patchTerminalObjective } from '../../api/services';

/** Efecto: carga datos del home (objetivos + alertas) */
export const fetchDashboardHome = createAsyncThunk(
  'dashboard/fetchDashboardHome',
  async (filters?: Record<string, string[]>) => {
    return await getDashboardHome(filters);
  }
);

/** Efecto: carga objetivos terminales */
export const fetchTerminalObjectives = createAsyncThunk(
  'dashboard/fetchTerminalObjectives',
  async (filters?: Record<string, string[]>) => {
    return await getTerminalObjectives(filters);
  }
);

export interface FetchTerminalByPeriodArg {
  type: string;
  period: string;
}

/** Efecto: carga objetivos terminales por tipo y periodo (histórico) */
export const fetchTerminalObjectivesByPeriod = createAsyncThunk(
  'dashboard/fetchTerminalObjectivesByPeriod',
  async (arg: FetchTerminalByPeriodArg) => {
    return await getTerminalObjectives({ type: [arg.type], period: [arg.period] });
  }
);

export interface PatchTerminalObjectiveArg {
  id: string;
  isActive: boolean;
}

/** Efecto: actualiza isActive de un objetivo terminal */
export const patchTerminalObjectiveThunk = createAsyncThunk(
  'dashboard/patchTerminalObjective',
  async (arg: PatchTerminalObjectiveArg) => {
    return await patchTerminalObjective(arg.id, { isActive: arg.isActive });
  }
);

export interface DashboardState {
  homeData: DashboardHomeResponse | null;
  terminalData: TerminalObjectivesResponse | null;
  /** Datos por tipo+periodo (key = `${type}-${period}`) */
  terminalDataByPeriod: { key: string; data: TerminalObjectivesResponse | null };
  terminalByPeriodLoading: boolean;
  isLoading: boolean;
  error: string | null;
  patchLoading: boolean;
  patchError: string | null;
}

const initialState: DashboardState = {
  homeData: null,
  terminalData: null,
  terminalDataByPeriod: { key: '', data: null },
  terminalByPeriodLoading: false,
  isLoading: false,
  error: null,
  patchLoading: false,
  patchError: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardHome.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardHome.fulfilled, (state, action) => {
        state.homeData = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDashboardHome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error cargando dashboard';
      })
      .addCase(fetchTerminalObjectives.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTerminalObjectives.fulfilled, (state, action) => {
        state.terminalData = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchTerminalObjectives.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error cargando objetivos terminales';
      })
      .addCase(fetchTerminalObjectivesByPeriod.pending, (state) => {
        state.terminalByPeriodLoading = true;
      })
      .addCase(fetchTerminalObjectivesByPeriod.fulfilled, (state, action) => {
        const meta = action.meta;
        const key = meta.arg ? `${meta.arg.type}-${meta.arg.period}` : '';
        state.terminalDataByPeriod = { key, data: action.payload };
        state.terminalByPeriodLoading = false;
      })
      .addCase(fetchTerminalObjectivesByPeriod.rejected, (state) => {
        state.terminalByPeriodLoading = false;
      })
      .addCase(patchTerminalObjectiveThunk.pending, (state) => {
        state.patchLoading = true;
        state.patchError = null;
      })
      .addCase(patchTerminalObjectiveThunk.fulfilled, (state) => {
        state.patchLoading = false;
        state.patchError = null;
      })
      .addCase(patchTerminalObjectiveThunk.rejected, (state, action) => {
        state.patchLoading = false;
        state.patchError = action.error.message ?? 'Error al actualizar objetivo';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
