#!/usr/bin/env node
/**
 * Pruebas para API en modo GraphQL (3022 local) y REST (3021).
 * Usa http nativo de Node (funciona en Windows sin curl).
 *
 * Uso:
 *   pnpm api:test:curl:graphql   # Prueba GraphQL en 3022
 *   pnpm api:test:curl:rest      # Prueba REST en 3021
 *   pnpm api:test:curl            # Muestra comandos para ambos
 */

const http = require('http');

const GRAPHQL_PORT = 3022;
const REST_PORT = 3021;

/** Log JSON de forma legible; si hay muchos items muestra los primeros y un resumen */
function logJson(label, data, maxItems = 3) {
  if (data === undefined) return;
  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];
  const show = items.slice(0, maxItems);
  const rest = items.length - show.length;
  console.log(label);
  console.log(JSON.stringify(show.length === 1 && !isArray ? show[0] : show, null, 2));
  if (rest > 0) console.log(`   ... y ${rest} más (${items.length} en total)\n`);
  else console.log('');
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

async function testRest(port) {
  console.log(`\n--- REST (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    console.log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 80) + '...');
  } catch (e) {
    console.log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    return;
  }
  let totalBytes = 0;
  let requests = 0;
  try {
    const users = await get(`http://localhost:${port}/api/v1/users?page=1&pageSize=5`);
    requests++;
    totalBytes += Buffer.byteLength(users.body, 'utf8');
    console.log('GET /api/v1/users (lista): status', users.statusCode, '| bytes:', Buffer.byteLength(users.body, 'utf8'));
    const parsed = JSON.parse(users.body);
    const items = parsed.items ?? parsed.data ?? [];
    if (Array.isArray(items)) {
      console.log('✅ REST usuarios: lista válida, total', items.length);
      logJson('   [REST] Lista usuarios (primeros):', items, 3);
      if (items.length > 0) {
        const firstId = items[0].id;
        const one = await get(`http://localhost:${port}/api/v1/users/${firstId}`);
        requests++;
        totalBytes += Buffer.byteLength(one.body, 'utf8');
        console.log('GET /api/v1/users/:id (detalle): status', one.statusCode, '| bytes:', Buffer.byteLength(one.body, 'utf8'));
        try {
          const oneParsed = JSON.parse(one.body);
          logJson('   [REST] Usuario por ID:', oneParsed);
        } catch (_) {}
        console.log('   → REST:', requests, 'peticiones,', totalBytes, 'bytes (payload completo en cada una)\n');
      } else {
        console.log('   → REST: 1 petición,', totalBytes, 'bytes\n');
      }
    } else {
      console.log('⚠️  Respuesta:', users.body.trim().slice(0, 200));
    }
  } catch (e) {
    console.log('⚠️  REST:', e.message);
  }
}

