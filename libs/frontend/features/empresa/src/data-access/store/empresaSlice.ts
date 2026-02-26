import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { EmpresaListResponse } from '../../api/services/models';
import { getEmpresa, createWorkCenter, updateWorkCenter } from '../../api/services';

/** Efecto: carga empresa (departamentos, centros, cuentas) desde el API */
export const fetchEmpresa = createAsyncThunk(
  'empresa/fetchEmpresa',
  async () => {
    return await getEmpresa();
  }
);

/** Efecto: crea centro de trabajo y recarga empresa */
export const createWorkCenterThunk = createAsyncThunk(
  'empresa/createWorkCenter',
  async (
    data: { name: string; address?: string; departmentId?: string },
    { dispatch }
  ) => {
    const result = await createWorkCenter(data);
    dispatch(fetchEmpresa());
    return result;
  }
);

/** Efecto: actualiza centro de trabajo y recarga empresa */
export const updateWorkCenterThunk = createAsyncThunk(
  'empresa/updateWorkCenter',
  async (
    { id, data }: { id: string; data: { name?: string; address?: string; departmentId?: string } },
    { dispatch }
  ) => {
    const result = await updateWorkCenter(id, data);
    dispatch(fetchEmpresa());
    return result;
  }
);

export interface EmpresaState {
  data: EmpresaListResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmpresaState = {
  data: null,
  isLoading: false,
  error: null,
};

export const empresaSlice = createSlice({
  name: 'empresa',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpresa.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmpresa.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEmpresa.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al cargar empresa';
      })
      .addCase(createWorkCenterThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'Error al crear centro';
      })
      .addCase(updateWorkCenterThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'Error al actualizar centro';
      });
  },
});

export const { clearError } = empresaSlice.actions;
export default empresaSlice.reducer;
