import { Injectable, NotFoundException } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import { GetUserByIdQuery } from '../queries/GetUserById.query';
import type { User } from '@biosstel/shared-types';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/TypeOrmUserRepository';

@Injectable()
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery, User> {
  constructor(private readonly userRepository: TypeOrmUserRepository) {}

  async handle(query: GetUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);
    if (!user) throw new NotFoundException(`User with ID ${query.id} not found`);
    return user;
  }
}
