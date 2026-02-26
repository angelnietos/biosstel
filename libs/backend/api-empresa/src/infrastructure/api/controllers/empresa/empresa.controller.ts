/**
 * @biosstel/api-empresa - Empresa Controller
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmpresaManagementUseCase } from '../../../../application/use-cases/empresa/EmpresaManagementUseCase';

@ApiTags('empresa')
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaManagement: EmpresaManagementUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar empresa',
    description: 'Obtiene datos de empresa, centros, departamentos.',
  })
  @ApiResponse({ status: 200, description: 'Datos de empresa.' })
  async list() {
    return this.empresaManagement.list();
  }
}
