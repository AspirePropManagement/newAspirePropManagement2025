-- Add contact fields to new_projects table
-- These fields allow storing primary and secondary contact information for projects

-- Add contact_name_1 column (Primary contact person name)
ALTER TABLE public.new_projects
ADD COLUMN IF NOT EXISTS contact_name_1 text NULL;

-- Add contact_number_1 column (Primary contact phone number)
ALTER TABLE public.new_projects
ADD COLUMN IF NOT EXISTS contact_number_1 text NULL;

-- Add contact_name_2 column (Secondary contact person name)
ALTER TABLE public.new_projects
ADD COLUMN IF NOT EXISTS contact_name_2 text NULL;

-- Add contact_number_2 column (Secondary contact phone number)
ALTER TABLE public.new_projects
ADD COLUMN IF NOT EXISTS contact_number_2 text NULL;

-- Add check constraint for contact_number_1 format (10-15 digits with optional + prefix)
ALTER TABLE public.new_projects
DROP CONSTRAINT IF EXISTS valid_contact_number_1;

ALTER TABLE public.new_projects
ADD CONSTRAINT valid_contact_number_1 
CHECK (
  contact_number_1 IS NULL 
  OR contact_number_1 ~ '^\+?[0-9]{10,15}$'
);

-- Add check constraint for contact_number_2 format (10-15 digits with optional + prefix)
ALTER TABLE public.new_projects
DROP CONSTRAINT IF EXISTS valid_contact_number_2;

ALTER TABLE public.new_projects
ADD CONSTRAINT valid_contact_number_2 
CHECK (
  contact_number_2 IS NULL 
  OR contact_number_2 ~ '^\+?[0-9]{10,15}$'
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_new_projects_contact_number_1 
ON public.new_projects (contact_number_1) 
WHERE contact_number_1 IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_new_projects_contact_number_2 
ON public.new_projects (contact_number_2) 
WHERE contact_number_2 IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.new_projects.contact_name_1 IS 'Primary contact person name for the project';
COMMENT ON COLUMN public.new_projects.contact_number_1 IS 'Primary contact phone number (10-15 digits, optional + prefix)';
COMMENT ON COLUMN public.new_projects.contact_name_2 IS 'Secondary contact person name for the project';
COMMENT ON COLUMN public.new_projects.contact_number_2 IS 'Secondary contact phone number (10-15 digits, optional + prefix)';

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'new_projects'
    AND column_name IN ('contact_name_1', 'contact_number_1', 'contact_name_2', 'contact_number_2')
ORDER BY column_name;
