/**
 * @biosstel/api-users - Infrastructure Layer: GraphQL Output Mapper
 *
 * Transforms domain entities to GraphQL types.
 * This is the abstraction layer between domain and GraphQL API.
 */

import { Injectable } from '@nestjs/common';
import type { User } from '@biosstel/shared-types';
import type { UserType, UsersPaginatedType } from '../user.graphql-types';
import { UserRoleEnum } from '../user.graphql-types';

/**
 * Maps domain entities to GraphQL types.
 * Provides a clean abstraction between domain and GraphQL presentation layer.
 */
@Injectable()
export class UserGraphQLMapper {
  /**
   * Transforms a single User domain entity to GraphQL UserType
   */
  toGraphQL(user: User): UserType {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name ?? ([user.firstName, user.lastName].filter(Boolean).join(' ') || undefined),
      role: this.mapRoleToEnum(user.role),
      isActive: user.isActive,
    };
  }

  /**
   * Transforms a list of User domain entities to GraphQL paginated type
   */
  toPaginatedGraphQL(
    items: User[],
    total: number,
    page?: number,
    pageSize?: number
  ): UsersPaginatedType {
    const list = items ?? [];
    const totalPages = pageSize ? Math.ceil(total / pageSize) : undefined;
    
    return {
      items: list.map((u) => this.toGraphQL(u)),
      total,
      totalPages,
      page,
      pageSize,
    };
  }

  /**
   * Maps role string to GraphQL enum
   */
  private mapRoleToEnum(role?: string): UserRoleEnum | undefined {
    if (!role) return undefined;
    
    // Map domain role to GraphQL enum
    const roleMapping: Record<string, UserRoleEnum> = {
      'ADMIN': UserRoleEnum.ADMIN,
      'COORDINADOR': UserRoleEnum.COORDINADOR,
      'TELEMARKETING': UserRoleEnum.TELEMARKETING,
      'TIENDA': UserRoleEnum.TIENDA,
      'COMERCIAL': UserRoleEnum.COMERCIAL,
      'BACKOFFICE': UserRoleEnum.BACKOFFICE,
    };
    
    return roleMapping[role] ?? undefined;
  }
}
