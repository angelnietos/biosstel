import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { I_AUTH_REPOSITORY } from '../../../../domain/repositories';
import type { IAuthRepository } from '../../../../domain/repositories';
import { LogoutCommand, type LogoutResult } from '../../commands/Logout.command';

@CommandHandler(LogoutCommand)
@Injectable()
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(command: LogoutCommand): Promise<LogoutResult> {
    const { refreshToken } = command;
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token requerido');
    }

    const raw = refreshToken.startsWith('Bearer ') ? refreshToken.slice(7) : refreshToken;

    // Verificar que el token es válido antes de revocarlo
    let payload: { exp?: number };
    try {
      payload = this.jwtService.verify(raw);
    } catch {
      // Si el token ya está expirado o es inválido, aún así lo marcamos como revocado
      // para evitar que se use si alguien lo tiene guardado
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 día por defecto si no podemos obtener exp
      await this.authRepository.revokeToken(raw, expiresAt);
      return { message: 'Sesión cerrada correctamente' };
    }

    // Calcular la fecha de expiración del token
    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 días por defecto

    // Revocar el token
    await this.authRepository.revokeToken(raw, expiresAt);

    return { message: 'Sesión cerrada correctamente' };
  }
}
