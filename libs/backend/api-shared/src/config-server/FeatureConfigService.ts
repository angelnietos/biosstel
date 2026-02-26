/**
 * Servicio inyectable que expone la configuración por feature (adapters, URLs, connection strings).
 * Usado por el Config Controller y por cualquier módulo que necesite config en runtime.
 */

import { Injectable } from '@nestjs/common';
import {
  getFeatureAdapter,
  getFeatureServiceUrl,
  getFeatureConnectionString,
  getFullRuntimeConfig,
  getFeaturesConfig,
  getGraphQLConfig,
  isGraphQLEnabledForFeature,
  resetFeatureAdapterCache,
} from '../adapters';
import type { FeatureKey, AdapterKind, RuntimeConfig, FeatureConfigEntry, GraphQLConfig } from '../adapters';

@Injectable()
export class FeatureConfigService {
  getFeatureAdapter(feature: FeatureKey): AdapterKind {
    return getFeatureAdapter(feature);
  }

  getFeatureServiceUrl(feature: FeatureKey): string | undefined {
    return getFeatureServiceUrl(feature);
  }

  getFeatureConnectionString(feature: FeatureKey): string | undefined {
    return getFeatureConnectionString(feature);
  }

  /** Configuración completa para el Config Server (GET /api/config). */
  getRuntimeConfig(): RuntimeConfig {
    return getFullRuntimeConfig();
  }

  /** Lista por feature (GET /api/config/features). */
  getFeaturesConfig(): FeatureConfigEntry[] {
    return getFeaturesConfig();
  }

  getGraphQLConfig(): GraphQLConfig {
    return getGraphQLConfig();
  }

  isGraphQLEnabledForFeature(feature: FeatureKey): boolean {
    return isGraphQLEnabledForFeature(feature);
  }

  /** Reinvalida caché (útil si en el futuro se recarga config desde remoto). */
  reload(): void {
    resetFeatureAdapterCache();
  }
}
