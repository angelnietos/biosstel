import { Injectable } from '@nestjs/common';
import type { IAuthRepository } from '../../../../domain/repositories';

@Injectable()
export class PostgresAuthRepository implements IAuthRepository {
  // Placeholder for auth-specific persistence (e.g. audit logs, refresh tokens if stored in DB)
  constructor() {}
}
