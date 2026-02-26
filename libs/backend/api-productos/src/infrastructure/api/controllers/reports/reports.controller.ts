import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { IMediator, type IMediatorPort } from '@biosstel/api-shared';
import { GetReportsSummaryQuery } from '../../../../application/cqrs/queries/reports';

@ApiTags('reports')
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen para informes', description: 'Devuelve métricas agregadas para dashboards e informes.' })
  @ApiResponse({ status: 200, description: 'Resumen de métricas.' })
  async getSummary() {
    return this.mediator.execute(new GetReportsSummaryQuery());
  }
}
