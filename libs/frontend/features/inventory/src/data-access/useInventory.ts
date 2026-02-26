import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, updateInventoryItemThunk, type InventoryState, type UpdateInventoryData } from './store';

export function useInventory() {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error, mutationLoading, mutationError } = useSelector((state: { inventory: InventoryState }) => state.inventory);

  const fetchInventoryFn = useCallback(() => {
    (dispatch as (thunk: ReturnType<typeof fetchInventory>) => void)(fetchInventory());
  }, [dispatch]);

  const updateItem = useCallback(
    (id: string, payload: UpdateInventoryData) => {
      return (dispatch as (thunk: ReturnType<typeof updateInventoryItemThunk>) => Promise<unknown>)(updateInventoryItemThunk({ id, data: payload }));
    },
    [dispatch]
  );

  return { data, loading, error, fetchInventory: fetchInventoryFn, updateItem, mutationLoading, mutationError };
}
