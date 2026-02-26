#!/usr/bin/env node
/**
 * Pruebas para API en modo GraphQL (3022 local) y REST (3021).
 * Usa http nativo de Node (funciona en Windows sin curl).
 *
 * Uso:
 *   pnpm api:test:curl:graphql   # Prueba GraphQL en 3022
 *   pnpm api:test:curl:rest      # Prueba REST en 3021
 *   pnpm api:test:curl:all       # Levanta ambas APIs, ejecuta las 2 pruebas en paralelo
 *   pnpm api:test:curl           # Muestra comandos
 */

const http = require('http');

const GRAPHQL_PORT = 3022;
const REST_PORT = 3021;

/** Crea un logger: si collect, acumula líneas en array; si no, escribe a console */
function makeLogger(collect) {
  const out = [];
  const log = (...args) => {
    const line = args.map((a) => (typeof a === 'string' ? a : String(a))).join(' ');
    if (collect) line.split('\n').forEach((l) => out.push(l));
    else console.log(...args);
  };
  return { log, out };
}

/** Log JSON de forma legible; usa logger.log si se pasa */
function logJson(logger, label, data, maxItems = 3) {
  const log = logger ? logger.log : console.log;
  if (data === undefined) return;
  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];
  const show = items.slice(0, maxItems);
  const rest = items.length - show.length;
  log(label);
  log(JSON.stringify(show.length === 1 && !isArray ? show[0] : show, null, 2));
  if (rest > 0) log(`   ... y ${rest} más (${items.length} en total)\n`);
  else log('');
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function post(url, body) {
  const u = new URL(url);
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 8000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(payload);
    req.end();
  });
}

