import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { GetDashboardHomeQuery } from './queries/dashboard/GetDashboardHome.query';
import { GetTerminalObjectivesQuery } from './queries/dashboard/GetTerminalObjectives.query';
import { GetDashboardHomeHandler } from './handlers/dashboard/GetDashboardHome.handler';
import { GetTerminalObjectivesHandler } from './handlers/dashboard/GetTerminalObjectives.handler';

@Injectable()
export class DashboardMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerQueryHandler(GetDashboardHomeQuery, GetDashboardHomeHandler);
    this.mediator.registerQueryHandler(GetTerminalObjectivesQuery, GetTerminalObjectivesHandler);
  }
}
