#!/usr/bin/env node
/**
 * Levanta la API en Docker en modo REST / Postgres (sin GraphQL).
 * Puerto 3021.
 *
 * Uso: pnpm api:docker:rest
 * Requiere: Docker en ejecución.
 */

const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const composeFile = path.join(root, 'docker-compose.api-rest.yml');

process.chdir(root);

console.log('🔧 Comprobando Docker...');
execSync('node scripts/ensure-docker.js', { stdio: 'inherit' });

console.log('🚀 Levantando API en modo REST/Postgres (puerto 3021)...');
console.log('   REST: http://localhost:3021/api/v1/...');
console.log('');
execSync(`docker compose -f "${composeFile}" up --build`, {
  stdio: 'inherit',
  env: { ...process.env },
});
