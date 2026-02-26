import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { ListAlertasQuery } from './queries/alertas/ListAlertas.query';
import { ListAlertasHandler } from './handlers/alertas/queries/ListAlertas.handler';

@Injectable()
export class AlertasMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerQueryHandler(ListAlertasQuery, ListAlertasHandler);
  }
}
