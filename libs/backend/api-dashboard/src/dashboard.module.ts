/**
 * @biosstel/api-dashboard - NestJS Module Adapter
 * 
 * Hexagonal Architecture:
 * - Application: Use Cases and Ports
 * - Infrastructure: Adapters (TypeORM, REST)
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
} from './infrastructure';

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
    // Output Adapters (Repositories)
    TypeOrmDashboardRepository,
    
    // Application Layer (Use Cases)
    DashboardManagementUseCase,
    
    // Legacy service (for backward compatibility)
    DashboardService,
  ],
  exports: [
    DashboardManagementUseCase,
    TypeOrmDashboardRepository,
    DashboardService, // For backward compatibility
  ],
})
export class DashboardModule {}


