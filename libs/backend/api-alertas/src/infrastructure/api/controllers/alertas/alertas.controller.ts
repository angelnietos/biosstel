/**
 * @biosstel/api-alertas - Infrastructure Layer: Alertas Controller (CQRS vía IMediator)
 * GET /api/alertas con filtros (tipo, marca, departamento, centroTrabajo) y paginación.
 */

import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import { ListAlertasQuery } from '../../../../application/cqrs/queries/alertas/ListAlertas.query';

function toStringArray(value: string | string[] | undefined): string[] | undefined {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return undefined;
}

@ApiTags('alertas')
@ApiBearerAuth('access-token')
@Controller('alertas')
export class AlertasController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get()
  @ApiOperation({
    summary: 'Listar alertas',
    description: 'Obtiene alertas paginadas. Query: tipo, marca, departamento, centroTrabajo (separados por coma), page, pageSize.',
  })
  @ApiQuery({ name: 'tipo', required: false, enum: ['ventas', 'recordatorios', 'tracking'] })
  @ApiQuery({ name: 'marca', required: false, type: String })
  @ApiQuery({ name: 'departamento', required: false, type: String })
  @ApiQuery({ name: 'centroTrabajo', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista paginada de alertas (items, total, page, pageSize).' })
  async list(
    @Query('tipo') tipo?: 'ventas' | 'recordatorios' | 'tracking',
    @Query('marca') marca?: string | string[],
    @Query('departamento') departamento?: string | string[],
    @Query('centroTrabajo') centroTrabajo?: string | string[],
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const dep = toStringArray(departamento);
    const center = toStringArray(centroTrabajo);
    const marcaArr = toStringArray(marca);
    const pageNum = page != null && Number.isFinite(Number(page)) ? Number(page) : 1;
    const pageSizeNum = pageSize != null && Number.isFinite(Number(pageSize)) ? Math.min(100, Math.max(1, Number(pageSize))) : 10;
    return this.mediator.execute(
      new ListAlertasQuery(tipo, { departamento: dep, centroTrabajo: center, marca: marcaArr }, pageNum, pageSizeNum)
    );
  }
}
