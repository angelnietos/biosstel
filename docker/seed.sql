-- =============================================================
-- Biosstel Dev Seed
-- Runs automatically on first Docker start (02-seed.sql).
-- Also safe to run manually:
--   pnpm db:seed
--   (or) Get-Content docker/seed.sql | docker exec -i biosstel-db psql -U biosstel -d biosstel
--
-- Credentials:
--   admin@biosstel.com         / admin123
--   coordinador@biosstel.com   / coord123
--   telemarketing@biosstel.com / tm123
--   tienda@biosstel.com        / tienda123
--   comercial@biosstel.com     / comercial123
--   backoffice@biosstel.com    / bo123
-- =============================================================

-- ─── Users (UPSERT — safe to re-run even with FK deps) ────────
INSERT INTO users (id, email, password, "firstName", "lastName", "isActive", role, "createdAt", "updatedAt") VALUES
    ('f2ce86c5-0406-403e-a6dc-8a55d91f480b', 'admin@biosstel.com',         '$2b$10$8oABx54YZfz3AIotvR16PeFrrNVKdWOeihxLnkvCA07geOfre/qJG', 'Admin',         'User', true, 'ADMIN',         NOW(), NOW()),
    ('bb8a902e-f668-4fe0-a757-8e39d8b395be', 'coordinador@biosstel.com',   '$2b$10$UgCacUx8B.mOJBmTxoKhuODndOJHpGpM36.ax82rlo3NjlnPHWFd6', 'Coordinador',   'Test', true, 'COORDINADOR',   NOW(), NOW()),
    ('8743def1-7b23-44e6-83e9-8a5226a4e2e4', 'telemarketing@biosstel.com', '$2b$10$gJ88oRUlirCGjLOd2o2MgePpAM52euuYo53nO82EFwToPTBAZbsd2', 'Telemarketing', 'User', true, 'TELEMARKETING', NOW(), NOW()),
    ('af569b59-cee1-449d-941c-f1cc75ff3ba3', 'tienda@biosstel.com',        '$2b$10$gWOrxMQ7rDggjKOZlKtwHeV74.k9Q1jlscVkDq4t6lnuW7OGsyYau', 'Tienda',        'User', true, 'TIENDA',        NOW(), NOW()),
    ('cb688ab4-6501-441d-bf8d-d05a991cc546', 'comercial@biosstel.com',     '$2b$10$am5qeNVJvxSSp.XvQsCe8uWKFOMINcgAp2lP70ELk5cghR16C1wFS', 'Comercial',     'User', true, 'COMERCIAL',     NOW(), NOW()),
    ('9b7b9fc8-ba34-467b-976e-59445b345e70', 'backoffice@biosstel.com',    '$2b$10$kW0ngGe2iX/t/72KePHBz.iviZAl7m1QDAByILdNuhtfua8.xao12', 'Backoffice',    'User', true, 'BACKOFFICE',    NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    password    = EXCLUDED.password,
    "firstName" = EXCLUDED."firstName",
    "lastName"  = EXCLUDED."lastName",
    role        = EXCLUDED.role,
    "isActive"  = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- ─── Dashboard Objectives (IDs fijos para que los enlaces de las cards funcionen) ─
DELETE FROM dashboard_objectives;

INSERT INTO dashboard_objectives (id, title, achieved, objective, accent, href, "isActive", "createdAt", "updatedAt") VALUES
    ('a1000001-0000-0000-0000-000000000001', 'Terminales (Familia X)', 12867, 34560, 'maroon', '/objetivos-terminales', true, NOW(), NOW()),
    ('a1000001-0000-0000-0000-000000000002', 'Familia Y',              10124, 89988, 'teal',   NULL,                    true, NOW(), NOW()),
    ('a1000001-0000-0000-0000-000000000003', 'Familia',                37009, 36134, 'blue',   NULL,                    true, NOW(), NOW()),
    ('a1000001-0000-0000-0000-000000000004', 'Producto X',             57112, 76110, 'purple', NULL,                    true, NOW(), NOW());

-- ─── Dashboard Alerts ─────────────────────────────────────────
ALTER TABLE dashboard_alerts ADD COLUMN IF NOT EXISTS marca varchar(128) DEFAULT NULL;
DELETE FROM dashboard_alerts;

INSERT INTO dashboard_alerts (id, usuario, departamento, "centroTrabajo", rol, estado, "statusType", marca, "sortOrder", "isActive", "createdAt", "updatedAt") VALUES
    (gen_random_uuid(), 'Isabella Torres', 'Comercial', 'Barakaldo',  'Tienda',        'No ha fichado',            'no-fichado',    'marca1', 1, true, NOW(), NOW()),
    (gen_random_uuid(), 'Maria Robledo',   'Comercial', 'Las Arenas', 'Telemarketing', 'No ha fichado',            'no-fichado',    'marca1', 2, true, NOW(), NOW()),
    (gen_random_uuid(), 'Lucia Martinez',  'Comercial', 'Las Arenas', 'Comercial',     'No ha fichado',            'no-fichado',    'marca2', 3, true, NOW(), NOW()),
    (gen_random_uuid(), 'Isabella Torres', 'Comercial', 'Barakaldo',  'Comercial',     'No ha fichado',            'no-fichado',    'marca2', 4, true, NOW(), NOW()),
    (gen_random_uuid(), 'Maria Robledo',   'Comercial', 'Las Arenas', 'Tienda',        'No ha fichado',            'no-fichado',    'marca1', 5, true, NOW(), NOW()),
    (gen_random_uuid(), 'Lucia Martinez',  'Comercial', 'Las Arenas', 'Telemarketing', 'Fichaje fuera de horario', 'fuera-horario', 'marca1', 6, true, NOW(), NOW()),
    (gen_random_uuid(), 'Lucia Martinez',  'Comercial', 'Las Arenas', 'Comercial',     'Fichaje fuera de horario', 'fuera-horario', 'marca2', 7, true, NOW(), NOW());

-- ─── Terminal Objectives + Assignments (Contratos + Puntos) ─────
ALTER TABLE terminal_objectives ADD COLUMN IF NOT EXISTS period varchar(20) DEFAULT NULL;
DELETE FROM terminal_assignments;
DELETE FROM terminal_objectives;

INSERT INTO terminal_objectives (id, title, "rangeLabel", achieved, objective, pct, "isActive", "objectiveType", period) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Objetivos Terminales (Contratos)', 'Mes en curso 1 Enero - 27 Enero', 20000, 89988, 22, true, 'contratos', NULL),
    ('a0000000-0000-0000-0000-000000000002', 'Objetivos Terminales (Puntos)', 'Mes actual Febrero 2026', 18450, 72000, 26, true, 'puntos', NULL),
    ('a0000000-0000-0000-0000-000000000011', 'Contratos Nov 2025', 'Noviembre 2025', 85000, 89988, 94, false, 'contratos', '2025-11'),
    ('a0000000-0000-0000-0000-000000000012', 'Puntos Nov 2025', 'Noviembre 2025', 68200, 72000, 95, false, 'puntos', '2025-11'),
    ('a0000000-0000-0000-0000-000000000021', 'Contratos Oct 2025', 'Octubre 2025', 78000, 85000, 92, false, 'contratos', '2025-10'),
    ('a0000000-0000-0000-0000-000000000022', 'Puntos Oct 2025', 'Octubre 2025', 65100, 70000, 93, false, 'puntos', '2025-10'),
    ('a0000000-0000-0000-0000-000000000031', 'Contratos Sep 2025', 'Septiembre 2025', 82000, 90000, 91, false, 'contratos', '2025-09'),
    ('a0000000-0000-0000-0000-000000000032', 'Puntos Sep 2025', 'Septiembre 2025', 65800, 72000, 91, false, 'puntos', '2025-09'),
    ('a0000000-0000-0000-0000-000000000041', 'Contratos Ago 2025', 'Agosto 2025', 72000, 88000, 82, false, 'contratos', '2025-08'),
    ('a0000000-0000-0000-0000-000000000042', 'Puntos Ago 2025', 'Agosto 2025', 58000, 72000, 81, false, 'puntos', '2025-08'),
    ('a0000000-0000-0000-0000-000000000051', 'Contratos Dic 2025', 'Diciembre 2025', 88000, 90000, 98, false, 'contratos', '2025-12'),
    ('a0000000-0000-0000-0000-000000000052', 'Puntos Dic 2025', 'Diciembre 2025', 70000, 72000, 97, false, 'puntos', '2025-12'),
    ('a0000000-0000-0000-0000-000000000061', 'Contratos Ene 2026', 'Enero 2026', 25000, 90000, 28, false, 'contratos', '2026-01'),
    ('a0000000-0000-0000-0000-000000000062', 'Puntos Ene 2026', 'Enero 2026', 18000, 72000, 25, false, 'puntos', '2026-01');

INSERT INTO terminal_assignments ("terminalObjectiveId", "groupType", "groupTitle", "sortOrder", label, value, total, ok) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Comercial', 1, 'Centro de trabajo 1', 120, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Comercial', 2, 'Centro de trabajo 2', 437, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Comercial', 3, 'Centro de trabajo 3', 757, 800, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Comercial', 4, 'Centro de trabajo 4', 344, 500, false),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Comercial', 5, 'Centro de trabajo 5', 419, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Departamento 2', 1, 'Centro de trabajo 1', 120, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Departamento 2', 2, 'Centro de trabajo 2', 437, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Tienda', 1, 'Centro de trabajo 1', 120, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'department', 'Tienda', 2, 'Centro de trabajo 2', 437, 500, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Comercial', 1, 'Isabella Torres', 12, 50, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Comercial', 2, 'Maria Robledo', 37, 50, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Comercial', 3, 'Lucia Martinez', 57, 80, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Telemarketing', 1, 'Isabella Torres', 22, 50, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Telemarketing', 2, 'Maria Robledo', 41, 50, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Tienda', 1, 'Isabella Torres', 29, 50, true),
    ('a0000000-0000-0000-0000-000000000001', 'person', 'Tienda', 2, 'Maria Robledo', 25, 50, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Comercial', 1, 'Centro de trabajo 1', 2100, 8000, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Comercial', 2, 'Centro de trabajo 2', 5200, 8000, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Comercial', 3, 'Centro de trabajo 3', 6100, 9000, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Departamento 2', 1, 'Centro de trabajo 1', 2100, 8000, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Departamento 2', 2, 'Centro de trabajo 2', 5050, 8000, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Tienda', 1, 'Centro de trabajo 1', 2000, 7000, true),
    ('a0000000-0000-0000-0000-000000000002', 'department', 'Tienda', 2, 'Centro de trabajo 2', 5000, 7000, true),
    ('a0000000-0000-0000-0000-000000000002', 'person', 'Comercial', 1, 'Isabella Torres', 420, 600, true),
    ('a0000000-0000-0000-0000-000000000002', 'person', 'Comercial', 2, 'Maria Robledo', 380, 600, true),
    ('a0000000-0000-0000-0000-000000000002', 'person', 'Telemarketing', 1, 'Isabella Torres', 350, 500, true),
    ('a0000000-0000-0000-0000-000000000002', 'person', 'Tienda', 1, 'Isabella Torres', 290, 500, true),
    ('a0000000-0000-0000-0000-000000000011', 'department', 'Comercial', 1, 'Centro de trabajo 1', 500, 500, true),
    ('a0000000-0000-0000-0000-000000000011', 'department', 'Comercial', 2, 'Centro de trabajo 2', 500, 500, true),
    ('a0000000-0000-0000-0000-000000000011', 'department', 'Tienda', 1, 'Centro de trabajo 1', 480, 500, true),
    ('a0000000-0000-0000-0000-000000000012', 'department', 'Comercial', 1, 'Centro de trabajo 1', 8000, 8000, true),
    ('a0000000-0000-0000-0000-000000000012', 'department', 'Tienda', 1, 'Centro de trabajo 1', 7200, 7500, true),
    ('a0000000-0000-0000-0000-000000000021', 'department', 'Comercial', 1, 'Centro de trabajo 1', 42000, 45000, true),
    ('a0000000-0000-0000-0000-000000000021', 'department', 'Tienda', 1, 'Centro de trabajo 1', 36000, 40000, true),
    ('a0000000-0000-0000-0000-000000000022', 'department', 'Comercial', 1, 'Centro de trabajo 1', 32000, 35000, true),
    ('a0000000-0000-0000-0000-000000000031', 'department', 'Comercial', 1, 'Centro de trabajo 1', 41000, 45000, true),
    ('a0000000-0000-0000-0000-000000000032', 'department', 'Comercial', 1, 'Centro de trabajo 1', 33000, 36000, true),
    ('a0000000-0000-0000-0000-000000000041', 'department', 'Comercial', 1, 'Centro de trabajo 1', 35000, 44000, true),
    ('a0000000-0000-0000-0000-000000000041', 'department', 'Tienda', 1, 'Centro de trabajo 1', 37000, 44000, true),
    ('a0000000-0000-0000-0000-000000000041', 'person', 'Comercial', 1, 'Isabella Torres', 15, 50, true),
    ('a0000000-0000-0000-0000-000000000041', 'person', 'Comercial', 2, 'Maria Robledo', 38, 50, true),
    ('a0000000-0000-0000-0000-000000000041', 'person', 'Tienda', 1, 'Isabella Torres', 28, 50, true),
    ('a0000000-0000-0000-0000-000000000042', 'department', 'Comercial', 1, 'Centro de trabajo 1', 28000, 36000, true),
    ('a0000000-0000-0000-0000-000000000042', 'department', 'Tienda', 1, 'Centro de trabajo 1', 30000, 36000, true),
    ('a0000000-0000-0000-0000-000000000042', 'person', 'Comercial', 1, 'Isabella Torres', 400, 600, true),
    ('a0000000-0000-0000-0000-000000000042', 'person', 'Tienda', 1, 'Maria Robledo', 350, 500, true),
    ('a0000000-0000-0000-0000-000000000051', 'department', 'Comercial', 1, 'Centro de trabajo 1', 44000, 45000, true),
    ('a0000000-0000-0000-0000-000000000051', 'department', 'Tienda', 1, 'Centro de trabajo 1', 44000, 45000, true),
    ('a0000000-0000-0000-0000-000000000051', 'person', 'Comercial', 1, 'Isabella Torres', 45, 50, true),
    ('a0000000-0000-0000-0000-000000000051', 'person', 'Tienda', 1, 'Maria Robledo', 48, 50, true),
    ('a0000000-0000-0000-0000-000000000052', 'department', 'Comercial', 1, 'Centro de trabajo 1', 35000, 36000, true),
    ('a0000000-0000-0000-0000-000000000052', 'department', 'Tienda', 1, 'Centro de trabajo 1', 35000, 36000, true),
    ('a0000000-0000-0000-0000-000000000061', 'department', 'Comercial', 1, 'Centro de trabajo 1', 12000, 45000, true),
    ('a0000000-0000-0000-0000-000000000061', 'department', 'Tienda', 1, 'Centro de trabajo 1', 13000, 45000, true),
    ('a0000000-0000-0000-0000-000000000061', 'person', 'Comercial', 1, 'Isabella Torres', 12, 50, true),
    ('a0000000-0000-0000-0000-000000000061', 'person', 'Tienda', 1, 'Maria Robledo', 15, 50, true),
    ('a0000000-0000-0000-0000-000000000062', 'department', 'Comercial', 1, 'Centro de trabajo 1', 9000, 36000, true),
    ('a0000000-0000-0000-0000-000000000062', 'department', 'Tienda', 1, 'Centro de trabajo 1', 9000, 36000, true),
    ('a0000000-0000-0000-0000-000000000062', 'person', 'Comercial', 1, 'Isabella Torres', 350, 600, true),
    ('a0000000-0000-0000-0000-000000000062', 'person', 'Tienda', 1, 'Lucia Martinez', 420, 500, true);

