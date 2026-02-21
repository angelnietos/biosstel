#!/usr/bin/env node
/**
 * Seed vía API: alimenta la base de datos llamando a los endpoints REST
 * en lugar de ejecutar SQL. Útil para probar la API con datos de ejemplo
 * y asegurar que los POST funcionan.
 *
 * Requisitos:
 *   - API levantada (pnpm dev:api o pnpm start).
 *   - Al menos el usuario admin debe existir (para login). Si la BD está
 *     vacía, ejecuta primero: pnpm db:seed  (crea admin y otros usuarios por SQL)
 *     o crea solo el admin y luego: pnpm api:seed  para el resto vía API.
 *
 * Uso: pnpm api:seed
 * Env: API_URL (default http://localhost:4000), API_SEED_USER, API_SEED_PASSWORD.
 */

const BASE = (process.env.API_URL || 'http://localhost:4000').replace(/\/$/, '');
const API = `${BASE}/api/v1`;
const USER = process.env.API_SEED_USER || process.env.API_SMOKE_USER || 'admin@biosstel.com';
const PASS = process.env.API_SEED_PASSWORD || process.env.API_SMOKE_PASSWORD || 'admin123';

async function request(method, url, token, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {}
  return { status: res.status, ok: res.ok, data, text };
}

function log(msg) {
  console.log(msg);
}

function logOk(msg) {
  console.log('  ✅', msg);
}

function logSkip(msg) {
  console.log('  ⏭️', msg);
}

function logWarn(msg) {
  console.log('  ⚠️', msg);
}

