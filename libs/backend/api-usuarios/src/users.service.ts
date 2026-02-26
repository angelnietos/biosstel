/**
 * @biosstel/api-users - Application Layer: Users Service
 *
 * NestJS service that uses the IUserRepository port.
 * This is the application service in the hexagonal architecture.
 */

import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type {
  IUserRepository,
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
} from './domain/repositories';
import { USER_REPOSITORY } from './domain/repositories';

@Injectable()
export class UsersService {
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
    const email = data.email?.trim();
    if (!email) {
      throw new BadRequestException('Email is required');
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
