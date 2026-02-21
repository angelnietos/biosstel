import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { DashboardHomeResponse } from '@biosstel/shared-types';
import { GetDashboardHomeQuery } from '../queries/GetDashboardHome.query';
import { TypeOrmDashboardRepository } from '../../infrastructure/persistence/TypeOrmDashboardRepository';

@Injectable()
export class GetDashboardHomeHandler
  implements IQueryHandler<GetDashboardHomeQuery, DashboardHomeResponse>
{
  constructor(private readonly dashboardRepository: TypeOrmDashboardRepository) {}

  async handle(query: GetDashboardHomeQuery): Promise<DashboardHomeResponse> {
    return this.dashboardRepository.getDashboardHome(query.filters);
  }
}
