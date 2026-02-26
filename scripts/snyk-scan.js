#!/usr/bin/env node
/**
 * Ejecuta Snyk con variables de .env cargadas (comando Node, evita dotenv-cli en Windows).
 * Uso: node scripts/snyk-scan.js [scan|test|code|monitor]
 * - scan (por defecto): test + code test
 * - test: snyk test --severity-threshold=high --all-projects
 * - code: snyk code test --severity-threshold=high
 * - monitor: snyk monitor --all-projects
 */
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env') });

const mode = process.argv[2] || 'scan';
const run = (args) => {
  const result = spawnSync('pnpm', ['exec', 'snyk', ...args], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    shell: true,
  });
  return result.status ?? 1;
};

let status = 0;
switch (mode) {
  case 'scan':
    status = run(['test', '--severity-threshold=high', '--all-projects']);
    if (status !== 0) process.exit(status);
    status = run(['code', 'test', '--severity-threshold=high']);
    break;
  case 'test':
    status = run(['test', '--severity-threshold=high', '--all-projects']);
    break;
  case 'code':
    status = run(['code', 'test', '--severity-threshold=high']);
    break;
  case 'monitor':
    status = run(['monitor', '--all-projects']);
    break;
  default:
    console.error('[snyk-scan] Modo desconocido:', mode, '- use scan|test|code|monitor');
    process.exit(1);
}
process.exit(status);
