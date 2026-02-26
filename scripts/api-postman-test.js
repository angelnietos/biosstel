#!/usr/bin/env node
/**
 * Test tipo Postman: prueba todos los endpoints de la API y lista los que fallan.
 * No requiere Python; se ejecuta con Node (pnpm api:postman-test).
 *
 * Uso: node scripts/api-postman-test.js [--curl]
 *  --curl  Genera scripts/api_postman_curls.sh con los curl equivalentes.
 *
 * Env: API_URL (default http://localhost:4000), API_SMOKE_USER, API_SMOKE_PASSWORD.
 */

const fs = require('fs');
const path = require('path');

const BASE = process.env.API_URL || 'http://localhost:4000';
const API = `${BASE}/api/v1`;
const HEALTH = `${BASE}/api`;
const USER = process.env.API_SMOKE_USER || 'admin@biosstel.com';
const PASS = process.env.API_SMOKE_PASSWORD || 'admin123';

const results = { ok: 0, fail: 0, skipped: 0 };
const failedEndpoints = [];
const ids = {};
const curlCommands = [];
const emitCurl = process.argv.includes('--curl');

async function request(method, url, token = null, body = null) {
  if (emitCurl) recordCurl(method, url, token, body);
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  return { status: res.status, ok: res.ok, body: await res.text() };
}

function recordCurl(method, url, token, body) {
  let line = `curl -s -w "\\n%{http_code}" -X ${method} -H 'Content-Type: application/json'`;
  if (token) line += ` -H 'Authorization: Bearer ${token}'`;
  line += ` '${url}'`;
  if (body && method !== 'GET') line += ` -d '${JSON.stringify(body).replace(/'/g, "'\\''")}'`;
  curlCommands.push(line);
}

function pass(label) {
  results.ok++;
  console.log(`  [OK]   ${label}`);
}

function fail(label, status, body = '') {
  results.fail++;
  const preview = body.slice(0, 120).replace(/\n/g, ' ');
  failedEndpoints.push({ label, status, preview });
  console.log(`  [FAIL] ${label} -> ${status} ${preview ? `(${preview}...)` : ''}`);
}

