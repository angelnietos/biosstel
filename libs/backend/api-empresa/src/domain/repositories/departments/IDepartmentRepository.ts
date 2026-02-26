/**
 * Output Port: repositorio de departamentos (dominio).
 */
import type { Department, CreateDepartmentInput, UpdateDepartmentInput } from '../../entities/Department';

export interface IDepartmentRepository {
  findAll(activeOnly?: boolean): Promise<Department[]>;
  findById(id: string): Promise<Department | null>;
  create(data: CreateDepartmentInput): Promise<Department>;
  update(id: string, data: UpdateDepartmentInput): Promise<Department>;
  delete(id: string): Promise<void>;
}

export const DEPARTMENT_REPOSITORY = Symbol('IDepartmentRepository');