async function testGraphQL(port) {
  console.log(`\n--- GraphQL (puerto ${port}) ---\n`);
  try {
    const health = await get(`http://localhost:${port}/api/v1/health/live`);
    console.log('GET /api/v1/health/live:', health.statusCode, health.body.trim().slice(0, 80) + '...');
  } catch (e) {
    console.log('GET /api/v1/health/live: Error –', e.message, '(¿API en marcha en', port + '?)');
    return;
  }

  const base = `http://localhost:${port}/graphql`;
  let allOk = true;

  // 1) Solo los campos que necesitas (menos bytes que REST)
  try {
    const minimal = await post(base, {
      query: 'query { users(page: 1, pageSize: 5) { items { id email } total page pageSize } }',
    });
    const parsed = JSON.parse(minimal.body);
    if (parsed.errors) {
      console.log('⚠️  Query "solo id+email":', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(minimal.body, 'utf8');
      console.log('1) Solo id+email:     ', u?.items?.length ?? 0, 'items |', bytes, 'bytes');
      logJson('   [GraphQL] users { id, email }:', u?.items ?? [], 5);
    }
  } catch (e) {
    console.log('⚠️  Query minimal:', e.message);
    allOk = false;
  }

  // 2) Campos completos (como REST pero en una query)
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
      console.log('⚠️  Query "campos completos":', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(full.body, 'utf8');
      console.log('2) Campos completos:  ', u?.items?.length ?? 0, 'items |', bytes, 'bytes');
      logJson('   [GraphQL] users (todos los campos):', u?.items ?? [], 2);
      console.log('   total:', u?.total, '| totalPages:', u?.totalPages, '| page:', u?.page, '| pageSize:', u?.pageSize, '\n');
    }
  } catch (e) {
    console.log('⚠️  Query full:', e.message);
    allOk = false;
  }

  // 3) Una sola petición: lista + detalle de un usuario (evita 2 round-trips REST)
  try {
    const listRes = await post(base, {
      query: '{ users(page: 1, pageSize: 3) { items { id } total } }',
    });
    const listData = JSON.parse(listRes.body);
    const firstId = listData.data?.users?.items?.[0]?.id;
    if (!firstId) {
      console.log('3) Lista + detalle:   (no hay usuarios para probar)');
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
        console.log('3) Lista + detalle:   ⚠️', batchData.errors[0].message);
        allOk = false;
      } else {
        const bytes = Buffer.byteLength(batch.body, 'utf8');
        console.log('3) Lista + detalle:   1 petición |', bytes, 'bytes (REST haría 2 peticiones)');
        logJson('   [GraphQL] list (items):', batchData.data?.list?.items ?? []);
        logJson('   [GraphQL] detail (user):', batchData.data?.detail ?? null);
      }
    }
  } catch (e) {
    console.log('3) Lista + detalle:   ⚠️', e.message);
    allOk = false;
  }

  // 4) Paginación y metadatos
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
      console.log('4) Paginación:        ⚠️', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      console.log('4) Paginación:        page', u?.page, '| pageSize', u?.pageSize, '| total', u?.total, '| totalPages', u?.totalPages);
      logJson('   [GraphQL] page 2 items:', u?.items ?? []);
    }
  } catch (e) {
    console.log('4) Paginación:        ⚠️', e.message);
    allOk = false;
  }

  // 5) Un solo usuario por ID (todos los campos)
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
        console.log('5) User por ID:       ⚠️', oneData.errors[0].message);
        allOk = false;
      } else {
        console.log('5) User por ID:       user(id: "' + firstId.slice(0, 8) + '...")');
        logJson('   [GraphQL] user:', oneData.data?.user);
      }
    } else {
      console.log('5) User por ID:       (no hay usuarios)');
    }
  } catch (e) {
    console.log('5) User por ID:       ⚠️', e.message);
    allOk = false;
  }

  // 6) Solo id + role (otra forma de pedir poco)
  try {
    const roles = await post(base, {
      query: 'query { users(page: 1, pageSize: 10) { items { id role } total } }',
    });
    const parsed = JSON.parse(roles.body);
    if (parsed.errors) {
      console.log('6) Solo id+role:      ⚠️', parsed.errors[0].message);
      allOk = false;
    } else {
      const u = parsed.data?.users;
      const bytes = Buffer.byteLength(roles.body, 'utf8');
      console.log('6) Solo id+role:     ', u?.items?.length ?? 0, 'items |', bytes, 'bytes');
      logJson('   [GraphQL] users { id, role }:', u?.items ?? [], 5);
    }
  } catch (e) {
    console.log('6) Solo id+role:      ⚠️', e.message);
    allOk = false;
  }

  if (allOk) {
    console.log('✅ GraphQL: queries complejas OK (logs de JSON arriba)');
  }
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
  } else {
    printCommands();
    console.log('Ejecutar: pnpm api:test:curl:rest  o  pnpm api:test:curl:graphql');
  }
}

main();
