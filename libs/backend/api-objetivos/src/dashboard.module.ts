/**
 * @biosstel/api-dashboard - NestJS Module Adapter
 *
 * CQRS: query handlers; event-driven: subscribes to FichajeEnded.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './infrastructure/api/dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardManagementUseCase } from './application/use-cases';
import { TypeOrmDashboardRepository } from './infrastructure/persistence/TypeOrmDashboardRepository';
import {
  DashboardObjectiveEntity,
  DashboardAlertEntity,
  TerminalObjectiveEntity,
  TerminalAssignmentEntity,
} from './infrastructure/persistence';
import { GetDashboardHomeHandler } from './application/handlers/GetDashboardHome.handler';
import { GetTerminalObjectivesHandler } from './application/handlers/GetTerminalObjectives.handler';
import { FichajeEndedEventHandler } from './application/handlers/FichajeEndedEvent.handler';
import { DashboardMediatorRegistration } from './application/DashboardMediatorRegistration';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DashboardObjectiveEntity,
      DashboardAlertEntity,
      TerminalObjectiveEntity,
      TerminalAssignmentEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    TypeOrmDashboardRepository,
    DashboardManagementUseCase,
    DashboardService,
    GetDashboardHomeHandler,
    GetTerminalObjectivesHandler,
    FichajeEndedEventHandler,
    DashboardMediatorRegistration,
  ],
  exports: [
    DashboardManagementUseCase,
    TypeOrmDashboardRepository,
    DashboardService,
  ],
})
export class DashboardModule {}
