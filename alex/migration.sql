-- Biosstel CRM - Database Migration
-- PostgreSQL 15+
-- Run: psql -U <user> -d <database> -f migration.sql

BEGIN;

-- ============================================
-- EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE roles (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE departments (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) UNIQUE NOT NULL,
    color   VARCHAR(20) NOT NULL,
    status  VARCHAR(20) NOT NULL DEFAULT 'active'
);

CREATE TABLE work_centers (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    address  VARCHAR(255)
);

CREATE TABLE departments_work_centers (
    department_id   INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    work_center_id  INT NOT NULL REFERENCES work_centers(id) ON DELETE CASCADE,
    PRIMARY KEY (department_id, work_center_id)
);

CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    phone            VARCHAR(20),
    email_confirmed  BOOLEAN NOT NULL DEFAULT FALSE,
    first_login      BOOLEAN NOT NULL DEFAULT TRUE,
    role_id          INT NOT NULL REFERENCES roles(id),
    department_id    INT REFERENCES departments(id) ON DELETE SET NULL,
    work_center_id   INT REFERENCES work_centers(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE TABLE families (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  VARCHAR(100) NOT NULL
);

CREATE TABLE subfamilies (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id  UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL
);

CREATE TABLE brands (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(150) NOT NULL,
    family_id     UUID NOT NULL REFERENCES families(id),
    subfamily_id  UUID REFERENCES subfamilies(id) ON DELETE SET NULL,
    brand_id      UUID NOT NULL REFERENCES brands(id)
);

CREATE TABLE objectives (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    VARCHAR(150) NOT NULL,
    color   VARCHAR(20) NOT NULL,
    active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE objectives_families (
    objective_id  UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    family_id     UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    PRIMARY KEY (objective_id, family_id)
);

CREATE TABLE monthly_objectives (
    id            SERIAL PRIMARY KEY,
    objective_id  UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    month         DATE NOT NULL,
    target        INT NOT NULL DEFAULT 0,
    UNIQUE (objective_id, month)
);

CREATE TABLE department_assignments (
    id              SERIAL PRIMARY KEY,
    objective_id    UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    month           DATE NOT NULL,
    department_id   INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    target          INT NOT NULL DEFAULT 0,
    UNIQUE (objective_id, month, department_id)
);

CREATE TABLE work_center_assignments (
    id                        SERIAL PRIMARY KEY,
    department_assignment_id  INT NOT NULL REFERENCES department_assignments(id) ON DELETE CASCADE,
    work_center_id            INT NOT NULL REFERENCES work_centers(id) ON DELETE CASCADE,
    target                    INT NOT NULL DEFAULT 0,
    UNIQUE (department_assignment_id, work_center_id)
);

CREATE TABLE person_assignments (
    id                        SERIAL PRIMARY KEY,
    department_assignment_id  INT NOT NULL REFERENCES department_assignments(id) ON DELETE CASCADE,
    user_id                   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target                    INT NOT NULL DEFAULT 0,
    achieved                  INT NOT NULL DEFAULT 0,
    UNIQUE (department_assignment_id, user_id)
);

CREATE TABLE agendas (
    id       SERIAL PRIMARY KEY,
    user_id  INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id           SERIAL PRIMARY KEY,
    agenda_id    INT NOT NULL REFERENCES agendas(id) ON DELETE CASCADE,
    title        VARCHAR(150) NOT NULL,
    description  TEXT,
    time_start   TIMESTAMPTZ NOT NULL,
    time_end     TIMESTAMPTZ NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE time_entries (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(20) NOT NULL,
    timestamp  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- VIEWS (achieved computed from person_assignments)
-- ============================================

CREATE VIEW v_work_center_achieved AS
SELECT
    wca.id                       AS work_center_assignment_id,
    wca.department_assignment_id,
    wca.work_center_id,
    wca.target,
    COALESCE(SUM(pa.achieved), 0) AS achieved
FROM work_center_assignments wca
LEFT JOIN person_assignments pa
    ON pa.department_assignment_id = wca.department_assignment_id
LEFT JOIN users u
    ON u.id = pa.user_id
    AND u.work_center_id = wca.work_center_id
GROUP BY wca.id;

CREATE VIEW v_department_achieved AS
SELECT
    da.id              AS department_assignment_id,
    da.objective_id,
    da.month,
    da.department_id,
    da.target,
    COALESCE(SUM(pa.achieved), 0) AS achieved
FROM department_assignments da
LEFT JOIN person_assignments pa
    ON pa.department_assignment_id = da.id
GROUP BY da.id;

CREATE VIEW v_monthly_objective_achieved AS
SELECT
    mo.id            AS monthly_objective_id,
    mo.objective_id,
    mo.month,
    mo.target,
    COALESCE(SUM(pa.achieved), 0) AS achieved
FROM monthly_objectives mo
LEFT JOIN department_assignments da
    ON da.objective_id = mo.objective_id
    AND da.month = mo.month
LEFT JOIN person_assignments pa
    ON pa.department_assignment_id = da.id
GROUP BY mo.id;

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_role            ON users(role_id);
CREATE INDEX idx_users_department      ON users(department_id);
CREATE INDEX idx_users_work_center     ON users(work_center_id);
CREATE INDEX idx_users_email           ON users(email);
CREATE INDEX idx_users_deleted_at      ON users(deleted_at) WHERE deleted_at IS NULL;

-- Products
CREATE INDEX idx_products_family       ON products(family_id);
CREATE INDEX idx_products_subfamily    ON products(subfamily_id);
CREATE INDEX idx_products_brand        ON products(brand_id);

-- Subfamilies
CREATE INDEX idx_subfamilies_family    ON subfamilies(family_id);

-- Monthly objectives
CREATE INDEX idx_monthly_obj_objective ON monthly_objectives(objective_id);
CREATE INDEX idx_monthly_obj_month     ON monthly_objectives(month);

-- Department assignments
CREATE INDEX idx_dept_assign_objective ON department_assignments(objective_id);
CREATE INDEX idx_dept_assign_month     ON department_assignments(month);
CREATE INDEX idx_dept_assign_dept      ON department_assignments(department_id);

-- Work center assignments
CREATE INDEX idx_wc_assign_dept_assign ON work_center_assignments(department_assignment_id);
CREATE INDEX idx_wc_assign_wc          ON work_center_assignments(work_center_id);

-- Person assignments
CREATE INDEX idx_person_assign_dept    ON person_assignments(department_assignment_id);
CREATE INDEX idx_person_assign_user    ON person_assignments(user_id);

-- Tasks
CREATE INDEX idx_tasks_agenda          ON tasks(agenda_id);
CREATE INDEX idx_tasks_time_start      ON tasks(time_start);

-- Time entries
CREATE INDEX idx_time_entries_user     ON time_entries(user_id);
CREATE INDEX idx_time_entries_ts       ON time_entries(user_id, timestamp DESC);

-- ============================================
-- CHECK CONSTRAINTS
-- ============================================

ALTER TABLE departments
    ADD CONSTRAINT chk_department_status
    CHECK (status IN ('active', 'inactive'));

ALTER TABLE departments
    ADD CONSTRAINT chk_department_color
    CHECK (color IN ('blue', 'maroon', 'teal', 'purple', 'magenta'));

ALTER TABLE objectives
    ADD CONSTRAINT chk_objective_color
    CHECK (color IN ('blue', 'maroon', 'teal', 'purple', 'magenta'));

ALTER TABLE time_entries
    ADD CONSTRAINT chk_time_entry_type
    CHECK (type IN ('clock_in', 'clock_out', 'break_start', 'break_end'));

ALTER TABLE monthly_objectives
    ADD CONSTRAINT chk_monthly_obj_target_positive
    CHECK (target >= 0);

ALTER TABLE department_assignments
    ADD CONSTRAINT chk_dept_assign_target_positive
    CHECK (target >= 0);

ALTER TABLE work_center_assignments
    ADD CONSTRAINT chk_wc_assign_target_positive
    CHECK (target >= 0);

ALTER TABLE person_assignments
    ADD CONSTRAINT chk_person_assign_target_positive
    CHECK (target >= 0);

-- ============================================
-- SEED DATA: Roles
-- ============================================

INSERT INTO roles (name) VALUES
    ('ADMINISTRADOR'),
    ('COORDINADOR'),
    ('TELEMARKETING'),
    ('TIENDA'),
    ('COMERCIAL'),
    ('BACKOFFICE');

COMMIT;
