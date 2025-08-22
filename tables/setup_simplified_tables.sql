-- =====================================================
-- SIMPLIFIED SETUP SCRIPT - Users with Roles + Property Tables
-- =====================================================
-- This script creates a simplified system with users table containing roles
-- and all property tables referencing users directly
-- Execute this in your Supabase SQL Editor

-- Step 1: Create users table with roles
\i 01_users.sql

-- Step 2: Create resale properties table
\i 08_resale_properties.sql

-- Step 3: Create rental properties table
\i 09_rental_properties.sql

-- Step 4: Create new projects tables
\i 10_new_projects.sql

-- Step 5: Create property activity tracking tables
\i 11_property_activity_tracking.sql

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if all tables were created
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'users',
    'resale_properties', 'rental_properties', 'new_projects', 
    'project_units', 'project_amenities', 'project_approvals',
    'property_activity_tracking', 'property_inquiries', 'property_views'
  )
ORDER BY table_name;

-- Check if all views were created
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'resale_properties_view', 'rental_properties_view', 'new_projects_view',
    'property_analytics_summary'
  )
ORDER BY table_name;

-- Check RLS policies for new tables
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
  AND tablename IN ('users', 'resale_properties', 'rental_properties', 'new_projects', 'project_units', 'project_amenities', 'project_approvals', 'property_activity_tracking', 'property_inquiries', 'property_views')
ORDER BY tablename, policyname;

-- =====================================================
-- SAMPLE DATA INSERTION (Optional)
-- =====================================================

-- Uncomment the following lines to insert sample data for testing

-- Insert sample users with different roles
-- INSERT INTO users (id, email, full_name, phone, role) VALUES 
--   ('00000000-0000-0000-0000-000000000000', 'admin@aspire.com', 'System Administrator', '+1234567890', 'admin'),
--   ('11111111-1111-1111-1111-111111111111', 'agent@aspire.com', 'John Doe Agent', '+1234567891', 'agent'),
--   ('22222222-2222-2222-2222-222222222222', 'builder@aspire.com', 'Bob Builder', '+1234567892', 'builder'),
--   ('33333333-3333-3333-3333-333333333333', 'buyer@aspire.com', 'Jane Smith Buyer', '+1234567893', 'buyer'),
--   ('44444444-4444-4444-4444-444444444444', 'user@aspire.com', 'Regular User', '+1234567894', 'user');

-- Insert sample resale property
-- INSERT INTO resale_properties (
--   seller_name, seller_email, seller_contact_no, 
--   property_type, bhk_type, location, asking_price, 
--   furnishing_type, status, assigned_agent_id, created_by
-- ) VALUES (
--   'John Smith', 'john.smith@email.com', '+919876543210',
--   'apartment', '3_bhk', 'Downtown Mumbai', 8500000,
--   'semi_furnished', 'available', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'
-- );

-- Insert sample rental property
-- INSERT INTO rental_properties (
--   owner_name, owner_email, owner_contact_no,
--   property_type, bhk_type, location, rent_amount,
--   furnishing_type, allowed_for_family, status, assigned_agent_id, created_by
-- ) VALUES (
--   'Jane Doe', 'jane.doe@email.com', '+919876543211',
--   'apartment', '2_bhk', 'Suburban Area', 25000,
--   'fully_furnished', true, 'available', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'
-- );

-- Insert sample new project
-- INSERT INTO new_projects (
--   project_name, crafted_by, project_type, construction_type,
--   project_location, status, builder_id, created_by
-- ) VALUES (
--   'Sunrise Residency', 'Premium Builders Inc', 'residence', 'new_launching',
--   'Pune, Maharashtra', 'active', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'
-- );

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- View all users with their roles
-- SELECT id, email, full_name, role, is_active FROM users ORDER BY role, full_name;

-- View all resale properties with creator information
-- SELECT * FROM resale_properties_view;

-- View all rental properties with creator information
-- SELECT * FROM rental_properties_view;

-- View all new projects with builder information
-- SELECT * FROM new_projects_view;

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

-- View property analytics summary
-- SELECT * FROM property_analytics_summary;

-- =====================================================
-- ROLE-BASED ACCESS CONTROL
-- =====================================================

-- Check user roles and permissions
-- SELECT 
--   u.id,
--   u.email,
--   u.full_name,
--   u.role,
--   CASE 
--     WHEN u.role = 'admin' THEN 'Full access to all properties and users'
--     WHEN u.role = 'agent' THEN 'Can manage assigned properties and view inquiries'
--     WHEN u.role = 'builder' THEN 'Can manage own projects and units'
--     WHEN u.role = 'buyer' THEN 'Can view properties and create inquiries'
--     ELSE 'Basic user access'
--   END as permissions
-- FROM users u
-- ORDER BY u.role, u.full_name;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database now includes a simplified system with:
-- 1. Users table with role-based access control
-- 2. Resale Properties (from resale owner form)
-- 3. Rental Properties (from rental owner form)  
-- 4. New Projects (from new project records form)
-- 5. Project Units, Amenities, and Approvals
-- 6. Property Activity Tracking and Analytics
-- 
-- Key Features:
-- - Single users table with roles (admin, agent, builder, buyer, user)
-- - Direct user references in all property tables
-- - Role-based RLS policies for security
-- - Created by tracking for all properties
-- - Last modified by tracking
-- - Comprehensive activity monitoring
-- - Inquiry and view analytics
-- - Performance metrics tracking
-- 
-- Next steps:
-- 1. Test user creation with different roles
-- 2. Test property creation for each type
-- 3. Verify RLS policies are working correctly
-- 4. Test search and filtering functionality
-- 5. Implement frontend forms for each property type
-- 6. Test role-based access control
-- 7. Monitor property analytics and performance
