/**
 * Output Port: generación y verificación de tokens.
 * La aplicación necesita "emitir/validar tokens" pero no sabe si es JWT, opaque, etc.
 * Infraestructura implementa (p. ej. JwtTokenServiceAdapter sobre JwtService).
 */
export interface TokenPayload {
  sub: string;
  email: string;
  role?: string;
  tokenType?: 'access' | 'refresh';
}

export interface ITokenService {
  sign(payload: TokenPayload, expiresIn: string): string;
  verify<T = TokenPayload>(token: string): T;
}
