-- =====================================================
-- BUILDERS TABLE - Property developers
-- =====================================================

-- Create builders table
CREATE TABLE builders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  license_number TEXT UNIQUE,
  specialization TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  ongoing_projects INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  insurance_info JSONB DEFAULT '{}',
  warranty_info JSONB DEFAULT '{}',
  company_address TEXT,
  company_phone TEXT,
  website_url TEXT,
  social_media JSONB DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  awards TEXT[] DEFAULT '{}',
  team_size INTEGER,
  annual_revenue DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Builders can view their own profile" ON builders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Builders can update their own profile" ON builders
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view verified builders" ON builders
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Admins can manage all builders" ON builders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view builder profiles" ON builders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_builders_user_id ON builders(user_id);
CREATE INDEX idx_builders_company_name ON builders(company_name);
CREATE INDEX idx_builders_license_number ON builders(license_number);
CREATE INDEX idx_builders_is_verified ON builders(is_verified);
CREATE INDEX idx_builders_specialization ON builders USING GIN(specialization);
CREATE INDEX idx_builders_rating ON builders(rating);
CREATE INDEX idx_builders_experience_years ON builders(experience_years);
CREATE INDEX idx_builders_is_active ON builders(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_builders_updated_at 
    BEFORE UPDATE ON builders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample builder (optional - for testing)
-- INSERT INTO builders (user_id, company_name, license_number, specialization, experience_years, is_verified) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Premium Builders Inc', 'BL123456', ARRAY['residential', 'luxury'], 10, true);
