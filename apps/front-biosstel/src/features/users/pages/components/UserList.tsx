'use client'

/**
 * UserList - Componente para listar usuarios
 */
import { useEffect, useState } from 'react'
import { useUsers } from '../../data-access/useUsers'

export default function UserList() {
  const { users, isLoading, error, fetchUsers, remove } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers({ search: searchTerm })
  }, [searchTerm, fetchUsers])

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await remove(id)
    }
  }

  if (isLoading) return <div>Cargando usuarios...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="user-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.isActive ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}