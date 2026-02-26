import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../../queries/users/GetUserById.query';
import type { User } from '@biosstel/shared-types';
import { USER_REPOSITORY, type IUserRepository } from '../../../../domain/repositories/users/IUserRepository';

@QueryHandler(GetUserByIdQuery)
@Injectable()
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);
    if (!user) throw new NotFoundException(`User with ID ${query.id} not found`);
    return user;
  }
}
