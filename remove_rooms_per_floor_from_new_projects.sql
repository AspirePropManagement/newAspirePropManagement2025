-- =====================================================
-- REMOVE ROOMS PER FLOOR FIELD FROM NEW PROJECTS
-- =====================================================
-- This script removes rooms_per_floor from the new_projects table in Supabase
-- Note: flats_per_floor is kept as it's the standard field used across property types

-- Drop the column
ALTER TABLE public.new_projects
DROP COLUMN IF EXISTS rooms_per_floor;

-- Verify the column was removed
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'new_projects'
    AND column_name = 'rooms_per_floor'
ORDER BY column_name;

-- Expected result: No rows should be returned (column successfully removed)
