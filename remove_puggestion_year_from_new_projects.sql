-- =====================================================
-- REMOVE PUGGESTION YEAR FIELD FROM NEW PROJECTS
-- =====================================================
-- This script removes puggestion_year from the new_projects table in Supabase

-- Drop the column
ALTER TABLE public.new_projects
DROP COLUMN IF EXISTS puggestion_year;

-- Verify the column was removed
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'new_projects'
    AND column_name = 'puggestion_year'
ORDER BY column_name;

-- Expected result: No rows should be returned (column successfully removed)
