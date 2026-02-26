/**
 * Mapper Domain ↔ ORM (WorkCenter).
 */
import { WorkCenter, type CreateWorkCenterInput, type UpdateWorkCenterInput } from '../../domain/entities/WorkCenter';
import type { WorkCenterEntity } from '../persistence/entities/WorkCenterEntity';

export class WorkCenterMapper {
  static toDomain(orm: WorkCenterEntity): WorkCenter {
    return new WorkCenter(
      orm.id,
      orm.name,
      orm.address ?? undefined,
      orm.departmentId ?? undefined,
      orm.isActive
    );
  }

  static toOrmCreate(data: CreateWorkCenterInput): Partial<WorkCenterEntity> {
    return {
      name: data.name,
      address: data.address,
      departmentId: data.departmentId,
      isActive: true,
    };
  }

  static applyUpdate(orm: WorkCenterEntity, input: UpdateWorkCenterInput): void {
    if (input.name !== undefined) orm.name = input.name;
    if (input.address !== undefined) orm.address = input.address;
    if (input.departmentId !== undefined) orm.departmentId = input.departmentId;
    if (input.isActive !== undefined) orm.isActive = input.isActive;
  }
}
