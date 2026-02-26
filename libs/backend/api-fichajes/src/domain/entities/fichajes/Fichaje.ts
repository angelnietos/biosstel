export interface FichajePause {
  startTime: string;
  endTime?: string;
  reason?: string;
}

export interface FichajeLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface CreateFichajeInput {
  userId: string;
  date: string;
  startTime: Date;
  location?: FichajeLocation;
}

export class Fichaje {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly date: string,
    public readonly startTime: Date,
    public status: 'working' | 'paused' | 'finished',
    public endTime?: Date,
    public pauses: FichajePause[] = [],
    public location?: FichajeLocation,
    public totalTime?: number,
    public fueraHorario?: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  public static create(input: CreateFichajeInput): Fichaje {
    return new Fichaje(
      '', // ID will be set by repository/orm
      input.userId,
      input.date,
      input.startTime,
      'working',
      undefined,
      [],
      input.location,
      0,
      false,
      new Date(),
      new Date()
    );
  }

  public toPlain() {
    return {
      id: this.id,
      userId: this.userId,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      pauses: this.pauses,
      location: this.location,
      totalTime: this.totalTime,
      fueraHorario: this.fueraHorario,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
