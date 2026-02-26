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

/** Mide tiempo de una promesa y devuelve { result, ms } */
async function measure(fn) {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}

/** Categorías para comparativa: simple, complejo, muy complejo */
const SIMPLE = 'simple';
const COMPLEX = 'complejo';
const VERY_COMPLEX = 'muy complejo';

function printMetricsTable(restMetrics, graphqlMetrics) {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  MÉTRICAS: REST vs GraphQL (tiempos en ms, tamaño en bytes)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const byCategory = (m) => {
    const o = { [SIMPLE]: [], [COMPLEX]: [], [VERY_COMPLEX]: [] };
    (m || []).forEach((r) => (o[r.category] = o[r.category] || []).push(r));
    return o;
  };
  const restByCat = byCategory(restMetrics);
  const gqlByCat = byCategory(graphqlMetrics);

  const sum = (arr, key) => (arr || []).reduce((a, r) => a + (r[key] ?? 0), 0);

  const categories = [
    [SIMPLE, 'Consultas simples (lista mínima, user por ID, id+role)'],
    [COMPLEX, 'Consultas complejas (lista completa, paginación)'],
    [VERY_COMPLEX, 'Consulta muy compleja (lista + detalle en 1 o 2 peticiones)'],
  ];

  categories.forEach(([cat, label]) => {
    console.log(`  ${label}`);
    console.log('  ' + '-'.repeat(55));
    const restItems = restByCat[cat] || [];
    const gqlItems = gqlByCat[cat] || [];
    const restMs = sum(restItems, 'ms');
    const gqlMs = sum(gqlItems, 'ms');
    const restBytes = sum(restItems, 'bytes');
    const gqlBytes = sum(gqlItems, 'bytes');
    const restReqs = sum(restItems, 'requests') || (restItems.length > 0 ? restItems.length : 0);
    const gqlReqs = sum(gqlItems, 'requests') || (gqlItems.length > 0 ? gqlItems.length : 0);
    console.log(`    REST:    ${restMs} ms  |  ${restBytes} bytes  |  ${restReqs} petición(es)`);
    console.log(`    GraphQL: ${gqlMs} ms  |  ${gqlBytes} bytes  |  ${gqlReqs} petición(es)`);
    if (restMs > 0 && gqlMs > 0) {
      const diff = restMs - gqlMs;
      const winner = diff > 0 ? 'GraphQL' : 'REST';
      console.log(`    → ${winner} más rápido por ${Math.abs(diff)} ms en esta categoría`);
    }
    console.log('');
  });

  const totalRestMs = sum(restMetrics || [], 'ms');
  const totalGqlMs = sum(graphqlMetrics || [], 'ms');
  const totalRestBytes = sum(restMetrics || [], 'bytes');
  const totalGqlBytes = sum(graphqlMetrics || [], 'bytes');
  console.log('  TOTAL (todas las pruebas)');
  console.log('  ' + '-'.repeat(55));
  console.log(`    REST:    ${totalRestMs} ms  |  ${totalRestBytes} bytes`);
  console.log(`    GraphQL: ${totalGqlMs} ms  |  ${totalGqlBytes} bytes`);
  const diffMs = totalRestMs - totalGqlMs;
  const winner = diffMs > 0 ? 'GraphQL' : diffMs < 0 ? 'REST' : 'Empate';
  console.log(`    → Más rápido en total: ${winner} (${Math.abs(diffMs)} ms de diferencia)`);
  console.log('');

  // Desglose por prueba (1-6)
  console.log('  DESGLOSE POR PRUEBA (ms | bytes | peticiones)');
  console.log('  ' + '-'.repeat(55));
  const maxN = Math.max((restMetrics || []).length, (graphqlMetrics || []).length);
  for (let i = 0; i < maxN; i++) {
    const r = (restMetrics || [])[i];
    const g = (graphqlMetrics || [])[i];
    const rMs = r?.ms ?? '-';
    const gMs = g?.ms ?? '-';
    const rBytes = r?.bytes ?? '-';
    const gBytes = g?.bytes ?? '-';
    const rReq = r?.requests ?? '-';
    const gReq = g?.requests ?? '-';
    const name = (r?.name || g?.name || `Prueba ${i + 1}`).slice(0, 22).padEnd(22);
    console.log(`    ${name}  REST: ${String(rMs).padStart(5)} ms  ${String(rBytes).padStart(5)} B  ${rReq} req  |  GQL: ${String(gMs).padStart(5)} ms  ${String(gBytes).padStart(5)} B  ${gReq} req`);
  }
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

async function testRest(port, opts = {}) {
  const collect = !!opts.collect;
  const L = makeLogger(collect);
  const log = L.log;
  const metrics = [];

  log(`\n--- REST (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 80) + '...');
  } catch (e) {
    log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    if (collect) return { out: L.out, metrics: [] };
    return;
  }

  const base = `http://localhost:${port}/api/v1`;
  let allOk = true;

  // 1) Lista - simple
  try {
    const { result: r1, ms } = await measure(() => get(`${base}/users?page=1&pageSize=5`));
    const parsed = JSON.parse(r1.body);
    const items = parsed.items ?? parsed.data ?? [];
    const bytes = Buffer.byteLength(r1.body, 'utf8');
    metrics.push({ name: '1) Lista completa', category: SIMPLE, ms, bytes, requests: 1 });
    log('1) Lista (payload completo):', Array.isArray(items) ? items.length : 0, 'items |', bytes, 'bytes |', ms, 'ms');
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

  // 2) Lista page 1 - complejo
  try {
    const { result: r2, ms } = await measure(() => get(`${base}/users?page=1&pageSize=5`));
    const parsed = JSON.parse(r2.body);
    const items = parsed.items ?? parsed.data ?? [];
    const total = parsed.total ?? items.length;
    const bytes = Buffer.byteLength(r2.body, 'utf8');
    metrics.push({ name: '2) Lista page 1', category: COMPLEX, ms, bytes, requests: 1 });
    log('2) Lista page 1: total', total, '| items', items.length, '|', bytes, 'bytes |', ms, 'ms');
    logJson(L, '   [REST] items (primeros 2):', items, 2);
  } catch (e) {
    log('2) Lista page 1: ⚠️', e.message);
    allOk = false;
  }

  // 3) Lista + detalle - muy complejo (2 peticiones)
  try {
    const { result: listResult, ms: ms1 } = await measure(() => get(`${base}/users?page=1&pageSize=3`));
    const listData = JSON.parse(listResult.body);
    const items = listData.items ?? listData.data ?? [];
    const firstId = items[0]?.id;
    if (!firstId) {
      log('3) Lista + detalle: (no hay usuarios)');
    } else {
      const { result: oneResult, ms: ms2 } = await measure(() => get(`${base}/users/${firstId}`));
      const oneData = JSON.parse(oneResult.body);
      const b1 = Buffer.byteLength(listResult.body, 'utf8');
      const b2 = Buffer.byteLength(oneResult.body, 'utf8');
      metrics.push({ name: '3) Lista + detalle', category: VERY_COMPLEX, ms: ms1 + ms2, bytes: b1 + b2, requests: 2 });
      log('3) Lista + detalle: 2 peticiones |', b1 + b2, 'bytes |', ms1 + ms2, 'ms (GraphQL: 1 petición)');
      logJson(L, '   [REST] lista:', items);
      logJson(L, '   [REST] detalle user:', oneData);
    }
  } catch (e) {
    log('3) Lista + detalle: ⚠️', e.message);
    allOk = false;
  }

  // 4) Paginación - complejo
  try {
    const { result: r4, ms } = await measure(() => get(`${base}/users?page=2&pageSize=2`));
    const parsed = JSON.parse(r4.body);
    const items = parsed.items ?? parsed.data ?? [];
    const total = parsed.total ?? 0;
    const bytes = Buffer.byteLength(r4.body, 'utf8');
    metrics.push({ name: '4) Paginación page 2', category: COMPLEX, ms, bytes, requests: 1 });
    log('4) Paginación page 2: pageSize 2 | total', total, '|', bytes, 'bytes |', ms, 'ms');
    logJson(L, '   [REST] page 2 items:', items);
  } catch (e) {
    log('4) Paginación: ⚠️', e.message);
    allOk = false;
  }

  // 5) User por ID - simple
  try {
    const { result: listRes, ms: msList } = await measure(() => get(`${base}/users?page=1&pageSize=1`));
    const firstId = (JSON.parse(listRes.body).items ?? JSON.parse(listRes.body).data ?? [])[0]?.id;
    if (firstId) {
      const { result: oneRes, ms: msOne } = await measure(() => get(`${base}/users/${firstId}`));
      const oneData = JSON.parse(oneRes.body);
      const bytes = Buffer.byteLength(oneRes.body, 'utf8');
      metrics.push({ name: '5) User por ID', category: SIMPLE, ms: msList + msOne, bytes, requests: 2 });
      log('5) User por ID: GET /users/' + firstId.slice(0, 8) + '... |', bytes, 'bytes |', msList + msOne, 'ms');
      logJson(L, '   [REST] user:', oneData);
    } else {
      log('5) User por ID: (no hay usuarios)');
    }
  } catch (e) {
    log('5) User por ID: ⚠️', e.message);
    allOk = false;
  }

  // 6) Lista 10 - simple
  try {
    const { result: r6, ms } = await measure(() => get(`${base}/users?page=1&pageSize=10`));
    const parsed = JSON.parse(r6.body);
    const items = parsed.items ?? parsed.data ?? [];
    const bytes = Buffer.byteLength(r6.body, 'utf8');
    metrics.push({ name: '6) Lista 10 (id+role)', category: SIMPLE, ms, bytes, requests: 1 });
    log('6) Lista 10 usuarios: ', items.length, 'items |', bytes, 'bytes |', ms, 'ms (incluye todos los campos)');
    const idRole = items.map((u) => ({ id: u.id, role: u.role }));
    logJson(L, '   [REST] id+role (extraídos del payload completo):', idRole, 5);
  } catch (e) {
    log('6) Lista 10: ⚠️', e.message);
    allOk = false;
  }

  if (allOk) log('✅ REST: mismas pruebas que GraphQL (siempre payload completo, más peticiones)\n');
  if (collect) return { out: L.out, metrics };
}

async function testGraphQL(port, opts = {}) {
  const collect = !!opts.collect;
  const L = makeLogger(collect);
  const log = L.log;
  const metrics = [];

  log(`\n--- GraphQL (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 80) + '...');
  } catch (e) {
    log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    if (collect) return { out: L.out, metrics: [] };
    return;
  }

  const base = `http://localhost:${port}/graphql`;
  let allOk = true;

  // 1) Solo id+email - simple
  try {
    const { result: minimal, ms } = await measure(() =>
      post(base, { query: 'query { users(page: 1, pageSize: 5) { items { id email } total page pageSize } }' })
    );
    const parsed = JSON.parse(minimal.body);
    if (parsed.errors) {
      log('⚠️  Query "solo id+email":', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(minimal.body, 'utf8');
      metrics.push({ name: '1) Solo id+email', category: SIMPLE, ms, bytes, requests: 1 });
      log('1) Solo id+email:     ', u?.items?.length ?? 0, 'items |', bytes, 'bytes |', ms, 'ms');
      logJson(L, '   [GraphQL] users { id, email }:', u?.items ?? [], 5);
    }
  } catch (e) {
    log('⚠️  Query minimal:', e.message);
    allOk = false;
  }

  // 2) Campos completos - complejo
  try {
    const { result: full, ms } = await measure(() =>
      post(base, {
        query: `query {
          users(page: 1, pageSize: 5) {
            items { id email firstName lastName name role isActive }
            total totalPages page pageSize
          }
        }`,
      })
    );
    const parsed = JSON.parse(full.body);
    if (parsed.errors) {
      log('⚠️  Query "campos completos":', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(full.body, 'utf8');
      metrics.push({ name: '2) Campos completos', category: COMPLEX, ms, bytes, requests: 1 });
      log('2) Campos completos:  ', u?.items?.length ?? 0, 'items |', bytes, 'bytes |', ms, 'ms');
      logJson(L, '   [GraphQL] users (todos los campos):', u?.items ?? [], 2);
      log('   total:', u?.total, '| totalPages:', u?.totalPages, '| page:', u?.page, '| pageSize:', u?.pageSize, '\n');
    }
  } catch (e) {
    log('⚠️  Query full:', e.message);
    allOk = false;
  }

  // 3) Lista + detalle en 1 petición - muy complejo
  try {
    const listRes = await post(base, { query: '{ users(page: 1, pageSize: 3) { items { id } total } }' });
    const listData = JSON.parse(listRes.body);
    const firstId = listData.data?.users?.items?.[0]?.id;
    if (!firstId) {
      log('3) Lista + detalle:   (no hay usuarios para probar)');
    } else {
      const { result: batch, ms } = await measure(() =>
        post(base, {
          query: `query ($id: String!) {
            list: users(page: 1, pageSize: 3) { items { id email } total }
            detail: user(id: $id) { id email firstName lastName role isActive }
          }`,
          variables: { id: firstId },
        })
      );
      const batchData = JSON.parse(batch.body);
      if (batchData.errors) {
        log('3) Lista + detalle:   ⚠️', batchData.errors[0].message);
        allOk = false;
      } else {
        const bytes = Buffer.byteLength(batch.body, 'utf8');
        metrics.push({ name: '3) Lista + detalle', category: VERY_COMPLEX, ms, bytes, requests: 1 });
        log('3) Lista + detalle:   1 petición |', bytes, 'bytes |', ms, 'ms (REST haría 2 peticiones)');
        logJson(L, '   [GraphQL] list (items):', batchData.data?.list?.items ?? []);
        logJson(L, '   [GraphQL] detail (user):', batchData.data?.detail ?? null);
      }
    }
  } catch (e) {
    log('3) Lista + detalle:   ⚠️', e.message);
    allOk = false;
  }

  // 4) Paginación - complejo
  try {
    const { result: page2, ms } = await measure(() =>
      post(base, {
        query: `query {
          users(page: 2, pageSize: 2) {
            items { id email }
            total totalPages page pageSize
          }
        }`,
      })
    );
    const parsed = JSON.parse(page2.body);
    if (parsed.errors) {
      log('4) Paginación:        ⚠️', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(page2.body, 'utf8');
      metrics.push({ name: '4) Paginación page 2', category: COMPLEX, ms, bytes, requests: 1 });
      log('4) Paginación:        page', u?.page, '| pageSize', u?.pageSize, '| total', u?.total, '| totalPages', u?.totalPages, '|', bytes, 'bytes |', ms, 'ms');
      logJson(L, '   [GraphQL] page 2 items:', u?.items ?? []);
    }
  } catch (e) {
    log('4) Paginación:        ⚠️', e.message);
    allOk = false;
  }

  // 5) User por ID - simple
  try {
    const listForId = await post(base, { query: '{ users(page: 1, pageSize: 1) { items { id } } }' });
    const firstId = JSON.parse(listForId.body).data?.users?.items?.[0]?.id;
    if (firstId) {
      const { result: one, ms } = await measure(() =>
        post(base, {
          query: `query ($id: String!) {
            user(id: $id) { id email firstName lastName name role isActive }
          }`,
          variables: { id: firstId },
        })
      );
      const oneData = JSON.parse(one.body);
      if (oneData.errors) {
        log('5) User por ID:       ⚠️', oneData.errors[0].message);
        allOk = false;
      } else {
        const bytes = Buffer.byteLength(one.body, 'utf8');
        metrics.push({ name: '5) User por ID', category: SIMPLE, ms, bytes, requests: 1 });
        log('5) User por ID:       user(id: "' + firstId.slice(0, 8) + '...") |', bytes, 'bytes |', ms, 'ms');
        logJson(L, '   [GraphQL] user:', oneData.data?.user);
      }
    } else {
      log('5) User por ID:       (no hay usuarios)');
    }
  } catch (e) {
    log('5) User por ID:       ⚠️', e.message);
    allOk = false;
  }

  // 6) Solo id+role - simple
  try {
    const { result: roles, ms } = await measure(() =>
      post(base, { query: 'query { users(page: 1, pageSize: 10) { items { id role } total } }' })
    );
    const parsed = JSON.parse(roles.body);
    if (parsed.errors) {
      log('6) Solo id+role:      ⚠️', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(roles.body, 'utf8');
      metrics.push({ name: '6) Solo id+role', category: SIMPLE, ms, bytes, requests: 1 });
      log('6) Solo id+role:     ', u?.items?.length ?? 0, 'items |', bytes, 'bytes |', ms, 'ms');
      logJson(L, '   [GraphQL] users { id, role }:', u?.items ?? [], 5);
    }
  } catch (e) {
    log('6) Solo id+role:      ⚠️', e.message);
    allOk = false;
  }

  if (allOk) log('✅ GraphQL: queries complejas OK (logs de JSON arriba)\n');
  if (collect) return { out: L.out, metrics };
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
    const [restResult, graphqlResult] = await Promise.all([
      testRest(REST_PORT, { collect: true }),
      testGraphQL(GRAPHQL_PORT, { collect: true }),
    ]);
    const restLines = restResult?.out ?? (Array.isArray(restResult) ? restResult : []);
    const graphqlLines = graphqlResult?.out ?? (Array.isArray(graphqlResult) ? graphqlResult : []);
    console.log(restLines.join('\n'));
    console.log(graphqlLines.join('\n'));
    printMetricsTable(restResult?.metrics ?? [], graphqlResult?.metrics ?? []);
    console.log('--- Fin (REST puerto', REST_PORT, '| GraphQL puerto', GRAPHQL_PORT, ') ---');
  } else {
    printCommands();
    console.log('Ejecutar: pnpm api:test:curl:rest | pnpm api:test:curl:graphql | pnpm api:test:curl:all');
  }
}

main();
