import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FichajeEntity } from '../FichajeEntity';
import { IFichajeRepository, FichajeDashboardRow } from '../../../domain/repositories/IFichajeRepository';

@Injectable()
export class PostgresFichajeRepository implements IFichajeRepository {
  constructor(
    @InjectRepository(FichajeEntity)
    private readonly repository: Repository<FichajeEntity>,
  ) {}

  async create(fichaje: Partial<FichajeEntity>): Promise<FichajeEntity> {
    const entity = this.repository.create(fichaje);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<FichajeEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findCurrentByUserId(userId: string): Promise<FichajeEntity | null> {
    // Return last fichaje that is not finished
    // Or just the last one created
    return this.repository.findOne({
      where: { userId },
      order: { startTime: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<FichajeEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { startTime: 'DESC' },
    });
  }

  async save(fichaje: FichajeEntity): Promise<FichajeEntity> {
    return this.repository.save(fichaje);
  }

  async findDashboardRows(date: string): Promise<FichajeDashboardRow[]> {
    const rows = await this.repository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.user', 'u')
      .where('f.date = :date', { date })
      .orderBy('u.firstName', 'ASC')
      .getMany();

    return rows.map((f) => {
      const totalMs = f.endTime
        ? new Date(f.endTime).getTime() - new Date(f.startTime).getTime()
        : Date.now() - new Date(f.startTime).getTime();
      return {
        userId: f.userId,
        firstName: (f.user as any)?.firstName ?? '',
        lastName: (f.user as any)?.lastName ?? '',
        role: (f.user as any)?.role ?? '',
        status: f.status,
        startTime: f.startTime,
        location: f.location ?? null,
        minutosHoy: Math.floor(totalMs / 60000),
      };
    });
  }
}