-- ─── Fichajes (hoy) ───────────────────────────────────────────
-- Se insertan sólo cuando la tabla ya existe (creada por TypeORM al arrancar la API).
-- Usa IDs fijos para poder hacer UPSERT y evitar duplicados al re-ejecutar.
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fichajes') THEN
    -- Borrar sólo los fichajes de hoy
    DELETE FROM fichajes WHERE date = CURRENT_DATE;

    INSERT INTO fichajes (id, "userId", date, "startTime", "endTime", status, pauses, location) VALUES
      (gen_random_uuid(), 'f2ce86c5-0406-403e-a6dc-8a55d91f480b', CURRENT_DATE, NOW() - INTERVAL '8 hours', NULL,                      'working',  '[]', '{"lat":40.4168,"lng":-3.7038}'),
      (gen_random_uuid(), '9b7b9fc8-ba34-467b-976e-59445b345e70', CURRENT_DATE, NOW() - INTERVAL '6 hours', NULL,                      'working',  '[]', NULL),
      (gen_random_uuid(), 'cb688ab4-6501-441d-bf8d-d05a991cc546', CURRENT_DATE, NOW() - INTERVAL '7 hours', NULL,                      'working',  '[]', '{"lat":40.4168,"lng":-3.7038}'),
      (gen_random_uuid(), 'bb8a902e-f668-4fe0-a757-8e39d8b395be', CURRENT_DATE, NOW() - INTERVAL '5 hours', NULL,                      'paused',   '[]', NULL),
      (gen_random_uuid(), '8743def1-7b23-44e6-83e9-8a5226a4e2e4', CURRENT_DATE, NOW() - INTERVAL '4 hours', NULL,                      'working',  '[]', NULL),
      (gen_random_uuid(), 'af569b59-cee1-449d-941c-f1cc75ff3ba3', CURRENT_DATE, NOW() - INTERVAL '9 hours', NOW() - INTERVAL '1 hour', 'finished', '[]', '{"lat":40.4168,"lng":-3.7038}');

    RAISE NOTICE 'Fichajes seeded for %', CURRENT_DATE;
  ELSE
    RAISE NOTICE 'Table fichajes does not exist yet — will be seeded on next run after API starts';
  END IF;
