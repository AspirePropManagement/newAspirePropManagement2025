-- ALTER queries to rename suggestion columns to puggestion in new_projects table

-- Rename suggestion_date to puggestion_date
ALTER TABLE public.new_projects 
RENAME COLUMN suggestion_date TO puggestion_date;

-- Rename suggestion_year to puggestion_year
ALTER TABLE public.new_projects 
RENAME COLUMN suggestion_year TO puggestion_year;

-- Note: After running these queries, update all code references from "suggestion" to "puggestion"

