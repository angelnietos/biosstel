/**
 * Resuelve el adaptador configurado para un feature.
 * Fuente: settings.json (database) o env FEATURE_<NAME>_ADAPTER / FEATURE_<NAME>_SERVICE_URL.
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  FeatureKey,
  AdapterKind,
  FeatureAdapterConfig,
  RuntimeConfig,
  FeatureConfigEntry,
  GraphQLConfig,
} from './types';

const DEFAULT_ADAPTER: AdapterKind = 'postgres';
const FEATURE_KEYS: FeatureKey[] = [
  'users',
  'fichajes',
  'alertas',
  'objetivos',
  'empresa',
  'productos',
  'auth',
  'operaciones',
];

let cachedGraphql: GraphQLConfig | null = null;

function loadSettings(): FeatureAdapterConfig {
  const settingsPath = path.resolve(process.cwd(), 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    return { defaultAdapter: DEFAULT_ADAPTER };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const db = raw.database ?? raw;
    const graphql = raw.graphql ?? {};
    cachedGraphql = {
      enabled: !!graphql.enabled,
      features: Array.isArray(graphql.features) ? graphql.features : [],
      path: graphql.path ?? '/graphql',
    };
    return {
      defaultAdapter: (db.defaultAdapter ?? db.adapter ?? DEFAULT_ADAPTER) as AdapterKind,
      features: db.features ?? {},
      serviceUrls: db.serviceUrls ?? {},
      connectionStrings: db.connectionStrings ?? {},
    };
  } catch {
    return { defaultAdapter: DEFAULT_ADAPTER };
  }
}

function loadGraphQLConfig(): GraphQLConfig {
  if (cachedGraphql) return cachedGraphql;
  getConfig(); // ensure cache loaded
  if (cachedGraphql) return cachedGraphql;
  const envEnabled = process.env['GRAPHQL_ENABLED'] === 'true' || process.env['GRAPHQL_ENABLED'] === '1';
  const envFeatures = process.env['GRAPHQL_FEATURES']?.split(',').map((s) => s.trim()).filter(Boolean) as FeatureKey[] | undefined;
  return {
    enabled: envEnabled,
    features: envFeatures ?? [],
    path: process.env['GRAPHQL_PATH'] ?? '/graphql',
  };
}

let cached: FeatureAdapterConfig | null = null;

export function getConfig(): FeatureAdapterConfig {
  if (cached === null) {
    cached = loadSettings();
  }
  return cached;
}

/**
 * Devuelve el adaptador configurado para el feature.
 * Ej.: getFeatureAdapter('users') => 'postgres' | 'mongo' | 'http'
 */
export function getFeatureAdapter(feature: FeatureKey): AdapterKind {
  const config = getConfig();
  const featureAdapter = config.features?.[feature];
  if (featureAdapter) return featureAdapter;
  const envKey = `FEATURE_${feature.toUpperCase()}_ADAPTER`;
  const envAdapter = process.env[envKey] as AdapterKind | undefined;
  if (envAdapter === 'postgres' || envAdapter === 'mongo' || envAdapter === 'http') return envAdapter;
  return (config.defaultAdapter ?? DEFAULT_ADAPTER) as AdapterKind;
}

/**
 * URL del servicio remoto cuando el feature usa adapter 'http'.
 */
export function getFeatureServiceUrl(feature: FeatureKey): string | undefined {
  const config = getConfig();
  const url = config.serviceUrls?.[feature];
  if (url) return url;
  const envKey = `FEATURE_${feature.toUpperCase()}_SERVICE_URL`;
  return process.env[envKey];
}

/**
 * Connection string para el feature cuando usa su propia BD (env override: FEATURE_<NAME>_CONNECTION_STRING).
 */
export function getFeatureConnectionString(feature: FeatureKey): string | undefined {
  const config = getConfig();
  const cs = config.connectionStrings?.[feature];
  if (cs) return cs;
  const envKey = `FEATURE_${feature.toUpperCase()}_CONNECTION_STRING`;
  return process.env[envKey];
}

/**
 * Configuración GraphQL (activar por config server).
 */
export function getGraphQLConfig(): GraphQLConfig {
  return loadGraphQLConfig();
}

/**
 * Indica si GraphQL está habilitado y el feature tiene schema expuesto.
 */
export function isGraphQLEnabledForFeature(feature: FeatureKey): boolean {
  const gql = loadGraphQLConfig();
  if (!gql.enabled) return false;
  if (!gql.features?.length) return false;
  return gql.features.includes(feature);
}

/**
 * Configuración completa para el Config Server (GET /api/config).
 */
export function getFullRuntimeConfig(): RuntimeConfig {
  const database = getConfig();
  const graphql = loadGraphQLConfig();
  return {
    source: 'file',
    profile: process.env['NODE_ENV'] ?? 'development',
    loadedAt: new Date().toISOString(),
    database: { ...database },
    graphql,
  };
}

/**
 * Lista de configuración por feature (GET /api/config/features).
 */
export function getFeaturesConfig(): FeatureConfigEntry[] {
  return FEATURE_KEYS.map((feature) => ({
    feature,
    adapter: getFeatureAdapter(feature),
    serviceUrl: getFeatureServiceUrl(feature),
    connectionString: getFeatureConnectionString(feature),
  }));
}

/**
 * Reinvalida la caché (útil en tests o tras recargar config).
 */
export function resetFeatureAdapterCache(): void {
  cached = null;
  cachedGraphql = null;
}
