import type { OnModuleInit } from '@nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { IEventBus, DomainEvents, type UserCreatedEvent } from '@biosstel/api-shared';

/**
 * Event-driven: reacciona a UserCreated (ej. asignar org por defecto, crear centro, etc.).
 */
@Injectable()
export class UserCreatedEmpresaHandler implements OnModuleInit {
  constructor(
    @Inject(IEventBus) private readonly eventBus: { subscribe: (name: string, fn: (e: unknown) => void) => () => void }
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DomainEvents.USER_CREATED, (e: unknown) => {
      const event = e as UserCreatedEvent;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Empresa] UserCreated:', event.userId);
      }
      // TODO: asignar organización/centro por defecto
    });
  }
}
