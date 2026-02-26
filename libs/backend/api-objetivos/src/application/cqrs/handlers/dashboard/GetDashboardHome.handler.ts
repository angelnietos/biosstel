import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { DashboardHomeResponse } from '@biosstel/shared-types';
import type { GetDashboardHomeQuery } from '../../queries/dashboard/GetDashboardHome.query';
import type { TypeOrmDashboardRepository } from '../../../../infrastructure/persistence';

@Injectable()
export class GetDashboardHomeHandler
  implements IQueryHandler<GetDashboardHomeQuery, DashboardHomeResponse>
{
  constructor(private readonly dashboardRepository: TypeOrmDashboardRepository) {}

  async handle(query: GetDashboardHomeQuery): Promise<DashboardHomeResponse> {
    return this.dashboardRepository.getDashboardHome(query.filters);
  }
}
