import * as fs from 'node:fs';
import * as path from 'node:path';
import type { FeatureAdapterConfig } from '../adapters/types';

export interface DatabaseSettings {
  adapter: 'postgres' | 'mongo';
  /** Configuración por feature (ver getFeatureAdapter en ./adapters). */
  features?: FeatureAdapterConfig['features'];
  serviceUrls?: FeatureAdapterConfig['serviceUrls'];
}

export class DatabaseConfig {
  static getSettings(): DatabaseSettings {
    const settingsPath = path.resolve(process.cwd(), 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      console.warn('⚠️ settings.json not found, defaulting to postgres');
      return { adapter: 'postgres' };
    }
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const db = settings.database || { adapter: 'postgres' };
    return {
      adapter: db.adapter ?? 'postgres',
      features: db.features,
      serviceUrls: db.serviceUrls,
    };
  }
}
