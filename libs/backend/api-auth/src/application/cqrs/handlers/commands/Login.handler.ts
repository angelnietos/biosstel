import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import type { UserLoggedInEvent } from '@biosstel/api-shared';
import { IEventBus, DomainEvents } from '@biosstel/api-shared';
import { type LoginResult, LoginCommand } from '../../commands/Login.command';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import { I_AUTH_REPOSITORY } from '../../../../domain/repositories';
import type { IAuthRepository } from '../../../../domain/repositories';

const ACCESS_EXPIRES_DEFAULT = '15m';
const REFRESH_EXPIRES_DEFAULT = '7d';

@CommandHandler(LoginCommand)
@Injectable()
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(I_AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(IEventBus) private readonly eventBus: { publish: (name: string, payload: unknown) => void }
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const { email, password } = command;
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son obligatorios');
    }
    const user = await this.userRepository.validateCredentials(email, password);
    
    if (!user) {
      // Intentamos obtener el ID por email para el log si es posible, o lanzamos directamente
      await this.authRepository.logLoginAttempt(email, false);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.authRepository.logLoginAttempt(user.id, true);
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

    this.eventBus.publish(DomainEvents.USER_LOGGED_IN, {
      userId: user.id,
      email: userEmail,
      occurredAt: new Date().toISOString(),
    } as UserLoggedInEvent);

    return {
      access_token,
      refresh_token,
      expires_in,
      user: { id: user.id, email: userEmail, ...(user.role != null && { role: user.role }) },
    };
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
}
