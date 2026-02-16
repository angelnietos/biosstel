/**
 * Página de Usuarios - Ejemplo de uso de la feature users
 * Ubicación: /[locale]/users
 */
import { UserList, UsersLayout } from '../../../../features'

export default function UsersPage() {
  return (
    <UsersLayout>
      <UserList />
    </UsersLayout>
  )
}