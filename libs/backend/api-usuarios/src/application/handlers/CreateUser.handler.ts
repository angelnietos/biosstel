import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { IEventBus, DomainEvents, type UserCreatedEvent } from '@biosstel/api-shared';
import { CreateUserCommand } from '../commands/CreateUser.command';
import type { User } from '@biosstel/shared-types';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/TypeOrmUserRepository';

@Injectable()
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, User> {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async handle(command: CreateUserCommand): Promise<User> {
    const { data } = command;
    const email = (data.email ?? '').trim();
    if (!email) throw new BadRequestException('El email es obligatorio');
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictException('Ya existe un usuario con este email');

    const user = await this.userRepository.create(data);

    try {
      this.eventBus.publish(DomainEvents.USER_CREATED, {
        userId: user.id,
        email: user.email,
        occurredAt: new Date().toISOString(),
      } as UserCreatedEvent);
    } catch (_) {
      // Event publish failure must not fail the request
    }
    return user;
  }
}
