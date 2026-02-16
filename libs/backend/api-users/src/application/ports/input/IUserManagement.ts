/**
 * @biosstel/api-users - Application Layer: Input Ports
 * 
 * Input ports define the interface for use cases.
 * These are the entry points to the application layer.
 */

import type { User, CreateUserData, UpdateUserData, PaginatedResult } from '@biosstel/shared-types';

/**
 * Input port for user management operations
 */
export interface IUserManagement {
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  validatePassword(email: string, password: string): Promise<User | null>;
}
