#!/usr/bin/env node
/**
 * Encuentra puertos libres para front y API.
 * Por defecto intenta 3001 (front) y 4000 (API); si están ocupados busca el siguiente libre.
 * Escribe el resultado en .dev-ports.json y lo imprime por stdout (JSON).
 *
 * Uso: node scripts/find-free-ports.js
 * Salida: .dev-ports.json y stdout {"front":3001,"api":4000}
 */

const net = require('net');
const fs = require('fs');
const path = require('path');

const DEFAULT_FRONT = 3001;
const DEFAULT_API = 4000;
const PORTS_FILE = path.resolve(__dirname, '..', '.dev-ports.json');

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer((c) => c.end());
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findNextFreePort(start) {
  let p = start;
  const max = Math.min(65535, start + 100);
  while (p <= max) {
    const free = await isPortFree(p);
    if (free) return p;
    p++;
  }
  throw new Error(`No se encontró puerto libre entre ${start} y ${max}`);
}

async function main() {
  const frontFree = await isPortFree(DEFAULT_FRONT);
  const apiFree = await isPortFree(DEFAULT_API);

  const frontPort = frontFree ? DEFAULT_FRONT : await findNextFreePort(DEFAULT_FRONT);
  const apiPort = apiFree ? DEFAULT_API : await findNextFreePort(DEFAULT_API);

  const ports = { front: frontPort, api: apiPort };
  fs.writeFileSync(PORTS_FILE, JSON.stringify(ports, null, 2), 'utf8');

  if (!frontFree) console.warn(`⚠️  Puerto ${DEFAULT_FRONT} ocupado → usando ${frontPort}`);
  if (!apiFree) console.warn(`⚠️  Puerto ${DEFAULT_API} ocupado → usando ${apiPort}`);

  console.log(JSON.stringify(ports));
  return ports;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
