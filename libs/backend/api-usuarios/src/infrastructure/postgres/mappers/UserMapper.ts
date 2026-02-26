/**
 * @biosstel/api-users - Infrastructure Layer: User Persistence Mapper
 *
 * Transforms domain entities to/from Postgres TypeORM entities.
 */

import type { User } from '@biosstel/shared-types';
import { UserEntity } from '../entities/users/UserEntity';

export class UserMapper {
  public static toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      role: entity.role,
      roleId: entity.roleId,
      departmentId: entity.departmentId,
      workCenterId: entity.workCenterId,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    } as User;
  }

  public static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    if (domain.id) entity.id = domain.id;
    // Use type assertion to handle the index signature issue
    const domainAny = domain as Record<string, unknown>;
    (entity as Record<string, unknown>)['email'] = domainAny['email'] ?? '';
    (entity as Record<string, unknown>)['isActive'] = domainAny['isActive'] ?? true;
    (entity as Record<string, unknown>)['firstName'] = domainAny['firstName'];
    (entity as Record<string, unknown>)['lastName'] = domainAny['lastName'];
    (entity as Record<string, unknown>)['phone'] = domainAny['phone'];
    (entity as Record<string, unknown>)['role'] = domainAny['role'];
    (entity as Record<string, unknown>)['roleId'] = domainAny['roleId'];
    (entity as Record<string, unknown>)['departmentId'] = domainAny['departmentId'];
    (entity as Record<string, unknown>)['workCenterId'] = domainAny['workCenterId'];
    return entity;
  }
}
