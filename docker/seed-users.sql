-- Seed Users Script
-- This script creates initial users for development
-- Run with: docker exec -i biosstel-postgres-dev psql -U biosstel -d biosstel < docker/seed-users.sql

-- Note: Passwords are hashed with bcrypt
-- admin123 -> $2b$10$rQ8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K
-- coord123 -> $2b$10$rQ8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K
-- user123 -> $2b$10$rQ8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K

-- Check if users table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        RAISE NOTICE 'Users table does not exist yet. Please run migrations first.';
        RETURN;
    END IF;
END $$;

-- Delete existing seed users if they exist
DELETE FROM users WHERE email IN (
    'admin@biosstel.com',
    'coordinador@biosstel.com',
    'usuario@biosstel.com'
);

-- Insert seed users
-- Password: admin123 (bcrypt hash)
INSERT INTO users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'admin@biosstel.com',
    '$2b$10$lIw0QtVKriN60AWV0Sq4BOB4lu3kqAb3WKFJu9yXA5/qwu.Tg258u',
    'Admin',
    'User',
    true,
    NOW(),
    NOW()
);

-- Password: coord123 (bcrypt hash)
INSERT INTO users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'coordinador@biosstel.com',
    '$2b$10$1sAFHbjoIw9/gj44K/noyOQ2QvGmBtcqq98ubtFK6T7NWaV/Yeoo6',
    'Coordinador',
    'Test',
    true,
    NOW(),
    NOW()
);

-- Password: user123 (bcrypt hash)
INSERT INTO users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'usuario@biosstel.com',
    '$2b$10$5jo9/AQaH2GTsOwErzZUWugobhFtYtuJA93an6c10JnT9iULfW89e',
    'Usuario',
    'Prueba',
    true,
    NOW(),
    NOW()
);

-- Show created users
SELECT email, "firstName", "lastName", "isActive" FROM users WHERE email IN (
    'admin@biosstel.com',
    'coordinador@biosstel.com',
    'usuario@biosstel.com'
);
