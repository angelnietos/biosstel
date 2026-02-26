import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Fichaje } from '@biosstel/shared-types';
import type { GetCurrentFichajeQuery } from '../../queries/fichajes/GetCurrentFichaje.query';
import { IFichajeRepository } from '../../../../domain/repositories';

@Injectable()
export class GetCurrentFichajeHandler
  implements IQueryHandler<GetCurrentFichajeQuery, Fichaje | null>
{
  constructor(@Inject(IFichajeRepository) private readonly fichajeRepo: IFichajeRepository) {}

  async handle(query: GetCurrentFichajeQuery): Promise<Fichaje | null> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return null;
    }
    const fichaje = await this.fichajeRepo.findCurrentByUserId(query.userId);
    if (!fichaje || fichaje.status === 'finished') return null;
    return { ...fichaje, fueraHorario: false };
  }
}
