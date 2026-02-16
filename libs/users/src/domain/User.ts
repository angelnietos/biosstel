/**
 * @biosstel/users - Domain Layer: User Entity
 * 
 * Pure TypeScript entity - NO React, NO Next, NO fetch
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}
