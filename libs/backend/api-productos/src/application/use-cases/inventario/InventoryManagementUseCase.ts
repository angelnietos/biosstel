import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { InventoryItem, CreateInventoryInput, UpdateInventoryInput } from '../../../domain/entities';
import type { IInventoryRepository } from '../../../domain/repositories';
import { INVENTORY_REPOSITORY } from '../../../domain/repositories';

@Injectable()
export class InventoryManagementUseCase {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: IInventoryRepository
  ) {}

  async list(): Promise<{ items: InventoryItem[] }> {
    const items = await this.inventoryRepository.findAll();
    return { items };
  }

  async getById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) throw new NotFoundException(`Item de inventario ${id} no encontrado`);
    return item;
  }

  async create(data: CreateInventoryInput): Promise<InventoryItem> {
    return this.inventoryRepository.create(data);
  }

  async update(id: string, data: UpdateInventoryInput): Promise<InventoryItem> {
    const item = await this.inventoryRepository.update(id, data);
    if (!item) throw new NotFoundException(`Item de inventario ${id} no encontrado`);
    return item;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.inventoryRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Item de inventario ${id} no encontrado`);
  }
}
