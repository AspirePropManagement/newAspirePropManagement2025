-- =====================================================
-- ALTER QUERIES FOR ENHANCED PROPERTY IMAGES
-- Based on Greenfront Project Structure
-- =====================================================

-- =====================================================
-- 1. ALTER RESALE PROPERTIES TABLE
-- =====================================================

-- Add comprehensive image support to resale_properties
ALTER TABLE resale_properties 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image category columns
ALTER TABLE resale_properties 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resale_properties_property_images ON resale_properties USING GIN(property_images);
CREATE INDEX IF NOT EXISTS idx_resale_properties_general_photos ON resale_properties USING GIN(general_photos);
CREATE INDEX IF NOT EXISTS idx_resale_properties_floor_plans ON resale_properties USING GIN(floor_plans);

-- =====================================================
-- 2. ALTER RENTAL PROPERTIES TABLE
-- =====================================================

-- Add comprehensive image support to rental_properties
ALTER TABLE rental_properties 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image category columns
ALTER TABLE rental_properties 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rental_properties_property_images ON rental_properties USING GIN(property_images);
CREATE INDEX IF NOT EXISTS idx_rental_properties_general_photos ON rental_properties USING GIN(general_photos);
CREATE INDEX IF NOT EXISTS idx_rental_properties_floor_plans ON rental_properties USING GIN(floor_plans);

-- =====================================================
-- 3. ALTER NEW PROJECTS TABLE
-- =====================================================

-- Add comprehensive image support to new_projects
ALTER TABLE new_projects 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image category columns for new projects
ALTER TABLE new_projects 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS project_images JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_new_projects_property_images ON new_projects USING GIN(property_images);
CREATE INDEX IF NOT EXISTS idx_new_projects_general_photos ON new_projects USING GIN(general_photos);
CREATE INDEX IF NOT EXISTS idx_new_projects_floor_plans ON new_projects USING GIN(floor_plans);
CREATE INDEX IF NOT EXISTS idx_new_projects_project_images ON new_projects USING GIN(project_images);

-- =====================================================
-- 4. ALTER MAIN PROPERTIES TABLE
-- =====================================================

-- Add comprehensive image support to main properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_images JSONB DEFAULT '{}';

