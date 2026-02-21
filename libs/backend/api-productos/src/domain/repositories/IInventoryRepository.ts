import type { InventoryItem, CreateInventoryData, UpdateInventoryData } from '@biosstel/shared-types';

export interface IInventoryRepository {
  findAll(): Promise<InventoryItem[]>;
  findById(id: string): Promise<InventoryItem | null>;
  create(data: CreateInventoryData): Promise<InventoryItem>;
  update(id: string, data: UpdateInventoryData): Promise<InventoryItem | null>;
  delete(id: string): Promise<boolean>;
}
