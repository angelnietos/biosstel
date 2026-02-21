/**
 * @biosstel/api-users - NestJS Module Adapter
 *
 * CQRS + Event-driven: controller dispatches commands/queries via Mediator;
 * handlers publish domain events (UserCreated, UserUpdated, UserDeleted).
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserDocumentEntity } from './infrastructure/persistence';
import { ClientEntity } from './infrastructure/persistence/ClientEntity';
import { TypeOrmUserRepository } from './infrastructure/persistence';
import { UserManagementUseCase } from './application/use-cases';
import { UsersController } from './infrastructure/api/users.controller';
import { UserDocumentsController } from './infrastructure/api/user-documents.controller';
import { ClientsController } from './infrastructure/api/clients.controller';
import { UsersService } from './users.service';
import { CreateUserHandler } from './application/handlers/CreateUser.handler';
import { UpdateUserHandler } from './application/handlers/UpdateUser.handler';
import { DeleteUserHandler } from './application/handlers/DeleteUser.handler';
import { GetUserByIdHandler } from './application/handlers/GetUserById.handler';
import { ListUsersHandler } from './application/handlers/ListUsers.handler';
import { UsersMediatorRegistration } from './application/UsersMediatorRegistration';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDocumentEntity, ClientEntity])],
  controllers: [UsersController, UserDocumentsController, ClientsController],
  providers: [
    TypeOrmUserRepository,
    UserManagementUseCase,
    UsersService,
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    GetUserByIdHandler,
    ListUsersHandler,
    UsersMediatorRegistration,
  ],
  exports: [
    UserManagementUseCase,
    TypeOrmUserRepository,
    UsersService,
  ],
})
export class UsersModule {}
