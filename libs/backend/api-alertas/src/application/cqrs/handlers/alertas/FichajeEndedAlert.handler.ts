import type { OnModuleInit } from '@nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { IEventBus, DomainEvents, type FichajeEndedEvent } from '@biosstel/api-shared';

/**
 * Event-driven: reacciona a FichajeEnded (ej. crear alerta de fichaje largo, notificar, etc.).
 */
@Injectable()
export class FichajeEndedAlertHandler implements OnModuleInit {
  constructor(
    @Inject(IEventBus) private readonly eventBus: { subscribe: (name: string, fn: (e: unknown) => void) => () => void }
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DomainEvents.FICHAJE_ENDED, (e: unknown) => {
      const event = e as FichajeEndedEvent;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Alertas] FichajeEnded:', event.fichajeId);
      }
      // TODO: crear alerta en dashboard_alerts o notificación
    });
  }
}
