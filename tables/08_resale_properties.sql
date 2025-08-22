-- =====================================================
-- RESALE PROPERTIES TABLE - Based on RESALE OWNER FORM
-- =====================================================

CREATE TABLE resale_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Seller Information (SELLER DETAILS)
  seller_name TEXT NOT NULL,                    -- NAME
  submission_date DATE DEFAULT CURRENT_DATE,    -- DATE (DD/MM/2024)
  seller_email TEXT NOT NULL,                   -- EMAIL ID
  seller_contact_no TEXT NOT NULL,              -- CONTACT NO (+91)
  seller_alternate_no TEXT,                     -- ALTERNATE NO
  
  -- Property Basic Information
  property_type TEXT CHECK (property_type IN ('apartment', 'gated_community_villa_or_bungalow', 'independent_house')) NOT NULL,  -- PROPERTY TYPES
  society_name TEXT,                            -- SOCIETY NAME
  bhk_type TEXT CHECK (bhk_type IN ('1_rk_1_bhk', '2_bhk', '3_bhk', '4_bhk', '5_bhk', '5_plus_bhk')) NOT NULL,  -- BHK TYPES
  square_feet INTEGER,                          -- SQ'FT
  carpet_area INTEGER,                          -- CARPET
  location TEXT NOT NULL,                       -- LOCATION
  flat_no TEXT,                                 -- FLAT NO
  wing_no TEXT,                                 -- WING NO
  floor_no TEXT,                                -- FLOOR NO
  facing TEXT,                                  -- FACING
  
  -- Parking Information
  parking_type TEXT CHECK (parking_type IN ('covered_parking', 'open_parking', 'shed_parking')),  -- PARKING
  
  -- Furnishing Information
  furnishing_type TEXT CHECK (furnishing_type IN ('fully_furnished', 'semi_furnished', 'un_furnished')) NOT NULL,  -- FURNISHING TYPES
  
  -- Pricing Information
  asking_price DECIMAL(12,2) NOT NULL,         -- ASKING PRICE
  is_negotiable BOOLEAN DEFAULT false,          -- NEGOTIABLE (YES/NO)
  
  -- Property Details
  property_age TEXT,                            -- PROPERTY AGE
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
  CONSTRAINT valid_price CHECK (asking_price > 0),
  CONSTRAINT valid_contact CHECK (seller_contact_no ~ '^\+?[0-9]{10,15}$'),
  CONSTRAINT valid_email CHECK (seller_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for better performance
CREATE INDEX idx_resale_properties_location ON resale_properties(location);
CREATE INDEX idx_resale_properties_price ON resale_properties(asking_price);
CREATE INDEX idx_resale_properties_status ON resale_properties(status);
CREATE INDEX idx_resale_properties_created_by ON resale_properties(created_by);
CREATE INDEX idx_resale_properties_property_type ON resale_properties(property_type);
CREATE INDEX idx_resale_properties_bhk_type ON resale_properties(bhk_type);
CREATE INDEX idx_resale_properties_seller_email ON resale_properties(seller_email);
CREATE INDEX idx_resale_properties_submission_date ON resale_properties(submission_date);
