-- Increase statement_timeout for anonymous users
-- This helps with queries that fetch large amounts of data (like base64 images)
--
-- Default timeout for anon role: 3 seconds
-- This increases it to 10 seconds (you can adjust as needed)

-- Check current timeout settings
SELECT rolname, rolconfig FROM pg_roles WHERE rolname IN ('anon', 'authenticated');

-- Increase timeout for anonymous users (anon role)
ALTER ROLE anon SET statement_timeout = '10s';

-- Reload PostgREST configuration to apply the change
NOTIFY pgrst, 'reload config';

-- Verify the change
SELECT rolname, rolconfig FROM pg_roles WHERE rolname = 'anon';
-- Should show: statement_timeout = 10s

-- Note: You can increase this further if needed (e.g., '15s', '30s')
-- But keep in mind that free tier has performance constraints
-- The real solution is to optimize data transfer (use Storage instead of base64)
