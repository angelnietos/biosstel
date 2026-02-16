/**
 * Página de Login - Ejemplo de uso de la feature auth
 * Ubicación: /[locale]/login
 */
import { LoginForm, AuthLayout } from '../../../../features'

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}