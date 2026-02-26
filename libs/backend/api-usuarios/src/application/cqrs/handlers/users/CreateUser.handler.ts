import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { IEventBus, DomainEvents, type UserCreatedEvent } from '@biosstel/api-shared';
import type { CreateUserCommand } from '../../commands/users/CreateUser.command';
import type { User } from '@biosstel/shared-types';
import type { IUserRepository } from '../../../../domain/repositories/users/IUserRepository';
import { USER_REPOSITORY } from '../../../../domain/repositories/users/IUserRepository';

@Injectable()
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, User> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: CreateUserCommand): Promise<User> {
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
