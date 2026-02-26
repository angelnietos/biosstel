import { Injectable, Inject, type OnModuleInit } from '@nestjs/common';
import type { UserCreatedEvent } from '@biosstel/api-shared';
import { IEventBus, DomainEvents } from '@biosstel/api-shared';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';

/**
 * Event-driven: reacciona a UserCreated (ej. asignar org por defecto, crear centro, etc.).
 */
@Injectable()
export class UserCreatedEmpresaHandler implements OnModuleInit {
  constructor(
    @Inject(IEventBus) private readonly eventBus: { subscribe: (name: string, fn: (e: unknown) => void) => () => void },
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DomainEvents.USER_CREATED, async (e: unknown) => {
      const event = e as UserCreatedEvent;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Empresa] UserCreated:', event.userId);
      }
      
      try {
        const departments = await this.departmentRepo.findAll(true);
        if (departments.length > 0) {
          const defaultDept = departments[0];
          // En una implementación real, aquí llamaríamos a un servicio para persistir la relación
          // o emitiríamos un comando de actualización de usuario.
          if (process.env.NODE_ENV === 'development') {
            console.debug(`[Empresa] Asignando departamento por defecto "${defaultDept.name}" al usuario ${event.userId}`);
          }
        }
      } catch (error) {
        console.error('[Empresa] Error al asignar departamento por defecto:', error);
      }
    });
  }
}
