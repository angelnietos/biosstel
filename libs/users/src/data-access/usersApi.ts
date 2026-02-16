/**
 * @biosstel/users - Users API Functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface CreateUserData {
  name: string;
  email: string;
  last_name: string;
  phone: string;
  role: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
}

export const createUserApi = async (data: CreateUserData): Promise<any> => {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: data.name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      organizationId: data.role,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear usuario');
  }

  return response.json();
};

export const createClientApi = async (data: CreateClientData): Promise<any> => {
  // TODO: Implementar endpoint de clientes
  console.log('Create client API call:', data);
  return Promise.resolve({});
};
