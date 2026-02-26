import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { FichajeEntity } from '../../entities/fichajes/FichajeEntity';
import type { IFichajeRepository, FichajeDashboardRow } from '../../../../domain/repositories/fichajes/IFichajeRepository';
import type { Fichaje } from '../../../../domain/entities/fichajes/Fichaje';

@Injectable()
export class PostgresFichajeRepository implements IFichajeRepository {
  constructor(
    @InjectRepository(FichajeEntity)
    private readonly repo: Repository<FichajeEntity>
  ) {}

  async create(fichaje: Partial<Fichaje>): Promise<Fichaje> {
    const entity = this.repo.create(fichaje as Partial<FichajeEntity>);
    const saved = await this.repo.save(entity);
    return saved as unknown as Fichaje;
  }

  async findById(id: string): Promise<Fichaje | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity as unknown as Fichaje | null;
  }

  async findCurrentByUserId(userId: string): Promise<Fichaje | null> {
    const entity = await this.repo.findOne({
      where: { userId, status: 'working' },
      order: { createdAt: 'DESC' },
    });
    return entity as unknown as Fichaje | null;
  }

  async findByUserId(userId: string): Promise<Fichaje[]> {
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities as unknown as Fichaje[];
  }

  async save(fichaje: Fichaje): Promise<Fichaje> {
    const saved = await this.repo.save(fichaje as unknown as FichajeEntity);
    return saved as unknown as Fichaje;
  }

  async findDashboardRows(_date: string): Promise<FichajeDashboardRow[]> {
    // Placeholder: returns empty list; implement with a JOIN query when user data is available.
    return [];
  }
}
