/**
 * @biosstel/auth - Auth Feature Library
 * 
 * Enterprise Modular Extractable v4 - Auth Feature
 * 
 * FEATURE STRUCTURE:
 * 
 * data-access/     - Hooks y funciones API
 * api/             - Rutas API de Next.js (opcional)
 * shell/           - Contenedor principal de la feature
 * feature/         - Componentes y layouts específicos
 *   layouts/       - Layouts de la feature
 *   components/    - Componentes de la feature
 * 
 * DEPENDENCIES ALLOWED:
 * - @biosstel/ui (atomic components)
 * - @biosstel/ui-layout (visual layouts)
 * - @biosstel/shared (shared components)
 * - @biosstel/platform (Next.js adapters)
 * - react
 */

// Domain Layer - Pure TypeScript entities (hexagonal architecture)
export type { User, AuthUser, Role, Permission, Organization } from './domain';

// Application Layer - Repository interfaces
export type {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from './application';

// Infrastructure Layer - Concrete implementations
export { AuthRepository, authRepository } from './infrastructure';

// Data Access Layer - Hooks y API functions
export * from './data-access';

// Shell - Contenedor principal
export * from './shell';

// Feature - Componentes y layouts
export * from './feature';
