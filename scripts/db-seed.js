#!/usr/bin/env node
/**
 * Runs docker/seed.sql against the running biosstel-db container.
 * Works on Windows (PowerShell), macOS, and Linux.
 *
 * Usage: pnpm db:seed
 * Requires: biosstel-db container running (e.g. after pnpm db:start or pnpm db:reset).
 */
const { spawnSync } = require('child_process');
const { readFileSync } = require('fs');
const path = require('path');

const CONTAINER = 'biosstel-db';
const MAX_WAIT_MS = 30000;
const POLL_MS = 500;

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

function isContainerRunning() {
  const r = spawnSync('docker', ['inspect', '-f', '{{.State.Running}}', CONTAINER], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return r.status === 0 && r.stdout && r.stdout.trim() === 'true';
}

const sqlPath = path.join(__dirname, '..', 'docker', 'seed.sql');
const sql = readFileSync(sqlPath, 'utf8');

console.log('🌱 Seeding database...');

let waited = 0;
while (!isContainerRunning()) {
  if (waited >= MAX_WAIT_MS) {
    console.error('❌ Seed failed: container', CONTAINER, 'is not running.');
    console.error('   Run: pnpm db:start  (or pnpm db:reset) first.');
    process.exit(1);
  }
  console.log('   Waiting for', CONTAINER, '...');
  sleep(POLL_MS);
  waited += POLL_MS;
}

const result = spawnSync(
  'docker',
  ['exec', '-i', CONTAINER, 'psql', '-U', 'biosstel', '-d', 'biosstel'],
  { input: sql, encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'] }
);

if (result.status !== 0) {
  console.error('❌ Seed failed (exit code', result.status, ')');
  if (result.error) console.error(result.error.message);
  process.exit(result.status ?? 1);
}

console.log('✅ Seed complete');