function skip(label, reason) {
  results.skipped++;
  console.log(`  [SKIP] ${label} (${reason})`);
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

async function run() {
  console.log(`\nAPI Postman-style test (todos los endpoints) -> ${API}\n`);

  let token = null;

  const loginBody = { email: USER, password: PASS };
  const loginRes = await request('POST', `${API}/auth/login`, null, loginBody);

  if (!loginRes.ok) {
    fail('POST /auth/login', loginRes.status, loginRes.body);
    console.log('\nSin token. No se pueden probar endpoints protegidos.\n');
    printSummary();
    process.exit(1);
  }
  if (loginRes.status !== 201) {
    fail('POST /auth/login (expected 201)', loginRes.status, loginRes.body);
  }
  const loginData = parseJson(loginRes.body);
  token = loginData?.access_token || loginData?.token;
  if (loginData?.user?.id) ids.userId = loginData.user.id;
  if (token) pass('POST /auth/login');
  else fail('POST /auth/login', loginRes.status, 'no access_token');

  for (const p of ['/health', '/health/live', '/health/ready']) {
    let r = await request('GET', `${API}${p}`, token);
    if (r.status === 404) r = await request('GET', `${HEALTH}${p}`, token);
    if (r.ok) pass(`GET ${p}`);
    else fail(`GET ${p}`, r.status, r.body);
  }

  const meRes = await request('GET', `${API}/auth/me`, token);
  if (meRes.ok) {
    pass('GET /auth/me');
    const me = parseJson(meRes.body);
    ids.userId = me?.id || me?.userId || ids.userId;
  } else fail('GET /auth/me', meRes.status, meRes.body);

  const forgotRes = await request('POST', `${API}/auth/forgot-password`, null, { email: USER });
  if (forgotRes.ok) pass('POST /auth/forgot-password');
  else fail('POST /auth/forgot-password', forgotRes.status, forgotRes.body);

  const usersRes = await request('GET', `${API}/users?page=1&pageSize=5`, token);
  if (usersRes.ok) {
    pass('GET /users');
    const d = parseJson(usersRes.body);
    const list = d?.items || (Array.isArray(d) ? d : []);
    if (list.length && !ids.userId) ids.userId = list[0].id;
  } else fail('GET /users', usersRes.status, usersRes.body);

  if (ids.userId) {
    const r = await request('GET', `${API}/users/${ids.userId}`, token);
    if (r.ok) pass('GET /users/:id');
    else fail('GET /users/:id', r.status, r.body);
  } else skip('GET /users/:id', 'no userId');

  const createUserBody = {
    email: `smoke-${Date.now()}@test.local`,
    password: 'SmokePass123',
    firstName: 'Smoke',
    lastName: 'Test',
  };
  const createUserRes = await request('POST', `${API}/users`, token, createUserBody);
  if (createUserRes.ok) {
    pass('POST /users');
    const u = parseJson(createUserRes.body);
    ids.createdUserId = u?.id;
  } else fail('POST /users', createUserRes.status, createUserRes.body);

  if (ids.createdUserId) {
    const r = await request('PUT', `${API}/users/${ids.createdUserId}`, token, { firstName: 'SmokeUpdated' });
    if (r.ok) pass('PUT /users/:id');
    else fail('PUT /users/:id', r.status, r.body);
  }

  const clientsRes = await request('GET', `${API}/clients`, token);
  if (clientsRes.ok) pass('GET /clients');
  else fail('GET /clients', clientsRes.status, clientsRes.body);

  const createClientBody = {
    name: 'Smoke Client',
    email: `smoke-${Date.now()}@client.test`,
    phone: '+34600000000',
  };
  const createClientRes = await request('POST', `${API}/clients`, token, createClientBody);
  if (createClientRes.ok) pass('POST /clients');
  else fail('POST /clients', createClientRes.status, createClientRes.body);

  const homeRes = await request('GET', `${API}/dashboard/home`, token);
  if (homeRes.ok) pass('GET /dashboard/home');
  else fail('GET /dashboard/home', homeRes.status, homeRes.body);

  const termRes = await request('GET', `${API}/dashboard/terminal-objectives`, token);
  if (termRes.ok) {
    pass('GET /dashboard/terminal-objectives');
    const t = parseJson(termRes.body);
    ids.terminalObjectiveId = t?.header?.id || t?.inactiveObjective?.id;
  } else fail('GET /dashboard/terminal-objectives', termRes.status, termRes.body);

  if (ids.terminalObjectiveId) {
    const r = await request('PATCH', `${API}/dashboard/terminal-objectives/${ids.terminalObjectiveId}`, token, { isActive: true });
    if (r.ok) pass('PATCH /dashboard/terminal-objectives/:id');
    else fail('PATCH /dashboard/terminal-objectives/:id', r.status, r.body);
  } else skip('PATCH /dashboard/terminal-objectives/:id', 'no objective id');

  const empresaRes = await request('GET', `${API}/empresa`, token);
  if (empresaRes.ok) pass('GET /empresa');
  else fail('GET /empresa', empresaRes.status, empresaRes.body);

  const deptRes = await request('GET', `${API}/empresa/departments`, token);
  if (deptRes.ok) {
    pass('GET /empresa/departments');
    const list = parseJson(deptRes.body);
    if (Array.isArray(list) && list.length) ids.departmentId = list[0].id;
  } else fail('GET /empresa/departments', deptRes.status, deptRes.body);

  const createDeptRes = await request('POST', `${API}/empresa/departments`, token, { name: 'Smoke Dept', code: 'SMK-1' });
  if (createDeptRes.ok) {
    pass('POST /empresa/departments');
    const d = parseJson(createDeptRes.body);
    if (d?.id) ids.createdDepartmentId = d.id;
  } else fail('POST /empresa/departments', createDeptRes.status, createDeptRes.body);

  if (ids.departmentId) {
    const r = await request('GET', `${API}/empresa/departments/${ids.departmentId}`, token);
    if (r.ok) pass('GET /empresa/departments/:id');
    else fail('GET /empresa/departments/:id', r.status, r.body);
  }
  if (ids.createdDepartmentId) {
    const r = await request('PUT', `${API}/empresa/departments/${ids.createdDepartmentId}`, token, { name: 'Smoke Dept Updated' });
    if (r.ok) pass('PUT /empresa/departments/:id');
    else fail('PUT /empresa/departments/:id', r.status, r.body);
  }

  const wcRes = await request('GET', `${API}/empresa/work-centers`, token);
  if (wcRes.ok) {
    pass('GET /empresa/work-centers');
    const list = parseJson(wcRes.body);
    if (Array.isArray(list) && list.length) ids.workCenterId = list[0].id;
  } else fail('GET /empresa/work-centers', wcRes.status, wcRes.body);

  const createWcBody = {
    name: 'Smoke Work Center',
    address: 'C/ Smoke 1',
    departmentId: ids.departmentId || 'string',
  };
  const createWcRes = await request('POST', `${API}/empresa/work-centers`, token, createWcBody);
  if (createWcRes.ok) {
    pass('POST /empresa/work-centers');
    const w = parseJson(createWcRes.body);
    if (w?.id) ids.createdWorkCenterId = w.id;
  } else fail('POST /empresa/work-centers', createWcRes.status, createWcRes.body);

  if (ids.workCenterId) {
    const r = await request('GET', `${API}/empresa/work-centers/${ids.workCenterId}`, token);
    if (r.ok) pass('GET /empresa/work-centers/:id');
    else fail('GET /empresa/work-centers/:id', r.status, r.body);
  }
  if (ids.createdWorkCenterId) {
    const r = await request('PUT', `${API}/empresa/work-centers/${ids.createdWorkCenterId}`, token, { name: 'Smoke WC Updated' });
    if (r.ok) pass('PUT /empresa/work-centers/:id');
    else fail('PUT /empresa/work-centers/:id', r.status, r.body);
  }

  const fichajesRes = await request('GET', `${API}/fichajes`, token);
  if (fichajesRes.ok) pass('GET /fichajes');
  else fail('GET /fichajes', fichajesRes.status, fichajesRes.body);

  if (ids.userId) {
    const r = await request('GET', `${API}/fichajes/user/${ids.userId}`, token);
    if (r.ok) pass('GET /fichajes/user/:userId');
    else fail('GET /fichajes/user/:userId', r.status, r.body);
  } else skip('GET /fichajes/user/:userId', 'no userId');

  if (ids.userId) {
    const r = await request('GET', `${API}/fichajes/current?userId=${encodeURIComponent(ids.userId)}`, token);
    if (r.ok) pass('GET /fichajes/current');
    else fail('GET /fichajes/current', r.status, r.body);
  } else skip('GET /fichajes/current', 'no userId');

  const clockInUserId = ids.userId || parseJson(usersRes.body)?.items?.[0]?.id;
  if (!clockInUserId) {
    skip('POST /fichajes/clock-in', 'no userId');
  } else {
    const clockInRes = await request('POST', `${API}/fichajes/clock-in`, token, { userId: String(clockInUserId) });
    if (clockInRes.ok) {
      pass('POST /fichajes/clock-in');
      const f = parseJson(clockInRes.body);
      if (f?.id) ids.fichajeId = f.id;
    } else fail('POST /fichajes/clock-in', clockInRes.status, clockInRes.body);
  }

  if (ids.fichajeId) {
    const pauseRes = await request('POST', `${API}/fichajes/${ids.fichajeId}/pause`, token, { reason: 'Smoke test' });
    if (pauseRes.ok) pass('POST /fichajes/:fichajeId/pause');
    else fail('POST /fichajes/:fichajeId/pause', pauseRes.status, pauseRes.body);
    const resumeRes = await request('POST', `${API}/fichajes/${ids.fichajeId}/resume`, token);
    if (resumeRes.ok) pass('POST /fichajes/:fichajeId/resume');
    else fail('POST /fichajes/:fichajeId/resume', resumeRes.status, resumeRes.body);
    const r = await request('POST', `${API}/fichajes/${ids.fichajeId}/clock-out`, token);
    if (r.ok) pass('POST /fichajes/:fichajeId/clock-out');
    else fail('POST /fichajes/:fichajeId/clock-out', r.status, r.body);
  } else {
    skip('POST /fichajes/:fichajeId/pause', 'no fichaje id');
    skip('POST /fichajes/:fichajeId/resume', 'no fichaje id');
    skip('POST /fichajes/:fichajeId/clock-out', 'no fichaje id');
  }

  const calRes = await request('GET', `${API}/fichajes/calendars`, token);
  if (calRes.ok) pass('GET /fichajes/calendars');
  else fail('GET /fichajes/calendars', calRes.status, calRes.body);
  const createCalRes = await request('POST', `${API}/fichajes/calendars`, token, { name: 'Smoke Calendar', description: 'Smoke' });
  if (createCalRes.ok) pass('POST /fichajes/calendars');
  else fail('POST /fichajes/calendars', createCalRes.status, createCalRes.body);

  const schedRes = await request('GET', `${API}/fichajes/schedules`, token);
  if (schedRes.ok) pass('GET /fichajes/schedules');
  else fail('GET /fichajes/schedules', schedRes.status, schedRes.body);
  const createSchedRes = await request('POST', `${API}/fichajes/schedules`, token, { name: 'Smoke Schedule', hoursPerWeek: 40 });
  if (createSchedRes.ok) pass('POST /fichajes/schedules');
  else fail('POST /fichajes/schedules', createSchedRes.status, createSchedRes.body);

  const permRes = await request('GET', `${API}/fichajes/permission-types`, token);
  if (permRes.ok) pass('GET /fichajes/permission-types');
  else fail('GET /fichajes/permission-types', permRes.status, permRes.body);
  const createPermRes = await request('POST', `${API}/fichajes/permission-types`, token, { name: 'Smoke Permiso', isPaid: true });
  if (createPermRes.ok) pass('POST /fichajes/permission-types');
  else fail('POST /fichajes/permission-types', createPermRes.status, createPermRes.body);

  if (ids.userId) {
    const tasksRes = await request('GET', `${API}/tasks/user/${ids.userId}`, token);
    if (tasksRes.ok) {
      pass('GET /tasks/user/:userId');
      const list = parseJson(tasksRes.body);
      if (Array.isArray(list) && list.length) ids.taskId = list[0].id;
    } else fail('GET /tasks/user/:userId', tasksRes.status, tasksRes.body);
  } else skip('GET /tasks/user/:userId', 'no userId');

  const createTaskRes = await request('POST', `${API}/tasks`, token, {
    userId: ids.userId,
    title: 'Smoke task',
    description: 'Smoke test',
  });
  if (createTaskRes.ok) {
    pass('POST /tasks');
    const t = parseJson(createTaskRes.body);
    if (t?.id) ids.createdTaskId = t.id;
  } else fail('POST /tasks', createTaskRes.status, createTaskRes.body);

  if (ids.taskId) {
    const r = await request('GET', `${API}/tasks/${ids.taskId}`, token);
    if (r.ok) pass('GET /tasks/:taskId');
    else fail('GET /tasks/:taskId', r.status, r.body);
  } else skip('GET /tasks/:taskId', 'no task id');
  if (ids.createdTaskId) {
    const r = await request('PATCH', `${API}/tasks/${ids.createdTaskId}`, token, { completed: true });
    if (r.ok) pass('PATCH /tasks/:taskId');
    else fail('PATCH /tasks/:taskId', r.status, r.body);
    const del = await request('DELETE', `${API}/tasks/${ids.createdTaskId}`, token);
    if (del.ok) pass('DELETE /tasks/:taskId');
    else fail('DELETE /tasks/:taskId', del.status, del.body);
  }

  const prodRes = await request('GET', `${API}/productos`, token);
  if (prodRes.ok) {
    pass('GET /productos');
    const data = parseJson(prodRes.body);
    const list = data?.products || (Array.isArray(data) ? data : []);
    if (list.length) ids.productId = list[0].id;
  } else fail('GET /productos', prodRes.status, prodRes.body);

  const createProdRes = await request('POST', `${API}/productos`, token, {
    codigo: `SMK-${Date.now()}`,
    nombre: 'Smoke Product',
    familia: 'Smoke',
    estado: 'Activo',
  });
  if (createProdRes.ok) {
    pass('POST /productos');
    const p = parseJson(createProdRes.body);
    if (p?.id) ids.createdProductId = p.id;
  } else fail('POST /productos', createProdRes.status, createProdRes.body);

  if (ids.productId) {
    const r = await request('GET', `${API}/productos/${ids.productId}`, token);
    if (r.ok) pass('GET /productos/:id');
    else fail('GET /productos/:id', r.status, r.body);
  } else skip('GET /productos/:id', 'no product id');
  if (ids.createdProductId) {
    const r = await request('PATCH', `${API}/productos/${ids.createdProductId}`, token, { nombre: 'Smoke Product Updated' });
    if (r.ok) pass('PATCH /productos/:id');
    else fail('PATCH /productos/:id', r.status, r.body);
  }

  const invRes = await request('GET', `${API}/inventory`, token);
  if (invRes.ok) {
    pass('GET /inventory');
    const data = parseJson(invRes.body);
    const list = data?.items || (Array.isArray(data) ? data : []);
    if (list.length) ids.inventoryId = list[0].id;
  } else fail('GET /inventory', invRes.status, invRes.body);

  const createInvRes = await request('POST', `${API}/inventory`, token, {
    codigo: `INV-SMK-${Date.now()}`,
    nombre: 'Smoke Item',
    cantidad: 10,
    ubicacion: 'Smoke Shelf',
  });
  if (createInvRes.ok) {
    pass('POST /inventory');
    const i = parseJson(createInvRes.body);
    if (i?.id) ids.createdInventoryId = i.id;
  } else fail('POST /inventory', createInvRes.status, createInvRes.body);

  if (ids.inventoryId) {
    const r = await request('GET', `${API}/inventory/${ids.inventoryId}`, token);
    if (r.ok) pass('GET /inventory/:id');
    else fail('GET /inventory/:id', r.status, r.body);
  } else skip('GET /inventory/:id', 'no inventory id');
  if (ids.createdInventoryId) {
    const r = await request('PATCH', `${API}/inventory/${ids.createdInventoryId}`, token, { cantidad: 20 });
    if (r.ok) pass('PATCH /inventory/:id');
    else fail('PATCH /inventory/:id', r.status, r.body);
  }

  const reportRes = await request('GET', `${API}/reports/summary`, token);
  if (reportRes.ok) pass('GET /reports/summary');
  else fail('GET /reports/summary', reportRes.status, reportRes.body);

  const alertasRes = await request('GET', `${API}/alertas`, token);
  if (alertasRes.ok) pass('GET /alertas');
  else fail('GET /alertas', alertasRes.status, alertasRes.body);

  const opRes = await request('GET', `${API}/operaciones`, token);
  if (opRes.ok) pass('GET /operaciones');
  else fail('GET /operaciones', opRes.status, opRes.body);

  if (ids.userId) {
    const docsRes = await request('GET', `${API}/users/${ids.userId}/documents`, token);
    if (docsRes.ok) pass('GET /users/:userId/documents');
    else fail('GET /users/:userId/documents', docsRes.status, docsRes.body);

    const createDocRes = await request('POST', `${API}/users/${ids.userId}/documents`, token, {
      name: 'smoke-doc.txt',
      mimeType: 'text/plain',
      contentBase64: Buffer.from('Smoke test').toString('base64'),
    });
    if (createDocRes.ok) {
      pass('POST /users/:userId/documents');
      const d = parseJson(createDocRes.body);
      if (d?.id) ids.createdDocId = d.id;
    } else fail('POST /users/:userId/documents', createDocRes.status, createDocRes.body);

    if (ids.createdDocId) {
      const r = await request('GET', `${API}/users/${ids.userId}/documents/${ids.createdDocId}`, token);
      if (r.ok) pass('GET /users/:userId/documents/:docId');
      else fail('GET /users/:userId/documents/:docId', r.status, r.body);
      const del = await request('DELETE', `${API}/users/${ids.userId}/documents/${ids.createdDocId}`, token);
      if (del.ok) pass('DELETE /users/:userId/documents/:docId');
      else fail('DELETE /users/:userId/documents/:docId', del.status, del.body);
    }
  } else {
    skip('GET /users/:userId/documents', 'no userId');
    skip('POST /users/:userId/documents', 'no userId');
  }

  printSummary();

  if (emitCurl && curlCommands.length) {
    const outPath = path.join(__dirname, 'api_postman_curls.sh');
    const content = '#!/bin/sh\n# Curl equivalentes a Postman (generado por api-postman-test.js)\n\n' + curlCommands.join('\n\n') + '\n';
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`\nComandos curl guardados en: ${outPath}`);
  }

  process.exit(results.fail > 0 ? 1 : 0);
}

function printSummary() {
  console.log('\n--- Resumen ---');
  console.log(`OK: ${results.ok} | FAIL: ${results.fail} | SKIP: ${results.skipped}`);
  if (failedEndpoints.length) {
    console.log('\n--- Endpoints que NO están funcionando (revisar en Postman) ---');
    failedEndpoints.forEach(({ label, status, preview }) => {
      console.log(`  • ${label} -> ${status}`);
      if (preview) console.log(`    ${preview.slice(0, 100)}`);
    });
  }
}

run().catch((err) => {
  console.error('Script error:', err.message);
  process.exit(1);
});
