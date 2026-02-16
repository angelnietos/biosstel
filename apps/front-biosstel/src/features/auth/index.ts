/**
 * Auth Feature - Exports
 * Punto de entrada para importar todo lo relacionado con autenticación
 */

// Shell
export { default as AuthShell } from './shell/AuthShell'

// Data Access
export { useAuth } from './data-access/useAuth'
export type { User } from './data-access/useAuth'
export {
  login,
  register,
  getProfile,
  logout,
} from './data-access/authApi'
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from './data-access/authApi'

// Pages
export { default as LoginForm } from './pages/components/LoginForm'
export { default as AuthLayout } from './pages/layouts/AuthLayout'
