import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { IQueryHandler } from '@biosstel/api-shared';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import type { User } from '@biosstel/shared-types';
import type { GetMeQuery } from '../../queries/GetMe.query';

@Injectable()
export class GetMeHandler implements IQueryHandler<GetMeQuery, User> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async handle(query: GetMeQuery): Promise<User> {
    const { accessToken } = query;
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
