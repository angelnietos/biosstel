import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { IEventBus, DomainEvents, type UserUpdatedEvent } from '@biosstel/api-shared';
import { UpdateUserCommand } from '../commands/UpdateUser.command';
import type { User } from '@biosstel/shared-types';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/TypeOrmUserRepository';

@Injectable()
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, User> {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.update(command.id, command.data);
    if (!user) throw new NotFoundException(`User with ID ${command.id} not found`);

    this.eventBus.publish(DomainEvents.USER_UPDATED, {
      userId: user.id,
      occurredAt: new Date().toISOString(),
    } as UserUpdatedEvent);

    return user;
  }
}
