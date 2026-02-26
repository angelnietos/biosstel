import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { TerminalObjectivesResponse } from '@biosstel/shared-types';
import type { GetTerminalObjectivesQuery } from '../../queries/dashboard/GetTerminalObjectives.query';
import type { TypeOrmDashboardRepository } from '../../../../infrastructure/persistence';

@Injectable()
export class GetTerminalObjectivesHandler
  implements IQueryHandler<GetTerminalObjectivesQuery, TerminalObjectivesResponse>
{
  constructor(private readonly dashboardRepository: TypeOrmDashboardRepository) {}

  async handle(query: GetTerminalObjectivesQuery): Promise<TerminalObjectivesResponse> {
    return this.dashboardRepository.getTerminalObjectives(query.filters);
  }
}
