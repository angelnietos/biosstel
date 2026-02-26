import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, DeepPartial } from 'typeorm';
import { FichajeEntity } from '../../entities/fichajes/FichajeEntity';
import type { IFichajeRepository, FichajeDashboardRow } from '../../../../domain/repositories';
import type { Fichaje } from '../../../../domain/entities/Fichaje';
import { FichajeMapper } from '../../../mappers/FichajeMapper';

@Injectable()
export class PostgresFichajeRepository implements IFichajeRepository {
  constructor(
    @InjectRepository(FichajeEntity)
    private readonly repository: Repository<FichajeEntity>,
  ) {}

  async create(data: Partial<Fichaje>): Promise<Fichaje> {
    // Note: this implementation is simplified for partials
    const entity = this.repository.create(data as DeepPartial<FichajeEntity>);
    const saved = await this.repository.save(entity);
    return FichajeMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Fichaje | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? FichajeMapper.toDomain(entity) : null;
  }

  async findCurrentByUserId(userId: string): Promise<Fichaje | null> {
    const entity = await this.repository.findOne({
      where: { userId },
      order: { startTime: 'DESC' },
    });
    return entity ? FichajeMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Fichaje[]> {
    const list = await this.repository.find({
      where: { userId },
      order: { startTime: 'DESC' },
    });
    return list.map(e => FichajeMapper.toDomain(e));
  }

  async save(fichaje: Fichaje): Promise<Fichaje> {
    const entity = FichajeMapper.toPersistence(fichaje);
    const saved = await this.repository.save(entity);
    return FichajeMapper.toDomain(saved);
  }

  async findDashboardRows(date: string): Promise<FichajeDashboardRow[]> {
    const dateNorm = date?.trim() ? date.trim().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const rows = await this.repository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.user', 'u')
      .where('f.date = :dateNorm', { dateNorm })
      .orderBy('f.startTime', 'DESC')
      .addOrderBy('u.firstName', 'ASC', 'NULLS LAST')
      .getMany();

    return rows.map((f) => {
      const totalMs = f.endTime
        ? new Date(f.endTime).getTime() - new Date(f.startTime).getTime()
        : Date.now() - new Date(f.startTime).getTime();
      const user = f.user as { firstName?: string; lastName?: string; role?: string } | undefined;
      return {
        userId: f.userId,
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        role: user?.role ?? '',
        status: f.status,
        startTime: f.startTime,
        location: f.location ?? null,
        minutosHoy: Math.floor(totalMs / 60000),
      };
    });
  }
}
