-- SQL command to rename other_notes column to project_description in new_projects table
-- Run this command in your database

ALTER TABLE public.new_projects 
RENAME COLUMN other_notes TO project_description;

