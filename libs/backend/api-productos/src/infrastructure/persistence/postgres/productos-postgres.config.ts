import { ProductOrmEntity, InventoryItemEntity, FamilyEntity, SubfamilyEntity, BrandEntity } from '../entities';

export const PRODUCTOS_POSTGRES_ENTITIES = [
  ProductOrmEntity,
  InventoryItemEntity,
  FamilyEntity,
  SubfamilyEntity,
  BrandEntity,
] as const;
