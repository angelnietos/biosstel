import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import type { InventoryItem, CreateInventoryData, UpdateInventoryData } from '@biosstel/shared-types';
import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { InventoryItemEntity } from './InventoryItemEntity';

@Injectable()
export class TypeOrmInventoryRepository implements IInventoryRepository {
  constructor(
    @InjectRepository(InventoryItemEntity)
    private readonly repository: Repository<InventoryItemEntity>,
  ) {}

  private toDomain(entity: InventoryItemEntity): InventoryItem {
    return {
      id: entity.id,
      codigo: entity.codigo,
      nombre: entity.nombre,
      cantidad: entity.cantidad,
      ubicacion: entity.ubicacion ?? undefined,
    };
  }

  async findAll(): Promise<InventoryItem[]> {
    const list = await this.repository.find({ order: { codigo: 'ASC' } });
    return list.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateInventoryData): Promise<InventoryItem> {
    const partial: DeepPartial<InventoryItemEntity> = {
      codigo: data.codigo,
      nombre: data.nombre,
      cantidad: data.cantidad ?? 0,
      ubicacion: data.ubicacion ?? undefined,
    };
    const entity = this.repository.create(partial);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, data: UpdateInventoryData): Promise<InventoryItem | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    if (data.codigo !== undefined) entity.codigo = data.codigo;
    if (data.nombre !== undefined) entity.nombre = data.nombre;
    if (data.cantidad !== undefined) entity.cantidad = data.cantidad;
    if (data.ubicacion !== undefined) entity.ubicacion = data.ubicacion;
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
