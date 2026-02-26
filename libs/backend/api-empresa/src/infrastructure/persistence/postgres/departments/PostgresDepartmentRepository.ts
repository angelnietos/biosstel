import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Department, CreateDepartmentInput, UpdateDepartmentInput } from '../../../../domain/entities/Department';
import type { IDepartmentRepository } from '../../../../domain/repositories';
import { DepartmentEntity } from '../../entities/DepartmentEntity';
import { DepartmentMapper } from '../../../mappers/DepartmentMapper';

@Injectable()
export class PostgresDepartmentRepository implements IDepartmentRepository {
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
    return list.map((e) => DepartmentMapper.toDomain(e));
  }

  async findById(id: string): Promise<Department | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? DepartmentMapper.toDomain(entity) : null;
  }

  async create(data: CreateDepartmentInput): Promise<Department> {
    const toInsert = DepartmentMapper.toOrmCreate(data);
    const entity = this.repo.create(toInsert);
    const saved = await this.repo.save(entity);
    return DepartmentMapper.toDomain(saved);
  }

  async update(id: string, data: UpdateDepartmentInput): Promise<Department> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new Error('Department not found');
    DepartmentMapper.applyUpdate(entity, data);
    const saved = await this.repo.save(entity);
    return DepartmentMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
