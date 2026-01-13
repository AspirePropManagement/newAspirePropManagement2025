-- SQL command to remove important_notes column from new_projects table
-- Run this command in your database

ALTER TABLE public.new_projects 
DROP COLUMN IF EXISTS important_notes;

