import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { DashboardHomeResponse } from '@biosstel/shared-types';
import { GetDashboardHomeQuery } from '../../queries/dashboard/GetDashboardHome.query';
import { TypeOrmDashboardRepository } from '../../../../infrastructure/persistence';

@QueryHandler(GetDashboardHomeQuery)
@Injectable()
export class GetDashboardHomeHandler implements IQueryHandler<GetDashboardHomeQuery> {
  constructor(private readonly dashboardRepository: TypeOrmDashboardRepository) {}

  async execute(query: GetDashboardHomeQuery): Promise<DashboardHomeResponse> {
    return this.dashboardRepository.getDashboardHome(query.filters);
  }
}
