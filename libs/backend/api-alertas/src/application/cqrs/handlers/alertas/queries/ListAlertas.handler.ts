import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListAlertasQuery } from '../../../queries/alertas/ListAlertas.query';
import type { AlertasManagementUseCase as AlertasUseCaseType } from '../../../../use-cases';
import { AlertasManagementUseCase } from '../../../../use-cases';

@QueryHandler(ListAlertasQuery)
@Injectable()
export class ListAlertasHandler implements IQueryHandler<ListAlertasQuery> {
  constructor(private readonly alertasManagement: AlertasManagementUseCase) {}

  async execute(query: ListAlertasQuery): Promise<Awaited<ReturnType<AlertasUseCaseType['list']>>> {
    return this.alertasManagement.list(query.tipo, query.filters, query.page, query.pageSize);
  }
}
