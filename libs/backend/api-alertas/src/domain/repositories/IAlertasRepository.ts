import type { Alert } from '../entities';

export const I_ALERTAS_REPOSITORY = Symbol('IAlertasRepository');

export interface CreateAlertData {
  usuario: string;
  departamento: string;
  centroTrabajo: string;
  estado: string;
  rol?: string;
  marca?: string;
  statusType?: 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario';
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateAlertData {
  usuario?: string;
  departamento?: string;
  centroTrabajo?: string;
  estado?: string;
  rol?: string;
  marca?: string;
  statusType?: 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario';
  sortOrder?: number;
  isActive?: boolean;
}

export interface IAlertasRepository {
  findAllActive(): Promise<Alert[]>;
  findById(id: string): Promise<Alert | null>;
  create(data: CreateAlertData): Promise<Alert>;
  update(id: string, data: UpdateAlertData): Promise<Alert>;
  delete(id: string): Promise<void>;
}
