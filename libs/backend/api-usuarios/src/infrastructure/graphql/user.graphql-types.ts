/**
 * Tipos GraphQL para User (code-first).
 * Comparten el mismo dominio que REST; el resolver usa USER_REPOSITORY.
 */

import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  COORDINADOR = 'COORDINADOR',
  TELEMARKETING = 'TELEMARKETING',
  TIENDA = 'TIENDA',
  COMERCIAL = 'COMERCIAL',
  BACKOFFICE = 'BACKOFFICE',
}

registerEnumType(UserRoleEnum, { name: 'UserRole' });

@ObjectType()
export class UserType {
  @Field()
  id!: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ObjectType()
export class UsersPaginatedType {
  @Field(() => [UserType])
  items!: UserType[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;
}
