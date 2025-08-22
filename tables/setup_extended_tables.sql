-- =====================================================
-- EXTENDED SETUP SCRIPT - Includes All Property Types
-- =====================================================
-- This script will create all tables including the new property type tables
-- Execute this in your Supabase SQL Editor after running setup_all_tables.sql

-- Step 1: Create resale properties table
\i 08_resale_properties.sql

-- Step 2: Create rental properties table
\i 09_rental_properties.sql

-- Step 3: Create new projects tables
\i 10_new_projects.sql

-- Step 4: Create property activity tracking tables
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
    'users', 'admins', 'agents', 'buyers', 'builders', 'properties',
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
  AND tablename IN ('resale_properties', 'rental_properties', 'new_projects', 'project_units', 'project_amenities', 'project_approvals', 'property_activity_tracking', 'property_inquiries', 'property_views')
ORDER BY tablename, policyname;

-- =====================================================
-- SAMPLE DATA INSERTION (Optional)
-- =====================================================

-- Uncomment the following lines to insert sample data for testing

-- Insert sample resale property
-- INSERT INTO resale_properties (
--   seller_name, seller_email, seller_contact_no, 
--   property_type, bhk_type, location, asking_price, 
--   furnishing_type, status, agent_id, created_by
-- ) VALUES (
--   'John Smith', 'john.smith@email.com', '+919876543210',
--   'apartment', '3_bhk', 'Downtown Mumbai', 8500000,
--   'semi_furnished', 'available', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'
-- );

-- Insert sample rental property
-- INSERT INTO rental_properties (
--   owner_name, owner_email, owner_contact_no,
--   property_type, bhk_type, location, rent_amount,
--   furnishing_type, status, agent_id, created_by
-- ) VALUES (
--   'Jane Doe', 'jane.doe@email.com', '+919876543211',
--   'apartment', '2_bhk', 'Suburban Area', 25000,
--   'fully_furnished', 'available', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'
-- );

-- Insert sample new project
-- INSERT INTO new_projects (
--   project_name, crafted_by, project_type, construction_type,
--   project_location, status, builder_id, created_by
-- ) VALUES (
--   'Sunrise Residency', 'Premium Builders Inc', 'residence', 'new_launching',
--   'Pune, Maharashtra', 'active', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333'
-- );

-- Insert sample project unit
-- INSERT INTO project_units (
--   project_id, land_area, starting_price_with_taxes, bhk_type, carpet_area, created_by
-- ) VALUES (
--   (SELECT id FROM new_projects WHERE project_name = 'Sunrise Residency'),
--   1200.50, 4500000, '2_bhk', 950, '33333333-3333-3333-3333-333333333333'
-- );

-- Insert sample project amenities
-- INSERT INTO project_amenities (
--   project_id, club_house, swimming_pool, gym, security, lift, created_by
-- ) VALUES (
--   (SELECT id FROM new_projects WHERE project_name = 'Sunrise Residency'),
--   true, true, true, true, true, '33333333-3333-3333-3333-333333333333'
-- );

-- Insert sample project approvals
-- INSERT INTO project_approvals (
--   project_id, rera_number, units_available_for_sale, project_conversion_rate, created_by
-- ) VALUES (
--   (SELECT id FROM new_projects WHERE project_name = 'Sunrise Residency'),
--   'P52100012345', 150, 85.5, '33333333-3333-3333-3333-333333333333'
-- );

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

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
-- SETUP COMPLETE!
-- =====================================================
-- Your database now includes comprehensive tables for:
-- 1. Resale Properties (from resale owner form)
-- 2. Rental Properties (from rental owner form)  
-- 3. New Projects (from new project records form)
-- 4. Project Units, Amenities, and Approvals
-- 5. Property Activity Tracking and Analytics
-- 
-- Key Features:
-- - Created by tracking for all properties
-- - Last modified by tracking
-- - Comprehensive activity monitoring
-- - Inquiry and view analytics
-- - Performance metrics tracking
-- 
-- Next steps:
-- 1. Test property creation for each type
-- 2. Verify RLS policies are working correctly
-- 3. Test search and filtering functionality
-- 4. Implement frontend forms for each property type
-- 5. Test role-based access control
-- 6. Monitor property analytics and performance
