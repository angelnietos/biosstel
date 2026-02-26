import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { User, PaginatedResult } from '@biosstel/shared-types';
import { ListUsersQuery } from '../../queries/users/ListUsers.query';
import { USER_REPOSITORY, type IUserRepository } from '../../../../domain/repositories/users/IUserRepository';

@QueryHandler(ListUsersQuery)
@Injectable()
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async execute(query: ListUsersQuery): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(query.page, query.pageSize);
  }
}