END $$;

-- ─── Clientes (solo si la tabla existe y está vacía) ─────────────
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clients') THEN
    INSERT INTO clients (id, name, email, phone, "createdAt", "updatedAt")
    SELECT 'c1000001-0000-0000-0000-000000000001'::uuid, 'Cliente A', 'cliente.a@example.com', '+34 600 111 222', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM clients LIMIT 1)
    UNION ALL
    SELECT 'c1000001-0000-0000-0000-000000000002'::uuid, 'Cliente B', 'cliente.b@example.com', '+34 600 333 444', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM clients LIMIT 1)
    UNION ALL
    SELECT 'c1000001-0000-0000-0000-000000000003'::uuid, 'Cliente C', 'cliente.c@example.com', NULL, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM clients LIMIT 1);
  END IF;
END $$;

-- ─── Departamentos (solo si la tabla está vacía) ─────────────────
INSERT INTO departments (id, code, name, "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'DEP-01', 'Comercial', true, NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM departments LIMIT 1)
UNION ALL
SELECT gen_random_uuid(), 'DEP-02', 'Tienda', true, NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM departments LIMIT 1)
UNION ALL
SELECT gen_random_uuid(), 'DEP-03', 'Telemarketing', true, NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM departments LIMIT 1);

-- ─── Centros de trabajo (solo si la tabla está vacía) ─────────────
INSERT INTO work_centers (id, name, address, "departmentId", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Barakaldo', 'C/ Ejemplo 1, Barakaldo', (SELECT id FROM departments LIMIT 1), true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM work_centers LIMIT 1) AND EXISTS (SELECT 1 FROM departments LIMIT 1)
UNION ALL
SELECT gen_random_uuid(), 'Las Arenas', 'C/ Ejemplo 2, Las Arenas', (SELECT id FROM departments LIMIT 1), true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM work_centers LIMIT 1) AND EXISTS (SELECT 1 FROM departments LIMIT 1)
UNION ALL
SELECT gen_random_uuid(), 'Sede central', 'Av. Principal 100', (SELECT id FROM departments LIMIT 1), true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM work_centers LIMIT 1) AND EXISTS (SELECT 1 FROM departments LIMIT 1);

