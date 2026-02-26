export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
}

export class Task {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public startTime: Date,
    public completed: boolean = false,
    public description?: string,
    public endTime?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  public static create(input: CreateTaskInput): Task {
    return new Task(
      '', // ID will be set by repository/orm
      input.userId,
      input.title,
      input.startTime,
      false,
      input.description,
      undefined,
      new Date(),
      new Date()
    );
  }

  public toPlain() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      startTime: this.startTime,
      endTime: this.endTime,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
