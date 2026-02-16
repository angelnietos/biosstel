/**
 * useUsers - Hook para gestionar el estado de usuarios
 */
'use client'

import { useState, useCallback } from 'react'
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  User,
  UsersResponse,
  GetUsersParams 
} from './usersApi'

interface UseUsersReturn {
  users: User[]
  total: number
  page: number
  limit: number
  isLoading: boolean
  error: string | null
  fetchUsers: (params?: GetUsersParams) => Promise<void>
  fetchUserById: (id: string) => Promise<User>
  create: (data: Partial<User>) => Promise<User>
  update: (id: string, data: Partial<User>) => Promise<User>
  remove: (id: string) => Promise<void>
  clearError: () => void
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (params?: GetUsersParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: UsersResponse = await getUsers(params)
      setUsers(response.data)
      setTotal(response.total)
      setPage(response.page)
      setLimit(response.limit)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUserById = useCallback(async (id: string): Promise<User> => {
    setIsLoading(true)
    setError(null)
    try {
      return await getUserById(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuario'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const create = useCallback(async (data: Partial<User>): Promise<User> => {
    setIsLoading(true)
    setError(null)
    try {
      const newUser = await createUser(data)
      setUsers(prev => [...prev, newUser])
      setTotal(prev => prev + 1)
      return newUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const update = useCallback(async (id: string, data: Partial<User>): Promise<User> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await updateUser(id, data)
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u))
      return updatedUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar usuario'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      setTotal(prev => prev - 1)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar usuario'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    users,
    total,
    page,
    limit,
    isLoading,
    error,
    fetchUsers,
    fetchUserById,
    create,
    update,
    remove,
    clearError,
  }
}