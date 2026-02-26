export {
  default as inventoryReducer,
  fetchInventory,
  updateInventoryItemThunk,
  clearError,
  clearMutationError,
} from './inventorySlice';
export type { InventoryState, UpdateInventoryItemArg } from './inventorySlice';
export type { UpdateInventoryData } from '../../api/services/models';
