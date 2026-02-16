/**
 * @biosstel/users - useUsers Hook
 */

import { useState } from 'react';
import { createUserApi, createClientApi, type CreateClientData } from './usersApi';
import type { CreateUserData } from '../types';

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (data: CreateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      return await createUserApi(data);
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
};

export const useCreateClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (data: CreateClientData) => {
    setIsLoading(true);
    setError(null);

    try {
      return await createClientApi(data);
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createClient, isLoading, error };
};
