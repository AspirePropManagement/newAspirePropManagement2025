-- =====================================================
-- UPDATE USERS TABLE AND CREATE ROLE-SPECIFIC TABLES
-- =====================================================

-- 1. Add OWNER role to existing users table
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check CHECK (
  (role)::text = ANY (ARRAY[
    'ADMIN'::text,
    'AGENT'::text, 
    'BUYER'::text,
    'BUILDER'::text,
    'OWNER'::text
  ])
);

-- 2. Create AGENT_PROFILES table for agent-specific information
CREATE TABLE public.agent_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  firm_name TEXT,
  rera_id TEXT,
  rera_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one profile per user
  CONSTRAINT agent_profiles_user_id_unique UNIQUE (user_id)
) TABLESPACE pg_default;

-- 3. Create OWNER_PROFILES table for owner-specific information
CREATE TABLE public.owner_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  properties_count INTEGER DEFAULT 0,
  primary_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one profile per user
  CONSTRAINT owner_profiles_user_id_unique UNIQUE (user_id)
) TABLESPACE pg_default;

-- 4. Create BUILDER_PROFILES table for builder-specific information
CREATE TABLE public.builder_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT,
  rera_id TEXT,
  rera_number TEXT,
  years_of_experience INTEGER,
  projects_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one profile per user
  CONSTRAINT builder_profiles_user_id_unique UNIQUE (user_id)
) TABLESPACE pg_default;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_profiles_user_id ON public.agent_profiles USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agent_profiles_rera_id ON public.agent_profiles USING btree (rera_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_owner_profiles_user_id ON public.owner_profiles USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_owner_profiles_location ON public.owner_profiles USING btree (primary_location) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_builder_profiles_user_id ON public.builder_profiles USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_builder_profiles_rera_id ON public.builder_profiles USING btree (rera_id) TABLESPACE pg_default;

-- 6. Create functions to automatically create profiles when user role changes
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile based on user role
  IF NEW.role = 'AGENT' THEN
    INSERT INTO public.agent_profiles (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'OWNER' THEN
    INSERT INTO public.owner_profiles (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'BUILDER' THEN
    INSERT INTO public.builder_profiles (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to automatically create profiles
DROP TRIGGER IF EXISTS trigger_create_user_profile ON public.users;
CREATE TRIGGER trigger_create_user_profile
  AFTER INSERT OR UPDATE OF role ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- 8. Add comments for documentation
COMMENT ON TABLE public.agent_profiles IS 'Agent-specific information linked to users table';
COMMENT ON TABLE public.owner_profiles IS 'Owner-specific information linked to users table';
COMMENT ON TABLE public.builder_profiles IS 'Builder-specific information linked to users table';

COMMENT ON COLUMN public.agent_profiles.firm_name IS 'Name of the real estate firm';
COMMENT ON COLUMN public.agent_profiles.rera_id IS 'RERA registration ID';
COMMENT ON COLUMN public.agent_profiles.rera_number IS 'RERA registration number';

COMMENT ON COLUMN public.owner_profiles.properties_count IS 'Number of properties owned';
COMMENT ON COLUMN public.owner_profiles.primary_location IS 'Primary location of properties';

COMMENT ON COLUMN public.builder_profiles.company_name IS 'Name of the construction company';
COMMENT ON COLUMN public.builder_profiles.years_of_experience IS 'Years of experience in construction';
COMMENT ON COLUMN public.builder_profiles.projects_completed IS 'Number of projects completed';

-- 9. Create views for easy querying with user information
CREATE OR REPLACE VIEW public.users_with_profiles AS
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.phone,
  u.role,
  u.is_active,
  u.created_at,
  u.updated_at,
  -- Agent profile fields
  ap.firm_name as agent_firm_name,
  ap.rera_id as agent_rera_id,
  ap.rera_number as agent_rera_number,
  -- Owner profile fields
  op.properties_count as owner_properties_count,
  op.primary_location as owner_primary_location,
  -- Builder profile fields
  bp.company_name as builder_company_name,
  bp.rera_id as builder_rera_id,
  bp.rera_number as builder_rera_number,
  bp.years_of_experience as builder_years_experience,
  bp.projects_completed as builder_projects_completed
FROM public.users u
LEFT JOIN public.agent_profiles ap ON u.id = ap.user_id AND u.role = 'AGENT'
LEFT JOIN public.owner_profiles op ON u.id = op.user_id AND u.role = 'OWNER'
LEFT JOIN public.builder_profiles bp ON u.id = bp.user_id AND u.role = 'BUILDER';

-- 10. Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_profiles TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.owner_profiles TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.builder_profiles TO your_app_user;
-- GRANT SELECT ON public.users_with_profiles TO your_app_user;
