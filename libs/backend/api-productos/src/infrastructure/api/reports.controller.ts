import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ReportsManagementUseCase } from '../../application/use-cases';

@ApiTags('reports')
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsManagement: ReportsManagementUseCase) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen para informes', description: 'Devuelve métricas agregadas para dashboards e informes.' })
  @ApiResponse({ status: 200, description: 'Resumen de métricas.' })
  async getSummary() {
    return this.reportsManagement.getSummary();
  }
}
