/**
 * @biosstel/api-users - Application Layer: User Repository Port
 *
 * Port interface for user repository.
 * This is the contract that infrastructure must implement.
 */

import type { User, CreateUserData, UpdateUserData, PaginatedResult } from '@biosstel/shared-types';
export type { User, CreateUserData, UpdateUserData, PaginatedResult } from '@biosstel/shared-types';

export interface IUserRepository {
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByEmail?(email: string): Promise<User | null>;
  validateCredentials(email: string, password: string): Promise<User | null>;
  create(data: CreateUserData & { password?: string }): Promise<User>;
  update(id: string, data: UpdateUserData & { password?: string }): Promise<User>;
  delete(id: string): Promise<void>;
}

/** Token para inyección Nest (el port puede tener implementación Postgres, Mongo o HTTP). */
export const USER_REPOSITORY = Symbol('IUserRepository');
