/**
 * Resolver GraphQL para Users (feature con GraphQL activable por config).
 * Usa el mismo port USER_REPOSITORY que REST; REST sigue funcionando.
 */

import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories';
import type { IUserRepository } from '../../domain/repositories';
import type { UserRoleEnum } from './user.graphql-types';
import { UserType, UsersPaginatedType } from './user.graphql-types';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  @Query(() => UsersPaginatedType, { name: 'users', description: 'Lista paginada de usuarios' })
  async users(
    @Args('page', { type: () => Number, nullable: true, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Number, nullable: true, defaultValue: 10 }) pageSize: number
  ) {
    const result = await this.userRepo.findAll(page, pageSize);
    const list = result.items ?? result.data ?? [];
    const items = list.map((u) => this.toUserType(u));
    return {
      items,
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  @Query(() => UserType, { nullable: true, name: 'user', description: 'Usuario por ID' })
  async user(@Args('id') id: string) {
    const u = await this.userRepo.findById(id);
    return u ? this.toUserType(u) : null;
  }

  private toUserType(u: { id: string; email?: string; firstName?: string; lastName?: string; name?: string; role?: string; isActive?: boolean }) {
    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      name: u.name ?? ([u.firstName, u.lastName].filter(Boolean).join(' ') || undefined),
      role: u.role as UserRoleEnum | undefined,
      isActive: u.isActive,
    };
  }
}
