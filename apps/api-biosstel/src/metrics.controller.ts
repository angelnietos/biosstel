/**
 * Serves GET /api/metrics (version-neutral) for Prometheus scrapers
 * that call /api/metrics instead of /api/v1/metrics.
 */
import { Controller, Get, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import * as client from 'prom-client';

@ApiTags('monitoring')
@Controller({ path: 'metrics', version: VERSION_NEUTRAL })
export class MetricsController {
  @Get()
  @ApiOperation({
    summary: 'Métricas Prometheus',
    description: 'Salida en formato Prometheus para scraping (sin prefijo /api/v1).',
  })
  async index(@Res({ passthrough: true }) res: Response): Promise<string> {
    res.setHeader('Content-Type', client.register.contentType);
    return client.register.metrics();
  }
}
