-- Setup Test Users for Aspire Property Management
-- Run this script in your Supabase SQL Editor

-- First, let's check if the users table exists and has data
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users
FROM users;

-- Insert test users for each role (if table is empty)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, phone) 
SELECT * FROM (VALUES
    ('admin@aspire.com', 'temp_hash', 'Admin', 'User', 'ADMIN', true, '+1234567890'),
    ('agent@aspire.com', 'temp_hash', 'Real Estate', 'Agent', 'AGENT', true, '+1234567891'),
    ('buyer@aspire.com', 'temp_hash', 'Property', 'Buyer', 'BUYER', true, '+1234567892'),
    ('builder@aspire.com', 'temp_hash', 'Property', 'Builder', 'BUILDER', true, '+1234567893')
) AS v(email, password_hash, first_name, last_name, role, is_active, phone)
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = v.email
);

-- Verify the users were created
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    created_at
FROM users 
ORDER BY created_at;

-- Check role distribution
SELECT 
    role,
    COUNT(*) as user_count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
FROM users 
GROUP BY role 
ORDER BY role;

-- Test query to verify authentication will work
SELECT 
    email,
    role,
    is_active
FROM users 
WHERE email = 'admin@aspire.com' 
AND is_active = true;
