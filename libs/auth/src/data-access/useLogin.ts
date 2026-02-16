/**
 * @biosstel/auth - useLogin Hook
 * 
 * Data access hook for login functionality.
 * Handles API calls and state management.
 */

import { useState } from 'react';
import { loginApi } from './authApi';
import type { LoginCredentials, AuthResponse } from '../types';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      return await loginApi(credentials);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
