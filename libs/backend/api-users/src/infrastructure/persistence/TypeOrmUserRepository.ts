/**
 * @biosstel/api-users - Infrastructure Layer: TypeORM User Repository
 * 
 * Implementation of IUserRepository using TypeORM.
 * This is the adapter that connects to the database.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
} from '../../application/ports/output/IUserRepository';
import { UserEntity } from './UserEntity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findAll(page = 1, pageSize = 10): Promise<PaginatedResult<User>> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      items: items.map((item) => this.mapToDomain(item)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
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

  async create(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const entity = this.repository.create({
      ...data,
      password: hashedPassword,
    });
    const saved = await this.repository.save(entity);
    return this.mapToDomain(saved);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await this.repository.update(id, updateData);
    return this.findById(id) as Promise<User>;
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
      phone: entity.phone,
      isActive: entity.isActive,
      organizationId: entity.organizationId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
