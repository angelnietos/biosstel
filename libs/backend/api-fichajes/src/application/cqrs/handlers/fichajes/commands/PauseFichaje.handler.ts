import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEventBus, DomainEvents, type FichajePausedEvent } from '@biosstel/api-shared';
import { PauseFichajeCommand } from '../../../commands/fichajes/PauseFichaje.command';
import type { Fichaje } from '../../../../../domain/entities';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@CommandHandler(PauseFichajeCommand)
@Injectable()
export class PauseFichajeHandler implements ICommandHandler<PauseFichajeCommand> {
  constructor(
    @Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async execute(command: PauseFichajeCommand): Promise<Fichaje> {
    const fichaje = await this.fichajeRepo.findById(command.fichajeId);
    if (!fichaje) throw new NotFoundException(`Fichaje ${command.fichajeId} not found`);

    const pauses = Array.isArray(fichaje.pauses) ? [...fichaje.pauses] : [];
    pauses.push({
      startTime: new Date().toISOString(),
      reason: command.reason,
    });
    const updated = await this.fichajeRepo.save({
      ...fichaje,
      status: 'paused',
      pauses,
    } as Fichaje);

    try {
      this.eventBus.publish(DomainEvents.FICHAJE_PAUSED, {
        fichajeId: updated.id,
        userId: updated.userId,
        occurredAt: new Date().toISOString(),
      } as FichajePausedEvent);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.warn('[PauseFichaje] Event publish failed:', err);
    }
    return updated;
  }
}
