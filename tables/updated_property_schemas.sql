-- Updated Property Table Schemas with JSONB Amenities
-- This replaces individual boolean columns with organized JSONB categories

-- 1. RESALE PROPERTIES TABLE
CREATE TABLE public.resale_properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_name text NOT NULL,
  submission_date date NULL DEFAULT CURRENT_DATE,
  seller_email text NOT NULL,
  seller_contact_no text NOT NULL,
  seller_alternate_no text NULL,
  property_type text NOT NULL,
  society_name text NULL,
  bhk_type text NOT NULL,
  square_feet integer NULL,
  carpet_area integer NULL,
  location text NOT NULL,
  flat_no text NULL,
  wing_no text NULL,
  floor_no text NULL,
  facing text NULL,
  parking_type text NULL,
  furnishing_type text NOT NULL,
  asking_price numeric(12, 2) NOT NULL,
  is_negotiable boolean NULL DEFAULT false,
  property_age text NULL,
  has_amenities boolean NULL DEFAULT false,
  status text NULL DEFAULT 'available'::text,
  documents text[] NULL DEFAULT '{}'::text[],
  notes text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_by uuid NOT NULL,
  property_images jsonb NULL DEFAULT '{}'::jsonb,
  amenities jsonb NULL DEFAULT '{}'::jsonb,
  CONSTRAINT resale_properties_pkey PRIMARY KEY (id),
  CONSTRAINT resale_properties_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id),
  CONSTRAINT resale_properties_parking_type_check CHECK (
    (parking_type = any (array['covered_parking'::text, 'open_parking'::text, 'shed_parking'::text]))
  ),
  CONSTRAINT resale_properties_property_type_check CHECK (
    (property_type = any (array['apartment'::text, 'gated_community_villa_or_bungalow'::text, 'independent_house'::text]))
  ),
  CONSTRAINT valid_contact CHECK ((seller_contact_no ~ '^\+?[0-9]{10,15}$'::text)),
  CONSTRAINT valid_email CHECK (
    (seller_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)
  ),
  CONSTRAINT resale_properties_bhk_type_check CHECK (
    (bhk_type = any (array['1_rk_1_bhk'::text, '2_bhk'::text, '3_bhk'::text, '4_bhk'::text, '5_bhk'::text, '5_plus_bhk'::text]))
  ),
  CONSTRAINT valid_price CHECK ((asking_price > (0)::numeric)),
  CONSTRAINT resale_properties_furnishing_type_check CHECK (
    (furnishing_type = any (array['fully_furnished'::text, 'semi_furnished'::text, 'un_furnished'::text]))
  )
) TABLESPACE pg_default;

