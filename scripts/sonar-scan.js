#!/usr/bin/env node
/**
 * Ejecuta el Sonar scanner con variables de .env cargadas (evita problemas con dotenv-cli en Windows).
 * Requiere SONAR_TOKEN en .env en la raíz del proyecto.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env') });

if (!process.env.SONAR_TOKEN) {
  console.error('[sonar-scan] ERROR: SONAR_TOKEN no está definido. Añade SONAR_TOKEN=tu_token en .env en la raíz del proyecto.');
  process.exit(1);
}

console.log('[sonar-scan] SONAR_TOKEN cargado. Ejecutando scanner...');
const result = spawnSync('npx', ['sonar'], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
