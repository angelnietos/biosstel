/**
 * Config Server: expone la configuración por feature (adaptador, URLs, connection strings).
 * GET /api/config       -> configuración completa (source, database, profile).
 * GET /api/config/features -> lista por feature (adapter, serviceUrl, connectionString).
 *
 * Fuente actual: settings.json + variables de entorno.
 * En el futuro un microservicio puede consumir estos endpoints o la app puede
 * obtener config desde un config server remoto (CONFIG_SERVER_URL).
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeatureConfigService } from '@biosstel/api-shared';

@ApiTags('config')
@Controller({ path: 'config', version: '1' })
export class ConfigController {
  constructor(private readonly config: FeatureConfigService) {}

  @Get()
  @ApiOperation({
    summary: 'Configuración completa',
    description:
      'Configuración de runtime: origen, database (defaultAdapter, features, serviceUrls, connectionStrings), profile. Usado por operaciones y por microservicios que consumen esta API como config server.',
  })
  @ApiResponse({ status: 200, description: 'Configuración actual.' })
  getConfig() {
    return this.config.getRuntimeConfig();
  }

  @Get('features')
  @ApiOperation({
    summary: 'Config por feature',
    description:
      'Lista cada feature con su adaptador (postgres|mongo|http), serviceUrl si aplica y connectionString si está definida.',
  })
  @ApiResponse({ status: 200, description: 'Lista de features con su config.' })
  getFeaturesConfig() {
    return this.config.getFeaturesConfig();
  }
}
