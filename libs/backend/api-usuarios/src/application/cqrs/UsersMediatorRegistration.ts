import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand } from './commands/users';
import { GetUserByIdQuery, ListUsersQuery } from './queries/users';
import { CreateUserHandler, UpdateUserHandler, DeleteUserHandler, GetUserByIdHandler, ListUsersHandler } from './handlers/users';

@Injectable()
export class UsersMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(CreateUserCommand, CreateUserHandler);
    this.mediator.registerCommandHandler(UpdateUserCommand, UpdateUserHandler);
    this.mediator.registerCommandHandler(DeleteUserCommand, DeleteUserHandler);
    this.mediator.registerQueryHandler(GetUserByIdQuery, GetUserByIdHandler);
    this.mediator.registerQueryHandler(ListUsersQuery, ListUsersHandler);
  }
}
