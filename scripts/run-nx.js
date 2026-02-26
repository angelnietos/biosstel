#!/usr/bin/env node
/**
 * Ejecuta el Nx local del proyecto. Si faltan dependencias, ejecuta pnpm install.
 *
 * Uso: node scripts/run-nx.js <args...>
 * Ej.: node scripts/run-nx.js dev api-biosstel
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const root = process.cwd();
const nxArgs = process.argv.slice(2);

function findNx() {
  try {
    return require.resolve('nx/bin/nx.js', { paths: [root] });
  } catch {
    const direct = path.join(root, 'node_modules', 'nx', 'bin', 'nx.js');
    return fs.existsSync(direct) ? direct : null;
  }
}

function removeIgnoredDirs(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory() && (e.name === '.ignored' || e.name.startsWith('.ignored_'))) {
        const full = path.join(dir, e.name);
        try {
          fs.rmSync(full, { recursive: true, force: true });
        } catch (_) {}
      }
    }
  } catch (_) {}
}

function isPnpmInstallComplete() {
  const modulesYaml = path.join(root, 'node_modules', '.modules.yaml');
  return fs.existsSync(modulesYaml);
}

function runPnpmInstall() {
  removeIgnoredDirs(path.join(root, 'node_modules'));
  removeIgnoredDirs(path.join(root, 'apps', 'front-biosstel', 'node_modules'));
  removeIgnoredDirs(path.join(root, 'apps', 'api-biosstel', 'node_modules'));
  const install = spawnSync('pnpm', ['install'], {
    stdio: 'inherit',
    cwd: root,
    shell: true,
  });
  return install.status === 0;
}

const fixInstallMsg = '\n   Ejecuta en la raíz:  pnpm run pnpm:fix-install\n   (limpia node_modules y reinstala con pnpm, como en Docker).\n';

let nxBin = findNx();

if (!nxBin) {
  console.log('\n Dependencias no instaladas. Ejecutando pnpm install...\n');
  if (!runPnpmInstall()) {
    console.error('\n❌ Error al instalar (en local suele ser restos de npm + EACCES).');
    console.error(fixInstallMsg);
    process.exit(1);
  }
  nxBin = findNx();
}

if (!nxBin) {
  console.error('\n NX   No se encontró Nx tras instalar. Revisa que nx esté en devDependencies.\n');
  process.exit(1);
}

if (fs.existsSync(path.join(root, 'pnpm-lock.yaml')) && !isPnpmInstallComplete()) {
  console.log('\n node_modules incompleto (falta .modules.yaml). Reintentando pnpm install...\n');
  if (!runPnpmInstall() || !isPnpmInstallComplete()) {
    console.error('\n❌ Instalación incompleta (p. ej. EACCES en .ignored_motion).');
    console.error(fixInstallMsg);
    process.exit(1);
  }
}

const result = spawnSync(process.execPath, [nxBin, ...nxArgs], {
  stdio: 'inherit',
  cwd: root,
  shell: false,
});
process.exit(result.status ?? 1);
