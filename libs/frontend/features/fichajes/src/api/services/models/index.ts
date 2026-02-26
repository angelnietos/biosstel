/**
 * Tipos de contrato API (fichajes, tareas).
 */
export type FichajeStatus = 'idle' | 'working' | 'paused' | 'finished';

export interface Fichaje {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime?: string;
  pauses: FichajePause[];
  totalTime?: number;
  status: FichajeStatus;
  location?: { lat: number; lng: number; address?: string };
}

export interface FichajePause {
  startTime: string;
  endTime?: string;
  reason?: string;
}

export interface Tarea {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
}
