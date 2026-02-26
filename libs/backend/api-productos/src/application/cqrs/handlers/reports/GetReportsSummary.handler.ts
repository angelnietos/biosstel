import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetReportsSummaryQuery } from '../../queries/reports/GetReportsSummary.query';
import type { ReportsManagementUseCase } from '../../../use-cases';

@QueryHandler(GetReportsSummaryQuery)
@Injectable()
export class GetReportsSummaryHandler implements IQueryHandler<GetReportsSummaryQuery> {
  constructor(private readonly reportsManagement: ReportsManagementUseCase) {}

  async execute(_query: GetReportsSummaryQuery): Promise<Awaited<ReturnType<ReportsManagementUseCase['getSummary']>>> {
    return this.reportsManagement.getSummary();
  }
}
