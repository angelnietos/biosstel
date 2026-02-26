import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { ListAlertasQuery } from '../../queries/alertas/ListAlertas.query';
import type { AlertasManagementUseCase } from '../../../use-cases';

@Injectable()
export class ListAlertasHandler implements IQueryHandler<ListAlertasQuery, Awaited<ReturnType<AlertasManagementUseCase['list']>>> {
  constructor(private readonly alertasManagement: AlertasManagementUseCase) {}

  async handle(query: ListAlertasQuery): Promise<Awaited<ReturnType<AlertasManagementUseCase['list']>>> {
    return this.alertasManagement.list(query.tipo, query.filters, query.page, query.pageSize);
  }
}
