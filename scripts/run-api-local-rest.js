#!/usr/bin/env node
/**
 * API en modo REST (sin GraphQL) en local (sin Docker). Puerto 3021.
 * Requiere Postgres en marcha: pnpm db:start
 * Uso: pnpm api:local:rest
 */
const path = require('path');
const { execSync } = require('child_process');

process.env.PORT = process.env.PORT || '3021';
process.env.GRAPHQL_ENABLED = 'false';
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5434';

const root = path.resolve(__dirname, '..');
process.chdir(root);
execSync(
  'npx nodemon --watch apps/api-biosstel/src --watch libs/backend --ext ts,json --exec "node scripts/run-api-dev-tsx.js"',
  { stdio: 'inherit', env: process.env }
);
