/**
 * Entidad de dominio WorkCenter.
 * Pura: sin dependencias de TypeORM ni de ningún framework.
 */
export class WorkCenter {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address: string | undefined,
    public readonly departmentId: string | undefined,
    public readonly isActive: boolean = true
  ) {}

  /** Serialización para API/contratos (shared-types). */
  toPlain() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      departmentId: this.departmentId,
      isActive: this.isActive,
    };
  }
}

export interface CreateWorkCenterInput {
  name: string;
  address?: string;
  departmentId?: string;
}

export interface UpdateWorkCenterInput {
  name?: string;
  address?: string;
  departmentId?: string;
  isActive?: boolean;
}
