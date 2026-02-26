import type { WorkCenter, CreateWorkCenterInput, UpdateWorkCenterInput } from '../../entities/WorkCenter';

export abstract class IWorkCenterRepository {
  abstract findAll(activeOnly?: boolean): Promise<WorkCenter[]>;
  abstract findById(id: string): Promise<WorkCenter | null>;
  abstract create(data: CreateWorkCenterInput): Promise<WorkCenter>;
  abstract update(id: string, data: UpdateWorkCenterInput): Promise<WorkCenter>;
  abstract delete(id: string): Promise<void>;
}

export const WORK_CENTER_REPOSITORY = Symbol('IWorkCenterRepository');
