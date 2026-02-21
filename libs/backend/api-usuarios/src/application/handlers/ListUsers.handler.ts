import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { User, PaginatedResult } from '@biosstel/shared-types';
import { ListUsersQuery } from '../queries/ListUsers.query';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/TypeOrmUserRepository';

@Injectable()
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, PaginatedResult<User>> {
  constructor(private readonly userRepository: TypeOrmUserRepository) {}

  async handle(query: ListUsersQuery): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(query.page, query.pageSize);
  }
}
