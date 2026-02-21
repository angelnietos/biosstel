export {
  default as productosReducer,
  fetchProductos,
  fetchProductoById,
  createProductoThunk,
  updateProductoThunk,
  clearListError,
  clearCurrentProduct,
  clearMutationError,
} from './productosSlice';
export type { ProductosState, FetchProductosOptions } from './productosSlice';
