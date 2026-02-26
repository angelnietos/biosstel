/**
 * Módulo del Config Server: expone FeatureConfigService para que la API
 * (o un servicio config dedicado) pueda inyectarlo y exponer GET /api/config.
 */

import { Global, Module } from '@nestjs/common';
import { FeatureConfigService } from './FeatureConfigService';

@Global()
@Module({
  providers: [FeatureConfigService],
  exports: [FeatureConfigService],
})
export class ConfigServerModule {}
