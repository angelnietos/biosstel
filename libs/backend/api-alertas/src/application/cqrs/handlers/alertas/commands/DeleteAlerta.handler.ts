import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DeleteAlertaCommand } from '../../../commands/alertas/DeleteAlerta.command';
import { type IAlertasRepository, I_ALERTAS_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class DeleteAlertaHandler implements ICommandHandler<DeleteAlertaCommand, void> {
  constructor(@Inject(I_ALERTAS_REPOSITORY) private readonly alertasRepo: IAlertasRepository) {}

  async handle(command: DeleteAlertaCommand): Promise<void> {
    const existing = await this.alertasRepo.findById(command.id);
    if (!existing) throw new NotFoundException(`Alerta ${command.id} no encontrada`);
    await this.alertasRepo.delete(command.id);
  }
}
