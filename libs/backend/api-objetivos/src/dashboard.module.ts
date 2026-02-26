/**
 * @biosstel/api-dashboard - NestJS Module Adapter
 *
 * CQRS: query handlers; event-driven: subscribes to FichajeEnded.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './infrastructure/api';
import { DashboardService } from './dashboard.service';
import { DashboardManagementUseCase } from './application/use-cases';
import {
  OBJETIVOS_POSTGRES_ENTITIES,
  TypeOrmDashboardRepository,
} from './infrastructure/persistence/postgres';
import { GetDashboardHomeHandler, GetTerminalObjectivesHandler, FichajeEndedEventHandler } from './application/cqrs/handlers/dashboard';
import { DashboardMediatorRegistration } from './application/cqrs/DashboardMediatorRegistration';
import { I_DASHBOARD_REPOSITORY } from './domain/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([...OBJETIVOS_POSTGRES_ENTITIES]),
  ],
  controllers: [DashboardController],
  providers: [
    { provide: I_DASHBOARD_REPOSITORY, useClass: TypeOrmDashboardRepository },
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
