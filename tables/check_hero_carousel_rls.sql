-- Check if RLS is enabled and policies exist for hero_carousel_images
-- Run this to diagnose RLS-related performance issues

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
    AND tablename = 'hero_carousel_images';

-- Check existing RLS policies
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
    AND tablename = 'hero_carousel_images'
ORDER BY policyname;

-- Check table size and row count
SELECT 
    pg_size_pretty(pg_total_relation_size('hero_carousel_images')) as total_size,
    pg_size_pretty(pg_relation_size('hero_carousel_images')) as table_size,
    COUNT(*) as row_count
FROM hero_carousel_images;

-- Check index usage (run EXPLAIN ANALYZE on the actual query)
EXPLAIN ANALYZE
SELECT *
FROM hero_carousel_images
WHERE is_active = true
ORDER BY display_order ASC;
