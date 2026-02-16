/**
 * @biosstel/users - Users Feature Library
 * 
 * Enterprise Modular Extractable v4 - Users Feature
 */

// Domain Layer
export type { User, CreateUserData, UpdateUserData } from './domain';

// Application Layer
export type { IUserRepository, PaginatedResult } from './application';

// Infrastructure Layer
export { UserRepository, userRepository } from './infrastructure';

// UI Layer
export { UsersLayout, type UsersLayoutProps } from './ui/UsersLayout';
export { UserList, type UserListProps } from './ui/UserList';
