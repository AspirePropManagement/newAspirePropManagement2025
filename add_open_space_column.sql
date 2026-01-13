-- SQL command to add open_space column to new_projects table
-- Run this command in your database

ALTER TABLE public.new_projects 
ADD COLUMN IF NOT EXISTS open_space NUMERIC(5, 2) NULL;

COMMENT ON COLUMN public.new_projects.open_space IS 'Open space in the project as a percentage (0-100)';

