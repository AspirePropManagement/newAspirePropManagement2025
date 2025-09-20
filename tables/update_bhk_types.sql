-- =====================================================
-- UPDATE BHK TYPES TO SEPARATE 1RK AND 1BHK
-- =====================================================

-- Update existing data first
UPDATE public.resale_properties 
SET bhk_type = '1_rk' 
WHERE bhk_type = '1_rk_1_bhk';

UPDATE public.rental_properties 
SET bhk_type = '1_rk' 
WHERE bhk_type = '1_rk_1_bhk';

UPDATE public.new_projects 
SET bhk_type = '1_rk' 
WHERE bhk_type = '1_rk_1_bhk';

-- Drop existing constraints
ALTER TABLE public.resale_properties DROP CONSTRAINT IF EXISTS resale_properties_bhk_type_check;
ALTER TABLE public.rental_properties DROP CONSTRAINT IF EXISTS rental_properties_bhk_type_check;
ALTER TABLE public.new_projects DROP CONSTRAINT IF EXISTS new_projects_bhk_type_check;

-- Add new constraints with separated 1RK and 1BHK
ALTER TABLE public.resale_properties 
ADD CONSTRAINT resale_properties_bhk_type_check CHECK (
  bhk_type = ANY (ARRAY['1_rk'::text, '1_bhk'::text, '2_bhk'::text, '3_bhk'::text, '4_bhk'::text, '5_bhk'::text, '5_plus_bhk'::text])
);

ALTER TABLE public.rental_properties 
ADD CONSTRAINT rental_properties_bhk_type_check CHECK (
  bhk_type = ANY (ARRAY['1_rk'::text, '1_bhk'::text, '2_bhk'::text, '3_bhk'::text, '4_bhk'::text, '5_bhk'::text, '5_plus_bhk'::text])
);

ALTER TABLE public.new_projects 
ADD CONSTRAINT new_projects_bhk_type_check CHECK (
  bhk_type = ANY (ARRAY['1_rk'::text, '1_bhk'::text, '2_bhk'::text, '3_bhk'::text, '4_bhk'::text, '5_bhk'::text, '5_plus_bhk'::text])
);

-- Update the schema files for future reference
COMMENT ON CONSTRAINT resale_properties_bhk_type_check ON public.resale_properties IS 'Updated to separate 1RK and 1BHK options';
COMMENT ON CONSTRAINT rental_properties_bhk_type_check ON public.rental_properties IS 'Updated to separate 1RK and 1BHK options';
COMMENT ON CONSTRAINT new_projects_bhk_type_check ON public.new_projects IS 'Updated to separate 1RK and 1BHK options';
