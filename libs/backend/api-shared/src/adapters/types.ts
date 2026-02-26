/**
 * Tipos para adaptadores de datos por feature.
 * Permite que cada feature use su propia base de datos o microservicio al escalar.
 */

/** Identificador de cada feature (dominio acotado). */
export type FeatureKey =
  | 'users'
  | 'fichajes'
  | 'alertas'
  | 'objetivos'
  | 'empresa'
  | 'productos'
  | 'auth'
  | 'operaciones';

/** Tipo de adaptador: BD local (postgres/mongo) o servicio remoto (http). */
export type AdapterKind = 'postgres' | 'mongo' | 'http';

/** Configuración de persistencia por feature (opcional por feature). */
export interface FeatureAdapterConfig {
  /** Adaptador por defecto si no se especifica por feature. */
  defaultAdapter?: AdapterKind;
  /** Adaptador por feature. Si no está, se usa defaultAdapter. */
  features?: Partial<Record<FeatureKey, AdapterKind>>;
  /** URL base del servicio cuando adapter === 'http' (ej. USERS_SERVICE_URL). */
  serviceUrls?: Partial<Record<FeatureKey, string>>;
  /** Connection string por feature cuando cada uno tiene su propia BD (postgres/mongo). */
  connectionStrings?: Partial<Record<FeatureKey, string>>;
}

/** Configuración completa expuesta por el Config Server (GET /api/config). */
export interface RuntimeConfig {
  /** Origen: 'file' | 'env' | 'remote'. */
  source: string;
  /** Configuración de base de datos y adaptadores por feature. */
  database: FeatureAdapterConfig;
  /** GraphQL: habilitado y features que lo exponen. */
  graphql?: GraphQLConfig;
  /** Perfil actual (development, production, etc.). */
  profile?: string;
  /** Timestamp de carga. */
  loadedAt?: string;
}

/** Resumen por feature para GET /api/config/features. */
export interface FeatureConfigEntry {
  feature: FeatureKey;
  adapter: AdapterKind;
  serviceUrl?: string;
  connectionString?: string;
}

/** Configuración GraphQL (activar por feature; REST sigue funcionando). */
export interface GraphQLConfig {
  /** Si true, se registra GraphQLModule y los resolvers de features en graphql.features. */
  enabled?: boolean;
  /** Features que exponen schema GraphQL (ej. ['users']). */
  features?: FeatureKey[];
  /** Path del endpoint GraphQL (default /graphql). */
  path?: string;
}
