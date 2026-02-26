/**
 * @biosstel/api-alertas - NestJS Module
 * Event-driven: suscrito a FichajeEnded (y otros) para generar alertas.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertasController } from './infrastructure/api';
import { AlertasManagementUseCase } from './application/use-cases';
import { FichajeEndedAlertHandler } from './application/cqrs/handlers/alertas/events/FichajeEndedAlert.handler';
import { AlertasMediatorRegistration } from './application/cqrs/AlertasMediatorRegistration';
import { ListAlertasHandler } from './application/cqrs/handlers/alertas/queries/ListAlertas.handler';
import { CreateAlertaHandler } from './application/cqrs/handlers/alertas/commands/CreateAlerta.handler';
import { UpdateAlertaHandler } from './application/cqrs/handlers/alertas/commands/UpdateAlerta.handler';
import { DeleteAlertaHandler } from './application/cqrs/handlers/alertas/commands/DeleteAlerta.handler';
import { ALERTAS_POSTGRES_ENTITIES, PostgresAlertasRepository } from './infrastructure/persistence';
import { I_ALERTAS_REPOSITORY } from './domain/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([...ALERTAS_POSTGRES_ENTITIES])],
  controllers: [AlertasController],
  providers: [
    AlertasManagementUseCase,
    FichajeEndedAlertHandler,
    ListAlertasHandler,
    CreateAlertaHandler,
    UpdateAlertaHandler,
    DeleteAlertaHandler,
    {
      provide: I_ALERTAS_REPOSITORY,
      useClass: PostgresAlertasRepository,
    },
  ],
  exports: [AlertasManagementUseCase],
})
export class AlertasModule {}
