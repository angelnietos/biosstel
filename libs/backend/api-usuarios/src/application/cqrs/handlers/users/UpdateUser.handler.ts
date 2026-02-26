import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEventBus, DomainEvents, type UserUpdatedEvent } from '@biosstel/api-shared';
import { UpdateUserCommand } from '../../commands/users/UpdateUser.command';
import type { User } from '@biosstel/shared-types';
import type { IUserRepository } from '../../../../domain/repositories/users/IUserRepository';
import { USER_REPOSITORY } from '../../../../domain/repositories/users/IUserRepository';

@CommandHandler(UpdateUserCommand)
@Injectable()
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.update(command.id, command.data);
    if (!user) throw new NotFoundException(`User with ID ${command.id} not found`);

    this.eventBus.publish(DomainEvents.USER_UPDATED, {
      userId: user.id,
      occurredAt: new Date().toISOString(),
    } as UserUpdatedEvent);

    return user;
  }
}
