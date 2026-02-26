import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { IAuthRepository } from '../../../domain/repositories';
import { LoginAttemptEntity, RevokedTokenEntity } from '../entities';

@Injectable()
export class PostgresAuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(LoginAttemptEntity)
    private readonly loginAttemptRepo: Repository<LoginAttemptEntity>,
    @InjectRepository(RevokedTokenEntity)
    private readonly revokedTokenRepo: Repository<RevokedTokenEntity>
  ) {}

  async logLoginAttempt(userId: string, success: boolean, ip?: string): Promise<void> {
    const attempt = this.loginAttemptRepo.create({
      userId,
      success,
      ip,
    });
    await this.loginAttemptRepo.save(attempt);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const revoked = await this.revokedTokenRepo.findOne({
      where: { token },
    });
    return revoked !== null;
  }

  async revokeToken(token: string, expiresAt: Date): Promise<void> {
    // Verificar si el token ya está revocado para evitar duplicados
    const existing = await this.revokedTokenRepo.findOne({
      where: { token },
    });

    if (!existing) {
      const revokedToken = this.revokedTokenRepo.create({
        token,
        expiresAt,
      });
      await this.revokedTokenRepo.save(revokedToken);
    }
  }
}
