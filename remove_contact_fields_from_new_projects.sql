-- =====================================================
-- REMOVE CONTACT 1 AND CONTACT 2 FIELDS FROM NEW PROJECTS
-- =====================================================
-- This script removes contact_name_1, contact_number_1, contact_name_2, and contact_number_2
-- from the new_projects table in Supabase

-- Step 1: Drop indexes if they exist
DROP INDEX IF EXISTS public.idx_new_projects_contact_number_1;
DROP INDEX IF EXISTS public.idx_new_projects_contact_number_2;

-- Step 2: Drop constraints if they exist
ALTER TABLE public.new_projects
DROP CONSTRAINT IF EXISTS valid_contact_number_1;

ALTER TABLE public.new_projects
DROP CONSTRAINT IF EXISTS valid_contact_number_2;

-- Step 3: Drop the columns
ALTER TABLE public.new_projects
DROP COLUMN IF EXISTS contact_name_1;

ALTER TABLE public.new_projects
DROP COLUMN IF EXISTS contact_number_1;

ALTER TABLE public.new_projects
DROP COLUMN IF EXISTS contact_name_2;

ALTER TABLE public.new_projects
DROP COLUMN IF EXISTS contact_number_2;

-- Step 4: Verify the columns were removed
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'new_projects'
    AND column_name IN ('contact_name_1', 'contact_number_1', 'contact_name_2', 'contact_number_2')
ORDER BY column_name;

-- Expected result: No rows should be returned (columns successfully removed)
