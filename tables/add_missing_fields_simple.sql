-- Simple version of adding missing fields to new_projects table
-- Run these commands one by one if the main file has issues

-- Step 1: Add the columns
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS available_bhk_types text[] DEFAULT '{}';
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS carpet_area numeric(10, 2) NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS square_feet numeric(10, 2) NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS property_age text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS floor_no text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS facing text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS parking_type text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS furnishing_type text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS asking_price numeric(12, 2) NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS starting_price numeric(12, 2) NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS description text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS notes text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS society_name text NULL;
ALTER TABLE public.new_projects ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Step 2: Add indexes (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_new_projects_available_bhk_types ON public.new_projects USING GIN (available_bhk_types);
CREATE INDEX IF NOT EXISTS idx_new_projects_carpet_area ON public.new_projects USING btree (carpet_area);
CREATE INDEX IF NOT EXISTS idx_new_projects_square_feet ON public.new_projects USING btree (square_feet);

-- Step 3: Update existing records for backward compatibility
UPDATE public.new_projects SET starting_price = min_price WHERE starting_price IS NULL AND min_price IS NOT NULL;
UPDATE public.new_projects SET asking_price = min_price WHERE asking_price IS NULL AND min_price IS NOT NULL;
