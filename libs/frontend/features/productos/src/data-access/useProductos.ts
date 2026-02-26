import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductos, type ProductosState } from './store';

export function useProductos() {
  const dispatch = useDispatch();
  const { list: data, listLoading: loading, listError: error } = useSelector((state: { productos: ProductosState }) => state.productos);

  const fetchProductosFn = useCallback(
    (options?: { cacheBust?: boolean }) => {
      (dispatch as (thunk: ReturnType<typeof fetchProductos>) => void)(fetchProductos(options));
    },
    [dispatch]
  );

  return { data, loading, error, fetchProductos: fetchProductosFn };
}
