/**
 * @biosstel/usuarios - useUsers, useCreateUser, useCreateClient hooks (despachan thunks y leen estado desde Redux)
 */

'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUserThunk, createClientThunk, type UserState, type CreateUserData, type CreateClientData } from '../store';

export function useUsers() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state: { users: UserState }) => state.users);

  const fetchUsersFn = useCallback(() => {
    (dispatch as (thunk: ReturnType<typeof fetchUsers>) => void)(fetchUsers());
  }, [dispatch]);

  return { data: users, fetchUsers: fetchUsersFn, isLoading, error };
}

export function useCreateUser() {
  const dispatch = useDispatch();
  const { mutationLoading: isLoading, mutationError: error } = useSelector((state: { users: UserState }) => state.users);

  const createUserFn = async (data: CreateUserData) => {
    const result = await (dispatch as (thunk: ReturnType<typeof createUserThunk>) => Promise<unknown>)(createUserThunk(data));
    if (createUserThunk.rejected.match(result)) throw new Error((result as { error: { message?: string } }).error?.message);
    return (result as { payload: unknown }).payload;
  };

  return { createUser: createUserFn, isLoading, error };
}

export function useCreateClient() {
  const dispatch = useDispatch();
  const { mutationLoading: isLoading, mutationError: error } = useSelector((state: { users: UserState }) => state.users);

  const createClientFn = async (data: CreateClientData) => {
    const result = await (dispatch as (thunk: ReturnType<typeof createClientThunk>) => Promise<unknown>)(createClientThunk(data));
    if (createClientThunk.rejected.match(result)) throw new Error((result as { error: { message?: string } }).error?.message);
    return (result as { payload: unknown }).payload;
  };

  return { createClient: createClientFn, isLoading, error };
}
