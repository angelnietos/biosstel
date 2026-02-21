/**
 * @biosstel/auth - useLogin hook (despacha loginThunk y lee estado desde Redux)
 */

'use client';

import type { LoginCredentials, AuthResponse } from '../../api/services/models';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, type AuthState } from '../store/authSlice';

export function useLogin() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: { auth: AuthState }) => state.auth);

  const loginFn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const result = await (dispatch as (a: ReturnType<typeof loginThunk>) => Promise<unknown>)(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result as { type: string })) {
      return (result as { payload: AuthResponse }).payload;
    }
    const err = result as { error?: { message?: string } };
    throw new Error(err.error?.message ?? 'Error al iniciar sesión');
  };

  return { login: loginFn, isLoading, error };
}
