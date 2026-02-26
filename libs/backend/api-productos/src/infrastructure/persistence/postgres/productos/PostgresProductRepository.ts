import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Product, CreateProductInput, UpdateProductInput } from '../../../../domain/entities/Product';
import type { IProductRepository } from '../../../../domain/repositories';
import { ProductOrmEntity } from '../../entities/ProductOrmEntity';
import { ProductMapper } from '../../../mappers/ProductMapper';

@Injectable()
export class PostgresProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const list = await this.repository.find({ order: { codigo: 'ASC' } });
    return list.map((e) => ProductMapper.toDomain(e));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async create(data: CreateProductInput): Promise<Product> {
    const toInsert = ProductMapper.toOrmCreate(data);
    const entity = this.repository.create(toInsert);
    const saved = await this.repository.save(entity);
    return ProductMapper.toDomain(saved);
  }

  async update(id: string, data: UpdateProductInput): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    ProductMapper.applyUpdate(entity, data);
    const saved = await this.repository.save(entity);
    return ProductMapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
