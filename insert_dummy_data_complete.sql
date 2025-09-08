-- Complete dummy data insertion script for Supabase
-- This script creates users first, then inserts properties with valid user references

-- Step 1: Insert dummy users
INSERT INTO public.users (
  email, password_hash, first_name, last_name, phone, role, is_active
) VALUES 
('admin@aspireprop.com', '$2a$10$dummy.hash.for.admin', 'Admin', 'User', '+919876543200', 'ADMIN', true),
('agent1@aspireprop.com', '$2a$10$dummy.hash.for.agent1', 'Rajesh', 'Kumar', '+919876543201', 'AGENT', true),
('agent2@aspireprop.com', '$2a$10$dummy.hash.for.agent2', 'Priya', 'Sharma', '+919876543202', 'AGENT', true),
('agent3@aspireprop.com', '$2a$10$dummy.hash.for.agent3', 'Amit', 'Patel', '+919876543203', 'AGENT', true),
('builder1@aspireprop.com', '$2a$10$dummy.hash.for.builder1', 'Sunita', 'Reddy', '+919876543204', 'BUILDER', true),
('builder2@aspireprop.com', '$2a$10$dummy.hash.for.builder2', 'Vikram', 'Singh', '+919876543205', 'BUILDER', true),
('buyer1@aspireprop.com', '$2a$10$dummy.hash.for.buyer1', 'Meera', 'Joshi', '+919876543206', 'BUYER', true),
('buyer2@aspireprop.com', '$2a$10$dummy.hash.for.buyer2', 'Ravi', 'Gupta', '+919876543207', 'BUYER', true);

-- Step 2: Get the user IDs for reference
-- Note: In a real scenario, you would use these IDs in your application
-- For now, we'll use a subquery to get the first agent's ID

