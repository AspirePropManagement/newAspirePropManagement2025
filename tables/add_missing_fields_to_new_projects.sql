-- Add missing fields to new_projects table for complete property information
-- These fields are needed for proper display and functionality

-- Add available BHK types field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS available_bhk_types text[] DEFAULT '{}';

-- Add carpet area field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS carpet_area numeric(10, 2) NULL;

-- Add built-up area (square feet) field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS square_feet numeric(10, 2) NULL;

-- Add property age field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS property_age text NULL;

-- Add floor number field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS floor_no text NULL;

-- Add facing direction field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS facing text NULL;

-- Add parking type field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS parking_type text NULL;

-- Add furnishing type field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS furnishing_type text NULL;

-- Add society name field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS society_name text NULL;

-- Add asking price field (for comparison with min_price)
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS asking_price numeric(12, 2) NULL;

-- Add starting price field (alias for min_price)
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS starting_price numeric(12, 2) NULL;

-- Add description field
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS description text NULL;

-- Add notes field (alias for other_notes)
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS notes text NULL;

-- Add images field (simple array for backward compatibility)
ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Add comments to describe the new fields
COMMENT ON COLUMN public.new_projects.available_bhk_types IS 'Array of available BHK types in the project (e.g., ["1_bhk", "2_bhk", "3_bhk"])';
COMMENT ON COLUMN public.new_projects.carpet_area IS 'Carpet area in square feet';
COMMENT ON COLUMN public.new_projects.square_feet IS 'Built-up area in square feet';
COMMENT ON COLUMN public.new_projects.property_age IS 'Age of the property (e.g., "Under Construction", "Ready to Move")';
COMMENT ON COLUMN public.new_projects.floor_no IS 'Floor number or range (e.g., "5th Floor", "Ground Floor")';
COMMENT ON COLUMN public.new_projects.facing IS 'Facing direction (e.g., "North", "East", "South", "West")';
COMMENT ON COLUMN public.new_projects.parking_type IS 'Type of parking available';
COMMENT ON COLUMN public.new_projects.furnishing_type IS 'Furnishing status (e.g., "Fully Furnished", "Semi Furnished", "Unfurnished")';
COMMENT ON COLUMN public.new_projects.society_name IS 'Society or building name';
COMMENT ON COLUMN public.new_projects.asking_price IS 'Asking price for the property';
COMMENT ON COLUMN public.new_projects.starting_price IS 'Starting price (alias for min_price)';
COMMENT ON COLUMN public.new_projects.description IS 'Detailed description of the property';
COMMENT ON COLUMN public.new_projects.notes IS 'Additional notes (alias for other_notes)';
COMMENT ON COLUMN public.new_projects.images IS 'Simple array of image URLs for backward compatibility';

-- Create indexes for the new fields for better performance
CREATE INDEX IF NOT EXISTS idx_new_projects_available_bhk_types 
ON public.new_projects USING GIN (available_bhk_types);

CREATE INDEX IF NOT EXISTS idx_new_projects_carpet_area 
ON public.new_projects USING btree (carpet_area);

CREATE INDEX IF NOT EXISTS idx_new_projects_square_feet 
ON public.new_projects USING btree (square_feet);

CREATE INDEX IF NOT EXISTS idx_new_projects_property_age 
ON public.new_projects USING btree (property_age);

CREATE INDEX IF NOT EXISTS idx_new_projects_floor_no 
ON public.new_projects USING btree (floor_no);

CREATE INDEX IF NOT EXISTS idx_new_projects_facing 
ON public.new_projects USING btree (facing);

CREATE INDEX IF NOT EXISTS idx_new_projects_parking_type 
ON public.new_projects USING btree (parking_type);

CREATE INDEX IF NOT EXISTS idx_new_projects_furnishing_type 
ON public.new_projects USING btree (furnishing_type);

CREATE INDEX IF NOT EXISTS idx_new_projects_society_name 
ON public.new_projects USING btree (society_name);

CREATE INDEX IF NOT EXISTS idx_new_projects_asking_price 
ON public.new_projects USING btree (asking_price);

CREATE INDEX IF NOT EXISTS idx_new_projects_starting_price 
ON public.new_projects USING btree (starting_price);

CREATE INDEX IF NOT EXISTS idx_new_projects_images 
ON public.new_projects USING GIN (images);

-- Add constraints for the new fields where appropriate

-- Furnishing type constraint
ALTER TABLE public.new_projects 
ADD CONSTRAINT IF NOT EXISTS new_projects_furnishing_type_check 
CHECK (
  furnishing_type IS NULL OR 
  furnishing_type = ANY (ARRAY['fully_furnished'::text, 'semi_furnished'::text, 'un_furnished'::text])
);

-- Parking type constraint
ALTER TABLE public.new_projects 
ADD CONSTRAINT IF NOT EXISTS new_projects_parking_type_check 
CHECK (
  parking_type IS NULL OR 
  parking_type = ANY (ARRAY['covered_parking'::text, 'open_parking'::text, 'shed_parking'::text])
);

-- Facing direction constraint
ALTER TABLE public.new_projects 
ADD CONSTRAINT IF NOT EXISTS new_projects_facing_check 
CHECK (
  facing IS NULL OR 
  facing = ANY (ARRAY['north'::text, 'south'::text, 'east'::text, 'west'::text, 'north_east'::text, 'north_west'::text, 'south_east'::text, 'south_west'::text])
);

-- Update existing records to set starting_price = min_price for backward compatibility
UPDATE public.new_projects 
SET starting_price = min_price 
WHERE starting_price IS NULL AND min_price IS NOT NULL;

-- Update existing records to set asking_price = min_price for display purposes
UPDATE public.new_projects 
SET asking_price = min_price 
WHERE asking_price IS NULL AND min_price IS NOT NULL;
