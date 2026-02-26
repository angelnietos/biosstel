#!/usr/bin/env node
/**
 * Levanta las dos APIs en Docker a la vez: GraphQL (3020) + REST (3021).
 * Un solo Postgres compartido.
 * Uso: pnpm api:docker:both
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const composeFile = path.join(root, 'docker-compose.api-modes.yml');

process.chdir(root);

console.log('🔧 Comprobando Docker...');
execSync('node scripts/ensure-docker.js', { stdio: 'inherit' });

console.log('🚀 Levantando ambas APIs (GraphQL 3020 + REST 3021)...');
console.log('   GraphQL: http://localhost:3020/graphql');
console.log('   REST:    http://localhost:3021/api/v1/...');
console.log('');
execSync(`docker compose -f "${composeFile}" up --build`, {
  stdio: 'inherit',
  env: process.env,
});
