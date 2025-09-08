-- Insert 30 dummy records into resale_properties table
-- Note: You'll need to replace the created_by UUIDs with actual user IDs from your users table

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
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"], "interior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- Property 2
('Priya Sharma', 'priya.sharma@email.com', '+919876543212', null,
 'apartment', 'Godrej Woods', '2_bhk', 950, 850,
 'Hinjewadi, Pune', 'B-502', 'B', '5', 'North', 'open_parking',
 'fully_furnished', 8500000.00, false, '3 years', true, 'available',
 'Fully furnished 2 BHK with premium fixtures and fittings.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 3
('Amit Patel', 'amit.patel@email.com', '+919876543213', '+919876543214',
 'gated_community_villa_or_bungalow', 'Lodha Belmondo', '4_bhk', 1800, 1600,
 'Hinjewadi, Pune', 'V-15', null, 'Ground', 'South', 'covered_parking',
 'un_furnished', 18500000.00, true, '2 years', true, 'available',
 'Spacious villa with private garden and premium location.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "park": true}}'),

-- Property 4
('Sunita Reddy', 'sunita.reddy@email.com', '+919876543215', null,
 'apartment', 'Mahindra LifeSpaces', '3_bhk', 1150, 1050,
 'Kharadi, Pune', 'C-801', 'C', '8', 'West', 'covered_parking',
 'semi_furnished', 9500000.00, true, '4 years', true, 'available',
 'Well-maintained apartment with good ventilation and natural light.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- Property 5
('Vikram Singh', 'vikram.singh@email.com', '+919876543216', '+919876543217',
 'independent_house', null, '5_bhk', 2200, 2000,
 'Koregaon Park, Pune', null, null, 'Ground', 'East', 'open_parking',
 'fully_furnished', 25000000.00, false, '1 year', true, 'available',
 'Luxury independent house with modern architecture and premium finishes.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Property 6
('Meera Joshi', 'meera.joshi@email.com', '+919876543218', null,
 'apartment', 'Sunshine Residency', '2_bhk', 900, 800,
 'Viman Nagar, Pune', 'D-301', 'D', '3', 'North', 'shed_parking',
 'un_furnished', 7500000.00, true, '6 years', false, 'available',
 'Compact 2 BHK apartment in a well-established society.',
 '00000000-0000-0000-0000-000000000001',
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 7
('Ravi Gupta', 'ravi.gupta@email.com', '+919876543219', '+919876543220',
 'apartment', 'Green Valley', '3_bhk', 1300, 1200,
 'Wakad, Pune', 'E-1001', 'E', '10', 'South', 'covered_parking',
 'semi_furnished', 11000000.00, true, '3 years', true, 'available',
 'Corner apartment with excellent views and natural lighting.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 8
('Kavita Desai', 'kavita.desai@email.com', '+919876543221', null,
 'gated_community_villa_or_bungalow', 'Palm Springs', '4_bhk', 1900, 1700,
 'Baner, Pune', 'V-8', null, 'Ground', 'West', 'covered_parking',
 'fully_furnished', 22000000.00, false, '2 years', true, 'available',
 'Premium villa with private terrace and garden area.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Property 9
('Suresh Iyer', 'suresh.iyer@email.com', '+919876543222', '+919876543223',
 'apartment', 'Blue Ridge', '2_bhk', 1000, 900,
 'Hinjewadi, Pune', 'F-402', 'F', '4', 'East', 'open_parking',
 'un_furnished', 8200000.00, true, '5 years', true, 'available',
 'Well-planned 2 BHK with good space utilization.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 10
('Anita Verma', 'anita.verma@email.com', '+919876543224', null,
 'apartment', 'Royal Gardens', '3_bhk', 1250, 1150,
 'Kharadi, Pune', 'G-601', 'G', '6', 'North', 'covered_parking',
 'semi_furnished', 9800000.00, true, '4 years', true, 'available',
 'Spacious 3 BHK with modern amenities and good connectivity.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"swimming_pool": true}}'),

-- Property 11
('Deepak Agarwal', 'deepak.agarwal@email.com', '+919876543225', '+919876543226',
 'independent_house', null, '5_plus_bhk', 2500, 2300,
 'Koregaon Park, Pune', null, null, 'Ground', 'South', 'covered_parking',
 'fully_furnished', 30000000.00, false, '1 year', true, 'available',
 'Luxury independent house with premium finishes and modern design.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- Property 12
('Pooja Nair', 'pooja.nair@email.com', '+919876543227', null,
 'apartment', 'Green Meadows', '2_bhk', 950, 850,
 'Wakad, Pune', 'H-201', 'H', '2', 'West', 'shed_parking',
 'un_furnished', 7800000.00, true, '6 years', false, 'available',
 'Affordable 2 BHK in a well-maintained society.',
 '00000000-0000-0000-0000-000000000001',
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 13
('Manoj Tiwari', 'manoj.tiwari@email.com', '+919876543228', '+919876543229',
 'apartment', 'Skyline Heights', '3_bhk', 1350, 1250,
 'Baner, Pune', 'I-701', 'I', '7', 'East', 'covered_parking',
 'semi_furnished', 12800000.00, true, '3 years', true, 'available',
 'High-rise apartment with panoramic city views.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Property 14
('Shilpa Rao', 'shilpa.rao@email.com', '+919876543230', null,
 'gated_community_villa_or_bungalow', 'Garden City', '4_bhk', 1750, 1600,
 'Hinjewadi, Pune', 'V-12', null, 'Ground', 'North', 'covered_parking',
 'fully_furnished', 19500000.00, false, '2 years', true, 'available',
 'Beautiful villa with landscaped garden and modern amenities.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 15
('Rajesh Malhotra', 'rajesh.malhotra@email.com', '+919876543231', '+919876543232',
 'apartment', 'Palm Grove', '2_bhk', 1050, 950,
 'Kharadi, Pune', 'J-501', 'J', '5', 'South', 'open_parking',
 'semi_furnished', 8800000.00, true, '4 years', true, 'available',
 'Well-designed 2 BHK with good natural light and ventilation.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 16
('Neha Kapoor', 'neha.kapoor@email.com', '+919876543233', null,
 'apartment', 'Royal Palms', '3_bhk', 1200, 1100,
 'Viman Nagar, Pune', 'K-301', 'K', '3', 'West', 'covered_parking',
 'fully_furnished', 11500000.00, false, '3 years', true, 'available',
 'Fully furnished 3 BHK with premium fixtures and modern design.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 17
('Vikash Jain', 'vikash.jain@email.com', '+919876543234', '+919876543235',
 'independent_house', null, '5_bhk', 2100, 1900,
 'Koregaon Park, Pune', null, null, 'Ground', 'East', 'covered_parking',
 'semi_furnished', 24000000.00, true, '2 years', true, 'available',
 'Spacious independent house with modern amenities and good location.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 18
('Ritu Sharma', 'ritu.sharma@email.com', '+919876543236', null,
 'apartment', 'Green Valley', '2_bhk', 900, 800,
 'Wakad, Pune', 'L-401', 'L', '4', 'North', 'shed_parking',
 'un_furnished', 7600000.00, true, '5 years', false, 'available',
 'Compact 2 BHK apartment in a well-established society.',
 '00000000-0000-0000-0000-000000000001',
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 19
('Amit Kumar', 'amit.kumar@email.com', '+919876543237', '+919876543238',
 'apartment', 'Blue Ridge', '3_bhk', 1300, 1200,
 'Hinjewadi, Pune', 'M-801', 'M', '8', 'South', 'covered_parking',
 'semi_furnished', 11200000.00, true, '3 years', true, 'available',
 'Well-maintained 3 BHK with good amenities and connectivity.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"swimming_pool": true}}'),

-- Property 20
('Suman Gupta', 'suman.gupta@email.com', '+919876543239', null,
 'gated_community_villa_or_bungalow', 'Palm Springs', '4_bhk', 1850, 1700,
 'Baner, Pune', 'V-6', null, 'Ground', 'West', 'covered_parking',
 'fully_furnished', 21500000.00, false, '2 years', true, 'available',
 'Premium villa with private garden and modern amenities.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true}}'),

-- Property 21
('Ravi Singh', 'ravi.singh@email.com', '+919876543240', '+919876543241',
 'apartment', 'Sunshine Residency', '2_bhk', 1000, 900,
 'Kharadi, Pune', 'N-201', 'N', '2', 'East', 'open_parking',
 'semi_furnished', 8500000.00, true, '4 years', true, 'available',
 'Well-planned 2 BHK with good space utilization and natural light.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 22
('Kavita Patel', 'kavita.patel@email.com', '+919876543242', null,
 'apartment', 'Royal Gardens', '3_bhk', 1250, 1150,
 'Viman Nagar, Pune', 'O-601', 'O', '6', 'North', 'covered_parking',
 'fully_furnished', 12000000.00, false, '3 years', true, 'available',
 'Fully furnished 3 BHK with premium amenities and modern design.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 23
('Suresh Reddy', 'suresh.reddy@email.com', '+919876543243', '+919876543244',
 'independent_house', null, '5_bhk', 2300, 2100,
 'Koregaon Park, Pune', null, null, 'Ground', 'South', 'covered_parking',
 'semi_furnished', 26000000.00, true, '1 year', true, 'available',
 'Modern independent house with premium finishes and good location.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 24
('Anita Iyer', 'anita.iyer@email.com', '+919876543245', null,
 'apartment', 'Green Meadows', '2_bhk', 950, 850,
 'Wakad, Pune', 'P-301', 'P', '3', 'West', 'shed_parking',
 'un_furnished', 7700000.00, true, '6 years', false, 'available',
 'Affordable 2 BHK in a well-maintained society with good connectivity.',
 '00000000-0000-0000-0000-000000000001',
 '{}',
 '{"basic_amenities": {"lift": true}}'),

-- Property 25
('Deepak Verma', 'deepak.verma@email.com', '+919876543246', '+919876543247',
 'apartment', 'Skyline Heights', '3_bhk', 1350, 1250,
 'Baner, Pune', 'Q-701', 'Q', '7', 'East', 'covered_parking',
 'semi_furnished', 13000000.00, true, '3 years', true, 'available',
 'High-rise apartment with excellent city views and modern amenities.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}}'),

-- Property 26
('Pooja Agarwal', 'pooja.agarwal@email.com', '+919876543248', null,
 'gated_community_villa_or_bungalow', 'Garden City', '4_bhk', 1800, 1650,
 'Hinjewadi, Pune', 'V-10', null, 'Ground', 'North', 'covered_parking',
 'fully_furnished', 20000000.00, false, '2 years', true, 'available',
 'Beautiful villa with landscaped garden and premium amenities.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "park": true}, "basic_amenities": {"security": true}}'),

-- Property 27
('Manoj Nair', 'manoj.nair@email.com', '+919876543249', '+919876543250',
 'apartment', 'Palm Grove', '2_bhk', 1050, 950,
 'Kharadi, Pune', 'R-401', 'R', '4', 'South', 'open_parking',
 'semi_furnished', 8900000.00, true, '4 years', true, 'available',
 'Well-designed 2 BHK with good natural light and modern amenities.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- Property 28
('Shilpa Tiwari', 'shilpa.tiwari@email.com', '+919876543251', null,
 'apartment', 'Royal Palms', '3_bhk', 1200, 1100,
 'Viman Nagar, Pune', 'S-501', 'S', '5', 'West', 'covered_parking',
 'fully_furnished', 11800000.00, false, '3 years', true, 'available',
 'Fully furnished 3 BHK with premium fixtures and excellent location.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true}, "luxury_amenities": {"club_house": true}}'),

-- Property 29
('Rajesh Rao', 'rajesh.rao@email.com', '+919876543252', '+919876543253',
 'independent_house', null, '5_plus_bhk', 2400, 2200,
 'Koregaon Park, Pune', null, null, 'Ground', 'East', 'covered_parking',
 'semi_furnished', 28000000.00, true, '1 year', true, 'available',
 'Luxury independent house with premium finishes and modern design.',
 '00000000-0000-0000-0000-000000000001',
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- Property 30
('Neha Malhotra', 'neha.malhotra@email.com', '+919876543254', null,
 'apartment', 'Green Valley', '2_bhk', 900, 800,
 'Wakad, Pune', 'T-201', 'T', '2', 'North', 'shed_parking',
 'un_furnished', 7500000.00, true, '5 years', false, 'available',
 'Compact 2 BHK apartment in a well-established society with good connectivity.',
 '00000000-0000-0000-0000-000000000001',
 '{}',
 '{"basic_amenities": {"lift": true}}');

-- Note: Make sure to replace '00000000-0000-0000-0000-000000000001' with actual user IDs from your users table
-- You can get the user IDs by running: SELECT id FROM users LIMIT 1;
