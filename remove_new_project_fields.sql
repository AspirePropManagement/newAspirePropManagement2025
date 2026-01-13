-- SQL commands to remove fields from new_projects table that were removed from the form
-- Run these commands in your database

-- Remove Facing Direction
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS facing;

-- Remove Parking Type
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS parking_type;

-- Remove Property Age
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS property_age;

-- Remove Society Name
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS society_name;

-- Remove Floor Number
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS floor_no;

-- Remove Furnishing Type
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS furnishing_type;

-- Note: facing_vastu is kept in DB for detail page display as static text "Property as per Vastu Compliances"
-- but removed from the form, so we don't drop this column

-- Remove Puggestion Date
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS puggestion_date;

-- Note: puggestion_year is kept in DB as it's used for "Possession Year as per RERA" in the form

-- Remove Website URL
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS website_url;

-- Remove Brochure URL
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS brochure_url;

-- Remove CP Sables
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS cp_sables;

-- Remove Units Available for Sale
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS units_available_for_sale;

-- Remove Contact Name 1
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS contact_name_1;

-- Remove Contact Number 1
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS contact_number_1;

-- Remove Contact Name 2
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS contact_name_2;

-- Remove Contact Number 2
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS contact_number_2;

-- Remove Project Conversion Rate
ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS project_conversion_rate;

-- Note: Important Notes was already removed in a previous migration
-- Note: Other Notes was renamed to project_description in a previous migration

