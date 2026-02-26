/**
 * Output Port: repositorio de inventario (dominio).
 */
import type { InventoryItem, CreateInventoryInput, UpdateInventoryInput } from '../../entities/InventoryItem';

export interface IInventoryRepository {
  findAll(): Promise<InventoryItem[]>;
  findById(id: string): Promise<InventoryItem | null>;
  create(data: CreateInventoryInput): Promise<InventoryItem>;
  update(id: string, data: UpdateInventoryInput): Promise<InventoryItem | null>;
  delete(id: string): Promise<boolean>;
}

export const INVENTORY_REPOSITORY = Symbol('IInventoryRepository');
