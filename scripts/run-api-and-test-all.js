#!/usr/bin/env node
/**
 * Levanta las dos APIs (REST 3021 + GraphQL 3022), espera a que estén listas,
 * ejecuta las pruebas en paralelo (testRest + testGraphQL) y muestra el resultado.
 *
 * Uso: pnpm api:test:curl:all
 */
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const root = path.resolve(__dirname, '..');
const REST_PORT = 3021;
const GRAPHQL_PORT = 3022;
const WAIT_MS = 60 * 1000;
const POLL_MS = 1500;

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });
}

function waitForHealth(port) {
  const url = `http://localhost:${port}/api/v1/health/live`;
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() - start > WAIT_MS) {
        reject(new Error(`Timeout esperando API en puerto ${port}`));
        return;
      }
      try {
        const res = await get(url);
        if (res.statusCode === 200) {
          resolve();
          return;
        }
      } catch (_) {}
      setTimeout(tick, POLL_MS);
    };
    tick();
  });
}

function killPorts() {
  const { execSync } = require('child_process');
  process.env.KILL_PORTS = [REST_PORT, GRAPHQL_PORT].join(',');
  try {
    execSync('node scripts/kill-ports.js', { cwd: root, stdio: 'pipe', env: process.env });
  } catch (_) {}
}

function startApi(port, graphqlEnabled) {
  const env = {
    ...process.env,
    PORT: String(port),
    GRAPHQL_ENABLED: graphqlEnabled ? 'true' : 'false',
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PORT: process.env.DB_PORT || '5434',
  };
  const child = spawn('node', ['scripts/run-api-dev-tsx.js'], {
    cwd: root,
    env,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  return child;
}

async function main() {
  console.log('Liberando puertos', REST_PORT, 'y', GRAPHQL_PORT, '...');
  killPorts();
  await new Promise((r) => setTimeout(r, 2500));

  console.log('Arrancando API REST (puerto', REST_PORT, ')...');
  startApi(REST_PORT, false);
  await new Promise((r) => setTimeout(r, 2000));
  console.log('Arrancando API GraphQL (puerto', GRAPHQL_PORT, ')...');
  startApi(GRAPHQL_PORT, true);

  console.log('Esperando a que ambas APIs respondan (health)...');
  await Promise.all([waitForHealth(REST_PORT), waitForHealth(GRAPHQL_PORT)]);
  console.log('Ambas APIs listas.\n');

  const { execSync } = require('child_process');
  execSync('node scripts/curl-test-api-modes.js all', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, GRAPHQL_PORT: String(GRAPHQL_PORT), REST_PORT: String(REST_PORT) },
  });

  console.log('\nLas dos APIs siguen en marcha (REST', REST_PORT, '| GraphQL', GRAPHQL_PORT + ').');
  console.log('Para detenerlas: cierra las terminales o usa kill-ports.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
