import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Product,
  ProductListResponse,
  CreateProductData,
  UpdateProductData,
} from '../../api/services/models';
import { getProductos, getProductoById, createProducto, updateProducto } from '../../api/services/productos';

export interface FetchProductosOptions {
  cacheBust?: boolean;
}

/** Efecto: carga lista de productos */
export const fetchProductos = createAsyncThunk(
  'productos/fetchProductos',
  async (options?: FetchProductosOptions) => {
    return await getProductos(options);
  }
);

/** Efecto: carga un producto por id */
export const fetchProductoById = createAsyncThunk(
  'productos/fetchProductoById',
  async (productId: string) => {
    return await getProductoById(productId);
  }
);

/** Efecto: crea producto */
export const createProductoThunk = createAsyncThunk(
  'productos/createProducto',
  async (data: CreateProductData) => {
    return await createProducto(data);
  }
);

/** Efecto: actualiza producto */
export const updateProductoThunk = createAsyncThunk(
  'productos/updateProducto',
  async (arg: { id: string; data: UpdateProductData }) => {
    return await updateProducto(arg.id, arg.data);
  }
);

export interface ProductosState {
  list: ProductListResponse | null;
  listLoading: boolean;
  listError: string | null;
  currentProduct: Product | null;
  currentLoading: boolean;
  currentError: string | null;
  mutationLoading: boolean;
  mutationError: string | null;
}

const initialState: ProductosState = {
  list: null,
  listLoading: false,
  listError: null,
  currentProduct: null,
  currentLoading: false,
  currentError: null,
  mutationLoading: false,
  mutationError: null,
};

export const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    clearListError: (state) => {
      state.listError = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentError = null;
    },
    clearMutationError: (state) => {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.list = action.payload;
        state.listLoading = false;
        state.listError = null;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.error.message ?? 'Error al cargar productos';
      })
      .addCase(fetchProductoById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchProductoById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.currentLoading = false;
        state.currentError = null;
      })
      .addCase(fetchProductoById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.error.message ?? 'Error al cargar producto';
      })
      .addCase(createProductoThunk.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(createProductoThunk.fulfilled, (state) => {
        state.mutationLoading = false;
        state.mutationError = null;
      })
      .addCase(createProductoThunk.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.error.message ?? 'Error al crear producto';
      })
      .addCase(updateProductoThunk.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(updateProductoThunk.fulfilled, (state) => {
        state.mutationLoading = false;
        state.mutationError = null;
      })
      .addCase(updateProductoThunk.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.error.message ?? 'Error al guardar';
      });
  },
});

export const { clearListError, clearCurrentProduct, clearMutationError } = productosSlice.actions;
export default productosSlice.reducer;
