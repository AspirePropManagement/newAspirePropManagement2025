-- TEMPORARY: Disable RLS on hero_carousel_images to test if RLS is causing timeout
-- ONLY USE FOR TESTING - Re-enable RLS after testing

-- Disable RLS temporarily
ALTER TABLE hero_carousel_images DISABLE ROW LEVEL SECURITY;

-- Test the query - it should work without RLS
-- SELECT * FROM hero_carousel_images WHERE is_active = true ORDER BY display_order ASC;

-- IMPORTANT: After testing, re-enable RLS and apply proper policies:
-- ALTER TABLE hero_carousel_images ENABLE ROW LEVEL SECURITY;
-- Then run hero_carousel_rls_policies.sql
