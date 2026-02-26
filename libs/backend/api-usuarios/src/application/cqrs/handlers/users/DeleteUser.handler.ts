import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEventBus, DomainEvents, type UserDeletedEvent } from '@biosstel/api-shared';
import { DeleteUserCommand } from '../../commands/users/DeleteUser.command';
import type { IUserRepository } from '../../../../domain/repositories/users/IUserRepository';
import { USER_REPOSITORY } from '../../../../domain/repositories/users/IUserRepository';

@CommandHandler(DeleteUserCommand)
@Injectable()
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);
    if (!user) throw new NotFoundException(`User with ID ${command.id} not found`);

    await this.userRepository.delete(command.id);

    this.eventBus.publish(DomainEvents.USER_DELETED, {
      userId: command.id,
      occurredAt: new Date().toISOString(),
    } as UserDeletedEvent);
  }
}
