/**
 * @biosstel/api-auth - Application Layer: Output Port
 * Contract for auth persistence (placeholder).
 */

export interface IAuthRepository {
  /** Logs a user login attempt for security auditing. */
  logLoginAttempt(userId: string, success: boolean, ip?: string): Promise<void>;
  /** Checks if a specific JWT refresh token has been revoked or blacklisted. */
  isTokenRevoked(token: string): Promise<boolean>;
  /** Marks a refresh token as revoked (e.g., on logout). */
  revokeToken(token: string, expiresAt: Date): Promise<void>;
}

export const I_AUTH_REPOSITORY = Symbol('IAuthRepository');
