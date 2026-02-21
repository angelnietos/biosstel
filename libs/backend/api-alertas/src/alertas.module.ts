/**
 * @biosstel/api-alertas - NestJS Module
 * Event-driven: suscrito a FichajeEnded (y otros) para generar alertas.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardAlertEntity } from '@biosstel/api-objetivos';
import { AlertasController } from './infrastructure/api/alertas.controller';
import { AlertasManagementUseCase } from './application/use-cases';
import { AlertasService } from './alertas.service';
import { FichajeEndedAlertHandler } from './application/handlers/FichajeEndedAlert.handler';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardAlertEntity])],
  controllers: [AlertasController],
  providers: [AlertasManagementUseCase, AlertasService, FichajeEndedAlertHandler],
  exports: [AlertasManagementUseCase, AlertasService],
})
export class AlertasModule {}
