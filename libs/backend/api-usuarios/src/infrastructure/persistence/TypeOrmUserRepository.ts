/**
 * @biosstel/api-users - Infrastructure Layer: TypeORM User Repository
 *
 * Implementation of IUserRepository using TypeORM.
 * This is the adapter that connects to the database.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
} from '../../domain/repositories';
import { UserEntity } from './UserEntity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async findAll(page = 1, pageSize = 10): Promise<PaginatedResult<User>> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const list = items.map((item) => this.mapToDomain(item));
    const totalPages = Math.ceil(total / pageSize);
    return {
      items: list,
      total,
      totalPages,
      page,
      pageSize,
    };
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapToDomain(entity) : null;
  }

  /** Validates credentials and returns full user (including role) for JWT/login. Used by auth. */
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity || !entity.password) return null;
    const ok = await bcrypt.compare(password, String(entity.password));
    return ok ? this.mapToDomain(entity) : null;
  }

  async create(data: CreateUserData & { password?: string }): Promise<User> {
    const email = data.email ?? '';
    const password = data.password ?? '';
    const hashedPassword = await bcrypt.hash(password, 10);
    const partial: DeepPartial<UserEntity> = {
      email,
      firstName: data.firstName as string | undefined,
      lastName: data.lastName as string | undefined,
      phone: data.phone as string | undefined,
      password: hashedPassword,
      isActive: true,
    };
    const entity = this.repository.create(partial);
    const saved = await this.repository.save(entity);
    return this.mapToDomain(saved);
  }

  async update(id: string, data: UpdateUserData & { password?: string }): Promise<User> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      throw new Error(`User with ID ${id} not found`);
    }
    const updatePayload: Record<string, unknown> = { ...data };
    if (typeof data['password'] === 'string' && data['password']) {
      updatePayload['password'] = await bcrypt.hash(data['password'], 10);
    }
    await this.repository.update(id, updatePayload as DeepPartial<UserEntity>);
    const updated = await this.repository.findOne({ where: { id } });
    return updated ? this.mapToDomain(updated) : ((await this.findById(id)) as User);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private mapToDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      name: [entity.firstName, entity.lastName].filter(Boolean).join(' ') || undefined,
      phone: entity.phone,
      isActive: entity.isActive,
      role: entity.role,
      organizationId: entity.organizationId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
