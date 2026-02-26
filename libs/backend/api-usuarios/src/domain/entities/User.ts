export interface CreateUserInput {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  departmentId?: string;
  workCenterId?: string;
}

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public isActive: boolean,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public role?: string,
    public roleId?: string,
    public departmentId?: string,
    public workCenterId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date
  ) {}

  public static create(input: CreateUserInput): User {
    return new User(
      '', // ID will be set by repository
      input.email,
      true,
      input.firstName,
      input.lastName,
      input.phone,
      input.role,
      undefined,
      input.departmentId,
      input.workCenterId,
      new Date(),
      new Date()
    );
  }

  public get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }

  public toPlain() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      isActive: this.isActive,
      role: this.role,
      departmentId: this.departmentId,
      workCenterId: this.workCenterId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
