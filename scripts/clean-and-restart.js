#!/usr/bin/env node
/**
 * Limpieza completa y reinicio:
 * 0. Asegura que Docker esté corriendo (lo inicia si hace falta en Windows/macOS)
 * 1. Detiene procesos Nx (API y Front en puertos 3001, 4000)
 * 2. Detiene y elimina contenedores Docker (dev)
 * 3. Opcionalmente elimina volúmenes Docker (--volumes)
 * 4. Elimina .dev-ports.json
 * 5. Inicia DB, espera a Postgres e inicia API + Front con puertos libres
 *
 * Uso: node scripts/clean-and-restart.js
 *      node scripts/clean-and-restart.js --volumes
 *      node scripts/clean-and-restart.js --no-start  (solo limpieza, no inicia servicios)
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.resolve(__dirname, '..');
const PORTS_FILE = path.join(root, '.dev-ports.json');
const COMPOSE_FILE = path.join(root, 'docker-compose.dev.yml');
const isWindows = os.platform() === 'win32';

const args = process.argv.slice(2);
const withVolumes = args.includes('--volumes');
const noStart = args.includes('--no-start');

function log(msg, emoji = '') {
  console.log(emoji ? `${emoji} ${msg}` : msg);
}

function ensureDocker() {
  log('Comprobando Docker (se iniciará si no está en marcha)...', '🐳');
  try {
    execSync('node scripts/ensure-docker.js', { cwd: root, stdio: 'inherit' });
  } catch (e) {
    if (e.status) {
      console.error('');
      process.exit(e.status);
    }
    throw e;
  }
  log('Docker listo', '✅');
}

function getPidsOnPort(port) {
  const pids = new Set();
  try {
    if (isWindows) {
      const out = execSync(`netstat -ano | findstr :${port}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const lines = out.split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const last = parts[parts.length - 1];
        if (last && /^\d+$/.test(last) && last !== '0') pids.add(last);
      }
    } else {
      const out = execSync(`lsof -ti :${port} 2>/dev/null || true`, { encoding: 'utf8' });
      out.trim().split(/\s+/).filter(Boolean).forEach((pid) => pids.add(pid));
    }
  } catch {
    // ignore
  }
  return [...pids];
}

function killPid(pid) {
  try {
    if (isWindows) {
      require('child_process').spawnSync('taskkill', ['/PID', pid, '/F', '/T'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      execSync(`kill -9 ${pid} 2>/dev/null || true`);
    }
    return true;
  } catch {
    return false;
  }
}

function stopNxProcesses() {
  log('Deteniendo procesos Nx (API y Front)...', '🔄');
  const ports = [3001, 4000];
  let killed = 0;
  for (const port of ports) {
    const pids = getPidsOnPort(port);
    for (const pid of pids) {
      if (killPid(pid)) killed++;
    }
  }
  log('Procesos Nx detenidos', '✅');
  if (killed > 0) {
    const delay = 1500;
    const end = Date.now() + delay;
    while (Date.now() < end) {
      /* busy wait to let OS release ports */
    }
  }
}

function stopDocker() {
  log('Deteniendo contenedores Docker...', '🛑');
  try {
    execSync(`docker compose -f "${COMPOSE_FILE}" stop`, {
      cwd: root,
      stdio: 'pipe',
    });
    log('Contenedores Docker detenidos', '✅');
  } catch (e) {
    if (e.status !== 0) log('(Algunos contenedores ya detenidos o no existían)', '⏭️');
  }
}

function removeDockerContainers() {
  log('Eliminando contenedores Docker...', '🗑️');
  try {
    const down = withVolumes
      ? `docker compose -f "${COMPOSE_FILE}" down -v`
      : `docker compose -f "${COMPOSE_FILE}" down`;
    execSync(down, { cwd: root, stdio: 'pipe' });
    log('Contenedores Docker eliminados' + (withVolumes ? ' (con volúmenes)' : ''), '✅');
  } catch (e) {
    if (e.status !== 0) log('(Compose down falló o no había contenedores)', '⏭️');
  }
}

function cleanTempFiles() {
  log('Limpiando archivos temporales...', '🧹');
  if (fs.existsSync(PORTS_FILE)) {
    fs.unlinkSync(PORTS_FILE);
    log('Archivo de puertos eliminado', '✅');
  }
}

function startServices() {
  log('Iniciando servicios...', '🚀');
  const env = { ...process.env, DB_HOST: '127.0.0.1', DB_PORT: '5434' };
  ensureDocker();
  execSync('docker compose -f docker-compose.dev.yml up -d postgres adminer', {
    cwd: root,
    stdio: 'inherit',
    env,
  });
  execSync('node scripts/wait-for-db.js', { cwd: root, stdio: 'inherit', env });
  const child = spawn('node', ['scripts/run-dev-dynamic-ports.js'], {
    cwd: root,
    stdio: 'inherit',
    env,
  });
  child.on('exit', (code) => process.exit(code !== null ? code : 0));
}

function main() {
  log('Limpieza e inicio limpio del proyecto', '🧹');
  console.log('');

  ensureDocker();
  console.log('');

  stopNxProcesses();
  console.log('');
  stopDocker();
  removeDockerContainers();
  console.log('');
  cleanTempFiles();
  log('Limpieza completada', '✅');
  console.log('');

  if (noStart) {
    log('Omitiendo inicio de servicios (--no-start)', '⏭️');
    return;
  }

  startServices();
}

main();
