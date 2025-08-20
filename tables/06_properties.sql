-- =====================================================
-- PROPERTIES TABLE - Property listings
-- =====================================================

-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  property_type TEXT CHECK (property_type IN ('residential', 'commercial', 'land')) NOT NULL,
  property_subtype TEXT,
  status TEXT CHECK (status IN ('available', 'sold', 'pending', 'under_construction', 'off_market')) NOT NULL DEFAULT 'available',
  agent_id UUID REFERENCES agents(id),
  builder_id UUID REFERENCES builders(id),
  images TEXT[] DEFAULT '{}',
  features JSONB DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  square_feet INTEGER,
  lot_size DECIMAL(10,2),
  year_built INTEGER,
  parking_spaces INTEGER,
  heating_type TEXT,
  cooling_type TEXT,
  flooring_type TEXT[],
  roof_type TEXT,
  exterior_material TEXT,
  interior_features TEXT[],
  outdoor_features TEXT[],
  neighborhood_info JSONB DEFAULT '{}',
  school_district TEXT,
  property_tax DECIMAL(10,2),
  hoa_fees DECIMAL(8,2),
  utilities_info JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  saved_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Agents can manage their own properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM agents WHERE user_id = auth.uid() AND id = agent_id
    )
  );

CREATE POLICY "Builders can manage their own properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM builders WHERE user_id = auth.uid() AND id = builder_id
    )
  );

CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_properties_builder_id ON properties(builder_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_state ON properties(state);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_bathrooms ON properties(bathrooms);
CREATE INDEX idx_properties_square_feet ON properties(square_feet);
CREATE INDEX idx_properties_year_built ON properties(year_built);
CREATE INDEX idx_properties_is_featured ON properties(is_featured);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_features ON properties USING GIN(features);
CREATE INDEX idx_properties_specifications ON properties USING GIN(specifications);
CREATE INDEX idx_properties_amenities ON properties USING GIN(amenities);

-- Create updated_at trigger
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample property (optional - for testing)
-- INSERT INTO properties (title, description, price, location, address, city, state, property_type, bedrooms, bathrooms, square_feet) 
-- VALUES ('Beautiful Family Home', 'Spacious 3-bedroom home in quiet neighborhood', 350000, 'Downtown', '123 Main St', 'New York', 'NY', 'residential', 3, 2.5, 1800);
