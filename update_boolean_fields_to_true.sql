-- =====================================================
-- UPDATE BOOLEAN FIELDS FROM FALSE TO TRUE IN NEW PROJECTS
-- =====================================================
-- This script updates compliance and approval boolean fields
-- from false to true in the new_projects table

-- Option 1: Update all records to set all boolean fields to true
UPDATE public.new_projects
SET 
  is_govt_approved = true,
  is_rera_approved = true,
  loan_available = true,
  social_media_marketing_allowed = true
WHERE 
  is_govt_approved = false 
  OR is_rera_approved = false 
  OR loan_available = false 
  OR social_media_marketing_allowed = false;

-- Option 2: Update only specific fields (uncomment the ones you need)
-- UPDATE public.new_projects
-- SET is_govt_approved = true
-- WHERE is_govt_approved = false;

-- UPDATE public.new_projects
-- SET is_rera_approved = true
-- WHERE is_rera_approved = false;

-- UPDATE public.new_projects
-- SET loan_available = true
-- WHERE loan_available = false;

-- UPDATE public.new_projects
-- SET social_media_marketing_allowed = true
-- WHERE social_media_marketing_allowed = false;

-- Option 3: Update all records unconditionally (use with caution)
-- UPDATE public.new_projects
-- SET 
--   is_govt_approved = true,
--   is_rera_approved = true,
--   loan_available = true,
--   social_media_marketing_allowed = true;

-- Option 4: Update only records that have a RERA number (more selective)
-- UPDATE public.new_projects
-- SET is_rera_approved = true
-- WHERE rera_number IS NOT NULL AND rera_number != '' AND is_rera_approved = false;

-- Verify the updates
SELECT 
  id,
  project_name,
  is_govt_approved,
  is_rera_approved,
  loan_available,
  social_media_marketing_allowed,
  rera_number
FROM public.new_projects
ORDER BY created_at DESC
LIMIT 10;

-- Count records with each status
SELECT 
  COUNT(*) FILTER (WHERE is_govt_approved = true) as govt_approved_count,
  COUNT(*) FILTER (WHERE is_rera_approved = true) as rera_approved_count,
  COUNT(*) FILTER (WHERE loan_available = true) as loan_available_count,
  COUNT(*) FILTER (WHERE social_media_marketing_allowed = true) as social_media_allowed_count,
  COUNT(*) as total_projects
FROM public.new_projects;
