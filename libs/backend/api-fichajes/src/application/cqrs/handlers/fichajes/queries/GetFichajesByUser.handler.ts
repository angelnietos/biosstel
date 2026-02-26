import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { Fichaje } from '../../../../../domain/entities';
import { GetFichajesByUserQuery } from '../../../queries/fichajes/GetFichajesByUser.query';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@QueryHandler(GetFichajesByUserQuery)
@Injectable()
export class GetFichajesByUserHandler implements IQueryHandler<GetFichajesByUserQuery> {
  constructor(@Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository) {}

  async execute(query: GetFichajesByUserQuery): Promise<Fichaje[]> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return [];
    }
    return this.fichajeRepo.findByUserId(query.userId);
  }
}
