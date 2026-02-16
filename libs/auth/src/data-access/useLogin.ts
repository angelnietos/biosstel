/**
 * @biosstel/auth - useLogin Hook
 * 
 * Data access hook for login functionality.
 * Handles API calls and state management.
 */

import { useState } from 'react';
import { authRepository } from '../infrastructure';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Por ahora, validamos contra la API de usuarios
      // TODO: Implementar endpoint de autenticación completo
      const response = await fetch('http://localhost:4000/api/users?page=1&pageSize=100', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al conectar con el servidor');
      }

      const data = await response.json();
      const users = data.items || data.data || (Array.isArray(data) ? data : []);
      
      const user = users.find((u: any) => 
        u.email === credentials.username || u.email === credentials.username
      );

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // TODO: Implementar verificación de contraseña con bcrypt en el backend
      return { user };
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
