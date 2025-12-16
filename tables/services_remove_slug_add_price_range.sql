-- Remove slug column and add price range columns to services table

-- Step 1: Drop the unique constraint on slug (must be done before dropping the column)
ALTER TABLE public.services
DROP CONSTRAINT IF EXISTS services_slug_unique;

-- Step 2: Drop the slug column
ALTER TABLE public.services
DROP COLUMN IF EXISTS slug;

-- Step 3: Add min_price column (numeric for precise price values)
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS min_price numeric(12, 2) NULL;

-- Step 4: Add max_price column (numeric for precise price values)
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS max_price numeric(12, 2) NULL;

-- Step 5: Add check constraint to ensure min_price <= max_price (when both are set)
ALTER TABLE public.services
ADD CONSTRAINT services_price_range_check CHECK (
  (min_price IS NULL AND max_price IS NULL) OR
  (min_price IS NULL) OR
  (max_price IS NULL) OR
  (min_price <= max_price)
);

-- Step 6: Add check constraint to ensure prices are non-negative
ALTER TABLE public.services
ADD CONSTRAINT services_price_nonneg_check CHECK (
  (min_price IS NULL OR min_price >= 0) AND
  (max_price IS NULL OR max_price >= 0)
);

-- Optional: Add index for price range queries (if you plan to filter by price)
CREATE INDEX IF NOT EXISTS idx_services_price_range 
ON public.services USING btree (min_price, max_price) 
WHERE min_price IS NOT NULL AND max_price IS NOT NULL;

-- Optional: Add comment to document the change
COMMENT ON COLUMN public.services.min_price IS 'Minimum price for the service in INR';
COMMENT ON COLUMN public.services.max_price IS 'Maximum price for the service in INR';

