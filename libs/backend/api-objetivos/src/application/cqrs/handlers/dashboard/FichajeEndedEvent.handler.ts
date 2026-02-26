import { Injectable, Inject, type OnModuleInit } from '@nestjs/common';
import { IEventBus, DomainEvents, type FichajeEndedEvent } from '@biosstel/api-shared';

/**
 * Event-driven: when a fichaje ends, dashboard can update metrics, invalidate caches, etc.
 * For now we only log; later can push to read model or emit to Kafka.
 */
@Injectable()
export class FichajeEndedEventHandler implements OnModuleInit {
  constructor(
    @Inject(IEventBus) private readonly eventBus: { subscribe: (name: string, fn: (e: unknown) => void) => () => void }
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DomainEvents.FICHAJE_ENDED, (e: unknown) => {
      const event = e as FichajeEndedEvent;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Dashboard] FichajeEnded received:', event.fichajeId, event.userId);
      }
    });
  }
}