-- Step 3: Insert resale properties with valid user references
INSERT INTO public.resale_properties (
  seller_name, seller_email, seller_contact_no, seller_alternate_no,
  property_type, society_name, bhk_type, square_feet, carpet_area,
  location, flat_no, wing_no, floor_no, facing, parking_type,
  furnishing_type, asking_price, is_negotiable, property_age,
  has_amenities, status, notes, created_by, property_images, amenities
) VALUES 
-- Property 1
('Rajesh Kumar', 'rajesh.kumar@email.com', '+919876543210', '+919876543211',
 'apartment', 'Prestige Shantiniketan', '3_bhk', 1200, 1100,
 'Baner, Pune', 'A-1201', 'A', '12', 'East', 'covered_parking',
 'semi_furnished', 12500000.00, true, '5 years', true, 'available',
 'Beautiful 3 BHK apartment with modern amenities and great connectivity.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"], "interior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- Property 2
('Priya Sharma', 'priya.sharma@email.com', '+919876543212', null,
 'apartment', 'Godrej Woods', '2_bhk', 950, 850,
 'Hinjewadi, Pune', 'B-502', 'B', '5', 'North', 'open_parking',
 'fully_furnished', 8500000.00, false, '3 years', true, 'available',
 'Fully furnished 2 BHK with premium fixtures and fittings.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 3
('Amit Patel', 'amit.patel@email.com', '+919876543213', '+919876543214',
 'gated_community_villa_or_bungalow', 'Lodha Belmondo', '4_bhk', 1800, 1600,
 'Hinjewadi, Pune', 'V-15', null, 'Ground', 'South', 'covered_parking',
 'un_furnished', 18500000.00, true, '2 years', true, 'available',
 'Spacious villa with private garden and premium location.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "park": true}}'),

-- Property 4
('Sunita Reddy', 'sunita.reddy@email.com', '+919876543215', null,
 'apartment', 'Mahindra LifeSpaces', '3_bhk', 1150, 1050,
 'Kharadi, Pune', 'C-801', 'C', '8', 'West', 'covered_parking',
 'semi_furnished', 9500000.00, true, '4 years', true, 'available',
 'Well-maintained apartment with good ventilation and natural light.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- Property 5
('Vikram Singh', 'vikram.singh@email.com', '+919876543216', '+919876543217',
 'independent_house', null, '5_bhk', 2200, 2000,
 'Koregaon Park, Pune', null, null, 'Ground', 'East', 'open_parking',
 'fully_furnished', 25000000.00, false, '1 year', true, 'available',
 'Luxury independent house with modern architecture and premium finishes.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Property 6
('Meera Joshi', 'meera.joshi@email.com', '+919876543218', null,
 'apartment', 'Sunshine Residency', '2_bhk', 900, 800,
 'Viman Nagar, Pune', 'D-301', 'D', '3', 'North', 'shed_parking',
 'un_furnished', 7500000.00, true, '6 years', false, 'available',
 'Compact 2 BHK apartment in a well-established society.',
 (SELECT id FROM users WHERE email = 'buyer1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 7
('Ravi Gupta', 'ravi.gupta@email.com', '+919876543219', '+919876543220',
 'apartment', 'Green Valley', '3_bhk', 1300, 1200,
 'Wakad, Pune', 'E-1001', 'E', '10', 'South', 'covered_parking',
 'semi_furnished', 11000000.00, true, '3 years', true, 'available',
 'Corner apartment with excellent views and natural lighting.',
 (SELECT id FROM users WHERE email = 'buyer2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 8
('Kavita Desai', 'kavita.desai@email.com', '+919876543221', null,
 'gated_community_villa_or_bungalow', 'Palm Springs', '4_bhk', 1900, 1700,
 'Baner, Pune', 'V-8', null, 'Ground', 'West', 'covered_parking',
 'fully_furnished', 22000000.00, false, '2 years', true, 'available',
 'Premium villa with private terrace and garden area.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Property 9
('Suresh Iyer', 'suresh.iyer@email.com', '+919876543222', '+919876543223',
 'apartment', 'Blue Ridge', '2_bhk', 1000, 900,
 'Hinjewadi, Pune', 'F-402', 'F', '4', 'East', 'open_parking',
 'un_furnished', 8200000.00, true, '5 years', true, 'available',
 'Well-planned 2 BHK with good space utilization.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 10
('Anita Verma', 'anita.verma@email.com', '+919876543224', null,
 'apartment', 'Royal Gardens', '3_bhk', 1250, 1150,
 'Kharadi, Pune', 'G-601', 'G', '6', 'North', 'covered_parking',
 'semi_furnished', 9800000.00, true, '4 years', true, 'available',
 'Spacious 3 BHK with modern amenities and good connectivity.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"swimming_pool": true}}'),

-- Property 11
('Deepak Agarwal', 'deepak.agarwal@email.com', '+919876543225', '+919876543226',
 'independent_house', null, '5_plus_bhk', 2500, 2300,
 'Koregaon Park, Pune', null, null, 'Ground', 'South', 'covered_parking',
 'fully_furnished', 30000000.00, false, '1 year', true, 'available',
 'Luxury independent house with premium finishes and modern design.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- Property 12
('Pooja Nair', 'pooja.nair@email.com', '+919876543227', null,
 'apartment', 'Green Meadows', '2_bhk', 950, 850,
 'Wakad, Pune', 'H-201', 'H', '2', 'West', 'shed_parking',
 'un_furnished', 7800000.00, true, '6 years', false, 'available',
 'Affordable 2 BHK in a well-maintained society.',
 (SELECT id FROM users WHERE email = 'buyer1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 13
('Manoj Tiwari', 'manoj.tiwari@email.com', '+919876543228', '+919876543229',
 'apartment', 'Skyline Heights', '3_bhk', 1350, 1250,
 'Baner, Pune', 'I-701', 'I', '7', 'East', 'covered_parking',
 'semi_furnished', 12800000.00, true, '3 years', true, 'available',
 'High-rise apartment with panoramic city views.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Property 14
('Shilpa Rao', 'shilpa.rao@email.com', '+919876543230', null,
 'gated_community_villa_or_bungalow', 'Garden City', '4_bhk', 1750, 1600,
 'Hinjewadi, Pune', 'V-12', null, 'Ground', 'North', 'covered_parking',
 'fully_furnished', 19500000.00, false, '2 years', true, 'available',
 'Beautiful villa with landscaped garden and modern amenities.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 15
('Rajesh Malhotra', 'rajesh.malhotra@email.com', '+919876543231', '+919876543232',
 'apartment', 'Palm Grove', '2_bhk', 1050, 950,
 'Kharadi, Pune', 'J-501', 'J', '5', 'South', 'open_parking',
 'semi_furnished', 8800000.00, true, '4 years', true, 'available',
 'Well-designed 2 BHK with good natural light and ventilation.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 16
('Neha Kapoor', 'neha.kapoor@email.com', '+919876543233', null,
 'apartment', 'Royal Palms', '3_bhk', 1200, 1100,
 'Viman Nagar, Pune', 'K-301', 'K', '3', 'West', 'covered_parking',
 'fully_furnished', 11500000.00, false, '3 years', true, 'available',
 'Fully furnished 3 BHK with premium fixtures and modern design.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 17
('Vikash Jain', 'vikash.jain@email.com', '+919876543234', '+919876543235',
 'independent_house', null, '5_bhk', 2100, 1900,
 'Koregaon Park, Pune', null, null, 'Ground', 'East', 'covered_parking',
 'semi_furnished', 24000000.00, true, '2 years', true, 'available',
 'Spacious independent house with modern amenities and good location.',
 (SELECT id FROM users WHERE email = 'buyer2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 18
('Ritu Sharma', 'ritu.sharma@email.com', '+919876543236', null,
 'apartment', 'Green Valley', '2_bhk', 900, 800,
 'Wakad, Pune', 'L-401', 'L', '4', 'North', 'shed_parking',
 'un_furnished', 7600000.00, true, '5 years', false, 'available',
 'Compact 2 BHK apartment in a well-established society.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 19
('Amit Kumar', 'amit.kumar@email.com', '+919876543237', '+919876543238',
 'apartment', 'Blue Ridge', '3_bhk', 1300, 1200,
 'Hinjewadi, Pune', 'M-801', 'M', '8', 'South', 'covered_parking',
 'semi_furnished', 11200000.00, true, '3 years', true, 'available',
 'Well-maintained 3 BHK with good amenities and connectivity.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"swimming_pool": true}}'),

-- Property 20
('Suman Gupta', 'suman.gupta@email.com', '+919876543239', null,
 'gated_community_villa_or_bungalow', 'Palm Springs', '4_bhk', 1850, 1700,
 'Baner, Pune', 'V-6', null, 'Ground', 'West', 'covered_parking',
 'fully_furnished', 21500000.00, false, '2 years', true, 'available',
 'Premium villa with private garden and modern amenities.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Property 21
('Ravi Singh', 'ravi.singh@email.com', '+919876543240', '+919876543241',
 'apartment', 'Sunshine Residency', '2_bhk', 1000, 900,
 'Kharadi, Pune', 'N-201', 'N', '2', 'East', 'open_parking',
 'semi_furnished', 8500000.00, true, '4 years', true, 'available',
 'Well-planned 2 BHK with good space utilization and natural light.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 22
('Kavita Patel', 'kavita.patel@email.com', '+919876543242', null,
 'apartment', 'Royal Gardens', '3_bhk', 1250, 1150,
 'Viman Nagar, Pune', 'O-601', 'O', '6', 'North', 'covered_parking',
 'fully_furnished', 12000000.00, false, '3 years', true, 'available',
 'Fully furnished 3 BHK with premium amenities and modern design.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 23
('Suresh Reddy', 'suresh.reddy@email.com', '+919876543243', '+919876543244',
 'independent_house', null, '5_bhk', 2300, 2100,
 'Koregaon Park, Pune', null, null, 'Ground', 'South', 'covered_parking',
 'semi_furnished', 26000000.00, true, '1 year', true, 'available',
 'Modern independent house with premium finishes and good location.',
 (SELECT id FROM users WHERE email = 'buyer1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 24
('Anita Iyer', 'anita.iyer@email.com', '+919876543245', null,
 'apartment', 'Green Meadows', '2_bhk', 950, 850,
 'Wakad, Pune', 'P-301', 'P', '3', 'West', 'shed_parking',
 'un_furnished', 7700000.00, true, '6 years', false, 'available',
 'Affordable 2 BHK in a well-maintained society with good connectivity.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 25
('Deepak Verma', 'deepak.verma@email.com', '+919876543246', '+919876543247',
 'apartment', 'Skyline Heights', '3_bhk', 1350, 1250,
 'Baner, Pune', 'Q-701', 'Q', '7', 'East', 'covered_parking',
 'semi_furnished', 13000000.00, true, '3 years', true, 'available',
 'High-rise apartment with excellent city views and modern amenities.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Property 26
('Pooja Agarwal', 'pooja.agarwal@email.com', '+919876543248', null,
 'gated_community_villa_or_bungalow', 'Garden City', '4_bhk', 1800, 1650,
 'Hinjewadi, Pune', 'V-10', null, 'Ground', 'North', 'covered_parking',
 'fully_furnished', 20000000.00, false, '2 years', true, 'available',
 'Beautiful villa with landscaped garden and premium amenities.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 27
('Manoj Nair', 'manoj.nair@email.com', '+919876543249', '+919876543250',
 'apartment', 'Palm Grove', '2_bhk', 1050, 950,
 'Kharadi, Pune', 'R-401', 'R', '4', 'South', 'open_parking',
 'semi_furnished', 8900000.00, true, '4 years', true, 'available',
 'Well-designed 2 BHK with good natural light and modern amenities.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 28
('Shilpa Tiwari', 'shilpa.tiwari@email.com', '+919876543251', null,
 'apartment', 'Royal Palms', '3_bhk', 1200, 1100,
 'Viman Nagar, Pune', 'S-501', 'S', '5', 'West', 'covered_parking',
 'fully_furnished', 11800000.00, false, '3 years', true, 'available',
 'Fully furnished 3 BHK with premium fixtures and excellent location.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 29
('Rajesh Rao', 'rajesh.rao@email.com', '+919876543252', '+919876543253',
 'independent_house', null, '5_plus_bhk', 2400, 2200,
 'Koregaon Park, Pune', null, null, 'Ground', 'East', 'covered_parking',
 'semi_furnished', 28000000.00, true, '1 year', true, 'available',
 'Luxury independent house with premium finishes and modern design.',
 (SELECT id FROM users WHERE email = 'buyer2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- Property 30
('Neha Malhotra', 'neha.malhotra@email.com', '+919876543254', null,
 'apartment', 'Green Valley', '2_bhk', 900, 800,
 'Wakad, Pune', 'T-201', 'T', '2', 'North', 'shed_parking',
 'un_furnished', 7500000.00, true, '5 years', false, 'available',
 'Compact 2 BHK apartment in a well-established society with good connectivity.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}');

-- Step 4: Insert rental properties
INSERT INTO public.rental_properties (
  owner_name, owner_email, owner_contact_no, owner_alternate_no,
  property_type, society_name, bhk_type, location, flat_no, wing_no, floor_no,
  rent_amount, rent_negotiable, deposit_amount, deposit_negotiable,
  allowed_for_family, allowed_for_bachelor, allowed_for_anyone, pets_allowed,
  parking_type, furnishing_type, immediate_possession, available_from_date,
  visit_details, has_amenities, status, notes, created_by, property_images, amenities
) VALUES 
-- Rental Property 1
('Rajesh Kumar', 'rajesh.kumar@email.com', '+919876543300', '+919876543301',
 'apartment', 'Prestige Shantiniketan', '2_bhk', 'Baner, Pune', 'A-1201', 'A', '12',
 25000.00, true, 50000.00, true, true, true, true, false,
 'covered_parking', 'semi_furnished', true, '2024-02-01',
 'Contact between 10 AM to 6 PM', true, 'available',
 'Beautiful 2 BHK apartment available for rent with modern amenities.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Rental Property 2
('Priya Sharma', 'priya.sharma@email.com', '+919876543302', null,
 'apartment', 'Godrej Woods', '3_bhk', 'Hinjewadi, Pune', 'B-502', 'B', '5',
 35000.00, false, 70000.00, false, true, false, true, true,
 'open_parking', 'fully_furnished', false, '2024-03-01',
 'Weekend visits preferred', true, 'available',
 'Fully furnished 3 BHK with premium fixtures, family only.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Rental Property 3
('Amit Patel', 'amit.patel@email.com', '+919876543303', '+919876543304',
 'gated_community_villa_or_bungalow', 'Lodha Belmondo', '4_bhk', 'Hinjewadi, Pune', 'V-15', null, 'Ground',
 60000.00, true, 120000.00, true, true, false, true, true,
 'covered_parking', 'un_furnished', true, '2024-02-15',
 'Contact owner directly', true, 'available',
 'Spacious villa available for rent, family preferred.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "park": true}}'),

-- Rental Property 4
('Sunita Reddy', 'sunita.reddy@email.com', '+919876543305', null,
 'apartment', 'Mahindra LifeSpaces', '2_bhk', 'Kharadi, Pune', 'C-801', 'C', '8',
 22000.00, true, 44000.00, true, true, true, true, false,
 'covered_parking', 'semi_furnished', true, '2024-02-01',
 'Available for immediate possession', true, 'available',
 'Well-maintained 2 BHK apartment with good ventilation.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- Rental Property 5
('Vikram Singh', 'vikram.singh@email.com', '+919876543306', '+919876543307',
 'independent_house', null, '5_bhk', 'Koregaon Park, Pune', null, null, 'Ground',
 80000.00, false, 160000.00, false, true, false, true, true,
 'open_parking', 'fully_furnished', true, '2024-02-01',
 'Luxury house, family only', true, 'available',
 'Luxury independent house with modern architecture, family preferred.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}');

-- Step 5: Insert new projects
INSERT INTO public.new_projects (
  crafted_by, project_name, project_type, construction_type, project_location,
  rooms_per_floor, cp_sables, other_notes, contact_name_1, contact_number_1,
  contact_name_2, contact_number_2, is_govt_approved, is_rera_approved,
  loan_available, social_media_marketing_allowed, important_notes,
  units_available_for_sale, rera_number, project_conversion_rate,
  club_house, swimming_pool, children_play_area, power_backup, house_keeping,
  lift, gym, park, security, gas_pipeline, rain_water_harvesting,
  sewage_treatment_plant, visitor_parking, fire_safety, status, created_by,
  property_images, amenities
) VALUES 
-- New Project 1
('Prestige Group', 'Prestige City', 'residence', 'under_construction', 'Baner, Pune',
 '4 units per floor', 'Yes', 'Premium residential project with modern amenities',
 'Rajesh Kumar', '+919876543400', 'Priya Sharma', '+919876543401',
 true, true, true, true, 'RERA approved project with excellent connectivity',
 '150 units', 'P52100012345', '85%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true, "club_house": true}}'),

-- New Project 2
('Godrej Properties', 'Godrej Woods', 'residence', 'ready_to_move', 'Hinjewadi, Pune',
 '6 units per floor', 'Yes', 'Ready to move project with premium finishes',
 'Amit Patel', '+919876543402', null, null,
 true, true, true, true, 'Ready to move project, immediate possession available',
 '200 units', 'P52100012346', '90%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 3
('Lodha Group', 'Lodha Belmondo', 'gated_community_villa_or_bungalow', 'new_launching', 'Hinjewadi, Pune',
 '2 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Sunita Reddy', '+919876543403', 'Vikram Singh', '+919876543404',
 true, true, true, true, 'New launch luxury villa project',
 '50 units', 'P52100012347', '75%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 4
('Mahindra Lifespaces', 'Mahindra LifeSpaces', 'residence', 'under_construction', 'Kharadi, Pune',
 '4 units per floor', 'Yes', 'Modern residential project with green features',
 'Meera Joshi', '+919876543405', null, null,
 true, true, true, true, 'Green building with sustainable features',
 '120 units', 'P52100012348', '80%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- New Project 5
('Sunshine Developers', 'Sunshine Residency', 'residence', 'ready_to_move', 'Viman Nagar, Pune',
 '8 units per floor', 'Yes', 'Affordable housing project with basic amenities',
 'Ravi Gupta', '+919876543406', 'Kavita Desai', '+919876543407',
 true, true, true, true, 'Affordable housing project, ready to move',
 '300 units', 'P52100012349', '95%',
 false, false, true, true, true, false, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}');

-- Verification queries
SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Resale properties created:' as info, COUNT(*) as count FROM resale_properties;
SELECT 'Rental properties created:' as info, COUNT(*) as count FROM rental_properties;
SELECT 'New projects created:' as info, COUNT(*) as count FROM new_projects;
