/**
 * @biosstel/api-users - NestJS Module Adapter
 * 
 * This module wraps the hexagonal architecture for use in NestJS.
 * 
 * Hexagonal Architecture Layers:
 * - Domain: Entities and business logic (pure TypeScript)
 * - Application: Use Cases and Ports (business rules)
 * - Infrastructure: Adapters (TypeORM, REST, etc.)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/persistence/UserEntity';
import { TypeOrmUserRepository } from './infrastructure/persistence/TypeOrmUserRepository';
import { UserManagementUseCase } from './application/use-cases';
import { UsersController } from './infrastructure/api/users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    // Output Adapters (Repositories)
    TypeOrmUserRepository,
    
    // Application Layer (Use Cases)
    UserManagementUseCase,
    
    // Legacy service (for backward compatibility)
    UsersService,
  ],
  exports: [
    UserManagementUseCase,
    TypeOrmUserRepository,
    UsersService, // For backward compatibility
  ],
})
export class UsersModule {}

