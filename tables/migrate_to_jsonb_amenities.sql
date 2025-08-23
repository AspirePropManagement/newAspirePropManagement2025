-- Migration Script: Convert Boolean Amenities to JSONB
-- Run this script to update your existing tables

-- 1. MIGRATE RESALE PROPERTIES TABLE
-- Remove old images column if it exists
ALTER TABLE public.resale_properties DROP COLUMN IF EXISTS images;

-- Add amenities JSONB column
ALTER TABLE public.resale_properties 
ADD COLUMN amenities jsonb DEFAULT '{}'::jsonb;

-- Create GIN index for amenities
CREATE INDEX idx_resale_properties_amenities_gin 
ON public.resale_properties USING GIN (amenities);

-- 2. MIGRATE RENTAL PROPERTIES TABLE
-- Remove old images column if it exists
ALTER TABLE public.rental_properties DROP COLUMN IF EXISTS images;

-- Add amenities JSONB column
ALTER TABLE public.rental_properties 
ADD COLUMN amenities jsonb DEFAULT '{}'::jsonb;

-- Create GIN index for amenities
CREATE INDEX idx_rental_properties_amenities_gin 
ON public.rental_properties USING GIN (amenities);

-- 3. MIGRATE NEW PROJECTS TABLE
-- Remove old images column if it exists
ALTER TABLE public.new_projects DROP COLUMN IF EXISTS images;

-- Add amenities JSONB column
ALTER TABLE public.new_projects 
ADD COLUMN amenities jsonb DEFAULT '{}'::jsonb;

-- Create GIN index for amenities
CREATE INDEX idx_new_projects_amenities_gin 
ON public.new_projects USING GIN (amenities);

-- 4. MIGRATE EXISTING DATA (Optional - run after adding columns)
-- This will convert existing boolean values to JSONB format

-- For resale_properties (if you had any amenity columns)
-- UPDATE public.resale_properties 
-- SET amenities = '{}'::jsonb 
-- WHERE amenities IS NULL;

-- For rental_properties (if you had any amenity columns)
-- UPDATE public.rental_properties 
-- SET amenities = '{}'::jsonb 
-- WHERE amenities IS NULL;

-- For new_projects (if you had any amenity columns)
-- UPDATE public.new_projects 
-- SET amenities = '{}'::jsonb 
-- WHERE amenities IS NULL;

-- 5. VERIFY MIGRATION
-- Check that the new columns were added
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('resale_properties', 'rental_properties', 'new_projects') 
  AND column_name = 'amenities'
ORDER BY table_name;

-- Check that the indexes were created
SELECT 
  indexname, 
  tablename 
FROM pg_indexes 
WHERE indexname LIKE '%amenities_gin%'
ORDER BY tablename;

-- Check that old images columns were removed
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('resale_properties', 'rental_properties', 'new_projects') 
  AND column_name = 'images'
ORDER BY table_name;
