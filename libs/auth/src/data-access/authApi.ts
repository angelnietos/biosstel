/**
 * @biosstel/auth - Auth API Functions
 * 
 * API functions for authentication.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: any;
  accessToken?: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Por ahora, validamos contra la API de usuarios
  // TODO: Implementar endpoint de autenticación completo
  const response = await fetch(`${API_URL}/api/users?page=1&pageSize=100`, {
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
};

export const forgotPasswordApi = async (email: string): Promise<void> => {
  // TODO: Implementar endpoint de recuperación de contraseña
  console.log('Forgot password API call:', email);
};
