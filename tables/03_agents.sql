-- =====================================================
-- AGENTS TABLE - Real estate agents
-- =====================================================

-- Create agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  license_number TEXT UNIQUE,
  specialization TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 2.50,
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_sales INTEGER DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  bio TEXT,
  office_address TEXT,
  office_phone TEXT,
  website_url TEXT,
  social_media JSONB DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents can view their own profile" ON agents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Agents can update their own profile" ON agents
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view verified agents" ON agents
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Admins can manage all agents" ON agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view agent profiles" ON agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM buyers WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_license_number ON agents(license_number);
CREATE INDEX idx_agents_is_verified ON agents(is_verified);
CREATE INDEX idx_agents_specialization ON agents USING GIN(specialization);
CREATE INDEX idx_agents_rating ON agents(rating);
CREATE INDEX idx_agents_experience_years ON agents(experience_years);

-- Create updated_at trigger
CREATE TRIGGER update_agents_updated_at 
    BEFORE UPDATE ON agents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample agent (optional - for testing)
-- INSERT INTO agents (user_id, license_number, specialization, experience_years, is_verified) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'AG123456', ARRAY['residential', 'luxury'], 5, true);
