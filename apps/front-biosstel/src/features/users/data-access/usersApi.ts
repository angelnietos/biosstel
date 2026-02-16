/**
 * usersApi - Funciones para llamadas a la API de usuarios
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  createdAt: string
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
}

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.limit) queryParams.set('limit', params.limit.toString())
  if (params.search) queryParams.set('search', params.search)
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)

  const res = await fetch(`${API_URL}/users?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
    },
  })

  if (!res.ok) {
    throw new Error('Error al obtener usuarios')
  }

  return res.json()
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
    },
  })

  if (!res.ok) {
    throw new Error('Error al obtener usuario')
  }

  return res.json()
}

export async function createUser(data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Error al crear usuario')
  }

  return res.json()
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Error al actualizar usuario')
  }

  return res.json()
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
    },
  })

  if (!res.ok) {
    throw new Error('Error al eliminar usuario')
  }
}