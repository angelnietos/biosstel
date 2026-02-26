import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import type { ICommandHandler } from '@biosstel/api-shared';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import type { RefreshTokenCommand} from '../commands/RefreshToken.command';
import { type RefreshTokenResult } from '../commands/RefreshToken.command';

const ACCESS_EXPIRES_DEFAULT = '15m';

@Injectable()
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async handle(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const { refreshToken } = command;
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
    const m = expires.match(/^(\d+)(s|m|h|d)$/);
    if (!m) return 900;
    const n = parseInt(m[1], 10);
    switch (m[2]) {
      case 's': return n;
      case 'm': return n * 60;
      case 'h': return n * 3600;
      case 'd': return n * 86400;
      default: return 900;
    }
  }
}
