/**
 * @biosstel/api-alertas - Application Layer: Alertas Management Use Case
 * Lista alertas desde BD (tabla dashboard_alerts, seed) con filtros y paginación.
 */

import { Injectable, Inject } from '@nestjs/common';
import type { PaginatedResult } from '@biosstel/shared-types';
import type { AlertasListFilters } from '../../ports/input/IAlertasManagement';
import type { IAlertasRepository, Alert } from '../../../domain';
import { I_ALERTAS_REPOSITORY } from '../../../domain';

@Injectable()
export class AlertasManagementUseCase {
  constructor(
    @Inject(I_ALERTAS_REPOSITORY)
    private readonly alertRepository: IAlertasRepository
  ) {}

  async list(
    tipo?: 'ventas' | 'recordatorios' | 'tracking',
    filters?: AlertasListFilters,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResult<Alert>> {
    const rows = await this.alertRepository.findAllActive();
    
    let result: Alert[] = rows;

    if (tipo === 'recordatorios') {
      result = result.filter((r) => r.statusType === 'no-fichado');
    } else if (tipo === 'tracking') {
      result = result.filter((r) => r.statusType === 'fuera-horario');
    }

    if (filters?.departamento?.length) {
      const deptSet = new Set(filters.departamento.map((d) => d.toLowerCase()));
      result = result.filter((r) => deptSet.has((r.departamento ?? '').toLowerCase()));
    }
    if (filters?.centroTrabajo?.length) {
      const centerSet = new Set(filters.centroTrabajo.map((c) => c.toLowerCase()));
      result = result.filter((r) => centerSet.has((r.centroTrabajo ?? '').toLowerCase()));
    }
    if (filters?.marca?.length) {
      const marcaSet = new Set(filters.marca.map((m) => m.toLowerCase()));
      result = result.filter((r) => marcaSet.has((r.marca ?? '').toLowerCase()));
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize).map(a => a.toPlain());
    const totalPages = Math.ceil(total / pageSize);

    return { items, data: items, total, totalPages, page, pageSize };
  }
}
