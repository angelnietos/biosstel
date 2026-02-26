/**
 * @biosstel/api-users - Infrastructure Layer: GraphQL Users Resolver
 *
 * Resolver GraphQL para Users (feature con GraphQL activable por config).
 * Usa el mismo port USER_REPOSITORY que REST; REST sigue funcionando.
 * La transformación de dominio a GraphQL se hace mediante UserGraphQLMapper.
 */

import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories';
import type { User } from '@biosstel/shared-types';
import { UserType, UsersPaginatedType } from './user.graphql-types';
import { UserGraphQLMapper } from './mappers/UserGraphQLMapper';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    private readonly userMapper: UserGraphQLMapper
  ) {}

  @Query(() => UsersPaginatedType, { name: 'users', description: 'Lista paginada de usuarios' })
  async users(
    @Args('page', { type: () => Number, nullable: true, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Number, nullable: true, defaultValue: 10 }) pageSize: number
  ) {
    const result = await this.userRepo.findAll(page, pageSize);
    return this.userMapper.toPaginatedGraphQL(
      result.items ?? result.data ?? [],
      result.total,
      result.page,
      result.pageSize
    );
  }

  @Query(() => UserType, { nullable: true, name: 'user', description: 'Usuario por ID' })
  async user(@Args('id') id: string) {
    const u = await this.userRepo.findById(id);
    return u ? this.userMapper.toGraphQL(u) : null;
  }
}
