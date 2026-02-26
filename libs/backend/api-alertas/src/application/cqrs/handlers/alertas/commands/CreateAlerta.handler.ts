import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { CreateAlertaCommand } from '../../../commands/alertas/CreateAlerta.command';
import type { Alert } from '../../../../../domain/entities';
import { type IAlertasRepository, I_ALERTAS_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class CreateAlertaHandler implements ICommandHandler<CreateAlertaCommand, Alert> {
  constructor(@Inject(I_ALERTAS_REPOSITORY) private readonly alertasRepo: IAlertasRepository) {}

  async handle(command: CreateAlertaCommand): Promise<Alert> {
    const d = command.data;
    if (!d.usuario?.trim()) throw new BadRequestException('usuario es obligatorio');
    if (!d.departamento?.trim()) throw new BadRequestException('departamento es obligatorio');
    if (!d.centroTrabajo?.trim()) throw new BadRequestException('centroTrabajo es obligatorio');
    if (!d.estado?.trim()) throw new BadRequestException('estado es obligatorio');
    return this.alertasRepo.create(d);
  }
}
