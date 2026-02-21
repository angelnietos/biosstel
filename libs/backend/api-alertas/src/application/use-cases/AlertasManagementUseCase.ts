/**
 * @biosstel/api-alertas - Application Layer: Alertas Management Use Case
 * Lista alertas desde BD (tabla dashboard_alerts, seed).
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardAlertEntity } from '@biosstel/api-objetivos';

@Injectable()
export class AlertasManagementUseCase {
  constructor(
    @InjectRepository(DashboardAlertEntity)
    private readonly alertRepository: Repository<DashboardAlertEntity>
  ) {}

  async list(
    tipo?: 'ventas' | 'recordatorios' | 'tracking',
    filters?: { departamento?: string[]; centroTrabajo?: string[] }
  ): Promise<
    {
      id: string;
      usuario: string;
      departamento: string;
      centroTrabajo: string;
      rol?: string;
      estado: string;
      statusType?: string;
    }[]
  > {
    const rows = await this.alertRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
    let result = rows.map((r) => ({
      id: r.id,
      usuario: r.usuario,
      departamento: r.departamento,
      centroTrabajo: r.centroTrabajo,
      rol: r.rol,
      estado: r.estado,
      statusType: r.statusType,
    }));
    if (tipo === 'recordatorios') {
      result = result.filter((r) => r.statusType === 'no-fichado');
    } else if (tipo === 'tracking') {
      result = result.filter((r) => r.statusType === 'fuera-horario');
    }
    if (filters?.departamento?.length) {
      const deptSet = new Set(filters.departamento.map((d) => d.toLowerCase()));
      result = result.filter((r) => deptSet.has(r.departamento.toLowerCase()));
    }
    if (filters?.centroTrabajo?.length) {
      const centerSet = new Set(filters.centroTrabajo.map((c) => c.toLowerCase()));
      result = result.filter((r) => centerSet.has(r.centroTrabajo.toLowerCase()));
    }
    return result;
  }
}
