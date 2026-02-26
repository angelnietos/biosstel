/**
 * Adaptadores por feature: config para que cada dominio pueda usar
 * postgres, mongo o un microservicio (http) sin cambiar la lógica de aplicación.
 */
export * from './types';
export {
  getFeatureAdapter,
  getFeatureServiceUrl,
  getFeatureConnectionString,
  getFullRuntimeConfig,
  getFeaturesConfig,
  getGraphQLConfig,
  isGraphQLEnabledForFeature,
  getConfig,
  resetFeatureAdapterCache,
} from './getFeatureAdapter';
