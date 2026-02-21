import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkCenterEntity } from './WorkCenterEntity';
import type { WorkCenter } from '@biosstel/shared-types';

@Injectable()
export class TypeOrmWorkCenterRepository {
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
    return list.map((e) => ({
      id: e.id,
      name: e.name,
      address: e.address ?? undefined,
    }));
  }

  async findById(id: string): Promise<WorkCenterEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  private isValidUuid(s: string | null | undefined): boolean {
    if (s == null || typeof s !== 'string' || s.trim() === '') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(s.trim());
  }

  async create(data: { name: string; address?: string; departmentId?: string }): Promise<WorkCenterEntity> {
    const payload: { name: string; address?: string; departmentId?: string } = {
      name: data.name,
      address: data.address,
    };
    if (this.isValidUuid(data.departmentId)) payload.departmentId = data.departmentId!.trim();
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<{ name?: string; address?: string; departmentId?: string; isActive?: boolean }>): Promise<WorkCenterEntity> {
    const payload: Record<string, unknown> = { ...data };
    if (payload.departmentId !== undefined && !this.isValidUuid(payload.departmentId as string)) {
      payload.departmentId = null;
    }
    await this.repo.update(id, payload as any);
    const out = await this.repo.findOne({ where: { id } });
    if (!out) throw new Error('WorkCenter not found');
    return out;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
