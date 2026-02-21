#!/usr/bin/env node
/**
 * Elimina node_modules, dist, .next y cachés de build para un clean install.
 * Cross-platform (Windows + Unix).
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function rm(dir) {
  const full = path.join(root, dir);
  if (fs.existsSync(full)) {
    try {
      fs.rmSync(full, { recursive: true, force: true });
      console.log('Eliminado:', dir);
    } catch (err) {
      console.warn('No se pudo eliminar', dir, err.message);
    }
  }
}

// Root
rm('node_modules');
rm('dist');

// Next.js
rm('apps/front-biosstel/.next');

// Nx
rm('.nx/cache');

// Cachés de workspace (apps/libs pueden tener node_modules en pnpm)
const appsDir = path.join(root, 'apps');
const libsDir = path.join(root, 'libs');
if (fs.existsSync(appsDir)) {
  for (const name of fs.readdirSync(appsDir)) {
    rm(path.join('apps', name, 'node_modules'));
    rm(path.join('apps', name, '.next'));
  }
}
if (fs.existsSync(libsDir)) {
  for (const name of fs.readdirSync(libsDir)) {
    rm(path.join('libs', name, 'node_modules'));
    const libsSub = path.join(libsDir, name);
    if (fs.existsSync(libsSub) && fs.statSync(libsSub).isDirectory()) {
      try {
        for (const sub of fs.readdirSync(libsSub)) {
          rm(path.join('libs', name, sub, 'node_modules'));
        }
      } catch (_) {}
    }
  }
}

console.log('Limpieza terminada.');
