import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { type ICommandHandler, IEventBus, DomainEvents, type FichajeStartedEvent } from '@biosstel/api-shared';
import type { ClockInCommand } from '../../../commands/fichajes/ClockIn.command';
import type { Fichaje } from '../../../../../domain/entities';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class ClockInHandler implements ICommandHandler<ClockInCommand, Fichaje> {
  constructor(
    @Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: ClockInCommand): Promise<Fichaje> {
    if (!command.userId || typeof command.userId !== 'string') {
      throw new BadRequestException('userId es obligatorio para fichar entrada');
    }

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    let fichaje: Fichaje;
    try {
      fichaje = await this.fichajeRepo.create({
        userId: command.userId,
        date,
        startTime: now,
        status: 'working',
        location: command.location,
        pauses: [],
      });
    } catch (err: unknown) {
      const e = err as { code?: string; driverError?: { code?: string } };
      const code = e?.code ?? e?.driverError?.code;
      if (code === '23503') {
        throw new BadRequestException('Usuario no encontrado. No se puede registrar la entrada.');
      }
      throw err;
    }

    try {
      this.eventBus.publish(DomainEvents.FICHAJE_STARTED, {
        fichajeId: fichaje.id,
        userId: command.userId,
        startTime: typeof fichaje.startTime === 'string' ? fichaje.startTime : fichaje.startTime.toISOString(),
        occurredAt: new Date().toISOString(),
      } as FichajeStartedEvent);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ClockIn] Event publish failed:', err);
      }
    }

    return fichaje;
  }
}
