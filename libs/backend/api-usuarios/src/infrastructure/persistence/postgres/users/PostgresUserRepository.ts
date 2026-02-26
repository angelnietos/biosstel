/**
 * @biosstel/api-users - Infrastructure Layer: TypeORM User Repository
 *
 * Implementation of IUserRepository using TypeORM.
 * This is the adapter that connects to the database.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import type {
  IUserRepository,
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
} from '../../../../domain/repositories';
import { UserEntity } from '../../entities';
import { UserMapper } from '../../../mappers';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
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

    const list = items.map((item) => UserMapper.toDomain(item));
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
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  /** Validates credentials and returns full user (including role) for JWT/login. Used by auth. */
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity || !entity.password) return null;
    const ok = await bcrypt.compare(password, String(entity.password));
    return ok ? UserMapper.toDomain(entity) : null;
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
      role: data.role as string | undefined,
      departmentId: data.departmentId,
      workCenterId: data.workCenterId,
    };
    const entity = this.repository.create(partial);
    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }

  async update(id: string, data: UpdateUserData & { password?: string }): Promise<User> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      throw new Error(`User with ID ${id} not found`);
    }
    const updatePayload: DeepPartial<UserEntity> = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      isActive: data.isActive,
      role: data.role,
      departmentId: data.departmentId,
      workCenterId: data.workCenterId,
    };
    if (typeof data['password'] === 'string' && data['password']) {
      (updatePayload as unknown as Record<string, unknown>)['password'] = await bcrypt.hash(data['password'], 10);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.repository.update(id, updatePayload as any);
    const updated = await this.repository.findOne({ where: { id } });
    return updated ? UserMapper.toDomain(updated) : ((await this.findById(id)) as User);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
