/**
 * @biosstel/api-operaciones - NestJS Module
 * Event-driven: suscrito a FichajeEnded (métricas de operaciones).
 */

import { Module } from '@nestjs/common';
import { OperacionesController } from './infrastructure/api';
import { OperacionesManagementUseCase } from './application/use-cases';
import { FichajeEndedOperacionesHandler } from './application/cqrs/handlers/operaciones/FichajeEndedOperaciones.handler';
import { ListOperacionesHandler } from './application/cqrs/handlers/operaciones/ListOperaciones.handler';
import { I_OPERACIONES_REPOSITORY } from './domain/repositories';
import { PostgresOperacionesRepository } from './infrastructure/persistence';

@Module({
  controllers: [OperacionesController],
  providers: [
    OperacionesManagementUseCase,
    FichajeEndedOperacionesHandler,
    ListOperacionesHandler,
    {
      provide: I_OPERACIONES_REPOSITORY,
      useClass: PostgresOperacionesRepository,
    },
  ],
  exports: [OperacionesManagementUseCase],
})
export class OperacionesModule {}
