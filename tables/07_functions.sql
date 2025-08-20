-- =====================================================
-- HELPER FUNCTIONS - Role management and utilities
-- =====================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admins WHERE user_id = user_uuid) THEN
    RETURN 'admin';
  ELSIF EXISTS (SELECT 1 FROM agents WHERE user_id = user_uuid) THEN
    RETURN 'agent';
  ELSIF EXISTS (SELECT 1 FROM buyers WHERE user_id = user_uuid) THEN
    RETURN 'buyer';
  ELSIF EXISTS (SELECT 1 FROM builders WHERE user_id = user_uuid) THEN
    RETURN 'builder';
  ELSE
    RETURN 'user';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = role_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION has_any_role(user_uuid UUID, role_names TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = ANY(role_names);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's admin level
CREATE OR REPLACE FUNCTION get_admin_level(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admins WHERE user_id = user_uuid) THEN
    RETURN (SELECT admin_level FROM admins WHERE user_id = user_uuid);
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_admin_level(user_uuid) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile data with role
CREATE OR REPLACE FUNCTION get_user_profile_with_role(user_uuid UUID)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT,
  role_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.phone,
    u.avatar_url,
    get_user_role(u.id) as role,
    CASE 
      WHEN EXISTS (SELECT 1 FROM admins WHERE user_id = u.id) THEN
        (SELECT to_jsonb(a.*) FROM admins a WHERE a.user_id = u.id)
      WHEN EXISTS (SELECT 1 FROM agents WHERE user_id = u.id) THEN
        (SELECT to_jsonb(ag.*) FROM agents ag WHERE ag.user_id = u.id)
      WHEN EXISTS (SELECT 1 FROM buyers WHERE user_id = u.id) THEN
        (SELECT to_jsonb(b.*) FROM buyers b WHERE b.user_id = u.id)
      WHEN EXISTS (SELECT 1 FROM builders WHERE user_id = u.id) THEN
        (SELECT to_jsonb(bu.*) FROM builders bu WHERE bu.user_id = u.id)
      ELSE
        '{}'::jsonb
    END as role_data
  FROM users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  admin_level TEXT;
  has_permission BOOLEAN := false;
BEGIN
  user_role := get_user_role(user_uuid);
  
  -- Super admins have all permissions
  IF user_role = 'admin' THEN
    admin_level := get_admin_level(user_uuid);
    IF admin_level = 'super_admin' THEN
      RETURN true;
    END IF;
  END IF;
  
  -- Check specific permissions based on role
  CASE permission_name
    WHEN 'manage_users' THEN
      has_permission := EXISTS (
        SELECT 1 FROM admins 
        WHERE user_id = user_uuid 
        AND can_manage_users = true
      );
    WHEN 'manage_properties' THEN
      has_permission := EXISTS (
        SELECT 1 FROM admins 
        WHERE user_id = user_uuid 
        AND can_manage_properties = true
      ) OR user_role = 'agent' OR user_role = 'builder';
    WHEN 'manage_roles' THEN
      has_permission := EXISTS (
        SELECT 1 FROM admins 
        WHERE user_id = user_uuid 
        AND can_manage_roles = true
      );
    WHEN 'view_analytics' THEN
      has_permission := EXISTS (
        SELECT 1 FROM admins 
        WHERE user_id = user_uuid 
        AND can_view_analytics = true
      );
    WHEN 'manage_system' THEN
      has_permission := EXISTS (
        SELECT 1 FROM admins 
        WHERE user_id = user_uuid 
        AND can_manage_system = true
      );
    ELSE
      has_permission := false;
  END CASE;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all users with their roles (admin only)
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Check if user has permission to view all users
  IF NOT check_user_permission(auth.uid(), 'manage_users') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.phone,
    u.avatar_url,
    u.is_active,
    get_user_role(u.id) as role,
    u.created_at
  FROM users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user role
CREATE OR REPLACE FUNCTION update_user_role(
  target_user_id UUID, 
  new_role TEXT, 
  role_data JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_current_role TEXT;
  success BOOLEAN := false;
BEGIN
  -- Check if current user has permission to manage roles
  IF NOT check_user_permission(auth.uid(), 'manage_roles') THEN
    RAISE EXCEPTION 'Insufficient permissions to manage roles';
  END IF;
  
  -- Get current role
  user_current_role := get_user_role(target_user_id);
  
  -- Remove user from current role table
  IF user_current_role = 'admin' THEN
    DELETE FROM admins WHERE user_id = target_user_id;
  ELSIF user_current_role = 'agent' THEN
    DELETE FROM agents WHERE user_id = target_user_id;
  ELSIF user_current_role = 'buyer' THEN
    DELETE FROM buyers WHERE user_id = target_user_id;
  ELSIF user_current_role = 'builder' THEN
    DELETE FROM builders WHERE user_id = target_user_id;
  END IF;
  
  -- Add user to new role table
  CASE new_role
    WHEN 'admin' THEN
      INSERT INTO admins (user_id, admin_level, permissions, can_manage_users, can_manage_properties, can_manage_roles, can_view_analytics, can_manage_system)
      VALUES (
        target_user_id,
        COALESCE(role_data->>'admin_level', 'admin'),
        COALESCE(role_data->'permissions', '{}'::jsonb),
        COALESCE((role_data->>'can_manage_users')::boolean, true),
        COALESCE((role_data->>'can_manage_properties')::boolean, true),
        COALESCE((role_data->>'can_manage_roles')::boolean, true),
        COALESCE((role_data->>'can_view_analytics')::boolean, true),
        COALESCE((role_data->>'can_manage_system')::boolean, false)
      );
      success := true;
    WHEN 'agent' THEN
      INSERT INTO agents (user_id, license_number, specialization, experience_years, commission_rate, is_verified)
      VALUES (
        target_user_id,
        role_data->>'license_number',
        COALESCE(role_data->'specialization', '{}'::text[]),
        COALESCE((role_data->>'experience_years')::integer, 0),
        COALESCE((role_data->>'commission_rate')::decimal, 2.50),
        COALESCE((role_data->>'is_verified')::boolean, false)
      );
      success := true;
    WHEN 'buyer' THEN
      INSERT INTO buyers (user_id, budget_min, budget_max, preferred_locations, property_types, bedrooms_min, bathrooms_min)
      VALUES (
        target_user_id,
        (role_data->>'budget_min')::decimal,
        (role_data->>'budget_max')::decimal,
        COALESCE(role_data->'preferred_locations', '{}'::text[]),
        COALESCE(role_data->'property_types', '{}'::text[]),
        COALESCE((role_data->>'bedrooms_min')::integer, 1),
        COALESCE((role_data->>'bathrooms_min')::integer, 1)
      );
      success := true;
    WHEN 'builder' THEN
      INSERT INTO builders (user_id, company_name, license_number, specialization, experience_years, is_verified)
      VALUES (
        target_user_id,
        role_data->>'company_name',
        role_data->>'license_number',
        COALESCE(role_data->'specialization', '{}'::text[]),
        COALESCE((role_data->>'experience_years')::integer, 0),
        COALESCE((role_data->>'is_verified')::boolean, false)
      );
      success := true;
    ELSE
      success := false;
  END CASE;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
