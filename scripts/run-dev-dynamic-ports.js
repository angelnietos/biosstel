#!/usr/bin/env node
/**
 * Busca puertos libres (3001 front, 4000 API o siguientes disponibles),
 * escribe .dev-ports.json y arranca API y Front en esos puertos.
 * Requiere DB ya levantada (pnpm db:start).
 *
 * Uso: node scripts/run-dev-dynamic-ports.js
 *      node scripts/run-dev-dynamic-ports.js --no-find  (usa .dev-ports.json existente)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const PORTS_FILE = path.join(root, '.dev-ports.json');

function getPorts(forceFind) {
  if (!forceFind && fs.existsSync(PORTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PORTS_FILE, 'utf8'));
      if (data.front && data.api) return data;
    } catch (_) {}
  }
  const { execSync } = require('child_process');
  execSync('node scripts/find-free-ports.js', { cwd: root, stdio: 'pipe' });
  return JSON.parse(fs.readFileSync(PORTS_FILE, 'utf8'));
}

function main() {
  const noFind = process.argv.includes('--no-find');
  const ports = getPorts(!noFind);
  const { front: frontPort, api: apiPort } = ports;

  process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
  process.env.DB_PORT = process.env.DB_PORT || '5434';

  console.log('');
  console.log('🚀 Iniciando servicios con puertos dinámicos');
  console.log(`   API:   http://localhost:${apiPort}`);
  console.log(`   Front: http://localhost:${frontPort}`);
  console.log('');

  const apiEnv = {
    ...process.env,
    PORT: String(apiPort),
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
  };

  const api = spawn('pnpm', ['exec', 'nx', 'dev', 'api-biosstel'], {
    cwd: root,
    env: apiEnv,
    stdio: 'inherit',
    shell: true,
  });

  const frontEnv = {
    ...process.env,
    PORT: String(frontPort),
    NEXT_PUBLIC_API_URL: `http://localhost:${apiPort}`,
  };

  const front = spawn(
    'pnpm',
    ['exec', 'next', 'dev', '-p', String(frontPort), '--hostname', '0.0.0.0'],
    {
      cwd: path.join(root, 'apps/front-biosstel'),
      env: frontEnv,
      stdio: 'inherit',
      shell: true,
    }
  );

  const onExit = (code, name) => {
    if (code !== 0 && code !== null) {
      process.kill(api.pid, 'SIGTERM');
      process.kill(front.pid, 'SIGTERM');
      process.exit(code);
    }
  };

  api.on('exit', (code) => onExit(code, 'api'));
  front.on('exit', (code) => onExit(code, 'front'));

  process.on('SIGINT', () => {
    api.kill('SIGTERM');
    front.kill('SIGTERM');
    process.exit(0);
  });
}

main();
