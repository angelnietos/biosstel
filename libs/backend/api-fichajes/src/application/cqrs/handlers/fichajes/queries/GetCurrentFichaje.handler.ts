import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { Fichaje } from '../../../../../domain/entities';
import { GetCurrentFichajeQuery } from '../../../queries/fichajes/GetCurrentFichaje.query';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@QueryHandler(GetCurrentFichajeQuery)
@Injectable()
export class GetCurrentFichajeHandler implements IQueryHandler<GetCurrentFichajeQuery> {
  constructor(@Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository) {}

  async execute(query: GetCurrentFichajeQuery): Promise<Fichaje | null> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return null;
    }
    const fichaje = await this.fichajeRepo.findCurrentByUserId(query.userId);
    if (!fichaje || fichaje.status === 'finished') return null;
    return { ...fichaje, fueraHorario: false } as Fichaje;
  }
}
