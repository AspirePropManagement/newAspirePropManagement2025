-- TEST SCRIPT: Temporarily disable RLS on hero_carousel_images
-- This helps determine if RLS policies are causing query timeouts
-- 
-- IMPORTANT: This is for TESTING ONLY. Re-enable RLS after testing.

-- Step 1: Disable RLS temporarily
ALTER TABLE hero_carousel_images DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
    AND tablename = 'hero_carousel_images';
-- Should show: rls_enabled = false

-- Step 3: Test the query (this should work now)
-- SELECT * FROM hero_carousel_images WHERE is_active = true ORDER BY display_order ASC;

-- ============================================
-- AFTER TESTING:
-- ============================================
-- If disabling RLS fixes the timeout, the issue is RLS policy overhead.
-- If it still times out, the issue is database infrastructure/performance limits.
--
-- To re-enable RLS after testing:
-- 1. Run: ALTER TABLE hero_carousel_images ENABLE ROW LEVEL SECURITY;
-- 2. Then run: tables/hero_carousel_rls_policies.sql
