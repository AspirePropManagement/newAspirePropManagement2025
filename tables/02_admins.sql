-- =====================================================
-- ADMINS TABLE - Admin roles and permissions
-- =====================================================

-- Create admins table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  admin_level TEXT CHECK (admin_level IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  can_manage_users BOOLEAN DEFAULT true,
  can_manage_properties BOOLEAN DEFAULT true,
  can_manage_roles BOOLEAN DEFAULT true,
  can_view_analytics BOOLEAN DEFAULT true,
  can_manage_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all admins" ON admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all admins" ON admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid() AND admin_level = 'super_admin'
    )
  );

CREATE POLICY "Admins can manage their own profile" ON admins
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view their own profile" ON admins
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_admins_user_id ON admins(user_id);
CREATE INDEX idx_admins_admin_level ON admins(admin_level);
CREATE INDEX idx_admins_permissions ON admins USING GIN(permissions);

-- Create updated_at trigger
CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin (optional - for testing)
-- INSERT INTO admins (user_id, admin_level, permissions, can_manage_system) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin', '{"all": true}', true);
