import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetInventoryByIdQuery } from '../../queries/inventario/GetInventoryById.query';
import type { InventoryManagementUseCase } from '../../../use-cases';

@QueryHandler(GetInventoryByIdQuery)
@Injectable()
export class GetInventoryByIdHandler implements IQueryHandler<GetInventoryByIdQuery> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async execute(query: GetInventoryByIdQuery): Promise<Awaited<ReturnType<InventoryManagementUseCase['getById']>>> {
    return this.inventoryManagement.getById(query.id);
  }
}
