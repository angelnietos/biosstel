#!/usr/bin/env node
/**
 * Pruebas para API en modo GraphQL (3020) y REST (3021).
 * Usa http nativo de Node (funciona en Windows sin curl).
 *
 * Uso:
 *   pnpm api:test:curl:graphql   # Prueba GraphQL en 3020
 *   pnpm api:test:curl:rest      # Prueba REST en 3021
 *   pnpm api:test:curl            # Muestra comandos para ambos
 */

const http = require('http');

const GRAPHQL_PORT = 3020;
const REST_PORT = 3021;

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function post(url, body) {
  const u = new URL(url);
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 8000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(payload);
    req.end();
  });
}

async function testRest(port) {
  console.log(`\n--- REST (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    console.log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 150));
  } catch (e) {
    console.log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    return;
  }
  try {
    const users = await get(`http://localhost:${port}/api/v1/users?page=1&pageSize=5`);
    console.log('GET /api/v1/users: status', users.statusCode);
    const parsed = JSON.parse(users.body);
    if (parsed.items !== undefined || parsed.data !== undefined) {
      console.log('✅ REST usuarios: respuesta JSON válida');
    } else {
      console.log('⚠️  Respuesta:', users.body.trim().slice(0, 200));
    }
  } catch (e) {
    console.log('⚠️  GET /users:', e.message);
  }
}

async function testGraphQL(port) {
  console.log(`\n--- GraphQL (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    console.log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 150));
  } catch (e) {
    console.log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    return;
  }
  try {
    const res = await post(`http://localhost:${port}/graphql`, {
      query: '{ users(page: 1, pageSize: 5) { items { id email } total page pageSize } }',
    });
    console.log('POST /graphql: status', res.statusCode);
    const parsed = JSON.parse(res.body);
    if (parsed.data?.users) {
      console.log('✅ GraphQL users: respuesta válida');
    } else if (parsed.errors) {
      console.log('⚠️  GraphQL errors:', parsed.errors.map((e) => e.message).join('; '));
    } else {
      console.log('⚠️  Respuesta:', res.body.trim().slice(0, 200));
    }
  } catch (e) {
    console.log('⚠️  POST /graphql:', e.message);
  }
}

function printCommands() {
  console.log(`
Comandos manuales (con la API levantada):

REST (puerto 3021):
  Invoke-WebRequest -Uri "http://localhost:3021/api/v1/health/live" -UseBasicParsing
  Invoke-WebRequest -Uri "http://localhost:3021/api/v1/users?page=1&pageSize=5" -UseBasicParsing

GraphQL (puerto 3020):
  Invoke-WebRequest -Uri "http://localhost:3020/api/v1/health/live" -UseBasicParsing
  # POST /graphql: usar Postman o este script (pnpm api:test:curl:graphql)
`);
}

async function main() {
  const mode = process.argv[2];
  if (mode === 'rest') {
    await testRest(REST_PORT);
  } else if (mode === 'graphql') {
    await testGraphQL(GRAPHQL_PORT);
  } else {
    printCommands();
    console.log('Ejecutar: pnpm api:test:curl:rest  o  pnpm api:test:curl:graphql');
  }
}

main();
