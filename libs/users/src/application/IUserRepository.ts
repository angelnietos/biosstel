/**
 * @biosstel/users - Application Layer: User Repository Interface
 */

import { User, CreateUserData, UpdateUserData } from '../domain';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IUserRepository {
  getAll(token: string, page?: number, pageSize?: number): Promise<PaginatedResult<User>>;
  getById(token: string, id: string): Promise<User>;
  create(token: string, data: CreateUserData): Promise<User>;
  update(token: string, id: string, data: UpdateUserData): Promise<User>;
  delete(token: string, id: string): Promise<void>;
}
