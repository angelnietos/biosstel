import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListInventoryQuery } from '../../queries/inventario/ListInventory.query';
import type { InventoryManagementUseCase } from '../../../use-cases';

@QueryHandler(ListInventoryQuery)
@Injectable()
export class ListInventoryHandler implements IQueryHandler<ListInventoryQuery> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async execute(_query: ListInventoryQuery): Promise<Awaited<ReturnType<InventoryManagementUseCase['list']>>> {
    return this.inventoryManagement.list();
  }
}
