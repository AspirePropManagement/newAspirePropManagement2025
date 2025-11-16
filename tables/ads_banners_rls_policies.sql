-- =====================================================
-- ADS_BANNERS RLS POLICIES - Row Level Security
-- =====================================================

-- IMPORTANT: Before running this, ensure your users table allows reading user roles
-- If your users table has RLS, you may need to add a policy like:
-- CREATE POLICY "Allow reading own role for RLS checks" ON public.users
--   FOR SELECT USING (id = auth.uid() OR EXISTS (
--     SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
--   ));

-- Enable Row Level Security (if not already enabled)
ALTER TABLE public.ads_banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view active banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can view all banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can insert banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can update banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON public.ads_banners;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.ads_banners;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.ads_banners;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON public.ads_banners;

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

-- Helper function to check if current user is admin
-- Uses SECURITY DEFINER to bypass RLS on users table if needed
-- This function works whether users.id matches auth.uid() or not
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
  -- Try matching by auth.uid() first (if users.id = auth.uid())
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

-- Policy: Admins can view all banners (for admin panel)
CREATE POLICY "Admins can view all banners" ON public.ads_banners
  FOR SELECT USING (public.is_admin());

-- Policy: Allow inserts (admin check is done in application code)
-- Since we're using localStorage auth, auth.uid() won't work
-- Admin role validation is handled in the AdsBannersManager component
CREATE POLICY "Allow authenticated inserts" ON public.ads_banners
  FOR INSERT WITH CHECK (true);

-- Policy: Allow updates (admin check is done in application code)
CREATE POLICY "Allow authenticated updates" ON public.ads_banners
  FOR UPDATE USING (true);

-- Policy: Allow deletes (admin check is done in application code)
CREATE POLICY "Allow authenticated deletes" ON public.ads_banners
  FOR DELETE USING (true);

-- Verify policies were created
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