-- 2. RENTAL PROPERTIES TABLE
CREATE TABLE public.rental_properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  submission_date date NULL DEFAULT CURRENT_DATE,
  owner_email text NOT NULL,
  owner_contact_no text NOT NULL,
  owner_alternate_no text NULL,
  property_type text NOT NULL,
  society_name text NULL,
  bhk_type text NOT NULL,
  location text NOT NULL,
  flat_no text NULL,
  wing_no text NULL,
  floor_no text NULL,
  rent_amount numeric(10, 2) NOT NULL,
  rent_negotiable boolean NULL DEFAULT false,
  deposit_amount numeric(10, 2) NULL,
  deposit_negotiable boolean NULL DEFAULT false,
  allowed_for_family boolean NULL DEFAULT false,
  allowed_for_bachelor boolean NULL DEFAULT false,
  allowed_for_anyone boolean NULL DEFAULT false,
  pets_allowed boolean NULL DEFAULT false,
  parking_type text NULL,
  furnishing_type text NOT NULL,
  immediate_possession boolean NULL DEFAULT false,
  available_from_date date NULL,
  visit_details text NULL,
  has_amenities boolean NULL DEFAULT false,
  status text NULL DEFAULT 'available'::text,
  documents text[] NULL DEFAULT '{}'::text[],
  notes text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_by uuid NOT NULL,
  property_images jsonb NULL DEFAULT '{}'::jsonb,
  amenities jsonb NULL DEFAULT '{}'::jsonb,
  CONSTRAINT rental_properties_pkey PRIMARY KEY (id),
  CONSTRAINT rental_properties_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id),
  CONSTRAINT rental_properties_parking_type_check CHECK (
    (parking_type = any (array['covered_parking'::text, 'open_parking'::text, 'shed_parking'::text]))
  ),
  CONSTRAINT rental_properties_property_type_check CHECK (
    (property_type = any (array['apartment'::text, 'gated_community_villa_or_bungalow'::text, 'independent_house'::text]))
  ),
  CONSTRAINT valid_contact CHECK ((owner_contact_no ~ '^\+?[0-9]{10,15}$'::text)),
  CONSTRAINT valid_deposit CHECK (
    ((deposit_amount is null) or (deposit_amount >= (0)::numeric))
  ),
  CONSTRAINT valid_email CHECK (
    (owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)
  ),
  CONSTRAINT valid_rent CHECK ((rent_amount > (0)::numeric)),
  CONSTRAINT rental_properties_bhk_type_check CHECK (
    (bhk_type = any (array['1_rk_1_bhk'::text, '2_bhk'::text, '3_bhk'::text, '4_bhk'::text, '5_bhk'::text, '5_plus_bhk'::text]))
  ),
  CONSTRAINT valid_tenant_restrictions CHECK (
    (allowed_for_family or allowed_for_bachelor or allowed_for_anyone)
  ),
  CONSTRAINT rental_properties_furnishing_type_check CHECK (
    (furnishing_type = any (array['fully_furnished'::text, 'semi_furnished'::text, 'un_furnished'::text]))
  )
) TABLESPACE pg_default;

-- 3. NEW PROJECTS TABLE
CREATE TABLE public.new_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  crafted_by text NOT NULL,
  project_name text NOT NULL,
  project_type text NOT NULL,
  construction_type text NOT NULL,
  project_location text NOT NULL,
  rooms_per_floor text NULL,
  cp_sables text NULL,
  other_notes text NULL,
  contact_name_1 text NULL,
  contact_number_1 text NULL,
  contact_name_2 text NULL,
  contact_number_2 text NULL,
  is_govt_approved boolean NULL DEFAULT false,
  is_rera_approved boolean NULL DEFAULT false,
  loan_available boolean NULL DEFAULT false,
  social_media_marketing_allowed boolean NULL DEFAULT false,
  important_notes text NULL,
  units_available_for_sale text NULL,
  rera_number text NULL,
  project_conversion_rate text NULL,
  status text NULL DEFAULT 'active'::text,
  documents text[] NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_by uuid NOT NULL,
  property_images jsonb NULL DEFAULT '{}'::jsonb,
  amenities jsonb NULL DEFAULT '{}'::jsonb,
  CONSTRAINT new_projects_pkey PRIMARY KEY (id),
  CONSTRAINT new_projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id),
  CONSTRAINT new_projects_construction_type_check CHECK (
    (construction_type = any (array['new_launching'::text, 'under_construction'::text, 'ready_to_move'::text]))
  ),
  CONSTRAINT new_projects_project_type_check CHECK (
    (project_type = any (array['residence'::text, 'gated_community_villa_or_bungalow'::text, 'commercial'::text, 'land_or_plot'::text]))
  ),
  CONSTRAINT valid_contact_number_1 CHECK (
    ((contact_number_1 is null) or (contact_number_1 ~ '^\+?[0-9]{10,15}$'::text))
  ),
  CONSTRAINT valid_contact_number_2 CHECK (
    ((contact_number_2 is null) or (contact_number_2 ~ '^\+?[0-9]{10,15}$'::text))
  )
) TABLESPACE pg_default;

