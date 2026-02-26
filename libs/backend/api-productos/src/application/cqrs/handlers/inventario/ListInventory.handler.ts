import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { ListInventoryQuery } from '../../queries/inventario/ListInventory.query';
import type { InventoryManagementUseCase } from '../../../use-cases';

@Injectable()
export class ListInventoryHandler implements IQueryHandler<ListInventoryQuery, Awaited<ReturnType<InventoryManagementUseCase['list']>>> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async handle(_query: ListInventoryQuery): Promise<Awaited<ReturnType<InventoryManagementUseCase['list']>>> {
    return this.inventoryManagement.list();
  }
}
