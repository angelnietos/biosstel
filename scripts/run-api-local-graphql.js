#!/usr/bin/env node
/**
 * API en modo GraphQL en local (sin Docker). Puerto 3020.
 * Requiere Postgres en marcha: pnpm db:start
 * Uso: pnpm api:local:graphql
 */
const path = require('path');
const { execSync } = require('child_process');

process.env.PORT = process.env.PORT || '3020';
process.env.GRAPHQL_ENABLED = 'true';
process.env.GRAPHQL_FEATURES = process.env.GRAPHQL_FEATURES || 'users';
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5434';

const root = path.resolve(__dirname, '..');
process.chdir(root);

// Liberar puerto 3020 antes de arrancar para evitar EADDRINUSE al reiniciar nodemon
process.env.KILL_PORTS = process.env.PORT || '3020';
try {
  execSync('node scripts/kill-ports.js', { stdio: 'inherit', env: process.env });
} catch (_) {
  // Ignorar si kill-ports falla (ej. puerto ya libre)
}

execSync(
  'npx nodemon --watch apps/api-biosstel/src --watch libs/backend --ext ts,json --exec "node scripts/run-api-dev-tsx.js"',
  { stdio: 'inherit', env: process.env }
);
