import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { TerminalObjectivesResponse } from '@biosstel/shared-types';
import { GetTerminalObjectivesQuery } from '../queries/GetTerminalObjectives.query';
import { TypeOrmDashboardRepository } from '../../infrastructure/persistence/TypeOrmDashboardRepository';

@Injectable()
export class GetTerminalObjectivesHandler
  implements IQueryHandler<GetTerminalObjectivesQuery, TerminalObjectivesResponse>
{
  constructor(private readonly dashboardRepository: TypeOrmDashboardRepository) {}

  async handle(query: GetTerminalObjectivesQuery): Promise<TerminalObjectivesResponse> {
    return this.dashboardRepository.getTerminalObjectives(query.filters);
  }
}
