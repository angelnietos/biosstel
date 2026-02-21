import { Injectable, OnModuleInit } from '@nestjs/common';
import { Mediator } from '@biosstel/api-shared';
import { GetDashboardHomeQuery } from './queries/GetDashboardHome.query';
import { GetTerminalObjectivesQuery } from './queries/GetTerminalObjectives.query';
import { GetDashboardHomeHandler } from './handlers/GetDashboardHome.handler';
import { GetTerminalObjectivesHandler } from './handlers/GetTerminalObjectives.handler';

@Injectable()
export class DashboardMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerQueryHandler(GetDashboardHomeQuery, GetDashboardHomeHandler);
    this.mediator.registerQueryHandler(GetTerminalObjectivesQuery, GetTerminalObjectivesHandler);
  }
}
