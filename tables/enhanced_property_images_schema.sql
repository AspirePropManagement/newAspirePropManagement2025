-- =====================================================
-- ENHANCED PROPERTY IMAGES SCHEMA
-- Based on Greenfront Project Structure
-- =====================================================

-- Add comprehensive image support to all property tables
-- This script enhances existing property tables with detailed image categorization

-- =====================================================
-- 1. ENHANCE RESALE PROPERTIES TABLE
-- =====================================================

-- Add comprehensive image columns to resale_properties
ALTER TABLE resale_properties 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image categories
ALTER TABLE resale_properties 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- =====================================================
-- 2. ENHANCE RENTAL PROPERTIES TABLE
-- =====================================================

-- Add comprehensive image columns to rental_properties
ALTER TABLE rental_properties 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image categories
ALTER TABLE rental_properties 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- =====================================================
-- 3. ENHANCE NEW PROJECTS TABLE
-- =====================================================

-- Add comprehensive image columns to new_projects
ALTER TABLE new_projects 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image categories for new projects
ALTER TABLE new_projects 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS project_images JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- =====================================================
-- 4. ENHANCE MAIN PROPERTIES TABLE
-- =====================================================

-- Add comprehensive image columns to main properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image categories
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS project_images JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- =====================================================
-- 5. CREATE IMAGE CATEGORIES REFERENCE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS image_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  category_type TEXT NOT NULL CHECK (category_type IN ('general', 'floor_plan', 'project', 'legal', 'virtual')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert standard image categories
INSERT INTO image_categories (category_name, category_type, description) VALUES
-- General Photos
('exterior', 'general', 'Exterior views of the property'),
('interior', 'general', 'Interior spaces and rooms'),
('bedrooms', 'general', 'Bedroom images'),
('kitchen', 'general', 'Kitchen and cooking areas'),
('bathrooms', 'general', 'Bathroom facilities'),
('living_dining', 'general', 'Living and dining areas'),
('balcony', 'general', 'Balcony and outdoor spaces'),
('amenities', 'general', 'Property amenities and facilities'),

-- Floor Plans
('floor_plan', 'floor_plan', 'Individual unit floor plans'),
('site_plan', 'floor_plan', 'Site layout and positioning'),
('master_plan', 'floor_plan', 'Overall project master plan'),
('blueprint', 'floor_plan', 'Technical blueprints'),
('elevation', 'floor_plan', 'Building elevation views'),
('layout_2d', 'floor_plan', '2D layout diagrams'),
('layout_3d', 'floor_plan', '3D layout visualizations'),

-- Project Images
('club_house', 'project', 'Club house and common areas'),
('swimming_pool', 'project', 'Swimming pool facilities'),
('gym', 'project', 'Gymnasium and fitness center'),
('children_play_area', 'project', 'Children play areas'),
('park', 'project', 'Parks and green spaces'),
('security_gate', 'project', 'Security and entrance gates'),
('reception_lounge', 'project', 'Reception and lounge areas'),
('banquet_hall', 'project', 'Banquet and event halls'),
('retail_area', 'project', 'Retail and commercial spaces'),
('parking_area', 'project', 'Parking facilities'),

-- Legal Documents
('rera_certificate', 'legal', 'RERA approval certificates'),
('approval_documents', 'legal', 'Government approval documents'),
('legal_documents', 'legal', 'Legal and compliance documents'),
('brochures', 'legal', 'Marketing brochures and materials'),

-- Virtual Content
('virtual_tour', 'virtual', 'Virtual property tours'),
('video_walkthrough', 'virtual', 'Video walkthroughs'),
('drone_footage', 'virtual', 'Aerial drone footage'),
('promotional_videos', 'virtual', 'Promotional and marketing videos')
ON CONFLICT (category_name) DO NOTHING;

-- =====================================================
-- 6. CREATE PROPERTY IMAGES TABLE FOR DETAILED TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS property_image_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('resale', 'rental', 'new_project', 'general')),
  image_url TEXT NOT NULL,
  image_category_id UUID REFERENCES image_categories(id),
  image_title TEXT,
  image_description TEXT,
  image_alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  file_size INTEGER,
  image_dimensions JSONB, -- {"width": 1920, "height": 1080}
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_property_image_details_property_id ON property_image_details(property_id);
CREATE INDEX idx_property_image_details_property_type ON property_image_details(property_type);
CREATE INDEX idx_property_image_details_category ON property_image_details(image_category_id);
CREATE INDEX idx_property_image_details_primary ON property_image_details(is_primary);
CREATE INDEX idx_property_image_details_featured ON property_image_details(is_featured);
CREATE INDEX idx_property_image_details_display_order ON property_image_details(display_order);

-- =====================================================
-- 7. CREATE FUNCTIONS FOR IMAGE MANAGEMENT
-- =====================================================