async function run() {
  console.log('\n🌱 Seed vía API ->', API);
  console.log('   Login:', USER, '\n');

  const token = null;
  const loginRes = await request('POST', `${API}/auth/login`, null, { email: USER, password: PASS });
  if (!loginRes.ok) {
    console.error('❌ No se pudo iniciar sesión. La API debe estar levantada y debe existir el usuario', USER);
    console.error('   Si la base está vacía, ejecuta primero: pnpm db:seed');
    console.error('   Luego levanta la API y ejecuta: pnpm api:seed\n');
    process.exit(1);
  }
  const accessToken = loginRes.data?.access_token || loginRes.data?.token;
  if (!accessToken) {
    console.error('❌ Login no devolvió access_token');
    process.exit(1);
  }
  logOk(`Login correcto (${USER})\n`);

  const ids = { userId: loginRes.data?.user?.id };

  // ─── Usuarios adicionales (mismos que seed SQL, si no existen) ───
  const extraUsers = [
    { email: 'coordinador@biosstel.com', password: 'coord123', firstName: 'Coordinador', lastName: 'Test' },
    { email: 'telemarketing@biosstel.com', password: 'tm123', firstName: 'Telemarketing', lastName: 'User' },
    { email: 'tienda@biosstel.com', password: 'tienda123', firstName: 'Tienda', lastName: 'User' },
    { email: 'comercial@biosstel.com', password: 'comercial123', firstName: 'Comercial', lastName: 'User' },
    { email: 'backoffice@biosstel.com', password: 'bo123', firstName: 'Backoffice', lastName: 'User' },
    { email: 'usuario@biosstel.com', password: 'user123', firstName: 'Usuario', lastName: 'Prueba' },
  ];
  log('📝 Usuarios adicionales');
  for (const u of extraUsers) {
    const r = await request('POST', `${API}/users`, accessToken, u);
    if (r.status === 201 || r.status === 200) {
      logOk(`Usuario ${u.email}`);
    } else if (r.status === 409 || (r.data?.message && r.data.message.includes('Ya existe'))) {
      logSkip(`${u.email} (ya existe)`);
    } else {
      logWarn(`${u.email} -> ${r.status} ${r.data?.message || r.text?.slice(0, 60)}`);
    }
  }

  // ─── Departamentos ───
  log('\n📁 Departamentos');
  const depts = [
    { name: 'Comercial', code: 'DEP-01' },
    { name: 'Tienda', code: 'DEP-02' },
    { name: 'Telemarketing', code: 'DEP-03' },
  ];
  let departmentIds = [];
  const listBefore = await request('GET', `${API}/empresa/departments`, accessToken);
  if (listBefore.ok && Array.isArray(listBefore.data) && listBefore.data.length) {
    departmentIds = listBefore.data.map((x) => x.id);
    logSkip(`Departamentos ya existen (${departmentIds.length})`);
  } else {
    for (const d of depts) {
      const r = await request('POST', `${API}/empresa/departments`, accessToken, d);
      if (r.status === 201 && r.data?.id) {
        departmentIds.push(r.data.id);
        logOk(`Departamento ${d.name}`);
      } else {
        logWarn(`Departamento ${d.name} -> ${r.status}`);
      }
    }
  }
  const firstDeptId = departmentIds[0];

  // ─── Centros de trabajo ───
  log('\n🏢 Centros de trabajo');
  const workCenters = [
    { name: 'Barakaldo', address: 'C/ Ejemplo 1, Barakaldo', departmentId: firstDeptId },
    { name: 'Las Arenas', address: 'C/ Ejemplo 2, Las Arenas', departmentId: firstDeptId },
    { name: 'Sede central', address: 'Av. Principal 100', departmentId: firstDeptId },
  ];
  for (const w of workCenters) {
    const r = await request('POST', `${API}/empresa/work-centers`, accessToken, {
      ...w,
      departmentId: w.departmentId || undefined,
    });
    if (r.status === 201) {
      logOk(`Centro ${w.name}`);
    } else {
      logWarn(`Centro ${w.name} -> ${r.status}`);
    }
  }

  // ─── Clientes ───
  log('\n👥 Clientes');
  const clients = [
    { name: 'Cliente A', email: 'cliente.a@example.com', phone: '+34 600 111 222' },
    { name: 'Cliente B', email: 'cliente.b@example.com', phone: '+34 600 333 444' },
    { name: 'Cliente C', email: 'cliente.c@example.com' },
  ];
  for (const c of clients) {
    const r = await request('POST', `${API}/clients`, accessToken, c);
    if (r.status === 201) {
      logOk(`Cliente ${c.name}`);
    } else {
      logWarn(`Cliente ${c.name} -> ${r.status}`);
    }
  }

  // ─── Productos ───
  log('\n📦 Productos');
  const products = [
    { codigo: 'PRD-001', nombre: 'Producto A', familia: 'Familia 1', estado: 'Activo' },
    { codigo: 'PRD-002', nombre: 'Producto B', familia: 'Familia 1', estado: 'Activo' },
    { codigo: 'PRD-003', nombre: 'Producto C', familia: 'Familia 2', estado: 'Activo' },
  ];
  for (const p of products) {
    const r = await request('POST', `${API}/productos`, accessToken, p);
    if (r.status === 201 || r.status === 200) {
      logOk(`Producto ${p.codigo}`);
    } else {
      logWarn(`Producto ${p.codigo} -> ${r.status}`);
    }
  }

  // ─── Inventario ───
  log('\n📋 Inventario');
  const inventory = [
    { codigo: 'INV-001', nombre: 'Item Almacén 1', cantidad: 100, ubicacion: 'Estantería A1' },
    { codigo: 'INV-002', nombre: 'Item Almacén 2', cantidad: 50, ubicacion: 'Estantería B2' },
    { codigo: 'INV-003', nombre: 'Item Almacén 3', cantidad: 200, ubicacion: 'Estantería C1' },
  ];
  for (const i of inventory) {
    const r = await request('POST', `${API}/inventory`, accessToken, i);
    if (r.status === 201 || r.status === 200) {
      logOk(`Item ${i.codigo}`);
    } else {
      logWarn(`Item ${i.codigo} -> ${r.status}`);
    }
  }

  // ─── Calendarios laborales ───
  log('\n📅 Calendarios laborales');
  const calendars = [
    { name: 'Calendario estándar', description: 'Lunes a Viernes', isDefault: false },
    { name: 'Calendario reducido', description: 'Lunes a Jueves', isDefault: false },
  ];
  for (const c of calendars) {
    const r = await request('POST', `${API}/fichajes/calendars`, accessToken, c);
    if (r.status === 201) {
      logOk(c.name);
    } else {
      logWarn(`${c.name} -> ${r.status}`);
    }
  }

  // ─── Horarios laborales ───
  log('\n⏰ Horarios laborales');
  const schedules = [
    { name: 'Jornada completa', hoursPerYear: 1762, vacationDays: 22, freeDisposalDays: 2, hoursPerDayWeekdays: 8, hoursPerDaySaturday: 4, hoursPerWeek: 40 },
    { name: 'Media jornada', hoursPerYear: 881, vacationDays: 11, freeDisposalDays: 1, hoursPerDayWeekdays: 4, hoursPerWeek: 20 },
  ];
  for (const s of schedules) {
    const r = await request('POST', `${API}/fichajes/schedules`, accessToken, s);
    if (r.status === 201) {
      logOk(s.name);
    } else {
      logWarn(`${s.name} -> ${r.status}`);
    }
  }

  // ─── Tipos de permiso ───
  log('\n📌 Tipos de permiso');
  const permissionTypes = [
    { name: 'Vacaciones', isPaid: true },
    { name: 'Permiso retribuido', isPaid: true },
    { name: 'Asunto propio', isPaid: false },
  ];
  for (const p of permissionTypes) {
    const r = await request('POST', `${API}/fichajes/permission-types`, accessToken, p);
    if (r.status === 201) {
      logOk(p.name);
    } else {
      logWarn(`${p.name} -> ${r.status}`);
    }
  }

  // ─── Tareas (por usuario) ───
  log('\n📋 Tareas');
  const usersRes = await request('GET', `${API}/users?page=1&pageSize=20`, accessToken);
  const userList = usersRes.data?.items || [];
  const taskTemplates = [
    { title: 'Revisar documentación', description: 'Verificar requisitos', completed: false },
    { title: 'Reunión de equipo', description: 'Daily standup', completed: true },
    { title: 'Llamada de seguimiento', description: 'Cliente potencial', completed: false },
    { title: 'Enviar propuesta comercial', completed: false },
    { title: 'Visita a tienda', description: 'Revisión de stock', completed: true },
  ];
  let tasksCreated = 0;
  for (let i = 0; i < Math.min(userList.length, 5); i++) {
    const user = userList[i];
    const numTasks = 2 + (i % 3);
    for (let t = 0; t < numTasks; t++) {
      const tmpl = taskTemplates[(i + t) % taskTemplates.length];
      const r = await request('POST', `${API}/tasks`, accessToken, {
        userId: user.id,
        title: tmpl.title,
        description: tmpl.description,
        completed: tmpl.completed,
      });
      if (r.status === 201 || r.status === 200) tasksCreated++;
    }
  }
  logOk(`${tasksCreated} tareas creadas para usuarios`);

  // ─── Fichajes de ejemplo (clock-in para admin) ───
  if (ids.userId) {
    log('\n⏱️ Fichaje de ejemplo (entrada)');
    const clockInRes = await request('POST', `${API}/fichajes/clock-in`, accessToken, {
      userId: ids.userId,
      location: 'Oficina',
    });
    if (clockInRes.ok) {
      logOk('Fichaje de entrada creado para admin');
    } else {
      logSkip('Fichaje (ya hay uno abierto o error: ' + (clockInRes.data?.message || clockInRes.status) + ')');
    }
  }

  console.log('\n✅ Seed vía API terminado.');
  console.log('   Los objetivos del dashboard y objetivos terminales no tienen POST en la API.');
  console.log('   Para esos datos usa: pnpm db:seed (SQL).\n');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
