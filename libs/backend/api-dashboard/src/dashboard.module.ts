import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardObjectiveEntity } from './infrastructure/persistence/DashboardObjectiveEntity';
import { DashboardAlertEntity } from './infrastructure/persistence/DashboardAlertEntity';
import { TerminalObjectiveEntity } from './infrastructure/persistence/TerminalObjectiveEntity';
import { TerminalAssignmentEntity } from './infrastructure/persistence/TerminalAssignmentEntity';

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
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

