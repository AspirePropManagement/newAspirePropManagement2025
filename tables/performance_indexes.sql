-- Performance Indexes for Common Queries
-- Run this SQL to optimize database queries and prevent timeouts

-- Indexes for services table
CREATE INDEX IF NOT EXISTS idx_services_is_active_sort_order 
ON services (is_active, sort_order) 
WHERE is_active = true;

-- Indexes for resale_properties table  
CREATE INDEX IF NOT EXISTS idx_resale_properties_status_created 
ON resale_properties (status, created_at DESC) 
WHERE status = 'available';

-- Indexes for rental_properties table (if needed)
CREATE INDEX IF NOT EXISTS idx_rental_properties_status_created 
ON rental_properties (status, created_at DESC);

-- Indexes for new_projects table (if needed)
CREATE INDEX IF NOT EXISTS idx_new_projects_status_created 
ON new_projects (created_at DESC);

-- Verify indexes exist
SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND (
        tablename = 'services' 
        OR tablename = 'resale_properties'
        OR tablename = 'rental_properties'
        OR tablename = 'new_projects'
        OR tablename = 'hero_carousel_images'
    )
ORDER BY tablename, indexname;
