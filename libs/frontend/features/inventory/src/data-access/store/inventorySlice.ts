import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { InventoryListResponse, UpdateInventoryData } from '../../api/services/models';
import { getInventory, updateInventoryItem } from '../../api/services/inventory';

/** Efecto: carga inventario */
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async () => {
    return await getInventory();
  }
);

export interface UpdateInventoryItemArg {
  id: string;
  data: UpdateInventoryData;
}

/** Efecto: actualiza un item del inventario */
export const updateInventoryItemThunk = createAsyncThunk(
  'inventory/updateItem',
  async (arg: UpdateInventoryItemArg) => {
    return await updateInventoryItem(arg.id, arg.data);
  }
);

export interface InventoryState {
  data: InventoryListResponse | null;
  isLoading: boolean;
  error: string | null;
  mutationLoading: boolean;
  mutationError: string | null;
}

const initialState: InventoryState = {
  data: null,
  isLoading: false,
  error: null,
  mutationLoading: false,
  mutationError: null,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMutationError: (state) => {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al cargar inventario';
      })
      .addCase(updateInventoryItemThunk.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(updateInventoryItemThunk.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = null;
        if (state.data?.items) {
          const idx = state.data.items.findIndex((i) => i.id === action.payload.id);
          if (idx >= 0) state.data.items[idx] = action.payload;
        }
      })
      .addCase(updateInventoryItemThunk.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.error.message ?? 'Error al guardar';
      });
  },
});

export const { clearError, clearMutationError } = inventorySlice.actions;
export default inventorySlice.reducer;
