/**
 * @biosstel/users - Infrastructure Layer: REST User Repository
 */

import {
  IUserRepository,
  PaginatedResult,
} from '../application';
import { User, CreateUserData, UpdateUserData } from '../domain';

const API_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
  : 'http://localhost:3001/api';

export class UserRepository implements IUserRepository {
  private getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async getAll(token: string, page = 1, pageSize = 10): Promise<PaginatedResult<User>> {
    const response = await fetch(
      `${API_URL}/users?page=${page}&pageSize=${pageSize}`,
      { headers: this.getHeaders(token) }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async getById(token: string, id: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async create(token: string, data: CreateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  async update(token: string, id: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }

  async delete(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
}

export const userRepository = new UserRepository();
