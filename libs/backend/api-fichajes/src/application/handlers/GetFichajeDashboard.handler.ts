import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import { IFichajeRepository, FichajeDashboardRow } from '../../domain/repositories/IFichajeRepository';
import { GetFichajeDashboardQuery } from '../queries/GetFichajeDashboard.query';

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
