import type { OnModuleInit } from '@nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { IEventBus, DomainEvents, type FichajeEndedEvent } from '@biosstel/api-shared';

/**
 * Event-driven: reacciona a FichajeEnded (ej. actualizar métricas de operaciones).
 */
@Injectable()
export class FichajeEndedOperacionesHandler implements OnModuleInit {
  constructor(
    @Inject(IEventBus) private readonly eventBus: { subscribe: (name: string, fn: (e: unknown) => void) => () => void }
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DomainEvents.FICHAJE_ENDED, (e: unknown) => {
      const event = e as FichajeEndedEvent;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Operaciones] FichajeEnded:', event.fichajeId);
      }
      // TODO: actualizar indicadores de operaciones
    });
  }
}
