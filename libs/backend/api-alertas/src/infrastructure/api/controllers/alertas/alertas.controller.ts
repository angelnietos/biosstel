/**
 * @biosstel/api-alertas - Infrastructure Layer: Alertas Controller (CQRS vía IMediator)
 * GET /api/alertas (listar), POST (crear), PATCH /:id (actualizar), DELETE /:id (eliminar).
 */

import { Controller, Get, Post, Patch, Delete, Query, Body, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import { ListAlertasQuery } from '../../../../application/cqrs/queries/alertas/ListAlertas.query';
import { CreateAlertaCommand } from '../../../../application/cqrs/commands/alertas/CreateAlerta.command';
import { UpdateAlertaCommand } from '../../../../application/cqrs/commands/alertas/UpdateAlerta.command';
import { DeleteAlertaCommand } from '../../../../application/cqrs/commands/alertas/DeleteAlerta.command';
import type { CreateAlertData, UpdateAlertData } from '../../../../domain/repositories';

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

  @Post()
  @ApiOperation({ summary: 'Crear alerta' })
  @ApiBody({ description: 'usuario, departamento, centroTrabajo, estado (obligatorios); rol, marca, statusType, sortOrder, isActive (opcionales)' })
  @ApiResponse({ status: 201, description: 'Alerta creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() body: CreateAlertData) {
    return this.mediator.execute(new CreateAlertaCommand(body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar alerta' })
  @ApiBody({ description: 'Campos a actualizar (todos opcionales).' })
  @ApiResponse({ status: 200, description: 'Alerta actualizada.' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada.' })
  async update(@Param('id') id: string, @Body() body: UpdateAlertData) {
    return this.mediator.execute(new UpdateAlertaCommand(id, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar alerta' })
  @ApiResponse({ status: 204, description: 'Alerta eliminada.' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada.' })
  async delete(@Param('id') id: string) {
    await this.mediator.execute(new DeleteAlertaCommand(id));
  }
}
