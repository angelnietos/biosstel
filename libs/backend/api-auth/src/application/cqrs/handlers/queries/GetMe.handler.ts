import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import type { User } from '@biosstel/shared-types';
import { GetMeQuery } from '../../queries/GetMe.query';

@QueryHandler(GetMeQuery)
@Injectable()
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(query: GetMeQuery): Promise<User> {
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
