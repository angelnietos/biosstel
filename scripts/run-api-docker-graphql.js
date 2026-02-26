#!/usr/bin/env node
/**
 * Levanta la API en Docker en modo GraphQL (config por lib).
 * Puerto 3020. GraphQL habilitado con feature 'users'.
 *
 * Uso: pnpm api:docker:graphql
 * Requiere: Docker en ejecución.
 */

const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const composeFile = path.join(root, 'docker-compose.api-graphql.yml');

process.chdir(root);

console.log('🔧 Comprobando Docker...');
execSync('node scripts/ensure-docker.js', { stdio: 'inherit' });

console.log('🚀 Levantando API en modo GraphQL (puerto 3020)...');
console.log('   GraphQL: http://localhost:3020/graphql');
console.log('   REST:    http://localhost:3020/api/v1/...');
console.log('');
execSync(`docker compose -f "${composeFile}" up --build`, {
  stdio: 'inherit',
  env: { ...process.env },
});
