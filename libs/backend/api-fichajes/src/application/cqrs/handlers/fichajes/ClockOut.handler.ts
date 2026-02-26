import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { IEventBus, DomainEvents, type FichajeEndedEvent } from '@biosstel/api-shared';
import type { ClockOutCommand } from '../../commands/fichajes/ClockOut.command';
import type { Fichaje } from '@biosstel/shared-types';
import { IFichajeRepository } from '../../../../domain/repositories';

@Injectable()
export class ClockOutHandler implements ICommandHandler<ClockOutCommand, Fichaje> {
  constructor(
    @Inject(IFichajeRepository) private readonly fichajeRepo: IFichajeRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: ClockOutCommand): Promise<Fichaje> {
    const fichaje = await this.fichajeRepo.findById(command.fichajeId);
    if (!fichaje) throw new NotFoundException(`Fichaje ${command.fichajeId} not found`);

    const endTime = new Date();
    const updated = await this.fichajeRepo.save({
      ...fichaje,
      endTime,
      status: 'finished',
    });

    try {
      this.eventBus.publish(DomainEvents.FICHAJE_ENDED, {
        fichajeId: updated.id,
        userId: updated.userId,
        endTime: typeof endTime === 'string' ? endTime : endTime.toISOString(),
        occurredAt: new Date().toISOString(),
      } as FichajeEndedEvent);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.warn('[ClockOut] Event publish failed:', err);
    }
    return updated;
  }
}
