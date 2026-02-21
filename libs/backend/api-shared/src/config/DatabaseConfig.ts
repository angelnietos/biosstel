import * as fs from 'fs';
import * as path from 'path';

export interface DatabaseSettings {
  adapter: 'postgres' | 'mongo';
}

export class DatabaseConfig {
  static getSettings(): DatabaseSettings {
    const settingsPath = path.resolve(process.cwd(), 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      console.warn('⚠️ settings.json not found, defaulting to postgres');
      return { adapter: 'postgres' };
    }
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    return settings.database || { adapter: 'postgres' };
  }
}
