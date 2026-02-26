-- Biosstel Database Initialization
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set password for the user created by Docker Compose
ALTER USER biosstel WITH PASSWORD 'biosstel123';

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS app_schema;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA auth_schema TO biosstel;
GRANT ALL PRIVILEGES ON SCHEMA app_schema TO biosstel;
GRANT ALL PRIVILEGES ON DATABASE biosstel TO biosstel;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_schema GRANT ALL ON TABLES TO biosstel;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_schema GRANT ALL ON TABLES TO biosstel;

-- Users table (so 02-seed.sql can insert; TypeORM sync will not drop it)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    "firstName" varchar(255),
    "lastName" varchar(255),
    phone varchar(255),
    "isActive" boolean DEFAULT true,
    "organizationId" varchar(255),
    role text,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

-- Dashboard / Objetivos (so 02-seed.sql can insert; aligned with TypeORM entities)
CREATE TABLE IF NOT EXISTS public.dashboard_objectives (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(255) NOT NULL,
    achieved int DEFAULT 0,
    objective int DEFAULT 0,
    unit varchar(255),
    href varchar(255),
    accent varchar(50) DEFAULT 'blue',
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dashboard_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario varchar(255) NOT NULL,
    departamento varchar(255) NOT NULL,
    "centroTrabajo" varchar(255) NOT NULL,
    rol varchar(255),
    estado varchar(255) NOT NULL,
    "statusType" varchar(100),
    "sortOrder" int DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.terminal_objectives (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(255) DEFAULT 'Objetivos Terminales',
    "rangeLabel" varchar(255) DEFAULT '',
    achieved int DEFAULT 0,
    objective int DEFAULT 0,
    pct int DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "objectiveType" varchar(50) DEFAULT 'contratos',
    period varchar(20) DEFAULT NULL,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.terminal_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "terminalObjectiveId" uuid NOT NULL REFERENCES public.terminal_objectives(id) ON DELETE CASCADE,
    "groupType" varchar(50) NOT NULL,
    "groupTitle" varchar(255) NOT NULL,
    label varchar(255) NOT NULL,
    value int DEFAULT 0,
    total int DEFAULT 0,
    ok boolean DEFAULT true,
    "sortOrder" int DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_terminal_assignments_objective ON public.terminal_assignments("terminalObjectiveId");
CREATE INDEX IF NOT EXISTS idx_terminal_assignments_group ON public.terminal_assignments("groupType", "groupTitle");

-- Empresa: departamentos y centros de trabajo (TypeORM sync puede crear; aquí por compatibilidad)
CREATE TABLE IF NOT EXISTS public.departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(100),
    name varchar(255) NOT NULL,
    color varchar(50),
    "responsibleUserId" uuid,
    "dateFrom" date,
    "dateTo" date,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.work_centers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    address varchar(500),
    "departmentId" uuid REFERENCES public.departments(id) ON DELETE SET NULL,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_centers_department ON public.work_centers("departmentId");

-- Fichajes: calendarios laborales, horarios, tipos de permiso (TypeORM sync puede crear)
CREATE TABLE IF NOT EXISTS public.work_calendars (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description varchar(500),
    "isDefault" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.work_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    "hoursPerYear" int DEFAULT 0,
    "vacationDays" int DEFAULT 0,
    "freeDisposalDays" int DEFAULT 0,
    "hoursPerDayWeekdays" decimal(5,2) DEFAULT 0,
    "hoursPerDaySaturday" decimal(5,2) DEFAULT 0,
    "hoursPerWeek" decimal(5,2) DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leave_permission_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    "isPaid" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

-- Documentación usuario (Detalle Usuario – Documentación)
CREATE TABLE IF NOT EXISTS public.user_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    "mimeType" varchar(100),
    "filePath" varchar(500),
    "contentBase64" text,
    "createdAt" timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON public.user_documents("userId");

-- Clientes (CRM / alta desde front)
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(100),
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

-- Productos e inventario (para seed; TypeORM puede sincronizar después)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(100) NOT NULL,
    nombre varchar(255) NOT NULL,
    familia varchar(100) DEFAULT '',
    estado varchar(50) DEFAULT 'Activo',
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(100) NOT NULL,
    nombre varchar(255) NOT NULL,
    cantidad int DEFAULT 0,
    ubicacion varchar(255),
    "createdAt" timestamp with time zone DEFAULT NOW(),
    "updatedAt" timestamp with time zone DEFAULT NOW()
);

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Biosstel database initialized successfully';
END $$;
