import type { Fichaje } from '@biosstel/shared-types';

export interface FichajeDashboardRow {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  startTime: Date | null;
  location: { lat: number; lng: number } | null;
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

export const IFichajeRepository = Symbol('IFichajeRepository');
