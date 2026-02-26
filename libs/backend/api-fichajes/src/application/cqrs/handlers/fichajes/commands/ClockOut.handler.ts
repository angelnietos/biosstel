import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEventBus, DomainEvents, type FichajeEndedEvent } from '@biosstel/api-shared';
import { ClockOutCommand } from '../../../commands/fichajes/ClockOut.command';
import type { Fichaje } from '../../../../../domain/entities';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@CommandHandler(ClockOutCommand)
@Injectable()
export class ClockOutHandler implements ICommandHandler<ClockOutCommand> {
  constructor(
    @Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async execute(command: ClockOutCommand): Promise<Fichaje> {
    const fichaje = await this.fichajeRepo.findById(command.fichajeId);
    if (!fichaje) throw new NotFoundException(`Fichaje ${command.fichajeId} not found`);

    const endTime = new Date();
    const updated = await this.fichajeRepo.save({
      ...fichaje,
      endTime,
      status: 'finished',
    } as Fichaje);

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
