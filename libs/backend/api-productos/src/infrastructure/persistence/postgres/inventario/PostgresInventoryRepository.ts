import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { InventoryItem, CreateInventoryInput, UpdateInventoryInput } from '../../../../domain/entities';
import type { IInventoryRepository } from '../../../../domain/repositories';
import { InventoryItemEntity } from '../../entities/InventoryItemEntity';
import { InventoryMapper } from '../../../mappers/InventoryMapper';

@Injectable()
export class PostgresInventoryRepository implements IInventoryRepository {
  constructor(
    @InjectRepository(InventoryItemEntity)
    private readonly repository: Repository<InventoryItemEntity>,
  ) {}

  async findAll(): Promise<InventoryItem[]> {
    const list = await this.repository.find({ order: { codigo: 'ASC' } });
    return list.map((e) => InventoryMapper.toDomain(e));
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? InventoryMapper.toDomain(entity) : null;
  }

  async create(data: CreateInventoryInput): Promise<InventoryItem> {
    const toInsert = InventoryMapper.toOrmCreate(data);
    const entity = this.repository.create(toInsert);
    const saved = await this.repository.save(entity);
    return InventoryMapper.toDomain(saved);
  }

  async update(id: string, data: UpdateInventoryInput): Promise<InventoryItem | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    InventoryMapper.applyUpdate(entity, data);
    const saved = await this.repository.save(entity);
    return InventoryMapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
