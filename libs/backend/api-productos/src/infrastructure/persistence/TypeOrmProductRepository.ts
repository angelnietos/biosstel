import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import type { Product, CreateProductData, UpdateProductData } from '@biosstel/shared-types';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductEntity } from './ProductEntity';

@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  private toDomain(entity: ProductEntity): Product {
    return {
      id: entity.id,
      codigo: entity.codigo,
      nombre: entity.nombre,
      familia: entity.familia,
      estado: entity.estado,
    };
  }

  async findAll(): Promise<Product[]> {
    const list = await this.repository.find({ order: { codigo: 'ASC' } });
    return list.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const partial: DeepPartial<ProductEntity> = {
      codigo: data.codigo,
      nombre: data.nombre,
      familia: data.familia ?? '',
      estado: data.estado ?? 'Activo',
    };
    const entity = this.repository.create(partial);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, data: UpdateProductData): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    if (data.codigo !== undefined) entity.codigo = data.codigo;
    if (data.nombre !== undefined) entity.nombre = data.nombre;
    if (data.familia !== undefined) entity.familia = data.familia;
    if (data.estado !== undefined) entity.estado = data.estado;
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
