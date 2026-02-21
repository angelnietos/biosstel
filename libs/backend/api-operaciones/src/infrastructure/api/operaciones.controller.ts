/**
 * @biosstel/api-operaciones - Operaciones Controller
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OperacionesManagementUseCase } from '../../application/use-cases';

@ApiTags('operaciones')
@ApiBearerAuth('access-token')
@Controller('operaciones')
export class OperacionesController {
  constructor(private readonly operacionesManagement: OperacionesManagementUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar operaciones', description: 'Obtiene la lista de operaciones.' })
  @ApiResponse({ status: 200, description: 'Lista de operaciones.' })
  async list() {
    return this.operacionesManagement.list();
  }
}
