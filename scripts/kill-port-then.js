#!/usr/bin/env node
/**
 * Kills any process listening on the given port, then exits.
 * Used before starting the frontend dev server to avoid EADDRINUSE.
 * Usage: node scripts/kill-port-then.js [port]
 * Default port: 3001
 */

const port = parseInt(process.argv[2] || '3001', 10);
if (Number.isNaN(port) || port < 1 || port > 65535) {
  console.error('Invalid port. Usage: node scripts/kill-port-then.js [port]');
  process.exit(1);
}

async function main() {
  try {
    const kill = require('kill-port');
    await kill(port);
    console.log(`Port ${port} cleared (no process was using it or it was killed).`);
  } catch (err) {
    // Ignore "no process found" or similar
    if (err.code !== 'ESRCH' && err.message && !err.message.includes('nothing')) {
      console.warn('kill-port:', err.message);
    }
  }
  process.exit(0);
}

main();
