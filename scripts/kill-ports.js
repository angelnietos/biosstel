#!/usr/bin/env node
/**
 * Mata los procesos que usan los puertos 3001 (front) y/o 4000 (API).
 * Se ejecuta antes de dev:local para evitar EADDRINUSE.
 *
 * Uso:
 *   node scripts/kill-ports.js           → mata 3001 y 4000
 *   node scripts/kill-ports.js --front    → solo 3001 (para dev:front, no tocar API)
 *   node scripts/kill-ports.js --api     → solo 4000
 *   KILL_PORTS=3001,4000 node ...        → puertos custom
 */
const { execSync, spawnSync } = require('child_process');
const os = require('os');

const args = process.argv.slice(2);
let PORTS;
if (args.includes('--front')) {
  PORTS = [3001];
} else if (args.includes('--api')) {
  PORTS = [4000];
} else if (process.env.KILL_PORTS) {
  PORTS = process.env.KILL_PORTS.split(',').map((p) => p.trim()).filter(Boolean).map(Number);
} else {
  PORTS = [3001, 4000];
}

const DELAY_MS = Number(process.env.KILL_PORTS_DELAY_MS) || 2500;

const isWindows = os.platform() === 'win32';

function getPidsOnPort(port) {
  const pids = new Set();
  try {
    if (isWindows) {
      // Método 1: netstat -ano (más exhaustivo)
      try {
        const out = execSync(`netstat -ano`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        const lines = out.split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
          // Buscar el puerto en cualquier parte de la línea
          if (line.includes(`:${port}`) || line.includes(`:${port} `)) {
            const parts = line.trim().split(/\s+/);
            const last = parts[parts.length - 1];
            if (last && /^\d+$/.test(last) && last !== '0') {
              pids.add(last);
            }
          }
        }
      } catch (e) {
        // Ignorar error de netstat
      }

      // Método 2: PowerShell como fallback (más confiable)
      if (pids.size === 0) {
        try {
          const psCmd = `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess`;
          const out = execSync(`powershell -NoProfile -Command "${psCmd}"`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
          });
          out
            .trim()
            .split(/\s+/)
            .filter((p) => p && /^\d+$/.test(p))
            .forEach((pid) => pids.add(pid));
        } catch (e) {
          // Ignorar error de PowerShell
        }
      }

      // Método 3: tasklist + find para procesos node (último recurso)
      if (pids.size === 0) {
        try {
          const out = execSync(`tasklist /FI "IMAGENAME eq node.exe" /FO CSV`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
          });
          const lines = out.split(/\r?\n/).filter(Boolean);
          for (const line of lines.slice(1)) { // Saltar cabecera
            const match = line.match(/"node\.exe","(\d+)"/i);
            if (match) {
              // Verificar si este PID usa el puerto
              const netstatOut = execSync(`netstat -ano | findstr :${port}`, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'],
              }).catch(() => '');
              if (netstatOut && netstatOut.includes(match[1])) {
                pids.add(match[1]);
              }
            }
          }
        } catch (e) {
          // Ignorar error
        }
      }
    } else {
      const out = execSync(`lsof -ti :${port} 2>/dev/null || true`, {
        encoding: 'utf8',
      });
      out
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .forEach((pid) => pids.add(pid));
    }
  } catch (_) {
    // Error general
  }
  return [...pids];
}

/** En Windows, solo matar procesos "seguros" (node, ts-node) para no cerrar Docker. */
function getProcessNameWindows(pid) {
  try {
    const out = execSync(`wmic process where processId=${pid} get executablePath /format:value 2>nul`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const m = out.match(/ExecutablePath=(\S+)/);
    const path = m ? m[1].trim() : '';
    const name = path.split(/[/\\]/).pop() || '';
    return { path: path.toLowerCase(), name: name.toLowerCase() };
  } catch (_) {
    return { path: '', name: '' };
  }
}

function isDockerOrSystemProcess(name, path) {
  if (!name && !path) return true;
  const s = (name + ' ' + path).toLowerCase();
  return (
    s.includes('docker') ||
    s.includes('com.docker') ||
    s.includes('vpnkit') ||
    s.includes('wsl') ||
    s.includes('hyper-v')
  );
}

const DEV_API_PORTS = [3022, 3020, 4000];

function isSafeToKillWindows(pid, port) {
  const { name, path } = getProcessNameWindows(pid);
  if (isDockerOrSystemProcess(name, path)) return false;
  // Si no se pudo obtener nombre (wmic falla) y es puerto de dev API, asumir node y matar
  if ((!name && !path) && DEV_API_PORTS.includes(port)) return true;
  return name === 'node.exe' || name === 'node' || path.includes('node.exe');
}

function killPid(pid, port) {
  try {
    if (isWindows) {
      if (!isSafeToKillWindows(pid, port)) {
        console.log(`⏭️  Puerto en uso por Docker/sistema (PID ${pid}). Para dev:api usa solo Postgres: pnpm db:start. O detén la API en Docker: docker compose -f docker-compose.dev.yml stop api`);
        return false;
      }
      spawnSync('taskkill', ['/PID', pid, '/F', '/T'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      execSync(`kill -9 ${pid} 2>/dev/null || true`);
    }
    return true;
  } catch (_) {
    return false;
  }
}

function main() {
  let killed = 0;
  for (const port of PORTS) {
    const pids = getPidsOnPort(port);
    for (const pid of pids) {
      if (killPid(pid, port)) {
        console.log(`✅ Puerto ${port}: proceso ${pid} terminado.`);
        killed++;
      }
    }
    if (pids.length === 0) {
      console.log(`⏭️  Puerto ${port}: ningún proceso en uso.`);
    }
  }
  if (killed > 0) {
    console.log(`\n✅ ${killed} proceso(s) liberados. Esperando ${DELAY_MS / 1000}s para que el SO libere los puertos...\n`);
    const end = Date.now() + DELAY_MS;
    while (Date.now() < end) {}
  }
}

main();
