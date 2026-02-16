/**
 * @biosstel/api-users - NestJS Module Adapter
 * 
 * This module wraps the hexagonal architecture for use in NestJS.
 * It provides the TypeORM repository and NestJS-compatible services.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/persistence/UserEntity';
import { TypeOrmUserRepository } from './infrastructure/persistence/TypeOrmUserRepository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

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
