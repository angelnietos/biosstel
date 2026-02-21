/**
 * @biosstel/api-operaciones - NestJS Module
 * Event-driven: suscrito a FichajeEnded (métricas de operaciones).
 */

import { Module } from '@nestjs/common';
import { OperacionesController } from './infrastructure/api/operaciones.controller';
import { OperacionesManagementUseCase } from './application/use-cases';
import { OperacionesService } from './operaciones.service';
import { FichajeEndedOperacionesHandler } from './application/handlers/FichajeEndedOperaciones.handler';

@Module({
  controllers: [OperacionesController],
  providers: [OperacionesManagementUseCase, OperacionesService, FichajeEndedOperacionesHandler],
  exports: [OperacionesManagementUseCase, OperacionesService],
})
export class OperacionesModule {}
