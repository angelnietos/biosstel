/**
 * AuthLayout - Layout específico para páginas de autenticación
 * Equivale a un componente con su propio Router en Angular
 */
import AuthShell from '../../shell/AuthShell'
import { MainContainer } from '../../../../components/templates/auth/MainContainer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell>
      <MainContainer />
    </AuthShell>
  )
}