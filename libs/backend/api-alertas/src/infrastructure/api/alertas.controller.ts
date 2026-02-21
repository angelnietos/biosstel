/**
 * @biosstel/api-alertas - Infrastructure Layer: Alertas Controller (Input Adapter)
 * REST controller - placeholder GET /api/alertas.
 */

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AlertasManagementUseCase } from '../../application/use-cases';

@ApiTags('alertas')
@ApiBearerAuth('access-token')
@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasManagement: AlertasManagementUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar alertas',
    description: 'Obtiene alertas. Query: tipo=ventas|recordatorios|tracking; departamento=; centroTrabajo= (múltiples repetidos o separados por coma).',
  })
  @ApiResponse({ status: 200, description: 'Lista de alertas.' })
  async list(
    @Query('tipo') tipo?: 'ventas' | 'recordatorios' | 'tracking',
    @Query('departamento') departamento?: string | string[],
    @Query('centroTrabajo') centroTrabajo?: string | string[],
  ) {
    const dep = Array.isArray(departamento)
      ? departamento
      : typeof departamento === 'string'
        ? departamento.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;
    const center = Array.isArray(centroTrabajo)
      ? centroTrabajo
      : typeof centroTrabajo === 'string'
        ? centroTrabajo.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;
    return this.alertasManagement.list(tipo, { departamento: dep, centroTrabajo: center });
  }
}
