import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAlertaCommand } from '../../../commands/alertas/DeleteAlerta.command';
import { type IAlertasRepository, I_ALERTAS_REPOSITORY } from '../../../../../domain/repositories';

@CommandHandler(DeleteAlertaCommand)
@Injectable()
export class DeleteAlertaHandler implements ICommandHandler<DeleteAlertaCommand> {
  constructor(@Inject(I_ALERTAS_REPOSITORY) private readonly alertasRepo: IAlertasRepository) {}

  async execute(command: DeleteAlertaCommand): Promise<void> {
    const existing = await this.alertasRepo.findById(command.id);
    if (!existing) throw new NotFoundException(`Alerta ${command.id} no encontrada`);
    await this.alertasRepo.delete(command.id);
  }
}
