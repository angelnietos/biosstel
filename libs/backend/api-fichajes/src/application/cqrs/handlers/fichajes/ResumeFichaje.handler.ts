import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { IEventBus, DomainEvents, type FichajeResumedEvent } from '@biosstel/api-shared';
import type { ResumeFichajeCommand } from '../../commands/fichajes/ResumeFichaje.command';
import type { Fichaje } from '@biosstel/shared-types';
import { IFichajeRepository } from '../../../../domain/repositories';

@Injectable()
export class ResumeFichajeHandler implements ICommandHandler<ResumeFichajeCommand, Fichaje> {
  constructor(
    @Inject(IFichajeRepository) private readonly fichajeRepo: IFichajeRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: ResumeFichajeCommand): Promise<Fichaje> {
    const fichaje = await this.fichajeRepo.findById(command.fichajeId);
    if (!fichaje) throw new NotFoundException(`Fichaje ${command.fichajeId} not found`);

    const pauses = Array.isArray(fichaje.pauses) ? [...fichaje.pauses] : [];
    if (pauses.length > 0 && !pauses[pauses.length - 1].endTime) {
      pauses[pauses.length - 1] = {
        ...pauses[pauses.length - 1],
        endTime: new Date().toISOString(),
      };
    }
    const updated = await this.fichajeRepo.save({
      ...fichaje,
      status: 'working',
      pauses,
    });

    try {
      this.eventBus.publish(DomainEvents.FICHAJE_RESUMED, {
        fichajeId: updated.id,
        userId: updated.userId,
        occurredAt: new Date().toISOString(),
      } as FichajeResumedEvent);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.warn('[ResumeFichaje] Event publish failed:', err);
    }
    return updated;
  }
}
