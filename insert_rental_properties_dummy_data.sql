-- Insert 30 dummy records into rental_properties table
-- Note: This script assumes you have already run the users creation script
-- If not, make sure to create users first or replace the created_by references

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
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"], "interior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

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
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Rental Property 6
('Meera Joshi', 'meera.joshi@email.com', '+919876543308', null,
 'apartment', 'Sunshine Residency', '1_rk_1_bhk', 'Viman Nagar, Pune', 'D-301', 'D', '3',
 15000.00, true, 30000.00, true, false, true, true, false,
 'shed_parking', 'un_furnished', true, '2024-02-01',
 'Perfect for working professionals', false, 'available',
 'Compact 1 RK apartment in a well-established society.',
 (SELECT id FROM users WHERE email = 'buyer1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Rental Property 7
('Ravi Gupta', 'ravi.gupta@email.com', '+919876543309', '+919876543310',
 'apartment', 'Green Valley', '3_bhk', 'Wakad, Pune', 'E-1001', 'E', '10',
 32000.00, true, 64000.00, true, true, true, true, true,
 'covered_parking', 'semi_furnished', false, '2024-03-15',
 'Corner apartment with excellent views', true, 'available',
 'Spacious 3 BHK with good amenities and connectivity.',
 (SELECT id FROM users WHERE email = 'buyer2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Rental Property 8
('Kavita Desai', 'kavita.desai@email.com', '+919876543311', null,
 'gated_community_villa_or_bungalow', 'Palm Springs', '4_bhk', 'Baner, Pune', 'V-8', null, 'Ground',
 55000.00, false, 110000.00, false, true, false, true, true,
 'covered_parking', 'fully_furnished', true, '2024-02-01',
 'Premium villa with private terrace', true, 'available',
 'Luxury villa with private garden and modern amenities.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Rental Property 9
('Suresh Iyer', 'suresh.iyer@email.com', '+919876543312', '+919876543313',
 'apartment', 'Blue Ridge', '2_bhk', 'Hinjewadi, Pune', 'F-402', 'F', '4',
 28000.00, true, 56000.00, true, true, true, true, false,
 'open_parking', 'un_furnished', true, '2024-02-01',
 'Well-planned 2 BHK with good space utilization', true, 'available',
 'Modern 2 BHK apartment with good natural light.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Rental Property 10
('Anita Verma', 'anita.verma@email.com', '+919876543314', null,
 'apartment', 'Royal Gardens', '3_bhk', 'Kharadi, Pune', 'G-601', 'G', '6',
 30000.00, true, 60000.00, true, true, false, true, false,
 'covered_parking', 'semi_furnished', false, '2024-04-01',
 'Family preferred, no pets', true, 'available',
 'Spacious 3 BHK with modern amenities and good connectivity.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"swimming_pool": true}}'),

-- Rental Property 11
('Deepak Agarwal', 'deepak.agarwal@email.com', '+919876543315', '+919876543316',
 'independent_house', null, '5_plus_bhk', 'Koregaon Park, Pune', null, null, 'Ground',
 75000.00, true, 150000.00, true, true, false, true, true,
 'covered_parking', 'fully_furnished', true, '2024-02-01',
 'Luxury house with premium finishes', true, 'available',
 'Premium independent house with modern design and amenities.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- Rental Property 12
('Pooja Nair', 'pooja.nair@email.com', '+919876543317', null,
 'apartment', 'Green Meadows', '2_bhk', 'Wakad, Pune', 'H-201', 'H', '2',
 26000.00, true, 52000.00, true, true, true, true, false,
 'shed_parking', 'un_furnished', true, '2024-02-01',
 'Affordable 2 BHK in well-maintained society', false, 'available',
 'Budget-friendly 2 BHK apartment with basic amenities.',
 (SELECT id FROM users WHERE email = 'buyer1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Rental Property 13
('Manoj Tiwari', 'manoj.tiwari@email.com', '+919876543318', '+919876543319',
 'apartment', 'Skyline Heights', '3_bhk', 'Baner, Pune', 'I-701', 'I', '7',
 38000.00, true, 76000.00, true, true, true, true, true,
 'covered_parking', 'semi_furnished', false, '2024-03-01',
 'High-rise apartment with city views', true, 'available',
 'Modern 3 BHK with panoramic city views and amenities.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Rental Property 14
('Shilpa Rao', 'shilpa.rao@email.com', '+919876543320', null,
 'gated_community_villa_or_bungalow', 'Garden City', '4_bhk', 'Hinjewadi, Pune', 'V-12', null, 'Ground',
 52000.00, false, 104000.00, false, true, false, true, true,
 'covered_parking', 'fully_furnished', true, '2024-02-01',
 'Beautiful villa with landscaped garden', true, 'available',
 'Premium villa with garden and modern amenities.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Rental Property 15
('Rajesh Malhotra', 'rajesh.malhotra@email.com', '+919876543321', '+919876543322',
 'apartment', 'Palm Grove', '2_bhk', 'Kharadi, Pune', 'J-501', 'J', '5',
 27000.00, true, 54000.00, true, true, true, true, false,
 'open_parking', 'semi_furnished', true, '2024-02-01',
 'Well-designed 2 BHK with natural light', true, 'available',
 'Modern 2 BHK with good ventilation and amenities.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Rental Property 16
('Neha Kapoor', 'neha.kapoor@email.com', '+919876543323', null,
 'apartment', 'Royal Palms', '3_bhk', 'Viman Nagar, Pune', 'K-301', 'K', '3',
 33000.00, false, 66000.00, false, true, false, true, false,
 'covered_parking', 'fully_furnished', false, '2024-04-01',
 'Fully furnished 3 BHK, family only', true, 'available',
 'Premium 3 BHK with complete furnishings and amenities.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Rental Property 17
('Vikash Jain', 'vikash.jain@email.com', '+919876543324', '+919876543325',
 'independent_house', null, '5_bhk', 'Koregaon Park, Pune', null, null, 'Ground',
 70000.00, true, 140000.00, true, true, false, true, true,
 'covered_parking', 'semi_furnished', true, '2024-02-01',
 'Spacious house with modern amenities', true, 'available',
 'Large independent house with good location and amenities.',
 (SELECT id FROM users WHERE email = 'buyer2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Rental Property 18
('Ritu Sharma', 'ritu.sharma@email.com', '+919876543326', null,
 'apartment', 'Green Valley', '2_bhk', 'Wakad, Pune', 'L-401', 'L', '4',
 25000.00, true, 50000.00, true, true, true, true, false,
 'shed_parking', 'un_furnished', true, '2024-02-01',
 'Compact 2 BHK in established society', false, 'available',
 'Basic 2 BHK apartment with essential amenities.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Rental Property 19
('Amit Kumar', 'amit.kumar@email.com', '+919876543327', '+919876543328',
 'apartment', 'Blue Ridge', '3_bhk', 'Hinjewadi, Pune', 'M-801', 'M', '8',
 34000.00, true, 68000.00, true, true, true, true, true,
 'covered_parking', 'semi_furnished', false, '2024-03-01',
 'Well-maintained 3 BHK with amenities', true, 'available',
 'Modern 3 BHK with good connectivity and amenities.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"swimming_pool": true}}'),

-- Rental Property 20
('Suman Gupta', 'suman.gupta@email.com', '+919876543329', null,
 'gated_community_villa_or_bungalow', 'Palm Springs', '4_bhk', 'Baner, Pune', 'V-6', null, 'Ground',
 58000.00, false, 116000.00, false, true, false, true, true,
 'covered_parking', 'fully_furnished', true, '2024-02-01',
 'Premium villa with private garden', true, 'available',
 'Luxury villa with private garden and premium amenities.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Rental Property 21
('Ravi Singh', 'ravi.singh@email.com', '+919876543330', '+919876543331',
 'apartment', 'Sunshine Residency', '2_bhk', 'Kharadi, Pune', 'N-201', 'N', '2',
 29000.00, true, 58000.00, true, true, true, true, false,
 'open_parking', 'semi_furnished', true, '2024-02-01',
 'Well-planned 2 BHK with natural light', true, 'available',
 'Modern 2 BHK with good space utilization and amenities.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Rental Property 22
('Kavita Patel', 'kavita.patel@email.com', '+919876543332', null,
 'apartment', 'Royal Gardens', '3_bhk', 'Viman Nagar, Pune', 'O-601', 'O', '6',
 36000.00, false, 72000.00, false, true, false, true, false,
 'covered_parking', 'fully_furnished', false, '2024-04-01',
 'Fully furnished 3 BHK, family preferred', true, 'available',
 'Premium 3 BHK with complete furnishings and modern amenities.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Rental Property 23
('Suresh Reddy', 'suresh.reddy@email.com', '+919876543333', '+919876543334',
 'independent_house', null, '5_bhk', 'Koregaon Park, Pune', null, null, 'Ground',
 72000.00, true, 144000.00, true, true, false, true, true,
 'covered_parking', 'semi_furnished', true, '2024-02-01',
 'Modern house with premium finishes', true, 'available',
 'Contemporary independent house with modern amenities and good location.',
 (SELECT id FROM users WHERE email = 'buyer1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Rental Property 24
('Anita Iyer', 'anita.iyer@email.com', '+919876543335', null,
 'apartment', 'Green Meadows', '2_bhk', 'Wakad, Pune', 'P-301', 'P', '3',
 24000.00, true, 48000.00, true, true, true, true, false,
 'shed_parking', 'un_furnished', true, '2024-02-01',
 'Affordable 2 BHK with good connectivity', false, 'available',
 'Budget-friendly 2 BHK in well-maintained society.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Rental Property 25
('Deepak Verma', 'deepak.verma@email.com', '+919876543336', '+919876543337',
 'apartment', 'Skyline Heights', '3_bhk', 'Baner, Pune', 'Q-701', 'Q', '7',
 39000.00, true, 78000.00, true, true, true, true, true,
 'covered_parking', 'semi_furnished', false, '2024-03-01',
 'High-rise apartment with excellent city views', true, 'available',
 'Modern 3 BHK with panoramic city views and premium amenities.',
 (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Rental Property 26
('Pooja Agarwal', 'pooja.agarwal@email.com', '+919876543338', null,
 'gated_community_villa_or_bungalow', 'Garden City', '4_bhk', 'Hinjewadi, Pune', 'V-10', null, 'Ground',
 54000.00, false, 108000.00, false, true, false, true, true,
 'covered_parking', 'fully_furnished', true, '2024-02-01',
 'Beautiful villa with landscaped garden', true, 'available',
 'Premium villa with landscaped garden and luxury amenities.',
 (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Rental Property 27
('Manoj Nair', 'manoj.nair@email.com', '+919876543339', '+919876543340',
 'apartment', 'Palm Grove', '2_bhk', 'Kharadi, Pune', 'R-401', 'R', '4',
 28000.00, true, 56000.00, true, true, true, true, false,
 'open_parking', 'semi_furnished', true, '2024-02-01',
 'Well-designed 2 BHK with modern amenities', true, 'available',
 'Contemporary 2 BHK with good natural light and amenities.',
 (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Rental Property 28
('Shilpa Tiwari', 'shilpa.tiwari@email.com', '+919876543341', null,
 'apartment', 'Royal Palms', '3_bhk', 'Viman Nagar, Pune', 'S-501', 'S', '5',
 35000.00, false, 70000.00, false, true, false, true, false,
 'covered_parking', 'fully_furnished', false, '2024-04-01',
 'Fully furnished 3 BHK with premium fixtures', true, 'available',
 'Luxury 3 BHK with complete furnishings and premium amenities.',
 (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Rental Property 29
('Rajesh Rao', 'rajesh.rao@email.com', '+919876543342', '+919876543343',
 'independent_house', null, '5_plus_bhk', 'Koregaon Park, Pune', null, null, 'Ground',
 78000.00, true, 156000.00, true, true, false, true, true,
 'covered_parking', 'semi_furnished', true, '2024-02-01',
 'Luxury house with premium finishes and modern design', true, 'available',
 'Premium independent house with luxury amenities and modern design.',
 (SELECT id FROM users WHERE email = 'buyer2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- Rental Property 30
('Neha Malhotra', 'neha.malhotra@email.com', '+919876543344', null,
 'apartment', 'Green Valley', '2_bhk', 'Wakad, Pune', 'T-201', 'T', '2',
 23000.00, true, 46000.00, true, true, true, true, false,
 'shed_parking', 'un_furnished', true, '2024-02-01',
 'Compact 2 BHK with good connectivity', false, 'available',
 'Basic 2 BHK apartment in well-established society with good connectivity.',
 (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{}',
 '{"basic_amenities": {"lift": true}}');

-- Verification query
SELECT 'Rental properties created:' as info, COUNT(*) as count FROM rental_properties;
