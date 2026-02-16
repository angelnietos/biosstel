/**
 * @biosstel/auth - useForgotPassword Hook
 */

'use client';

import { useState } from 'react';
import { forgotPasswordApi } from './authApi';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await forgotPasswordApi(email);
    } catch (err: any) {
      setError(err.message || 'Error al enviar email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { forgotPassword, isLoading, error };
};
