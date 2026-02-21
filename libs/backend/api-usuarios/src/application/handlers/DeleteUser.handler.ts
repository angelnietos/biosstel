import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { IEventBus, DomainEvents, type UserDeletedEvent } from '@biosstel/api-shared';
import { DeleteUserCommand } from '../commands/DeleteUser.command';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/TypeOrmUserRepository';

@Injectable()
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, void> {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: DeleteUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);
    if (!user) throw new NotFoundException(`User with ID ${command.id} not found`);

    await this.userRepository.delete(command.id);

    this.eventBus.publish(DomainEvents.USER_DELETED, {
      userId: command.id,
      occurredAt: new Date().toISOString(),
    } as UserDeletedEvent);
  }
}
