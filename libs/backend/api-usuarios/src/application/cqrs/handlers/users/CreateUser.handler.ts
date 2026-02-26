import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEventBus, DomainEvents, type UserCreatedEvent } from '@biosstel/api-shared';
import { CreateUserCommand } from '../../commands/users/CreateUser.command';
import type { User } from '@biosstel/shared-types';
import type { IUserRepository } from '../../../../domain/repositories/users/IUserRepository';
import { USER_REPOSITORY } from '../../../../domain/repositories/users/IUserRepository';

@CommandHandler(CreateUserCommand)
@Injectable()
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { data } = command;
    const email = (data.email ?? '').trim();
    if (!email) throw new BadRequestException('El email es obligatorio');
    const existing = await this.userRepository.findByEmail?.(email);
    if (existing) throw new ConflictException('Ya existe un usuario con este email');

    const user = await this.userRepository.create(data);

    try {
      this.eventBus.publish(DomainEvents.USER_CREATED, {
        userId: user.id,
        email: user.email,
        occurredAt: new Date().toISOString(),
      } as UserCreatedEvent);
    } catch {
      // Event publish failure must not fail the request
    }
    return user;
  }
}
