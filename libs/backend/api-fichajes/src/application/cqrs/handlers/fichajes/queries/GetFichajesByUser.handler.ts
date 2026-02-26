import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Fichaje } from '../../../../../domain/entities';
import type { GetFichajesByUserQuery } from '../../../queries/fichajes/GetFichajesByUser.query';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class GetFichajesByUserHandler
  implements IQueryHandler<GetFichajesByUserQuery, Fichaje[]>
{
  constructor(@Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository) {}

  async handle(query: GetFichajesByUserQuery): Promise<Fichaje[]> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return [];
    }
    return this.fichajeRepo.findByUserId(query.userId);
  }
}
