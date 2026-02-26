/**
 * @biosstel/api-auth - Application Layer: Auth Management Use Case
 * Login with real user validation and JWT; refresh token; forgot-password placeholder.
 */

import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import type { User } from '@biosstel/shared-types';

const ACCESS_EXPIRES_DEFAULT = '15m';
const REFRESH_EXPIRES_DEFAULT = '7d';

@Injectable()
export class AuthManagementUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(body: {
    email?: string;
    password?: string;
  }): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: { id: string; email: string; role?: string };
  }> {
    const email = body?.email;
    const password = body?.password;
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son obligatorios');
    }
    const user = await this.userRepository.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const userEmail = user.email ?? user.id;
    const accessExpires = this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || this.config.get<string>('JWT_EXPIRES_IN') || ACCESS_EXPIRES_DEFAULT;
    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || REFRESH_EXPIRES_DEFAULT;

    const payload = {
      sub: user.id,
      email: userEmail,
      ...(user.role != null && { role: user.role }),
    };
    const access_token = this.jwtService.sign(
      { ...payload, tokenType: 'access' },
      { expiresIn: accessExpires } as Record<string, unknown>
    );
    const refresh_token = this.jwtService.sign(
      { ...payload, tokenType: 'refresh' },
      { expiresIn: refreshExpires } as Record<string, unknown>
    );
    const expires_in = this.parseExpiresToSeconds(accessExpires);
    return {
      access_token,
      refresh_token,
      expires_in,
      user: { id: user.id, email: userEmail, role: user.role },
    };
  }

  /**
   * Intercambia un refresh_token válido por un nuevo access_token.
   * El refresh token debe tener claim tokenType: 'refresh' y no estar expirado.
   */
  async refresh(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token requerido');
    }
    const raw = refreshToken.startsWith('Bearer ') ? refreshToken.slice(7) : refreshToken;
    let payload: { sub?: string; tokenType?: string };
    try {
      payload = this.jwtService.verify(raw);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
    if (payload?.tokenType !== 'refresh') {
      throw new UnauthorizedException('Token no es un refresh token');
    }
    const userId = payload.sub;
    if (!userId) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const accessExpires = this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || this.config.get<string>('JWT_EXPIRES_IN') || ACCESS_EXPIRES_DEFAULT;
    const userEmail = user.email ?? user.id;
    const access_token = this.jwtService.sign(
      {
        sub: user.id,
        email: userEmail,
        ...(user.role != null && { role: user.role }),
        tokenType: 'access',
      },
      { expiresIn: accessExpires } as Record<string, unknown>
    );
    const expires_in = this.parseExpiresToSeconds(accessExpires);
    return { access_token, expires_in };
  }

  private parseExpiresToSeconds(expires: string): number {
    const m = /^(\d+)([smhd])$/.exec(expires);
    if (!m) return 900;
    const n = Number.parseInt(m[1], 10);
    switch (m[2]) {
      case 's': return n;
      case 'm': return n * 60;
      case 'h': return n * 3600;
      case 'd': return n * 86400;
      default: return 900;
    }
  }

  /**
   * Recuperación de contraseña (mock para entrega).
   * Siempre devuelve el mismo mensaje para no revelar si el email está registrado.
   * Si el email existe en BD se registra en log; integrar envío real (token + email) después.
   */
  async forgotPassword(body: { email?: string }): Promise<{ message: string }> {
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    if (email) {
      try {
        const user = await this.userRepository.findByEmail?.(email);
        if (user && process.env.NODE_ENV !== 'test') {
          // Log only in non-test; do not send email in this mock
          console.info('[ForgotPassword] Request for existing email (mock: no email sent)');
        }
      } catch {
        // Ignore: same response either way
      }
    }
    return { message: 'Si el email existe, recibirás un enlace para restablecer la contraseña.' };
  }

  /**
   * Devuelve el usuario actual a partir del token JWT (Authorization: Bearer <token>).
   */
  async getMe(accessToken: string | undefined): Promise<User> {
    if (!accessToken || typeof accessToken !== 'string') {
      throw new UnauthorizedException('Token requerido');
    }
    const raw = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;
    let payload: { sub?: string; tokenType?: string };
    try {
      payload = this.jwtService.verify(raw);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    if (payload?.tokenType === 'refresh') {
      throw new UnauthorizedException('Use el access token, no el refresh token');
    }
    const userId = payload?.sub;
    if (!userId) {
      throw new UnauthorizedException('Token inválido');
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }
}
