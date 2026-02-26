import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { OperacionesListResponse } from '../../api/services/models';
import type { VisitaComercial, TareaAgenda, RevisionBackoffice } from '@biosstel/shared-types';
import { getOperaciones } from '../../api/services';

/** Efecto: carga datos de operaciones (tienda, visitas, agenda, etc.) */
export const fetchOperaciones = createAsyncThunk(
  'operaciones/fetchOperaciones',
  async () => {
    return await getOperaciones();
  }
);

export interface OperacionesState {
  data: OperacionesListResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OperacionesState = {
  data: null,
  isLoading: false,
  error: null,
};

function ensureData(state: OperacionesState): OperacionesListResponse {
  if (!state.data) {
    return { visitas: [], agenda: [], revision: [], tienda: [] };
  }
  return state.data;
}

export const operacionesSlice = createSlice({
  name: 'operaciones',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addVisita: (state, action: { payload: Omit<VisitaComercial, 'id'> }) => {
      const data = ensureData(state);
      const id = `visita-${Date.now()}`;
      data.visitas = [...(data.visitas ?? []), { ...action.payload, id }];
      state.data = data;
    },
    updateVisita: (state, action: { payload: VisitaComercial }) => {
      const data = ensureData(state);
      const list = data.visitas ?? [];
      const i = list.findIndex((v) => v.id === action.payload.id);
      if (i >= 0) {
        data.visitas = list.slice(0, i).concat(action.payload, list.slice(i + 1));
        state.data = data;
      }
    },
    addTarea: (state, action: { payload: Omit<TareaAgenda, 'id'> }) => {
      const data = ensureData(state);
      const id = `tarea-${Date.now()}`;
      data.agenda = [...(data.agenda ?? []), { ...action.payload, id }];
      state.data = data;
    },
    updateTarea: (state, action: { payload: TareaAgenda }) => {
      const data = ensureData(state);
      const list = data.agenda ?? [];
      const i = list.findIndex((t) => t.id === action.payload.id);
      if (i >= 0) {
        data.agenda = list.slice(0, i).concat(action.payload, list.slice(i + 1));
        state.data = data;
      }
    },
    updateRevisionEstado: (state, action: { payload: { id: string; estado: string } }) => {
      const data = ensureData(state);
      const list = data.revision ?? [];
      const i = list.findIndex((r) => r.id === action.payload.id);
      if (i >= 0) {
        data.revision = list.map((r) =>
          r.id === action.payload.id ? { ...r, estado: action.payload.estado } : r
        );
        state.data = data;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperaciones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOperaciones.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOperaciones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al cargar operaciones';
      });
  },
});

export const {
  clearError,
  addVisita,
  updateVisita,
  addTarea,
  updateTarea,
  updateRevisionEstado,
} = operacionesSlice.actions;
export default operacionesSlice.reducer;
