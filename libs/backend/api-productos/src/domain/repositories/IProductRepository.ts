import type { Product, CreateProductData, UpdateProductData } from '@biosstel/shared-types';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
