-- =====================================================
-- SIMPLE SETUP SCRIPT - Basic Tables for CRUD Operations
-- =====================================================
-- This script creates simple tables for basic CRUD operations
-- Execute this in your Supabase SQL Editor

-- Step 1: Create users table
\i 01_users.sql

-- Step 2: Create resale properties table
\i 08_resale_properties.sql

-- Step 3: Create rental properties table
\i 09_rental_properties.sql

-- Step 4: Create new projects table
\i 10_new_projects.sql

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if all tables were created
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'resale_properties', 'rental_properties', 'new_projects')
ORDER BY table_name;

-- =====================================================
-- SAMPLE DATA INSERTION (Optional)
-- =====================================================

-- Insert sample users with different roles
-- INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES 
--   ('admin@aspire.com', 'hashed_password_here', 'System', 'Administrator', '+1234567890', 'ADMIN'),
--   ('agent@aspire.com', 'hashed_password_here', 'John', 'Doe', '+1234567891', 'AGENT'),
--   ('builder@aspire.com', 'hashed_password_here', 'Bob', 'Builder', '+1234567892', 'BUILDER'),
--   ('buyer@aspire.com', 'hashed_password_here', 'Jane', 'Smith', '+1234567893', 'BUYER');

-- Insert sample resale property
-- INSERT INTO resale_properties (
--   seller_name, seller_email, seller_contact_no, 
--   property_type, bhk_type, location, asking_price, 
--   furnishing_type, created_by
-- ) VALUES (
--   'John Smith', 'john.smith@email.com', '+919876543210',
--   'apartment', '3_bhk', 'Downtown Mumbai', 8500000,
--   'semi_furnished', 'user-uuid-here'
-- );

-- Insert sample rental property
-- INSERT INTO rental_properties (
--   owner_name, owner_email, owner_contact_no,
--   property_type, bhk_type, location, rent_amount,
--   furnishing_type, created_by
-- ) VALUES (
--   'Jane Doe', 'jane.doe@email.com', '+919876543211',
--   'apartment', '2_bhk', 'Suburban Area', 25000,
--   'fully_furnished', 'user-uuid-here'
-- );

-- Insert sample new project
-- INSERT INTO new_projects (
--   project_name, crafted_by, project_type, construction_type,
--   project_location, created_by
-- ) VALUES (
--   'Sunrise Residency', 'Premium Builders Inc', 'residence', 'new_launching',
--   'Pune, Maharashtra', 'user-uuid-here'
-- );

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- View all users with their roles
-- SELECT id, email, first_name, last_name, role, is_active FROM users ORDER BY role, first_name;

-- View all resale properties
-- SELECT * FROM resale_properties;

-- View all rental properties
-- SELECT * FROM rental_properties;

-- View all new projects
-- SELECT * FROM new_projects;

-- Search resale properties by location and price range
-- SELECT * FROM resale_properties 
-- WHERE location ILIKE '%Mumbai%' 
--   AND asking_price BETWEEN 5000000 AND 10000000;

-- Search rental properties by BHK type and rent range
-- SELECT * FROM rental_properties 
-- WHERE bhk_type = '2_bhk' 
--   AND rent_amount BETWEEN 20000 AND 30000;

-- Search new projects by construction type
-- SELECT * FROM new_projects 
-- WHERE construction_type = 'ready_to_move' 
--   AND status = 'active';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database now includes a simple system with:
-- 1. Users table with roles (ADMIN, AGENT, BUYER, BUILDER)
-- 2. Resale Properties table
-- 3. Rental Properties table  
-- 4. New Projects table
-- 
-- Key Features:
-- - Simple structure for easy CRUD operations
-- - Basic foreign key relationships
-- - Essential indexes for performance
-- - No complex triggers or RLS policies
-- - Easy to understand and maintain
-- 
-- Next steps:
-- 1. Test user creation with different roles
-- 2. Test property creation for each type
-- 3. Implement your CRUD operations
-- 4. Add any additional fields you need
-- 5. Test search and filtering functionality
