/**
 * Users Module - Imports from @lib/api-users
 * 
 * NestJS module that wraps the hexagonal architecture from the library.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserEntity,
  TypeOrmUserRepository,
  UsersService,
  UsersController,
} from '@lib/api-users';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    TypeOrmUserRepository,
    UsersService,
  ],
  exports: [UsersService, TypeOrmUserRepository],
})
export class UsersModule {}
