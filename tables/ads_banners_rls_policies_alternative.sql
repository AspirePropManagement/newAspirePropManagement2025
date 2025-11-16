-- =====================================================
-- ADS_BANNERS RLS POLICIES - Alternative Approach
-- If auth.uid() doesn't work (custom auth system)
-- =====================================================

-- First, let's check what authentication system you're using
-- Run this query to see if auth.uid() returns a value:
-- SELECT auth.uid() as current_user_id;

-- If auth.uid() is NULL, you might be using a custom auth system
-- In that case, we need to disable RLS or use a different approach

-- Option 1: If using Supabase Auth (auth.uid() works)
-- Use the main ads_banners_rls_policies.sql file

-- Option 2: If using custom auth (auth.uid() is NULL)
-- You can temporarily disable RLS for testing, or use service role key

-- Option 3: Allow authenticated users (any logged-in user can manage)
-- This is less secure but works with custom auth
ALTER TABLE public.ads_banners ENABLE ROW LEVEL SECURITY;

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

-- Policy: Allow all authenticated users to manage (TEMPORARY - for testing)
-- WARNING: This allows any authenticated user to manage banners
-- Replace with proper admin check once auth.uid() is working
CREATE POLICY "Authenticated users can manage banners" ON public.ads_banners
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- To check your current authentication status, run:
-- SELECT auth.uid() as user_id, auth.role() as role;

