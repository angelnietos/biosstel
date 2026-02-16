/**
 * @biosstel/auth - Infrastructure Layer: REST Auth Repository
 * 
 * Concrete implementation of IAuthRepository using REST API.
 * 
 * SWAPPABLE: If you want to use GraphQL, SDK, or Mock instead,
 * simply create a new implementation of IAuthRepository.
 */

import {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../application/repositories';
import { User } from '../domain/entities';

// Environment variable - can be overridden
const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
  : 'http://localhost:3001/api';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    return {
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    
    return {
      user: result.user,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      tokenType: result.token_type,
    };
  }

  async getProfile(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    // Clean up local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    return {
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
    };
  }
}

// Default instance for easy import
export const authRepository = new AuthRepository();
