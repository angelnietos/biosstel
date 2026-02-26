import type { Fichaje } from '../../entities/Fichaje';

export interface FichajeDashboardRow {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  startTime: Date | null;
  location: { lat: number; lng: number; address?: string } | null;
  minutosHoy: number;
}

export interface IFichajeRepository {
  create(fichaje: Partial<Fichaje>): Promise<Fichaje>;
  findById(id: string): Promise<Fichaje | null>;
  findCurrentByUserId(userId: string): Promise<Fichaje | null>;
  findByUserId(userId: string): Promise<Fichaje[]>;
  save(fichaje: Fichaje): Promise<Fichaje>;
  findDashboardRows(date: string): Promise<FichajeDashboardRow[]>;
}

export const I_FICHAJE_REPOSITORY = Symbol('IFichajeRepository');
