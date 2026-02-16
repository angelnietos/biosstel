/**
 * UsersLayout - Layout específico para páginas de usuarios
 */
import UsersShell from '../../shell/UsersShell'

interface UsersLayoutProps {
  children: React.ReactNode
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <UsersShell>
      {children}
    </UsersShell>
  )
}