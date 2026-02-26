import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Fichaje } from '../../../../../domain/entities';
import type { GetCurrentFichajeQuery } from '../../../queries/fichajes/GetCurrentFichaje.query';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class GetCurrentFichajeHandler
  implements IQueryHandler<GetCurrentFichajeQuery, Fichaje | null>
{
  constructor(@Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepo: IFichajeRepository) {}

  async handle(query: GetCurrentFichajeQuery): Promise<Fichaje | null> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return null;
    }
    const fichaje = await this.fichajeRepo.findCurrentByUserId(query.userId);
    if (!fichaje || fichaje.status === 'finished') return null;
    return { ...fichaje, fueraHorario: false } as Fichaje;
  }
}
