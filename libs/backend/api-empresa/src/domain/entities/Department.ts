/**
 * Entidad de dominio Department.
 * Pura: sin dependencias de TypeORM ni de ningún framework.
 */
export class Department {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly color: string | undefined,
    public readonly code: string | undefined,
    public readonly responsibleUserId: string | undefined,
    public readonly dateFrom: string | undefined,
    public readonly dateTo: string | undefined
  ) {}

  /** Serialización para API/contratos (shared-types). */
  toPlain(): {
    id: string;
    name: string;
    color?: string;
    code?: string;
    responsibleUserId?: string;
    dateFrom?: string;
    dateTo?: string;
  } {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      code: this.code,
      responsibleUserId: this.responsibleUserId,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    };
  }
}

export interface CreateDepartmentInput {
  code?: string;
  name: string;
  color?: string;
  responsibleUserId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateDepartmentInput {
  code?: string;
  name?: string;
  color?: string;
  responsibleUserId?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export type DepartmentPlain = ReturnType<Department['toPlain']>;
