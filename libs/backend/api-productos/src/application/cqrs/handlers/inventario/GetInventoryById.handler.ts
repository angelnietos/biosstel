import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { GetInventoryByIdQuery } from '../../queries/inventario/GetInventoryById.query';
import type { InventoryManagementUseCase } from '../../../use-cases';

@Injectable()
export class GetInventoryByIdHandler implements IQueryHandler<GetInventoryByIdQuery, Awaited<ReturnType<InventoryManagementUseCase['getById']>>> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async handle(query: GetInventoryByIdQuery): Promise<Awaited<ReturnType<InventoryManagementUseCase['getById']>>> {
    return this.inventoryManagement.getById(query.id);
  }
}
