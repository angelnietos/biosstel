import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { UpdateAlertaCommand } from '../../../commands/alertas/UpdateAlerta.command';
import type { Alert } from '../../../../../domain/entities';
import { type IAlertasRepository, I_ALERTAS_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class UpdateAlertaHandler implements ICommandHandler<UpdateAlertaCommand, Alert> {
  constructor(@Inject(I_ALERTAS_REPOSITORY) private readonly alertasRepo: IAlertasRepository) {}

  async handle(command: UpdateAlertaCommand): Promise<Alert> {
    const existing = await this.alertasRepo.findById(command.id);
    if (!existing) throw new NotFoundException(`Alerta ${command.id} no encontrada`);
    return this.alertasRepo.update(command.id, command.data);
  }
}