-- ─── Productos (solo si la tabla existe y está vacía) ─────────────
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    INSERT INTO products (id, codigo, nombre, familia, estado, "createdAt", "updatedAt")
    SELECT gen_random_uuid(), 'PRD-001', 'Producto A', 'Familia 1', 'Activo', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1)
    UNION ALL
    SELECT gen_random_uuid(), 'PRD-002', 'Producto B', 'Familia 1', 'Activo', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1)
    UNION ALL
    SELECT gen_random_uuid(), 'PRD-003', 'Producto C', 'Familia 2', 'Activo', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);
  END IF;
END $$;

-- ─── Inventario (solo si la tabla existe y está vacía) ────────────
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inventory_items') THEN
    INSERT INTO inventory_items (id, codigo, nombre, cantidad, ubicacion, "createdAt", "updatedAt")
    SELECT gen_random_uuid(), 'INV-001', 'Item Almacén 1', 100, 'Estantería A1', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM inventory_items LIMIT 1)
    UNION ALL
    SELECT gen_random_uuid(), 'INV-002', 'Item Almacén 2', 50, 'Estantería B2', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM inventory_items LIMIT 1)
    UNION ALL
    SELECT gen_random_uuid(), 'INV-003', 'Item Almacén 3', 200, 'Estantería C1', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM inventory_items LIMIT 1);
  END IF;
