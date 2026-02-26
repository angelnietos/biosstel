import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Fichaje } from '@biosstel/shared-types';
import type { GetFichajesByUserQuery } from '../../queries/fichajes/GetFichajesByUser.query';
import { IFichajeRepository } from '../../../../domain/repositories';

@Injectable()
export class GetFichajesByUserHandler
  implements IQueryHandler<GetFichajesByUserQuery, Fichaje[]>
{
  constructor(@Inject(IFichajeRepository) private readonly fichajeRepo: IFichajeRepository) {}

  async handle(query: GetFichajesByUserQuery): Promise<Fichaje[]> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return [];
    }
    return this.fichajeRepo.findByUserId(query.userId);
  }
}
