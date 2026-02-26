import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { WorkCenterEntity } from '../../entities/WorkCenterEntity';
import type { WorkCenter, CreateWorkCenterInput, UpdateWorkCenterInput } from '../../../../domain/entities/WorkCenter';
import type { IWorkCenterRepository } from '../../../../domain/repositories';
import { WorkCenterMapper } from '../../../mappers/WorkCenterMapper';

@Injectable()
export class PostgresWorkCenterRepository implements IWorkCenterRepository {
  constructor(
    @InjectRepository(WorkCenterEntity)
    private readonly repo: Repository<WorkCenterEntity>,
  ) {}

  async findAll(activeOnly = true): Promise<WorkCenter[]> {
    const qb = this.repo.createQueryBuilder('w').orderBy('w.name');
    if (activeOnly) {
      qb.andWhere('w.isActive = :active', { active: true });
    }
    const list = await qb.getMany();
    return list.map((e) => WorkCenterMapper.toDomain(e));
  }

  async findById(id: string): Promise<WorkCenter | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? WorkCenterMapper.toDomain(entity) : null;
  }

  async create(data: CreateWorkCenterInput): Promise<WorkCenter> {
    const toInsert = WorkCenterMapper.toOrmCreate(data);
    const entity = this.repo.create(toInsert);
    const saved = await this.repo.save(entity);
    return WorkCenterMapper.toDomain(saved);
  }

  async update(id: string, data: UpdateWorkCenterInput): Promise<WorkCenter> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new Error('WorkCenter not found');
    WorkCenterMapper.applyUpdate(entity, data);
    const saved = await this.repo.save(entity);
    return WorkCenterMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
