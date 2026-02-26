/**
 * Mapper Domain ↔ ORM (InventoryItem).
 */
import { InventoryItem, type CreateInventoryInput, type UpdateInventoryInput } from '../../domain/entities/InventoryItem';
import type { InventoryItemEntity } from '../persistence/entities/InventoryItemEntity';

export class InventoryMapper {
  static toDomain(orm: InventoryItemEntity): InventoryItem {
    return new InventoryItem(
      orm.id,
      orm.codigo,
      orm.nombre,
      orm.cantidad,
      orm.ubicacion ?? undefined
    );
  }

  static toOrmCreate(data: CreateInventoryInput): Partial<InventoryItemEntity> {
    return {
      codigo: data.codigo,
      nombre: data.nombre,
      cantidad: data.cantidad ?? 0,
      ubicacion: data.ubicacion,
    };
  }

  static applyUpdate(orm: InventoryItemEntity, input: UpdateInventoryInput): void {
    if (input.codigo !== undefined) orm.codigo = input.codigo;
    if (input.nombre !== undefined) orm.nombre = input.nombre;
    if (input.cantidad !== undefined) orm.cantidad = input.cantidad;
    if (input.ubicacion !== undefined) orm.ubicacion = input.ubicacion;
  }
}
