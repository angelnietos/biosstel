import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAlertaCommand } from '../../../commands/alertas/UpdateAlerta.command';
import type { Alert } from '../../../../../domain/entities';
import { type IAlertasRepository, I_ALERTAS_REPOSITORY } from '../../../../../domain/repositories';

@CommandHandler(UpdateAlertaCommand)
@Injectable()
export class UpdateAlertaHandler implements ICommandHandler<UpdateAlertaCommand> {
  constructor(@Inject(I_ALERTAS_REPOSITORY) private readonly alertasRepo: IAlertasRepository) {}

  async execute(command: UpdateAlertaCommand): Promise<Alert> {
    const existing = await this.alertasRepo.findById(command.id);
    if (!existing) throw new NotFoundException(`Alerta ${command.id} no encontrada`);
    return this.alertasRepo.update(command.id, command.data);
  }
}
