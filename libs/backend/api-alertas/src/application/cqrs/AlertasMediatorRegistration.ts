import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { ListAlertasQuery } from './queries/alertas/ListAlertas.query';
import { ListAlertasHandler } from './handlers/alertas/queries/ListAlertas.handler';
import { CreateAlertaCommand } from './commands/alertas/CreateAlerta.command';
import { UpdateAlertaCommand } from './commands/alertas/UpdateAlerta.command';
import { DeleteAlertaCommand } from './commands/alertas/DeleteAlerta.command';
import { CreateAlertaHandler } from './handlers/alertas/commands/CreateAlerta.handler';
import { UpdateAlertaHandler } from './handlers/alertas/commands/UpdateAlerta.handler';
import { DeleteAlertaHandler } from './handlers/alertas/commands/DeleteAlerta.handler';

@Injectable()
export class AlertasMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerQueryHandler(ListAlertasQuery, ListAlertasHandler);
    this.mediator.registerCommandHandler(CreateAlertaCommand, CreateAlertaHandler);
    this.mediator.registerCommandHandler(UpdateAlertaCommand, UpdateAlertaHandler);
    this.mediator.registerCommandHandler(DeleteAlertaCommand, DeleteAlertaHandler);
  }
}
