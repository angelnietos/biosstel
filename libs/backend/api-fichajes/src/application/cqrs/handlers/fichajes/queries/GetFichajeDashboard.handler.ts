import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { type IFichajeRepository, I_FICHAJE_REPOSITORY, type FichajeDashboardRow } from '../../../../../domain/repositories';
import { GetFichajeDashboardQuery } from '../../../queries/fichajes/GetFichajeDashboard.query';

@QueryHandler(GetFichajeDashboardQuery)
@Injectable()
export class GetFichajeDashboardHandler implements IQueryHandler<GetFichajeDashboardQuery> {
  constructor(
    @Inject(I_FICHAJE_REPOSITORY)
    private readonly fichajeRepository: IFichajeRepository
  ) {}

  async execute(query: GetFichajeDashboardQuery): Promise<FichajeDashboardRow[]> {
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
