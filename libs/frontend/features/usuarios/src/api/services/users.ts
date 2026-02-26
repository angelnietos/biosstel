/**
 * @biosstel/usuarios - Users services (HTTP calls)
 */

import type { CreateUserData, UpdateUserData, User } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
}

export async function createUser(data: CreateUserData): Promise<unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (err) {
    throw toApiError(err);
  }
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  } catch (err) {
    throw toApiError(err);
  }
}

export async function createClient(data: CreateClientData): Promise<unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (err) {
    throw toApiError(err);
  }
}

function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError && err.message === 'Failed to fetch') return true;
  if (err instanceof Error && /fetch|network|connection/i.test(err.message)) return true;
  return false;
}

function toApiError(err: unknown): Error {
  if (err instanceof Error) {
    if (isNetworkError(err)) {
      return new Error(
        'No se pudo conectar con la API. Comprueba que el servidor esté en ejecución (ej. puerto 4000) y que NEXT_PUBLIC_API_URL sea correcto.'
      );
    }
    return err;
  }
  return new Error('Error al obtener usuarios');
}

export async function getUsers(params?: { page?: number; pageSize?: number }): Promise<User[]> {
  const search = params
    ? `?${new URLSearchParams({ page: String(params.page ?? 1), pageSize: String(params.pageSize ?? 50) }).toString()}`
    : '';
  try {
    const response = await fetch(`${API_BASE_URL}/users${search}`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<{ items: User[]; total: number } | User[]>(response);
    if (Array.isArray(result)) return result;
    if (result && typeof result === 'object' && Array.isArray((result as { items: User[] }).items)) {
      return (result as { items: User[] }).items;
    }
    return [];
  } catch (err) {
    throw toApiError(err);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Usuario no encontrado');
    return handleResponse<User>(response);
  } catch (err) {
    if (err instanceof Error && err.message === 'Usuario no encontrado') throw err;
    throw toApiError(err);
  }
}
