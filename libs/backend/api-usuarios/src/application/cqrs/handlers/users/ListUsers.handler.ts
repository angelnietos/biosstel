import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { User, PaginatedResult } from '@biosstel/shared-types';
import type { ListUsersQuery } from '../../queries/users/ListUsers.query';
import { USER_REPOSITORY, type IUserRepository } from '../../../../domain/repositories/users/IUserRepository';

@Injectable()
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, PaginatedResult<User>> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async handle(query: ListUsersQuery): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(query.page, query.pageSize);
  }
}