-- Add specific image category columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS general_photos JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS project_images JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_docs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS virtual_content JSONB DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_property_images ON properties USING GIN(property_images);
CREATE INDEX IF NOT EXISTS idx_properties_general_photos ON properties USING GIN(general_photos);
CREATE INDEX IF NOT EXISTS idx_properties_floor_plans ON properties USING GIN(floor_plans);
CREATE INDEX IF NOT EXISTS idx_properties_project_images ON properties USING GIN(project_images);

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
-- 6. CREATE PROPERTY IMAGES DETAILED TRACKING TABLE
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
CREATE INDEX IF NOT EXISTS idx_property_image_details_property_id ON property_image_details(property_id);
CREATE INDEX IF NOT EXISTS idx_property_image_details_property_type ON property_image_details(property_type);
CREATE INDEX IF NOT EXISTS idx_property_image_details_category ON property_image_details(image_category_id);
CREATE INDEX IF NOT EXISTS idx_property_image_details_primary ON property_image_details(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_image_details_featured ON property_image_details(is_featured);
CREATE INDEX IF NOT EXISTS idx_property_image_details_display_order ON property_image_details(display_order);

-- =====================================================
-- 7. SAMPLE DATA INSERTION QUERIES
-- =====================================================

-- Sample resale property with comprehensive images
INSERT INTO resale_properties (
  seller_name, seller_email, seller_contact_no, property_type, bhk_type, 
  square_feet, carpet_area, location, asking_price, furnishing_type,
  property_images, general_photos, floor_plans, legal_docs, virtual_content,
  created_by
) VALUES (
  'Rajesh Kumar', 'rajesh.kumar@email.com', '+919876543210', 'apartment', '2_bhk',
  1200, 944, 'Hinjawadi Phase 1, Pune', 11800000, 'semi_furnished',
  '{
    "general_photos": {
      "exterior": ["https://example.com/exterior1.jpg", "https://example.com/exterior2.jpg"],
      "interior": ["https://example.com/interior1.jpg", "https://example.com/interior2.jpg"],
      "bedrooms": ["https://example.com/bedroom1.jpg", "https://example.com/bedroom2.jpg"],
      "kitchen": ["https://example.com/kitchen1.jpg"],
      "bathrooms": ["https://example.com/bathroom1.jpg", "https://example.com/bathroom2.jpg"],
      "living_dining": ["https://example.com/living1.jpg"],
      "balcony": ["https://example.com/balcony1.jpg"]
    },
    "floor_plans": {
      "floor_plan": ["https://example.com/floorplan1.jpg"],
      "master_plan": ["https://example.com/masterplan1.jpg"],
      "elevation": ["https://example.com/elevation1.jpg"]
    },
    "legal_docs": {
      "rera_certificate": ["https://example.com/rera1.pdf"],
      "brochures": ["https://example.com/brochure1.pdf"]
    },
    "virtual_content": {
      "virtual_tour": ["https://example.com/virtual1.mp4"],
      "video_walkthrough": ["https://example.com/walkthrough1.mp4"]
    }
  }',
  '{
    "exterior": ["https://example.com/exterior1.jpg", "https://example.com/exterior2.jpg"],
    "interior": ["https://example.com/interior1.jpg", "https://example.com/interior2.jpg"],
    "bedrooms": ["https://example.com/bedroom1.jpg", "https://example.com/bedroom2.jpg"],
    "kitchen": ["https://example.com/kitchen1.jpg"],
    "bathrooms": ["https://example.com/bathroom1.jpg", "https://example.com/bathroom2.jpg"],
    "living_dining": ["https://example.com/living1.jpg"],
    "balcony": ["https://example.com/balcony1.jpg"]
  }',
  '{
    "floor_plan": ["https://example.com/floorplan1.jpg"],
    "master_plan": ["https://example.com/masterplan1.jpg"],
    "elevation": ["https://example.com/elevation1.jpg"]
  }',
  '{
    "rera_certificate": ["https://example.com/rera1.pdf"],
    "brochures": ["https://example.com/brochure1.pdf"]
  }',
  '{
    "virtual_tour": ["https://example.com/virtual1.mp4"],
    "video_walkthrough": ["https://example.com/walkthrough1.mp4"]
  }',
  (SELECT id FROM users WHERE role = 'AGENT' LIMIT 1)
);

