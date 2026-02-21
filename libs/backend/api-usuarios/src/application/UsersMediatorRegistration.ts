import { Injectable, OnModuleInit } from '@nestjs/common';
import { Mediator } from '@biosstel/api-shared';
import { CreateUserCommand } from './commands/CreateUser.command';
import { UpdateUserCommand } from './commands/UpdateUser.command';
import { DeleteUserCommand } from './commands/DeleteUser.command';
import { GetUserByIdQuery } from './queries/GetUserById.query';
import { ListUsersQuery } from './queries/ListUsers.query';
import { CreateUserHandler } from './handlers/CreateUser.handler';
import { UpdateUserHandler } from './handlers/UpdateUser.handler';
import { DeleteUserHandler } from './handlers/DeleteUser.handler';
import { GetUserByIdHandler } from './handlers/GetUserById.handler';
import { ListUsersHandler } from './handlers/ListUsers.handler';

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
