/**
 * @biosstel/auth - useForgotPassword hook (despacha forgotPasswordThunk y lee estado desde Redux)
 */

'use client';

import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordThunk, type AuthState } from '../store/authSlice';

export function useForgotPassword() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: { auth: AuthState }) => state.auth);

  const forgotPasswordFn = async (email: string) => {
    await (dispatch as (thunk: ReturnType<typeof forgotPasswordThunk>) => Promise<unknown>)(forgotPasswordThunk(email));
  };

  return { forgotPassword: forgotPasswordFn, isLoading, error };
}
