/**
 * Página de Usuarios - Ejemplo de uso de la feature users
 * Ubicación: /[locale]/users
 */
import { UserList, UsersLayout } from '@biosstel/users'
import { User } from '@biosstel/users'

const mockUsers: User[] = [
  { id: '1', email: 'admin@biosstel.com', firstName: 'Admin', lastName: 'User', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', email: 'user@biosstel.com', firstName: 'Regular', lastName: 'User', isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

export default function UsersPage() {
  return (
    <UsersLayout>
      <UserList users={mockUsers} />
    </UsersLayout>
  )
}