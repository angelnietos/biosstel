import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListOperacionesQuery } from '../../queries/operaciones/ListOperaciones.query';
import type { OperacionesManagementUseCase as OperacionesUseCaseType } from '../../../use-cases';
import { OperacionesManagementUseCase } from '../../../use-cases';

@QueryHandler(ListOperacionesQuery)
@Injectable()
export class ListOperacionesHandler implements IQueryHandler<ListOperacionesQuery> {
  constructor(private readonly operacionesManagement: OperacionesManagementUseCase) {}

  async execute(_query: ListOperacionesQuery): Promise<Awaited<ReturnType<OperacionesUseCaseType['list']>>> {
    return this.operacionesManagement.list();
  }
}
