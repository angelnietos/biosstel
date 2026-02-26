import type { IQuery } from '@biosstel/api-shared';

export class ListAlertasQuery implements IQuery {
  readonly type = 'ListAlertasQuery';
  constructor(
    public readonly tipo?: 'ventas' | 'recordatorios' | 'tracking',
    public readonly filters?: { departamento?: string[]; centroTrabajo?: string[]; marca?: string[] },
    public readonly page = 1,
    public readonly pageSize = 10
  ) {}
}
