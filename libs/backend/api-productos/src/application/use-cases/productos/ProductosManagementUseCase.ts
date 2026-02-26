import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import type { Product } from '../../../domain/entities/Product';
import type { IProductRepository } from '../../../domain/repositories';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories';

/** File from multipart upload (NestJS FileInterceptor / multer). */
export interface PlantillaUploadFile {
  fieldname?: string;
  originalname: string;
  buffer?: Buffer;
  path?: string;
  size?: number;
  mimetype?: string;
}

@Injectable()
export class ProductosManagementUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async list(): Promise<{ products: Product[] }> {
    const products = await this.productRepository.findAll();
    return { products };
  }

  async getById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
    return product;
  }

  async create(data: { codigo: string; nombre: string; familia?: string; estado?: string }): Promise<Product> {
    return this.productRepository.create({
      codigo: data.codigo,
      nombre: data.nombre,
      familia: data.familia,
      estado: data.estado,
    });
  }

  async update(id: string, data: { codigo?: string; nombre?: string; familia?: string; estado?: string }): Promise<Product> {
    const product = await this.productRepository.update(id, data);
    if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
    return product;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Producto ${id} no encontrado`);
  }

  /** Sube plantilla para un producto; guarda en uploads/plantillas y devuelve la ruta. */
  async uploadPlantilla(
    productId: string,
    file: PlantillaUploadFile
  ): Promise<{ ok: boolean; path: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException(`Producto ${productId} no encontrado`);
    const fs = await import('fs');
    const path = await import('path');
    const dir = path.join(process.cwd(), 'uploads', 'plantillas');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ext = path.extname(file.originalname) || '';
    const filename = `${productId}-${Date.now()}${ext}`;
    const filePath = path.join(dir, filename);
    const data = file.buffer ?? (file as { buffer?: Buffer }).buffer;
    if (data) fs.writeFileSync(filePath, data);
    else if (file.path) fs.copyFileSync(file.path, filePath);
    else throw new BadRequestException('No se recibió el archivo');
    return { ok: true, path: `/uploads/plantillas/${filename}` };
  }
}
