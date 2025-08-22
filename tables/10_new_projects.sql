-- =====================================================
-- NEW PROJECTS TABLE - Based on NEW PROJECT'S RECORD'S FORM
-- =====================================================

CREATE TABLE new_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Project Basic Information
  crafted_by TEXT NOT NULL,                     -- This Project Is Crafted By
  project_name TEXT NOT NULL,                   -- Project Name
  project_type TEXT CHECK (project_type IN ('residence', 'gated_community_villa_or_bungalow', 'commercial', 'land_or_plot')) NOT NULL,  -- Project Type's
  construction_type TEXT CHECK (construction_type IN ('new_launching', 'under_construction', 'ready_to_move')) NOT NULL,  -- Construction Type's
  project_location TEXT NOT NULL,               -- Project Location
  
  -- Project Details
  rooms_per_floor TEXT,                         -- How many Room are Available On Each Floor
  cp_sables TEXT,                               -- Cp Sables
  other_notes TEXT,                             -- Any Other Notes
  
  -- Project Contact Details
  contact_name_1 TEXT,                          -- Project Connect Details - Name 1
  contact_number_1 TEXT,                        -- Project Connect Details - Contact No 1
  contact_name_2 TEXT,                          -- Project Connect Details - Name 2
  contact_number_2 TEXT,                        -- Project Connect Details - Contact No 2
  
  -- Project Approval Status
  is_govt_approved BOOLEAN DEFAULT false,       -- Project Is Approved By: Govt Approved
  is_rera_approved BOOLEAN DEFAULT false,       -- Project Is Approved By: Rera Approved
  loan_available BOOLEAN DEFAULT false,         -- Project Is Approved By: Loan Available
  
  -- Marketing Permissions
  social_media_marketing_allowed BOOLEAN DEFAULT false,  -- You are Allowing as to do Social Media Marketing
  
  -- Important Notes
  important_notes TEXT,                         -- ANY IMPORTANT NOTE
  
  -- Project Specifics
  units_available_for_sale TEXT,                -- How many units are available for sale at this Project
  rera_number TEXT,                             -- Please Mention Rera No
  project_conversion_rate TEXT,                 -- Project Conversion Rate
  
  -- Project Amenities
  club_house BOOLEAN DEFAULT false,             -- Club house
  swimming_pool BOOLEAN DEFAULT false,           -- Swimming pool
  children_play_area BOOLEAN DEFAULT false,     -- Children's play area
  power_backup BOOLEAN DEFAULT false,           -- Power Backup
  house_keeping BOOLEAN DEFAULT false,          -- House keeping
  lift BOOLEAN DEFAULT false,                   -- Lift
  gym BOOLEAN DEFAULT false,                    -- Gym
  park BOOLEAN DEFAULT false,                   -- Park
  security BOOLEAN DEFAULT false,               -- Security
  gas_pipeline BOOLEAN DEFAULT false,           -- Gas pipeline
  rain_water_harvesting BOOLEAN DEFAULT false,  -- Rain water harvesting
  sewage_treatment_plant BOOLEAN DEFAULT false, -- Sewage treatment plant
  visitor_parking BOOLEAN DEFAULT false,        -- Visitor parking
  fire_safety BOOLEAN DEFAULT false,            -- Fire safety
  
  -- Status
  status TEXT DEFAULT 'active',
  
  -- Images and Documents
  images TEXT[] DEFAULT '{}',
  documents TEXT[] DEFAULT '{}',
  
  -- User Linking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id) NOT NULL,  -- Links to user who created this project
  
  -- Constraints
  CONSTRAINT valid_contact_number_1 CHECK (contact_number_1 IS NULL OR contact_number_1 ~ '^\+?[0-9]{10,15}$'),
  CONSTRAINT valid_contact_number_2 CHECK (contact_number_2 IS NULL OR contact_number_2 ~ '^\+?[0-9]{10,15}$')
);

-- Indexes for better performance
CREATE INDEX idx_new_projects_name ON new_projects(project_name);
CREATE INDEX idx_new_projects_location ON new_projects(project_location);
CREATE INDEX idx_new_projects_status ON new_projects(status);
CREATE INDEX idx_new_projects_created_by ON new_projects(created_by);
CREATE INDEX idx_new_projects_project_type ON new_projects(project_type);
CREATE INDEX idx_new_projects_construction_type ON new_projects(construction_type);
CREATE INDEX idx_new_projects_crafted_by ON new_projects(crafted_by);
CREATE INDEX idx_new_projects_rera_number ON new_projects(rera_number);
