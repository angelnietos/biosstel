/**
 * Adaptador MongoDB para IUserRepository.
 * Se usa cuando la feature 'users' tiene adapter: 'mongo' en settings.json.
 * Requiere conexión MongoDB (ej. MongooseModule) en el app cuando se active.
 */

import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  IUserRepository,
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
} from '../../../domain/repositories';

@Injectable()
export class MongoUserRepositoryAdapter implements IUserRepository {
  async findAll(_page?: number, _pageSize?: number): Promise<PaginatedResult<User>> {
    // Cuando se configure MongoDB: inyectar Model<User> y ejecutar find().skip().limit()
    throw new NotImplementedException(
      'Mongo adapter for users: add MongooseModule and implement or set database.adapter to postgres'
    );
  }

  async findById(_id: string): Promise<User | null> {
    throw new NotImplementedException('Mongo adapter for users: not implemented');
  }

  async findByEmail(_email: string): Promise<User | null> {
    throw new NotImplementedException('Mongo adapter for users: not implemented');
  }

  async validateCredentials(_email: string, _password: string): Promise<User | null> {
    throw new NotImplementedException('Mongo adapter for users: not implemented');
  }

  async create(_data: CreateUserData & { password?: string }): Promise<User> {
    throw new NotImplementedException('Mongo adapter for users: not implemented');
  }

  async update(_id: string, _data: UpdateUserData & { password?: string }): Promise<User> {
    throw new NotImplementedException('Mongo adapter for users: not implemented');
  }

  async delete(_id: string): Promise<void> {
    throw new NotImplementedException('Mongo adapter for users: not implemented');
  }
}
