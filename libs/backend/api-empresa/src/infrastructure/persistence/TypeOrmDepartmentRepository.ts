import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from './DepartmentEntity';
import type { Department } from '@biosstel/shared-types';

@Injectable()
export class TypeOrmDepartmentRepository {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly repo: Repository<DepartmentEntity>,
  ) {}

  async findAll(activeOnly = true): Promise<Department[]> {
    const qb = this.repo.createQueryBuilder('d').orderBy('d.name');
    if (activeOnly) {
      qb.andWhere('d.isActive = :active', { active: true });
    }
    const list = await qb.getMany();
    return list.map((e) => ({
      id: e.id,
      name: e.name,
      color: e.color ?? undefined,
    }));
  }

  async findById(id: string): Promise<DepartmentEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: { code?: string; name: string; color?: string; responsibleUserId?: string; dateFrom?: string; dateTo?: string }): Promise<DepartmentEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<{ code?: string; name?: string; color?: string; responsibleUserId?: string; dateFrom?: string; dateTo?: string; isActive?: boolean }>): Promise<DepartmentEntity> {
    await this.repo.update(id, data as any);
    const out = await this.repo.findOne({ where: { id } });
    if (!out) throw new Error('Department not found');
    return out;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