-- Sample new project with comprehensive images
INSERT INTO new_projects (
  crafted_by, project_name, project_type, construction_type, project_location,
  property_images, general_photos, floor_plans, project_images, legal_docs, virtual_content,
  created_by
) VALUES (
  'Godrej Properties', 'The Greenfront at Godrej Park World', 'residence', 'ready_to_move', 'Hinjawadi Phase 1, Pune',
  '{
    "general_photos": {
      "exterior": ["https://example.com/project_exterior1.jpg", "https://example.com/project_exterior2.jpg"],
      "interior": ["https://example.com/project_interior1.jpg", "https://example.com/project_interior2.jpg"],
      "bedrooms": ["https://example.com/project_bedroom1.jpg", "https://example.com/project_bedroom2.jpg"],
      "kitchen": ["https://example.com/project_kitchen1.jpg"],
      "bathrooms": ["https://example.com/project_bathroom1.jpg", "https://example.com/project_bathroom2.jpg"],
      "living_dining": ["https://example.com/project_living1.jpg"],
      "balcony": ["https://example.com/project_balcony1.jpg"]
    },
    "floor_plans": {
      "floor_plan": ["https://example.com/project_floorplan1.jpg", "https://example.com/project_floorplan2.jpg"],
      "master_plan": ["https://example.com/project_masterplan1.jpg"],
      "elevation": ["https://example.com/project_elevation1.jpg"]
    },
    "project_images": {
      "club_house": ["https://example.com/clubhouse1.jpg", "https://example.com/clubhouse2.jpg"],
      "swimming_pool": ["https://example.com/pool1.jpg"],
      "gym": ["https://example.com/gym1.jpg"],
      "children_play_area": ["https://example.com/playarea1.jpg"],
      "park": ["https://example.com/park1.jpg"],
      "reception_lounge": ["https://example.com/reception1.jpg"],
      "banquet_hall": ["https://example.com/banquet1.jpg"],
      "retail_area": ["https://example.com/retail1.jpg"],
      "parking_area": ["https://example.com/parking1.jpg"]
    },
    "legal_docs": {
      "rera_certificate": ["https://example.com/project_rera1.pdf"],
      "approval_documents": ["https://example.com/project_approval1.pdf"],
      "brochures": ["https://example.com/project_brochure1.pdf"]
    },
    "virtual_content": {
      "virtual_tour": ["https://example.com/project_virtual1.mp4"],
      "video_walkthrough": ["https://example.com/project_walkthrough1.mp4"],
      "drone_footage": ["https://example.com/project_drone1.mp4"],
      "promotional_videos": ["https://example.com/project_promo1.mp4"]
    }
  }',
  '{
    "exterior": ["https://example.com/project_exterior1.jpg", "https://example.com/project_exterior2.jpg"],
    "interior": ["https://example.com/project_interior1.jpg", "https://example.com/project_interior2.jpg"],
    "bedrooms": ["https://example.com/project_bedroom1.jpg", "https://example.com/project_bedroom2.jpg"],
    "kitchen": ["https://example.com/project_kitchen1.jpg"],
    "bathrooms": ["https://example.com/project_bathroom1.jpg", "https://example.com/project_bathroom2.jpg"],
    "living_dining": ["https://example.com/project_living1.jpg"],
    "balcony": ["https://example.com/project_balcony1.jpg"]
  }',
  '{
    "floor_plan": ["https://example.com/project_floorplan1.jpg", "https://example.com/project_floorplan2.jpg"],
    "master_plan": ["https://example.com/project_masterplan1.jpg"],
    "elevation": ["https://example.com/project_elevation1.jpg"]
  }',
  '{
    "club_house": ["https://example.com/clubhouse1.jpg", "https://example.com/clubhouse2.jpg"],
    "swimming_pool": ["https://example.com/pool1.jpg"],
    "gym": ["https://example.com/gym1.jpg"],
    "children_play_area": ["https://example.com/playarea1.jpg"],
    "park": ["https://example.com/park1.jpg"],
    "reception_lounge": ["https://example.com/reception1.jpg"],
    "banquet_hall": ["https://example.com/banquet1.jpg"],
    "retail_area": ["https://example.com/retail1.jpg"],
    "parking_area": ["https://example.com/parking1.jpg"]
  }',
  '{
    "rera_certificate": ["https://example.com/project_rera1.pdf"],
    "approval_documents": ["https://example.com/project_approval1.pdf"],
    "brochures": ["https://example.com/project_brochure1.pdf"]
  }',
  '{
    "virtual_tour": ["https://example.com/project_virtual1.mp4"],
    "video_walkthrough": ["https://example.com/project_walkthrough1.mp4"],
    "drone_footage": ["https://example.com/project_drone1.mp4"],
    "promotional_videos": ["https://example.com/project_promo1.mp4"]
  }',
  (SELECT id FROM users WHERE role = 'BUILDER' LIMIT 1)
);

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Check if columns were added successfully
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resale_properties' 
AND column_name IN ('property_images', 'general_photos', 'floor_plans', 'legal_docs', 'virtual_content');

-- Check if indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('resale_properties', 'rental_properties', 'new_projects', 'properties')
AND indexname LIKE '%property_images%' OR indexname LIKE '%general_photos%' OR indexname LIKE '%floor_plans%';

-- Check sample data
SELECT 
  seller_name, 
  property_type, 
  bhk_type, 
  asking_price,
  jsonb_pretty(property_images) as property_images_json
FROM resale_properties 
WHERE property_images IS NOT NULL 
LIMIT 1;
