-- Biosstel Database Initialization
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS app_schema;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA auth_schema TO biosstel;
GRANT ALL PRIVILEGES ON SCHEMA app_schema TO biosstel;

-- Auth tables will be created by Sequelize migrations
-- This is just a placeholder for initial setup

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Biosstel database initialized successfully';
END
$$;