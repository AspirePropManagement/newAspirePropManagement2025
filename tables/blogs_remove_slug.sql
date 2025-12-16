-- Ensure timestamps are properly configured for blogs table
-- Note: Slug column is kept due to dependencies (published_blogs view)

-- The table already has these timestamp columns:
-- - created_at timestamp with time zone (default now())
-- - updated_at timestamp with time zone (default now())
-- - published_at timestamp with time zone (nullable)

-- These columns store full timestamps with timezone information
-- The UI will format these to display only the date portion (no time)
-- but the backend will always store and send full timestamps

-- No changes needed - timestamps are already properly configured
-- The UI code handles date-only display formatting

