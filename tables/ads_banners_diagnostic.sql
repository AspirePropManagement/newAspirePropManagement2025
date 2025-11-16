-- =====================================================
-- ADS_BANNERS RLS DIAGNOSTIC QUERIES
-- Run these to diagnose the issue
-- =====================================================

-- 1. Check if you're authenticated and what your user ID is
SELECT 
  auth.uid() as current_auth_user_id,
  auth.role() as auth_role;

-- 2. Check if your user exists in the users table
SELECT 
  id,
  email,
  role,
  is_active,
  CASE 
    WHEN id = auth.uid() THEN 'MATCHES auth.uid()'
    ELSE 'DOES NOT MATCH auth.uid()'
  END as auth_match_status
FROM public.users
WHERE email = 'your-email@example.com';  -- Replace with your email

-- 3. Check if is_admin() function exists and works
SELECT public.is_admin() as is_admin_result;

-- 4. Check existing RLS policies on ads_banners
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
WHERE schemaname = 'public' AND tablename = 'ads_banners'
ORDER BY policyname;

-- 5. Check if users table has RLS that might block the function
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- 6. Check users table RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- 7. Test if you can read from users table (should return your user if RLS allows)
SELECT 
  id,
  email,
  role,
  is_active
FROM public.users
WHERE id = auth.uid();

