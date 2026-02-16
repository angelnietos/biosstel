/**
 * @biosstel/auth - Application Layer: Auth Repository Interface
 * 
 * This interface defines the contract for authentication operations.
 * It does NOT know if the implementation uses REST, GraphQL, SDK, or Mock.
 * 
 * This is the KEY to the swappable architecture:
 * - Today: REST implementation
 * - Tomorrow: GraphQL, SDK, or Mock implementation
 * - No changes to UI or domain needed
 */

import { User } from '../../domain/entities';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  getProfile(token: string): Promise<User>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthResponse>;
}
