/**
 * @biosstel/api-users - Application Layer: User Repository Port
 * 
 * Port interface for user repository.
 * This is the contract that infrastructure must implement.
 */

import type {
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResult,
  IUserRepository as IUserRepositoryShared,
} from '@biosstel/shared-types';

// Re-export types for convenience
export type { User, CreateUserData, UpdateUserData, PaginatedResult };

// Repository interface (re-exported from shared-types for consistency)
export type { IUserRepositoryShared as IUserRepository };
