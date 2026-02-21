#!/usr/bin/env node
/**
 * Ensures Docker is running before running compose.
 * On Windows: starts Docker Desktop if needed and waits for the engine.
 * On macOS: opens Docker Desktop if needed.
 */

const { execSync, spawn } = require('child_process');
const { platform } = require('os');

const DOCKER_WAIT_TIMEOUT_MS = 120000; // 2 min
const DOCKER_POLL_INTERVAL_MS = 3000;

function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'pipe', windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

function waitForDocker() {
  const start = Date.now();
  process.stdout.write('Esperando a que Docker esté listo');
  while (Date.now() - start < DOCKER_WAIT_TIMEOUT_MS) {
    if (isDockerRunning()) {
      process.stdout.write(' listo.\n');
      return true;
    }
    process.stdout.write('.');
    sleep(DOCKER_POLL_INTERVAL_MS);
  }
  process.stdout.write('\n');
  return false;
}

function startDockerWindows() {
  const paths = [
    process.env['ProgramFiles'] + '\\Docker\\Docker\\Docker Desktop.exe',
    process.env['ProgramFiles(x86)'] + '\\Docker\\Docker\\Docker Desktop.exe',
    'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe',
  ].filter(Boolean);

  for (const exe of paths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(exe)) {
        console.log('Iniciando Docker Desktop...');
        spawn(exe, [], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

function startDockerMac() {
  try {
    execSync('open -a Docker', { stdio: 'pipe' });
    console.log('Abriendo Docker Desktop...');
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (isDockerRunning()) {
    return 0;
  }

  if (platform() === 'win32') {
    if (!startDockerWindows()) {
      console.error(
        'Docker no está en ejecución y no se encontró Docker Desktop.\n' +
          'Instálalo desde https://www.docker.com/products/docker-desktop/ o inícialo manualmente.'
      );
      process.exit(1);
    }
    if (!waitForDocker()) {
      console.error('Timeout: Docker no respondió a tiempo. Inicia Docker Desktop manualmente y vuelve a ejecutar pnpm start.');
      process.exit(1);
    }
    return 0;
  }

  if (platform() === 'darwin') {
    if (startDockerMac()) {
      if (!waitForDocker()) {
        console.error('Timeout: Docker no respondió a tiempo. Inicia Docker Desktop manualmente y vuelve a ejecutar pnpm start.');
        process.exit(1);
      }
      return 0;
    }
  }

  console.error(
    'Docker no está en ejecución. Inicia Docker Desktop (o el daemon de Docker) y vuelve a ejecutar:\n  pnpm start'
  );
  process.exit(1);
}

main();
