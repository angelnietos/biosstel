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

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Biosstel database initialized successfully';
END $$;
