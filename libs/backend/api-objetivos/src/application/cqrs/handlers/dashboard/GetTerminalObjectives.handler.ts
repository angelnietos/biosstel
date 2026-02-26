import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { TerminalObjectivesResponse } from '@biosstel/shared-types';
import { GetTerminalObjectivesQuery } from '../../queries/dashboard/GetTerminalObjectives.query';
import type { TypeOrmDashboardRepository } from '../../../../infrastructure/persistence';

@QueryHandler(GetTerminalObjectivesQuery)
@Injectable()
export class GetTerminalObjectivesHandler implements IQueryHandler<GetTerminalObjectivesQuery> {
  constructor(private readonly dashboardRepository: TypeOrmDashboardRepository) {}

  async execute(query: GetTerminalObjectivesQuery): Promise<TerminalObjectivesResponse> {
    return this.dashboardRepository.getTerminalObjectives(query.filters);
  }
}