-- INDEXES FOR RESALE PROPERTIES
CREATE INDEX IF NOT EXISTS idx_resale_properties_location ON public.resale_properties USING btree (location) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_price ON public.resale_properties USING btree (asking_price) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_status ON public.resale_properties USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_created_by ON public.resale_properties USING btree (created_by) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_property_type ON public.resale_properties USING btree (property_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_bhk_type ON public.resale_properties USING btree (bhk_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_seller_email ON public.resale_properties USING btree (seller_email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_submission_date ON public.resale_properties USING btree (submission_date) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_images_gin ON public.resale_properties USING GIN (property_images) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_resale_properties_amenities_gin ON public.resale_properties USING GIN (amenities) TABLESPACE pg_default;

-- INDEXES FOR RENTAL PROPERTIES
CREATE INDEX IF NOT EXISTS idx_rental_properties_location ON public.rental_properties USING btree (location) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_rent_amount ON public.rental_properties USING btree (rent_amount) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_status ON public.rental_properties USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_created_by ON public.rental_properties USING btree (created_by) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_property_type ON public.rental_properties USING btree (property_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_bhk_type ON public.rental_properties USING btree (bhk_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_owner_email ON public.rental_properties USING btree (owner_email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_submission_date ON public.rental_properties USING btree (submission_date) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_available_from ON public.rental_properties USING btree (available_from_date) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_images_gin ON public.rental_properties USING GIN (property_images) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_rental_properties_amenities_gin ON public.rental_properties USING GIN (amenities) TABLESPACE pg_default;

-- INDEXES FOR NEW PROJECTS
CREATE INDEX IF NOT EXISTS idx_new_projects_name ON public.new_projects USING btree (project_name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_location ON public.new_projects USING btree (project_location) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_status ON public.new_projects USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_created_by ON public.new_projects USING btree (created_by) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_project_type ON public.new_projects USING btree (project_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_construction_type ON public.new_projects USING btree (construction_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_crafted_by ON public.new_projects USING btree (crafted_by) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_rera_number ON public.new_projects USING btree (rera_number) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_images_gin ON public.new_projects USING GIN (property_images) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_new_projects_amenities_gin ON public.new_projects USING GIN (amenities) TABLESPACE pg_default;

-- MIGRATION SCRIPTS TO UPDATE EXISTING TABLES
-- Run these if you want to migrate existing data

-- 1. MIGRATE RESALE PROPERTIES
-- ALTER TABLE public.resale_properties ADD COLUMN amenities jsonb DEFAULT '{}'::jsonb;
-- CREATE INDEX idx_resale_properties_amenities_gin ON public.resale_properties USING GIN (amenities);

-- 2. MIGRATE RENTAL PROPERTIES  
-- ALTER TABLE public.rental_properties ADD COLUMN amenities jsonb DEFAULT '{}'::jsonb;
-- CREATE INDEX idx_rental_properties_amenities_gin ON public.rental_properties USING GIN (amenities);

-- 3. MIGRATE NEW PROJECTS
-- ALTER TABLE public.new_projects ADD COLUMN amenities jsonb DEFAULT '{}'::jsonb;
-- CREATE INDEX idx_new_projects_amenities_gin ON public.new_projects USING GIN (amenities);

-- EXAMPLE AMENITIES JSONB STRUCTURE:
-- {
--   "basic_amenities": {
--     "power_backup": true,
--     "lift": true,
--     "security": true,
--     "visitor_parking": true
--   },
--   "luxury_amenities": {
--     "club_house": true,
--     "swimming_pool": true,
--     "gym": true,
--     "children_play_area": true
--   },
--   "infrastructure": {
--     "gas_pipeline": true,
--     "rain_water_harvesting": true,
--     "sewage_treatment_plant": true,
--     "fire_safety": true
--   },
--   "services": {
--     "house_keeping": true,
--     "social_media_marketing_allowed": true
--   }
-- }
