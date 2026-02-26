#!/usr/bin/env node
/**
 * Pruebas con curl para API en modo GraphQL (3020) y REST (3021).
 * Ejecutar con la API ya levantada en el modo correspondiente.
 *
 * Uso:
 *   pnpm api:test:curl:graphql   # Prueba GraphQL en 3020
 *   pnpm api:test:curl:rest      # Prueba REST en 3021
 *   pnpm api:test:curl            # Muestra comandos para ambos
 */

const { execSync } = require('child_process');

const GRAPHQL_PORT = 3020;
const REST_PORT = 3021;

function curl(args) {
  const cmd = ['curl', '-s', ...args].join(' ');
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  } catch (e) {
    return e.stdout?.toString() || e.message || String(e);
  }
}

function testRest(port) {
  console.log(`\n--- REST (puerto ${port}) ---\n`);
  const health = curl([`http://localhost:${port}/api/v1/health/live`]);
  console.log('GET /api/v1/health/live:', health.trim().slice(0, 200));

  const users = curl([`http://localhost:${port}/api/v1/users?page=1&pageSize=5`]);
  console.log('GET /api/v1/users?page=1&pageSize=5:', users.trim().slice(0, 500));
  try {
    const parsed = JSON.parse(users);
    if (parsed.items !== undefined || parsed.data !== undefined) {
      console.log('✅ REST usuarios: respuesta JSON válida');
    } else {
      console.log('⚠️  Respuesta inesperada (puede ser error o formato distinto)');
    }
  } catch {
    console.log('⚠️  No se pudo parsear JSON (¿API arrancada?)');
  }
}

function testGraphQL(port) {
  console.log(`\n--- GraphQL (puerto ${port}) ---\n`);
  const health = curl([`http://localhost:${port}/api/v1/health/live`]);
  console.log('GET /api/v1/health/live:', health.trim().slice(0, 200));

  const query = JSON.stringify({
    query: '{ users(page: 1, pageSize: 5) { items { id email } total page pageSize } }',
  });
  const gql = curl([
    '-X', 'POST',
    '-H', 'Content-Type: application/json',
    '-d', query,
    `http://localhost:${port}/graphql`,
  ]);
  console.log('POST /graphql { users(page:1, pageSize:5) {...} }:', gql.trim().slice(0, 500));
  try {
    const parsed = JSON.parse(gql);
    if (parsed.data?.users) {
      console.log('✅ GraphQL users: respuesta válida');
    } else if (parsed.errors) {
      console.log('⚠️  GraphQL errors:', parsed.errors.map((e) => e.message).join('; '));
    } else {
      console.log('⚠️  Respuesta inesperada');
    }
  } catch {
    console.log('⚠️  No se pudo parsear JSON (¿API en modo GraphQL en 3020?)');
  }
}

function printCommands() {
  console.log(`
Comandos curl manuales (api-usuarios):

REST (puerto 3021, con pnpm api:docker:rest):
  curl -s "http://localhost:3021/api/v1/health/live"
  curl -s "http://localhost:3021/api/v1/users?page=1&pageSize=5"

GraphQL (puerto 3020, con pnpm api:docker:graphql):
  curl -s "http://localhost:3020/api/v1/health/live"
  curl -s -X POST http://localhost:3020/graphql \\
    -H "Content-Type: application/json" \\
    -d '{"query":"{ users(page: 1, pageSize: 5) { items { id email } total } }"}'
`);
}

const mode = process.argv[2];
if (mode === 'rest') {
  testRest(REST_PORT);
} else if (mode === 'graphql') {
  testGraphQL(GRAPHQL_PORT);
} else {
  printCommands();
  console.log('Ejecutar con: pnpm api:test:curl:rest o pnpm api:test:curl:graphql');
}
