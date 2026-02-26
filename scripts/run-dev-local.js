#!/usr/bin/env node
/**
 * Ejecuta API + Front en local con las env correctas para la BD.
 * Fuerza DB_HOST y DB_PORT para que la API (en el host) conecte a Postgres en 127.0.0.1:5434.
 */
const { execSync } = require('child_process');

process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5434';

execSync('pnpm exec nx run-many -t dev -p api-biosstel,front-biosstel --parallel=2 --output-style=stream', {
  stdio: 'inherit',
  env: process.env,
});
