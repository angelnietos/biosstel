/**
 * Mapper Domain ↔ ORM (Department).
 */
import { Department, type CreateDepartmentInput, type UpdateDepartmentInput } from '../../domain/entities/Department';
import type { DepartmentEntity } from '../persistence/entities/DepartmentEntity';

export class DepartmentMapper {
  static toDomain(orm: DepartmentEntity): Department {
    return new Department(
      orm.id,
      orm.name,
      orm.color ?? undefined,
      orm.code ?? undefined,
      orm.responsibleUserId ?? undefined,
      orm.dateFrom ?? undefined,
      orm.dateTo ?? undefined
    );
  }

  static toOrmCreate(data: CreateDepartmentInput): Pick<DepartmentEntity, 'code' | 'name' | 'color' | 'responsibleUserId' | 'dateFrom' | 'dateTo'> {
    return {
      code: data.code,
      name: data.name,
      color: data.color ?? 'blue',
      responsibleUserId: data.responsibleUserId,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
    };
  }

  static applyUpdate(orm: DepartmentEntity, input: UpdateDepartmentInput): void {
    if (input.code !== undefined) orm.code = input.code;
    if (input.name !== undefined) orm.name = input.name;
    if (input.color !== undefined) orm.color = input.color;
    if (input.responsibleUserId !== undefined) orm.responsibleUserId = input.responsibleUserId;
    if (input.dateFrom !== undefined) orm.dateFrom = input.dateFrom;
    if (input.dateTo !== undefined) orm.dateTo = input.dateTo;
    if (input.isActive !== undefined) orm.isActive = input.isActive;
  }
}