END $$;

-- ─── Calendarios / horarios / permisos (fichajes) si tablas vacías ─
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'work_calendars') AND NOT EXISTS (SELECT 1 FROM work_calendars LIMIT 1) THEN
    INSERT INTO work_calendars (id, name, description, "isDefault", "createdAt", "updatedAt") VALUES
      (gen_random_uuid(), 'Calendario estándar', 'Lunes a Viernes', false, NOW(), NOW()),
      (gen_random_uuid(), 'Calendario reducido', 'Lunes a Jueves', false, NOW(), NOW());
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'work_schedules') AND NOT EXISTS (SELECT 1 FROM work_schedules LIMIT 1) THEN
    INSERT INTO work_schedules (id, name, "hoursPerYear", "vacationDays", "freeDisposalDays", "hoursPerDayWeekdays", "hoursPerDaySaturday", "hoursPerWeek", "createdAt", "updatedAt") VALUES
      (gen_random_uuid(), 'Jornada completa', 1762, 22, 2, 8, 4, 40, NOW(), NOW()),
      (gen_random_uuid(), 'Media jornada', 881, 11, 1, 4, 0, 20, NOW(), NOW());
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leave_permission_types') AND NOT EXISTS (SELECT 1 FROM leave_permission_types LIMIT 1) THEN
    INSERT INTO leave_permission_types (id, name, "isPaid", "createdAt", "updatedAt") VALUES
      (gen_random_uuid(), 'Vacaciones', true, NOW(), NOW()),
      (gen_random_uuid(), 'Permiso retribuido', true, NOW(), NOW()),
      (gen_random_uuid(), 'Asunto propio', false, NOW(), NOW());
  END IF;
END $$;

-- ─── Summary ──────────────────────────────────────────────────
SELECT 'users' AS tabla,             COUNT(*) FROM users
UNION ALL
SELECT 'dashboard_objectives',       COUNT(*) FROM dashboard_objectives
UNION ALL
SELECT 'dashboard_alerts',           COUNT(*) FROM dashboard_alerts
UNION ALL
SELECT 'terminal_objectives',        COUNT(*) FROM terminal_objectives
UNION ALL
SELECT 'terminal_assignments',       COUNT(*) FROM terminal_assignments
UNION ALL
SELECT 'departments',                COUNT(*) FROM departments
UNION ALL
SELECT 'work_centers',               COUNT(*) FROM work_centers
UNION ALL
SELECT 'clients',                   COUNT(*) FROM clients;
