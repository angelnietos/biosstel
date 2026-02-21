import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { OperacionesListResponse } from '../../api/services/models';
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

export const operacionesSlice = createSlice({
  name: 'operaciones',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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

export const { clearError } = operacionesSlice.actions;
export default operacionesSlice.reducer;
