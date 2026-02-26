import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { DashboardAlertEntity } from '@biosstel/api-objetivos';
import type { Alert } from '../../../../../domain/entities';
import type { IAlertasRepository } from '../../../../../domain/repositories';
import { AlertMapper } from '../../../../mappers/AlertMapper';

@Injectable()
export class PostgresAlertasRepository implements IAlertasRepository {
  constructor(
    @InjectRepository(DashboardAlertEntity)
    private readonly repository: Repository<DashboardAlertEntity>
  ) {}

  async findAllActive(): Promise<Alert[]> {
    const alerts = await this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    return alerts.map(r => AlertMapper.toDomain(r));
  }
}