async function testRest(port, opts = {}) {
  const collect = !!opts.collect;
  const L = makeLogger(collect);
  const log = L.log;

  log(`\n--- REST (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 80) + '...');
  } catch (e) {
    log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    if (collect) return L.out;
    return;
  }

  const base = `http://localhost:${port}/api/v1`;
  let allOk = true;

  // 1) Lista (REST siempre devuelve todos los campos)
  try {
    const r1 = await get(`${base}/users?page=1&pageSize=5`);
    const parsed = JSON.parse(r1.body);
    const items = parsed.items ?? parsed.data ?? [];
    const bytes = Buffer.byteLength(r1.body, 'utf8');
    log('1) Lista (payload completo):', Array.isArray(items) ? items.length : 0, 'items |', bytes, 'bytes');
    if (Array.isArray(items)) {
      logJson(L, '   [REST] users (siempre todos los campos):', items, 5);
    } else {
      log('⚠️  Respuesta inesperada');
      allOk = false;
    }
  } catch (e) {
    log('1) Lista: ⚠️', e.message);
    allOk = false;
  }

  // 2) Lista página 1 (total, totalPages si el backend los devuelve)
  try {
    const r2 = await get(`${base}/users?page=1&pageSize=5`);
    const parsed = JSON.parse(r2.body);
    const items = parsed.items ?? parsed.data ?? [];
    const total = parsed.total ?? items.length;
    log('2) Lista page 1: total', total, '| items', items.length);
    logJson(L, '   [REST] items (primeros 2):', items, 2);
  } catch (e) {
    log('2) Lista page 1: ⚠️', e.message);
    allOk = false;
  }

  // 3) Lista + detalle = 2 peticiones (GraphQL lo hace en 1)
  try {
    const list = await get(`${base}/users?page=1&pageSize=3`);
    const listData = JSON.parse(list.body);
    const items = listData.items ?? listData.data ?? [];
    const firstId = items[0]?.id;
    if (!firstId) {
      log('3) Lista + detalle: (no hay usuarios)');
    } else {
      const one = await get(`${base}/users/${firstId}`);
      const oneData = JSON.parse(one.body);
      const b1 = Buffer.byteLength(list.body, 'utf8');
      const b2 = Buffer.byteLength(one.body, 'utf8');
      log('3) Lista + detalle: 2 peticiones |', b1 + b2, 'bytes (GraphQL: 1 petición)');
      logJson(L, '   [REST] lista:', items);
      logJson(L, '   [REST] detalle user:', oneData);
    }
  } catch (e) {
    log('3) Lista + detalle: ⚠️', e.message);
    allOk = false;
  }

  // 4) Paginación page 2
  try {
    const r4 = await get(`${base}/users?page=2&pageSize=2`);
    const parsed = JSON.parse(r4.body);
    const items = parsed.items ?? parsed.data ?? [];
    const total = parsed.total ?? 0;
    log('4) Paginación page 2: pageSize 2 | total', total);
    logJson(L, '   [REST] page 2 items:', items);
  } catch (e) {
    log('4) Paginación: ⚠️', e.message);
    allOk = false;
  }

  // 5) User por ID
  try {
    const list = await get(`${base}/users?page=1&pageSize=1`);
    const firstId = (JSON.parse(list.body).items ?? JSON.parse(list.body).data ?? [])[0]?.id;
    if (firstId) {
      const one = await get(`${base}/users/${firstId}`);
      const oneData = JSON.parse(one.body);
      log('5) User por ID: GET /users/' + firstId.slice(0, 8) + '...');
      logJson(L, '   [REST] user:', oneData);
    } else {
      log('5) User por ID: (no hay usuarios)');
    }
  } catch (e) {
    log('5) User por ID: ⚠️', e.message);
    allOk = false;
  }

  // 6) Lista 10 (para ver id/role; REST devuelve todo)
  try {
    const r6 = await get(`${base}/users?page=1&pageSize=10`);
    const parsed = JSON.parse(r6.body);
    const items = parsed.items ?? parsed.data ?? [];
    const bytes = Buffer.byteLength(r6.body, 'utf8');
    log('6) Lista 10 usuarios: ', items.length, 'items |', bytes, 'bytes (incluye todos los campos)');
    const idRole = items.map((u) => ({ id: u.id, role: u.role }));
    logJson(L, '   [REST] id+role (extraídos del payload completo):', idRole, 5);
  } catch (e) {
    log('6) Lista 10: ⚠️', e.message);
    allOk = false;
  }

  if (allOk) log('✅ REST: mismas pruebas que GraphQL (siempre payload completo, más peticiones)\n');
  if (collect) return L.out;
}

async function testGraphQL(port, opts = {}) {
  const collect = !!opts.collect;
  const L = makeLogger(collect);
  const log = L.log;

  log(`\n--- GraphQL (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 80) + '...');
  } catch (e) {
    log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    if (collect) return L.out;
    return;
  }

  const base = `http://localhost:${port}/graphql`;
  let allOk = true;

  // 1) Solo id+email
  try {
    const minimal = await post(base, {
      query: 'query { users(page: 1, pageSize: 5) { items { id email } total page pageSize } }',
    });
    const parsed = JSON.parse(minimal.body);
    if (parsed.errors) {
      log('⚠️  Query "solo id+email":', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(minimal.body, 'utf8');
      log('1) Solo id+email:     ', u?.items?.length ?? 0, 'items |', bytes, 'bytes');
      logJson(L, '   [GraphQL] users { id, email }:', u?.items ?? [], 5);
    }
  } catch (e) {
    log('⚠️  Query minimal:', e.message);
    allOk = false;
  }

  // 2) Campos completos
  try {
    const full = await post(base, {
      query: `query {
        users(page: 1, pageSize: 5) {
          items { id email firstName lastName name role isActive }
          total totalPages page pageSize
        }
      }`,
    });
    const parsed = JSON.parse(full.body);
    if (parsed.errors) {
      log('⚠️  Query "campos completos":', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(full.body, 'utf8');
      log('2) Campos completos:  ', u?.items?.length ?? 0, 'items |', bytes, 'bytes');
      logJson(L, '   [GraphQL] users (todos los campos):', u?.items ?? [], 2);
      log('   total:', u?.total, '| totalPages:', u?.totalPages, '| page:', u?.page, '| pageSize:', u?.pageSize, '\n');
    }
  } catch (e) {
    log('⚠️  Query full:', e.message);
    allOk = false;
  }

  // 3) Lista + detalle en 1 petición
  try {
    const listRes = await post(base, {
      query: '{ users(page: 1, pageSize: 3) { items { id } total } }',
    });
    const listData = JSON.parse(listRes.body);
    const firstId = listData.data?.users?.items?.[0]?.id;
    if (!firstId) {
      log('3) Lista + detalle:   (no hay usuarios para probar)');
    } else {
      const batch = await post(base, {
        query: `query ($id: String!) {
          list: users(page: 1, pageSize: 3) { items { id email } total }
          detail: user(id: $id) { id email firstName lastName role isActive }
        }`,
        variables: { id: firstId },
      });
      const batchData = JSON.parse(batch.body);
      if (batchData.errors) {
        log('3) Lista + detalle:   ⚠️', batchData.errors[0].message);
        allOk = false;
      } else {
        const bytes = Buffer.byteLength(batch.body, 'utf8');
        log('3) Lista + detalle:   1 petición |', bytes, 'bytes (REST haría 2 peticiones)');
        logJson(L, '   [GraphQL] list (items):', batchData.data?.list?.items ?? []);
        logJson(L, '   [GraphQL] detail (user):', batchData.data?.detail ?? null);
      }
    }
  } catch (e) {
    log('3) Lista + detalle:   ⚠️', e.message);
    allOk = false;
  }

  // 4) Paginación
  try {
    const page2 = await post(base, {
      query: `query {
        users(page: 2, pageSize: 2) {
          items { id email }
          total totalPages page pageSize
        }
      }`,
    });
    const parsed = JSON.parse(page2.body);
    if (parsed.errors) {
      log('4) Paginación:        ⚠️', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      log('4) Paginación:        page', u?.page, '| pageSize', u?.pageSize, '| total', u?.total, '| totalPages', u?.totalPages);
      logJson(L, '   [GraphQL] page 2 items:', u?.items ?? []);
    }
  } catch (e) {
    log('4) Paginación:        ⚠️', e.message);
    allOk = false;
  }

  // 5) User por ID
  try {
    const listForId = await post(base, { query: '{ users(page: 1, pageSize: 1) { items { id } } }' });
    const firstId = JSON.parse(listForId.body).data?.users?.items?.[0]?.id;
    if (firstId) {
      const one = await post(base, {
        query: `query ($id: String!) {
          user(id: $id) { id email firstName lastName name role isActive }
        }`,
        variables: { id: firstId },
      });
      const oneData = JSON.parse(one.body);
      if (oneData.errors) {
        log('5) User por ID:       ⚠️', oneData.errors[0].message);
        allOk = false;
      } else {
        log('5) User por ID:       user(id: "' + firstId.slice(0, 8) + '...")');
        logJson(L, '   [GraphQL] user:', oneData.data?.user);
      }
    } else {
      log('5) User por ID:       (no hay usuarios)');
    }
  } catch (e) {
    log('5) User por ID:       ⚠️', e.message);
    allOk = false;
  }

  // 6) Solo id+role
  try {
    const roles = await post(base, {
      query: 'query { users(page: 1, pageSize: 10) { items { id role } total } }',
    });
    const parsed = JSON.parse(roles.body);
    if (parsed.errors) {
      log('6) Solo id+role:      ⚠️', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(roles.body, 'utf8');
      log('6) Solo id+role:     ', u?.items?.length ?? 0, 'items |', bytes, 'bytes');
      logJson(L, '   [GraphQL] users { id, role }:', u?.items ?? [], 5);
    }
  } catch (e) {
    log('6) Solo id+role:      ⚠️', e.message);
    allOk = false;
  }

  if (allOk) log('✅ GraphQL: queries complejas OK (logs de JSON arriba)\n');
  if (collect) return L.out;
}

function printCommands() {
  console.log(`
Comandos manuales (con la API levantada):

REST (puerto 3021):
  Invoke-WebRequest -Uri "http://localhost:3021/api/v1/health/live" -UseBasicParsing
  Invoke-WebRequest -Uri "http://localhost:3021/api/v1/users?page=1&pageSize=5" -UseBasicParsing

GraphQL (puerto 3022):
  Invoke-WebRequest -Uri "http://localhost:3022/api/v1/health/live" -UseBasicParsing
  # POST /graphql: usar Postman o este script (pnpm api:test:curl:graphql)
`);
}

async function main() {
  const mode = process.argv[2];
  if (mode === 'rest') {
    await testRest(REST_PORT);
  } else if (mode === 'graphql') {
    await testGraphQL(GRAPHQL_PORT);
  } else if (mode === 'all') {
    console.log('Ejecutando pruebas REST y GraphQL en paralelo...\n');
    const [restOut, graphqlOut] = await Promise.all([
      testRest(REST_PORT, { collect: true }),
      testGraphQL(GRAPHQL_PORT, { collect: true }),
    ]);
    const restLines = Array.isArray(restOut) ? restOut : [];
    const graphqlLines = Array.isArray(graphqlOut) ? graphqlOut : [];
    console.log(restLines.join('\n'));
    console.log(graphqlLines.join('\n'));
    console.log('--- Fin (REST puerto', REST_PORT, '| GraphQL puerto', GRAPHQL_PORT, ') ---');
  } else {
    printCommands();
    console.log('Ejecutar: pnpm api:test:curl:rest | pnpm api:test:curl:graphql | pnpm api:test:curl:all');
  }
}

main();
