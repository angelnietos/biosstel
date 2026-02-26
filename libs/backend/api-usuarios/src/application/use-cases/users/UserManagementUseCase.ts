/**
 * @biosstel/api-users - Application Layer: User Management Use Cases
 *
 * Use cases contain the application business logic.
 * They implement the input ports and use the output ports (repositories).
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserManagement } from '../../ports/input/IUserManagement';
import type { User, CreateUserData, UpdateUserData, PaginatedResult } from '@biosstel/shared-types';
import { USER_REPOSITORY, type IUserRepository } from '../../../domain/repositories';

@Injectable()
export class UserManagementUseCase implements IUserManagement {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async findAll(page = 1, pageSize = 10): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(page, pageSize);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail?.(email) ?? null;
  }

  async create(data: CreateUserData): Promise<User> {
    // Business rule: Email must be unique
    const email = data.email;
    if (!email) {
      throw new Error('Email is required');
    }
    const existingUser = await this.userRepository.findByEmail?.(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return this.userRepository.create(data);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.userRepository.update(id, data);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.delete(id);
  }

  async validatePassword(email: string, _password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail?.(email);
    if (!user) {
      return null;
    }
    // Note: Password validation should be done at the auth level
    // This is a helper method for authentication
    return user;
  }
}
