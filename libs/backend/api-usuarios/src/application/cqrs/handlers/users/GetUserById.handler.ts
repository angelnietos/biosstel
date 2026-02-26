import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { GetUserByIdQuery } from '../../queries/users/GetUserById.query';
import type { User } from '@biosstel/shared-types';
import { USER_REPOSITORY, type IUserRepository } from '../../../../domain/repositories/users/IUserRepository';

@Injectable()
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery, User> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async handle(query: GetUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);
    if (!user) throw new NotFoundException(`User with ID ${query.id} not found`);
    return user;
  }
}
