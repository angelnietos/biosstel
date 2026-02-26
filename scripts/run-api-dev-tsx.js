#!/usr/bin/env node
/**
 * Arranca la API en modo dev. Usa ts-node con tsconfig.dev.json (decoradores NestJS).
 * Ruta directa a node_modules para no depender de pnpm exec (evita crash en Docker).
 * PORT y GRAPHQL_* se leen de process.env.
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'apps/api-biosstel');
// ts-node (soporta experimentalDecorators; tsx/esbuild no)
let tsnodeBin = path.join(root, 'node_modules/ts-node/dist/bin.js');
if (!fs.existsSync(tsnodeBin)) {
  try {
    tsnodeBin = require.resolve('ts-node/dist/bin.js', { paths: [root] });
  } catch {
    tsnodeBin = path.join(root, 'node_modules/ts-node/dist/bin.js');
  }
}
const devEntry = path.join(apiDir, 'dev.ts');

process.chdir(apiDir);
execSync(
  `node "${tsnodeBin}" -r tsconfig-paths/register --project tsconfig.dev.json "${devEntry}"`,
  { stdio: 'inherit', env: process.env }
);
