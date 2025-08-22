-- =====================================================
-- RENTAL PROPERTIES TABLE - Based on RENTAL OWNER FORM
-- =====================================================

CREATE TABLE rental_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Owner Information (SELLER DETAILS)
  owner_name TEXT NOT NULL,                     -- NAME
  submission_date DATE DEFAULT CURRENT_DATE,    -- DATE (DD/MM/2024)
  owner_email TEXT NOT NULL,                    -- EMAIL ID
  owner_contact_no TEXT NOT NULL,               -- CONTACT NO (+91)
  owner_alternate_no TEXT,                      -- ALTERNATE NO
  
  -- Property Basic Information
  property_type TEXT CHECK (property_type IN ('apartment', 'gated_community_villa_or_bungalow', 'independent_house')) NOT NULL,  -- PROPERTY TYPES
  society_name TEXT,                            -- SOCIETY NAME
  bhk_type TEXT CHECK (bhk_type IN ('1_rk_1_bhk', '2_bhk', '3_bhk', '4_bhk', '5_bhk', '5_plus_bhk')) NOT NULL,  -- BHK TYPES
  location TEXT NOT NULL,                       -- LOCATION
  flat_no TEXT,                                 -- FLAT NO
  wing_no TEXT,                                 -- WING NO
  floor_no TEXT,                                -- FLOOR NO
  
  -- Rental Terms
  rent_amount DECIMAL(10,2) NOT NULL,          -- RENT
  rent_negotiable BOOLEAN DEFAULT false,        -- RENT NEGOTIABLE (YES/NO)
  deposit_amount DECIMAL(10,2),                 -- DEPOSIT
  deposit_negotiable BOOLEAN DEFAULT false,     -- DEPOSIT NEGOTIABLE (YES/NO)
  
  -- Tenant Preferences/Restrictions
  allowed_for_family BOOLEAN DEFAULT false,     -- ALLOWED FOR: FAMILY
  allowed_for_bachelor BOOLEAN DEFAULT false,   -- ALLOWED FOR: BACHELOR
  allowed_for_anyone BOOLEAN DEFAULT false,     -- ALLOWED FOR: ANY ONE
  pets_allowed BOOLEAN DEFAULT false,           -- PET ALLOWED (YES/NO)
  
  -- Parking Information
  parking_type TEXT CHECK (parking_type IN ('covered_parking', 'open_parking', 'shed_parking')),  -- PARKING
  
  -- Furnishing Information
  furnishing_type TEXT CHECK (furnishing_type IN ('fully_furnished', 'semi_furnished', 'un_furnished')) NOT NULL,  -- FURNISHING TYPES
  
  -- Possession Information
  immediate_possession BOOLEAN DEFAULT false,    -- IMMEDIATE POSSESSION
  available_from_date DATE,                     -- OR. MENTION DATE AVAILABLE FROM
  
  -- Visit Information
  visit_details TEXT,                           -- VISIT
  
  -- Property Details
  has_amenities BOOLEAN DEFAULT false,          -- AMENITIES (YES/NO)
  
  -- Status
  status TEXT DEFAULT 'available',
  
  -- Images and Documents
  images TEXT[] DEFAULT '{}',
  documents TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- User Linking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id) NOT NULL,  -- Links to user who created this property
  
  -- Constraints
  CONSTRAINT valid_rent CHECK (rent_amount > 0),
  CONSTRAINT valid_deposit CHECK (deposit_amount IS NULL OR deposit_amount >= 0),
  CONSTRAINT valid_contact CHECK (owner_contact_no ~ '^\+?[0-9]{10,15}$'),
  CONSTRAINT valid_email CHECK (owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_tenant_restrictions CHECK (
    allowed_for_family OR allowed_for_bachelor OR allowed_for_anyone
  )
);

-- Indexes for better performance
CREATE INDEX idx_rental_properties_location ON rental_properties(location);
CREATE INDEX idx_rental_properties_rent_amount ON rental_properties(rent_amount);
CREATE INDEX idx_rental_properties_status ON rental_properties(status);
CREATE INDEX idx_rental_properties_created_by ON rental_properties(created_by);
CREATE INDEX idx_rental_properties_property_type ON rental_properties(property_type);
CREATE INDEX idx_rental_properties_bhk_type ON rental_properties(bhk_type);
CREATE INDEX idx_rental_properties_owner_email ON rental_properties(owner_email);
CREATE INDEX idx_rental_properties_submission_date ON rental_properties(submission_date);
CREATE INDEX idx_rental_properties_available_from ON rental_properties(available_from_date);
