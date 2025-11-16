-- =====================================================
-- COMPLETE SETUP FOR ADS_BANNERS RLS POLICIES
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- Step 1: Ensure your users table ID matches auth.uid()
-- If you're using Supabase Auth, your users.id should equal auth.users.id
-- Check this first:
-- SELECT id, email, role FROM public.users WHERE email = 'your-admin-email@example.com';
-- SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';
-- These IDs should match!

-- Step 2: Create/Update the is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  auth_user_id UUID;
  user_record RECORD;
BEGIN
  -- Get the current authenticated user ID from Supabase Auth
  auth_user_id := auth.uid();
  
  -- If no user is authenticated via Supabase Auth, return false
  IF auth_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user exists in users table with ADMIN role
  SELECT INTO user_record
    id, role, is_active, status
  FROM public.users 
  WHERE id = auth_user_id 
  LIMIT 1;
  
  -- If user found and is admin
  IF FOUND THEN
    RETURN (
      user_record.role = 'ADMIN' 
      AND (user_record.is_active = true OR user_record.is_active IS NULL)
      AND (user_record.status = 'APPROVED' OR user_record.status IS NULL)
    );
  END IF;
  
  -- If no match found, return false
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Enable RLS on ads_banners
ALTER TABLE public.ads_banners ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view active banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can view all banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can insert banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can update banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON public.ads_banners;

-- Step 5: Create policies
-- Policy: Anyone can view active banners (for public display)
CREATE POLICY "Public can view active banners" ON public.ads_banners
  FOR SELECT USING (
    is_active = true AND
    (
      start_at IS NULL OR start_at <= NOW()
    ) AND
    (
      end_at IS NULL OR end_at >= NOW()
    )
  );

-- Policy: Admins can view all banners (for admin panel)
CREATE POLICY "Admins can view all banners" ON public.ads_banners
  FOR SELECT USING (public.is_admin());

-- Policy: Admins can insert banners
CREATE POLICY "Admins can insert banners" ON public.ads_banners
  FOR INSERT WITH CHECK (public.is_admin());

-- Policy: Admins can update banners
CREATE POLICY "Admins can update banners" ON public.ads_banners
  FOR UPDATE USING (public.is_admin());

-- Policy: Admins can delete banners
CREATE POLICY "Admins can delete banners" ON public.ads_banners
  FOR DELETE USING (public.is_admin());

-- Step 6: Verify everything is set up correctly
SELECT 
  'Function created' as check_type,
  EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_admin' 
    AND pronamespace = 'public'::regnamespace
  ) as status
UNION ALL
SELECT 
  'RLS enabled' as check_type,
  rowsecurity as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'ads_banners'
UNION ALL
SELECT 
  'Policies created' as check_type,
  (COUNT(*) >= 5)::boolean as status
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'ads_banners';

-- Step 7: Test the is_admin() function (replace with your actual user ID)
-- SELECT public.is_admin() as is_admin_result, auth.uid() as current_user_id;

-- Step 8: Verify policies
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

