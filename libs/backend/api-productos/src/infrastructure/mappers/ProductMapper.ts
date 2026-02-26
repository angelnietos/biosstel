/**
 * Mapper entre modelo de dominio y modelo ORM.
 * Responsabilidad: traducir entre capas que hablan modelos distintos.
 * Domain (puro) ↔ ORM (TypeORM) — aquí viven los mappers en Clean Architecture.
 */
import { Product, type CreateProductInput, type UpdateProductInput } from '../../domain/entities/Product';
import type { ProductOrmEntity } from '../persistence/entities/ProductOrmEntity';

export class ProductMapper {
  /** ORM → Dominio (sin dependencia de TypeORM en el resultado). */
  static toDomain(orm: ProductOrmEntity): Product {
    return new Product(
      orm.id,
      orm.codigo ?? undefined,
      orm.name,
      orm.familia,
      orm.estado,
      orm.familyId ?? undefined,
      orm.subfamilyId ?? undefined,
      orm.brandId ?? undefined
    );
  }

  /** Datos de creación → objeto para insertar en ORM (sin id). */
  static toOrmCreate(data: CreateProductInput): Pick<ProductOrmEntity, 'codigo' | 'name' | 'familia' | 'estado'> {
    return {
      codigo: data.codigo,
      name: data.nombre,
      familia: data.familia ?? '',
      estado: data.estado ?? 'Activo',
    };
  }

  /** Aplicar actualización parcial a entidad ORM existente. */
  static applyUpdate(orm: ProductOrmEntity, input: UpdateProductInput): void {
    if (input.codigo !== undefined) orm.codigo = input.codigo;
    if (input.nombre !== undefined) orm.name = input.nombre;
    if (input.familia !== undefined) orm.familia = input.familia;
    if (input.estado !== undefined) orm.estado = input.estado;
  }
}
