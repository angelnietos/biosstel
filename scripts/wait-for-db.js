#!/usr/bin/env node
/**
 * Waits for PostgreSQL to accept connections on port 5434 (local dev).
 * Used by dev:local so the API does not start before the DB is ready.
 *
 * Usage: node scripts/wait-for-db.js
 * Requires: pnpm db:start (or postgres listening on 5434).
 */
const net = require('net');

const PORT = Number(process.env.DB_PORT || process.env.PGPORT || 5434);
const HOST = process.env.DB_HOST || '127.0.0.1';
const MAX_ATTEMPTS = 60;
const RETRY_MS = 1000;

function tryConnect(attempt) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 2000);
    socket.once('connect', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.connect(PORT, HOST);
  });
}

async function main() {
  console.log(`⏳ Esperando Postgres en ${HOST}:${PORT}...`);
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (await tryConnect(i)) {
      console.log('✅ Base de datos lista.');
      process.exit(0);
    }
    if (i < MAX_ATTEMPTS - 1) {
      await new Promise((r) => setTimeout(r, RETRY_MS));
    }
  }
  console.error(`❌ Timeout: Postgres no acepta conexiones en ${HOST}:${PORT}.`);
  console.error('   Comprueba que Docker esté en marcha y que hayas ejecutado: pnpm db:start');
  process.exit(1);
}

main();
