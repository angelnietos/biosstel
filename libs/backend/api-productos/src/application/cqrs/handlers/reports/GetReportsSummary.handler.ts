import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { GetReportsSummaryQuery } from '../../queries/reports/GetReportsSummary.query';
import type { ReportsManagementUseCase } from '../../../use-cases';

@Injectable()
export class GetReportsSummaryHandler implements IQueryHandler<GetReportsSummaryQuery, Awaited<ReturnType<ReportsManagementUseCase['getSummary']>>> {
  constructor(private readonly reportsManagement: ReportsManagementUseCase) {}

  async handle(_query: GetReportsSummaryQuery): Promise<Awaited<ReturnType<ReportsManagementUseCase['getSummary']>>> {
    return this.reportsManagement.getSummary();
  }
}
