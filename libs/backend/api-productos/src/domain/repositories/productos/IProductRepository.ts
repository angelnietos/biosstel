/**
 * Output Port: repositorio de productos (dominio).
 */
import type { Product, CreateProductInput, UpdateProductInput } from '../../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductInput): Promise<Product>;
  update(id: string, data: UpdateProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
