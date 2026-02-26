import { Injectable, Inject, type OnModuleInit } from '@nestjs/common';
import type { FichajeEndedEvent } from '@biosstel/api-shared';
import { IEventBus, DomainEvents } from '@biosstel/api-shared';
import { I_ALERTAS_REPOSITORY } from '../../../../../domain/repositories';
import type { IAlertasRepository } from '../../../../../domain/repositories';

/**
 * Event-driven: reacciona a FichajeEnded (ej. crear alerta de fichaje largo, notificar, etc.).
 */
@Injectable()
export class FichajeEndedAlertHandler implements OnModuleInit {
  constructor(
    @Inject(IEventBus) private readonly eventBus: { subscribe: (name: string, fn: (e: unknown) => void) => () => void },
    @Inject(I_ALERTAS_REPOSITORY) private readonly alertasRepository: IAlertasRepository
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DomainEvents.FICHAJE_ENDED, async (e: unknown) => {
      const event = e as FichajeEndedEvent;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Alertas] FichajeEnded:', event.fichajeId);
      }

      try {
        // Detectar fichajes fuera del horario habitual.
        // endTime es la hora de fin del fichaje; occurredAt es el momento del evento.
        const endTime = event.endTime ? new Date(event.endTime) : null;

        if (endTime) {
          const lateHour = endTime.getHours() >= 21; // más allá de las 21:00

          if (lateHour) {
            console.warn(
              `[Alertas] Fichaje fuera de horario: usuario ${event.userId}, fichaje ${event.fichajeId}, fin: ${endTime.toISOString()}.`
            );
          }
        }

        // Mantener lista de alertas activas actualizada.
        await this.alertasRepository.findAllActive();
      } catch (error) {
        console.error('[Alertas] Error al procesar FichajeEnded:', error);
      }
    });
  }
}
