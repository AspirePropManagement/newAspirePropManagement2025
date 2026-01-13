-- RLS Policies for hero_carousel_images table
-- This allows anonymous users to view active hero carousel images

-- Enable RLS on the table
ALTER TABLE hero_carousel_images ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous users to SELECT active images
CREATE POLICY "Allow anonymous users to view active hero carousel images"
ON hero_carousel_images
FOR SELECT
TO anon
USING (is_active = true);

-- Policy to allow authenticated users to SELECT all images
CREATE POLICY "Allow authenticated users to view all hero carousel images"
ON hero_carousel_images
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow authenticated users to INSERT
CREATE POLICY "Allow authenticated users to insert hero carousel images"
ON hero_carousel_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy to allow authenticated users to UPDATE
CREATE POLICY "Allow authenticated users to update hero carousel images"
ON hero_carousel_images
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy to allow authenticated users to DELETE
CREATE POLICY "Allow authenticated users to delete hero carousel images"
ON hero_carousel_images
FOR DELETE
TO authenticated
USING (true);

-- Grant permissions (if RLS is not enough)
GRANT SELECT ON hero_carousel_images TO anon;
GRANT ALL ON hero_carousel_images TO authenticated;
GRANT ALL ON hero_carousel_images TO service_role;
