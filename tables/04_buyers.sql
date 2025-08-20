-- =====================================================
-- BUYERS TABLE - Property buyers
-- =====================================================

-- Create buyers table
CREATE TABLE buyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  preferred_locations TEXT[] DEFAULT '{}',
  property_types TEXT[] DEFAULT '{}',
  bedrooms_min INTEGER DEFAULT 1,
  bathrooms_min INTEGER DEFAULT 1,
  square_feet_min INTEGER,
  square_feet_max INTEGER,
  is_first_time_buyer BOOLEAN DEFAULT true,
  has_mortgage_preapproval BOOLEAN DEFAULT false,
  preferred_style TEXT[] DEFAULT '{}',
  must_have_features TEXT[] DEFAULT '{}',
  deal_breakers TEXT[] DEFAULT '{}',
  timeline_months INTEGER,
  is_active_buyer BOOLEAN DEFAULT true,
  saved_properties UUID[] DEFAULT '{}',
  viewed_properties UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Buyers can view their own profile" ON buyers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Buyers can update their own profile" ON buyers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Agents can view buyer preferences" ON buyers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all buyers" ON buyers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_buyers_user_id ON buyers(user_id);
CREATE INDEX idx_buyers_budget_min ON buyers(budget_min);
CREATE INDEX idx_buyers_budget_max ON buyers(budget_max);
CREATE INDEX idx_buyers_preferred_locations ON buyers USING GIN(preferred_locations);
CREATE INDEX idx_buyers_property_types ON buyers USING GIN(property_types);
CREATE INDEX idx_buyers_is_active_buyer ON buyers(is_active_buyer);
CREATE INDEX idx_buyers_bedrooms_min ON buyers(bedrooms_min);
CREATE INDEX idx_buyers_bathrooms_min ON buyers(bathrooms_min);

-- Create updated_at trigger
CREATE TRIGGER update_buyers_updated_at 
    BEFORE UPDATE ON buyers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample buyer (optional - for testing)
-- INSERT INTO buyers (user_id, budget_min, budget_max, preferred_locations, property_types, bedrooms_min) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 200000, 500000, ARRAY['Downtown', 'Suburbs'], ARRAY['residential'], 2);
