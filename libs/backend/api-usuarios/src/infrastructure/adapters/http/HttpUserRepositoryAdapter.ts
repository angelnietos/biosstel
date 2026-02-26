/**
 * Adaptador HTTP para IUserRepository (microservicio de usuarios).
 * Se usa cuando la feature 'users' tiene adapter: 'http' y FEATURE_USERS_SERVICE_URL (o database.serviceUrls.users).
 */

import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  IUserRepository,
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
} from '../../../domain/repositories';
import { getFeatureServiceUrl } from '@biosstel/api-shared';

@Injectable()
export class HttpUserRepositoryAdapter implements IUserRepository {
  private getBaseUrl(): string {
    const url = getFeatureServiceUrl('users');
    if (!url) {
      throw new NotImplementedException(
        'HTTP adapter for users: set FEATURE_USERS_SERVICE_URL or database.serviceUrls.users'
      );
    }
    return url.replace(/\/$/, '');
  }

  async findAll(page = 1, pageSize = 10): Promise<PaginatedResult<User>> {
    const base = this.getBaseUrl();
    const res = await fetch(`${base}/users?page=${page}&pageSize=${pageSize}`, {
      headers: { 'Content-Type': 'application/json' },
      // En producción inyectar token o ApiKey desde config
    });
    if (!res.ok) throw new Error(`Users service error: ${res.status}`);
    return res.json() as Promise<PaginatedResult<User>>;
  }

  async findById(id: string): Promise<User | null> {
    const base = this.getBaseUrl();
    const res = await fetch(`${base}/users/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Users service error: ${res.status}`);
    return res.json() as Promise<User>;
  }

  async findByEmail(_email: string): Promise<User | null> {
    // El microservicio puede exponer GET /users?email=... o no; por ahora no implementado
    throw new NotImplementedException('HTTP adapter: findByEmail not exposed by users service');
  }

  async validateCredentials(_email: string, _password: string): Promise<User | null> {
    // Normalmente el login va por Auth; si el microservicio expone POST /auth/validate podemos llamarlo
    throw new NotImplementedException('HTTP adapter: validateCredentials use Auth service');
  }

  async create(data: CreateUserData & { password?: string }): Promise<User> {
    const base = this.getBaseUrl();
    const res = await fetch(`${base}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Users service error: ${res.status}`);
    return res.json() as Promise<User>;
  }

  async update(id: string, data: UpdateUserData & { password?: string }): Promise<User> {
    const base = this.getBaseUrl();
    const res = await fetch(`${base}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Users service error: ${res.status}`);
    return res.json() as Promise<User>;
  }

  async delete(id: string): Promise<void> {
    const base = this.getBaseUrl();
    const res = await fetch(`${base}/users/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error(`Users service error: ${res.status}`);
  }
}
