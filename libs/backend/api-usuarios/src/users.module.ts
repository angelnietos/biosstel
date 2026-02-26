/**
 * @biosstel/api-users - NestJS Module Adapter
 *
 * CQRS + Event-driven. Persistencia por adaptador: postgres (default), mongo o http (microservicio).
 * Config: settings.json database.features.users = 'postgres'|'mongo'|'http'
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getFeatureAdapter } from '@biosstel/api-shared';
import { USUARIOS_POSTGRES_ENTITIES, PostgresUserRepository } from './infrastructure/postgres';
import { MongoUserRepositoryAdapter, HttpUserRepositoryAdapter } from './infrastructure/adapters';
import { USER_REPOSITORY } from './domain/repositories';
import { UserManagementUseCase } from './application/use-cases';
import { UsersController, UserDocumentsController, ClientsController } from './infrastructure/postgres';
import { UsersService } from './users.service';
import { CreateUserHandler, UpdateUserHandler, DeleteUserHandler, GetUserByIdHandler, ListUsersHandler } from './application/cqrs/handlers/users';
import { UsersMediatorRegistration } from './application/cqrs/UsersMediatorRegistration';

function getUsersRepositoryProvider() {
  const adapter = getFeatureAdapter('users');
  switch (adapter) {
    case 'mongo':
      return { provide: USER_REPOSITORY, useClass: MongoUserRepositoryAdapter };
    case 'http':
      return { provide: USER_REPOSITORY, useClass: HttpUserRepositoryAdapter };
    default:
      return { provide: USER_REPOSITORY, useExisting: PostgresUserRepository };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([...USUARIOS_POSTGRES_ENTITIES])],
  controllers: [UsersController, UserDocumentsController, ClientsController],
  providers: [
    PostgresUserRepository,
    getUsersRepositoryProvider(),
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
    PostgresUserRepository,
    USER_REPOSITORY,
    UsersService,
  ],
})
export class UsersModule {}
