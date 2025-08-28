-- Hero Carousel Images Table
-- This table stores base64 encoded images for the landing page hero section carousel

-- Create the trigger function first
CREATE OR REPLACE FUNCTION update_hero_carousel_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the table
CREATE TABLE IF NOT EXISTS hero_carousel_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_data TEXT NOT NULL, -- Base64 encoded image data
    image_type VARCHAR(100) NOT NULL, -- e.g., 'image/jpeg', 'image/png', 'image/webp'
    file_size INTEGER, -- Size in bytes (optional, for reference)
    display_order INTEGER DEFAULT 0, -- Order of display in carousel
    is_active BOOLEAN DEFAULT true, -- Whether this image should be displayed
    alt_text VARCHAR(255), -- Alt text for accessibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hero_carousel_display_order ON hero_carousel_images (display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_hero_carousel_created_by ON hero_carousel_images (created_by);
CREATE INDEX IF NOT EXISTS idx_hero_carousel_active ON hero_carousel_images (is_active) WHERE (is_active = true);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER trigger_update_hero_carousel_updated_at
    BEFORE UPDATE ON hero_carousel_images
    FOR EACH ROW
    EXECUTE FUNCTION update_hero_carousel_updated_at();

-- Add comments for documentation
COMMENT ON TABLE hero_carousel_images IS 'Stores hero carousel images for the landing page';
COMMENT ON COLUMN hero_carousel_images.image_data IS 'Base64 encoded image data';
COMMENT ON COLUMN hero_carousel_images.display_order IS 'Order of display in the carousel (0 = first)';
COMMENT ON COLUMN hero_carousel_images.is_active IS 'Whether this image should be displayed in the carousel';

-- Insert sample data
INSERT INTO hero_carousel_images (title, description, image_data, image_type, display_order, alt_text) VALUES
('Welcome to Aspire Properties', 'Discover your dream home with us', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldlbGNvbWUgdG8gQXNwaXJlIFByb3BlcnRpZXM8L3RleHQ+PC9zdmc+', 'image/svg+xml', 0, 'Welcome banner for Aspire Properties'),
('Luxury Living', 'Experience the finest in residential properties', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRmMmY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkx1eHVyeSBMaXZpbmc8L3RleHQ+PC9zdmc+', 'image/svg+xml', 1, 'Luxury living showcase'),
('Investment Opportunities', 'Build your portfolio with premium real estate', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYmJmN2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludmVzdG1lbnQgT3Bwb3J0dW5pdGllczwvdGV4dD48L3N2Zz4=', 'image/svg+xml', 2, 'Investment opportunities banner');

-- Grant permissions (adjust as needed for your Supabase setup)
-- GRANT SELECT ON hero_carousel_images TO anon;
-- GRANT ALL ON hero_carousel_images TO authenticated;
-- GRANT ALL ON hero_carousel_images TO service_role;
