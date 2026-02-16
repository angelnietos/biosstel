/**
 * @biosstel/auth - Auth Feature Library
 * 
 * Enterprise Modular Extractable v4 - Auth Feature
 * 
 * This is a standalone, publicable npm package for authentication.
 * Each feature is publicable as a package - no feature depends on another.
 * 
 * LAYER STRUCTURE:
 * 
 * domain/           - Pure TypeScript, NO React, NO Next, NO fetch
 *                   Portable to Node, React Native, etc.
 * 
 * application/      - Repository interfaces
 *                   Defines contracts without implementation details
 * 
 * infrastructure/   - Concrete implementations (REST, GraphQL, SDK, Mock)
 *                   Swappable without changing UI
 * 
 * ui/              - React components (uses application layer hooks)
 *                   Does NOT know about routes
 * 
 * shell/           - Visual composition
 *                   Uses ui-layout, NOT Next.js
 * 
 * DEPENDENCIES ALLOWED:
 * - @biosstel/ui (atomic components)
 * - @biosstel/ui-layout (visual layouts)
 * - @biosstel/platform (Next.js adapters - if needed)
 * - react
 * 
 * DEPENDENCIES FORBIDDEN:
 * - Other features (auth → users is NOT allowed)
 * - Next.js directly
 * - Business logic in UI components
 */

// Domain Layer - Pure TypeScript entities
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

/**
 * DEFAULT EXPORTS
 * 
 * For easier importing, you can also import directly:
 * import { authRepository } from '@biosstel/auth'
 */
