import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { FichajeDashboardRow } from '../../../../domain/repositories';
import { IFichajeRepository } from '../../../../domain/repositories';
import type { GetFichajeDashboardQuery } from '../../queries/fichajes/GetFichajeDashboard.query';

@Injectable()
export class GetFichajeDashboardHandler
  implements IQueryHandler<GetFichajeDashboardQuery, FichajeDashboardRow[]>
{
  constructor(
    @Inject(IFichajeRepository)
    private readonly fichajeRepository: IFichajeRepository
  ) {}

  async handle(query: GetFichajeDashboardQuery): Promise<FichajeDashboardRow[]> {
    const date = query?.date ?? new Date().toISOString().split('T')[0];
    try {
      return await this.fichajeRepository.findDashboardRows(date);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[GetFichajeDashboard]', err);
      }
      return [];
    }
  }
}
