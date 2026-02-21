import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  InventoryItem,
  InventoryListResponse,
  CreateInventoryData,
  UpdateInventoryData,
} from '@biosstel/shared-types';
import { TypeOrmInventoryRepository } from '../../infrastructure/persistence/TypeOrmInventoryRepository';

@Injectable()
export class InventoryManagementUseCase {
  constructor(private readonly inventoryRepository: TypeOrmInventoryRepository) {}

  async list(): Promise<InventoryListResponse> {
    const items = await this.inventoryRepository.findAll();
    return { items };
  }

  async getById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) throw new NotFoundException(`Item de inventario ${id} no encontrado`);
    return item;
  }

  async create(data: CreateInventoryData): Promise<InventoryItem> {
    return this.inventoryRepository.create(data);
  }

  async update(id: string, data: UpdateInventoryData): Promise<InventoryItem> {
    const item = await this.inventoryRepository.update(id, data);
    if (!item) throw new NotFoundException(`Item de inventario ${id} no encontrado`);
    return item;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.inventoryRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Item de inventario ${id} no encontrado`);
  }
}
