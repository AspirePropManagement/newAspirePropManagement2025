-- =====================================================
-- MASTER SETUP SCRIPT - Execute all tables in order
-- =====================================================
-- This script will create all tables and functions for the Aspire Property Management system
-- Execute this in your Supabase SQL Editor

-- Step 1: Create base users table
\i 01_users.sql

-- Step 2: Create admins table
\i 02_admins.sql

-- Step 3: Create agents table
\i 03_agents.sql

-- Step 4: Create buyers table
\i 04_buyers.sql

-- Step 5: Create builders table
\i 05_builders.sql

-- Step 6: Create properties table
\i 06_properties.sql

-- Step 7: Create helper functions
\i 07_functions.sql

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if all tables were created
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'admins', 'agents', 'buyers', 'builders', 'properties')
ORDER BY table_name;

-- Check if all functions were created
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_user_role', 'has_role', 'has_any_role', 'get_admin_level', 'is_super_admin', 'get_user_profile_with_role', 'check_user_permission', 'get_all_users_with_roles', 'update_user_role')
ORDER BY routine_name;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- SAMPLE DATA INSERTION (Optional)
-- =====================================================

-- Uncomment the following lines to insert sample data for testing

-- Insert sample admin user
-- INSERT INTO users (id, email, full_name, phone) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@aspire.com', 'System Administrator', '+1234567890');

-- INSERT INTO admins (user_id, admin_level, permissions, can_manage_system) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin', '{"all": true}', true);

-- Insert sample agent
-- INSERT INTO users (id, email, full_name, phone) 
-- VALUES ('11111111-1111-1111-1111-111111111111', 'agent@aspire.com', 'John Doe Agent', '+1234567891');

-- INSERT INTO agents (user_id, license_number, specialization, experience_years, is_verified) 
-- VALUES ('11111111-1111-1111-1111-111111111111', 'AG123456', ARRAY['residential', 'luxury'], 5, true);

-- Insert sample buyer
-- INSERT INTO users (id, email, full_name, phone) 
-- VALUES ('22222222-2222-2222-2222-222222222222', 'buyer@aspire.com', 'Jane Smith Buyer', '+1234567892');

-- INSERT INTO buyers (user_id, budget_min, budget_max, preferred_locations, property_types, bedrooms_min) 
-- VALUES ('22222222-2222-2222-2222-222222222222', 200000, 500000, ARRAY['Downtown', 'Suburbs'], ARRAY['residential'], 2);

-- Insert sample builder
-- INSERT INTO users (id, email, full_name, phone) 
-- VALUES ('33333333-3333-3333-3333-333333333333', 'builder@aspire.com', 'Bob Builder', '+1234567893');

-- INSERT INTO builders (user_id, company_name, license_number, specialization, experience_years, is_verified) 
-- VALUES ('33333333-3333-3333-3333-333333333333', 'Premium Builders Inc', 'BL123456', ARRAY['residential', 'luxury'], 10, true);

-- Insert sample property
-- INSERT INTO properties (title, description, price, location, address, city, state, property_type, bedrooms, bathrooms, square_feet, agent_id) 
-- VALUES ('Beautiful Family Home', 'Spacious 3-bedroom home in quiet neighborhood', 350000, 'Downtown', '123 Main St', 'New York', 'NY', 'residential', 3, 2.5, 1800, '11111111-1111-1111-1111-111111111111');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready for the Aspire Property Management application
-- 
-- Next steps:
-- 1. Test user registration and authentication
-- 2. Verify role assignment works correctly
-- 3. Test property creation and management
-- 4. Verify RLS policies are working
-- 5. Test admin functions and permissions
