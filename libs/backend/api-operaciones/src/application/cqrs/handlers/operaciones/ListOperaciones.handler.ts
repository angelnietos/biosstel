import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { ListOperacionesQuery } from '../../queries/operaciones/ListOperaciones.query';
import type { OperacionesManagementUseCase } from '../../../use-cases';

@Injectable()
export class ListOperacionesHandler implements IQueryHandler<ListOperacionesQuery, Awaited<ReturnType<OperacionesManagementUseCase['list']>>> {
  constructor(private readonly operacionesManagement: OperacionesManagementUseCase) {}

  async handle(_query: ListOperacionesQuery): Promise<Awaited<ReturnType<OperacionesManagementUseCase['list']>>> {
    return this.operacionesManagement.list();
  }
}