-- Function to get property images by category
CREATE OR REPLACE FUNCTION get_property_images_by_category(
  p_property_id UUID,
  p_property_type TEXT,
  p_category_name TEXT DEFAULT NULL
)
RETURNS TABLE (
  image_url TEXT,
  image_title TEXT,
  image_description TEXT,
  display_order INTEGER,
  is_primary BOOLEAN,
  is_featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pid.image_url,
    pid.image_title,
    pid.image_description,
    pid.display_order,
    pid.is_primary,
    pid.is_featured
  FROM property_image_details pid
  JOIN image_categories ic ON pid.image_category_id = ic.id
  WHERE pid.property_id = p_property_id
    AND pid.property_type = p_property_type
    AND (p_category_name IS NULL OR ic.category_name = p_category_name)
  ORDER BY pid.display_order, pid.created_at;
END;
$$ LANGUAGE plpgsql;

-- Function to update property images JSONB column
CREATE OR REPLACE FUNCTION update_property_images_jsonb(
  p_property_id UUID,
  p_property_type TEXT,
  p_table_name TEXT
)
RETURNS VOID AS $$
DECLARE
  images_json JSONB;
BEGIN
  -- Build comprehensive images JSONB from property_image_details
  SELECT jsonb_build_object(
    'general_photos', COALESCE(
      (SELECT jsonb_object_agg(ic.category_name, 
        (SELECT jsonb_agg(pid.image_url ORDER BY pid.display_order)
         FROM property_image_details pid 
         WHERE pid.property_id = p_property_id 
           AND pid.property_type = p_property_type
           AND pid.image_category_id = ic.id
           AND ic.category_type = 'general'))
      ), '{}'
    ),
    'floor_plans', COALESCE(
      (SELECT jsonb_object_agg(ic.category_name, 
        (SELECT jsonb_agg(pid.image_url ORDER BY pid.display_order)
         FROM property_image_details pid 
         WHERE pid.property_id = p_property_id 
           AND pid.property_type = p_property_type
           AND pid.image_category_id = ic.id
           AND ic.category_type = 'floor_plan'))
      ), '{}'
    ),
    'project_images', COALESCE(
      (SELECT jsonb_object_agg(ic.category_name, 
        (SELECT jsonb_agg(pid.image_url ORDER BY pid.display_order)
         FROM property_image_details pid 
         WHERE pid.property_id = p_property_id 
           AND pid.property_type = p_property_type
           AND pid.image_category_id = ic.id
           AND ic.category_type = 'project'))
      ), '{}'
    ),
    'legal_docs', COALESCE(
      (SELECT jsonb_object_agg(ic.category_name, 
        (SELECT jsonb_agg(pid.image_url ORDER BY pid.display_order)
         FROM property_image_details pid 
         WHERE pid.property_id = p_property_id 
           AND pid.property_type = p_property_type
           AND pid.image_category_id = ic.id
           AND ic.category_type = 'legal'))
      ), '{}'
    ),
    'virtual_content', COALESCE(
      (SELECT jsonb_object_agg(ic.category_name, 
        (SELECT jsonb_agg(pid.image_url ORDER BY pid.display_order)
         FROM property_image_details pid 
         WHERE pid.property_id = p_property_id 
           AND pid.property_type = p_property_type
           AND pid.image_category_id = ic.id
           AND ic.category_type = 'virtual'))
      ), '{}'
    )
  ) INTO images_json
  FROM image_categories ic
  WHERE ic.is_active = true;

  -- Update the appropriate table
  CASE p_table_name
    WHEN 'resale_properties' THEN
      UPDATE resale_properties SET property_images = images_json WHERE id = p_property_id;
    WHEN 'rental_properties' THEN
      UPDATE rental_properties SET property_images = images_json WHERE id = p_property_id;
    WHEN 'new_projects' THEN
      UPDATE new_projects SET property_images = images_json WHERE id = p_property_id;
    WHEN 'properties' THEN
      UPDATE properties SET property_images = images_json WHERE id = p_property_id;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. CREATE TRIGGERS FOR AUTOMATIC IMAGE UPDATES
-- =====================================================

-- Trigger function to update property images when image details change
CREATE OR REPLACE FUNCTION trigger_update_property_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the property images JSONB column
  PERFORM update_property_images_jsonb(
    COALESCE(NEW.property_id, OLD.property_id),
    COALESCE(NEW.property_type, OLD.property_type),
    CASE COALESCE(NEW.property_type, OLD.property_type)
      WHEN 'resale' THEN 'resale_properties'
      WHEN 'rental' THEN 'rental_properties'
      WHEN 'new_project' THEN 'new_projects'
      ELSE 'properties'
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_property_image_details_update ON property_image_details;
CREATE TRIGGER trigger_property_image_details_update
  AFTER INSERT OR UPDATE OR DELETE ON property_image_details
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_property_images();

-- =====================================================
-- 9. CREATE VIEWS FOR EASY IMAGE ACCESS
-- =====================================================

-- View for resale properties with images
CREATE OR REPLACE VIEW resale_properties_with_images AS
SELECT 
  rp.*,
  rp.property_images,
  rp.general_photos,
  rp.floor_plans,
  rp.legal_docs,
  rp.virtual_content
FROM resale_properties rp;

-- View for rental properties with images
CREATE OR REPLACE VIEW rental_properties_with_images AS
SELECT 
  rp.*,
  rp.property_images,
  rp.general_photos,
  rp.floor_plans,
  rp.legal_docs,
  rp.virtual_content
FROM rental_properties rp;

-- View for new projects with images
CREATE OR REPLACE VIEW new_projects_with_images AS
SELECT 
  np.*,
  np.property_images,
  np.general_photos,
  np.floor_plans,
  np.project_images,
  np.legal_docs,
  np.virtual_content
FROM new_projects np;

-- =====================================================
-- 10. SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample image categories if they don't exist
-- (Already handled above in the image_categories table)

-- Note: Sample property records with images will be created in separate files
-- This schema provides the foundation for comprehensive image management
