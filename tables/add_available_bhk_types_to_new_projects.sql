-- Add available_bhk_types field to new_projects table
-- This field will store an array of BHK types available in the project

ALTER TABLE public.new_projects 
ADD COLUMN available_bhk_types text[] DEFAULT '{}';

-- Add comment to describe the field
COMMENT ON COLUMN public.new_projects.available_bhk_types IS 'Array of available BHK types in the project (e.g., ["1_bhk", "2_bhk", "3_bhk"])';

-- Create index for better performance when filtering by BHK types
CREATE INDEX IF NOT EXISTS idx_new_projects_available_bhk_types 
ON public.new_projects USING GIN (available_bhk_types);
