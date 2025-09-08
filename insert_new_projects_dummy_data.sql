-- Insert 30 dummy records into new_projects table
-- Note: This script assumes you have already run the users creation script
-- If not, make sure to create users first or replace the created_by references

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
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"], "interior": ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"]}}',
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
 false, false, true, true, true, true, false, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"lift": true, "security": true}}'),

-- New Project 6
('Tata Housing', 'Tata Eureka Park', 'residence', 'under_construction', 'Wakad, Pune',
 '6 units per floor', 'Yes', 'Premium residential project with modern amenities',
 'Suresh Iyer', '+919876543408', null, null,
 true, true, true, true, 'Premium project with excellent connectivity',
 '180 units', 'P52100012350', '82%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 7
('Kolte Patil', 'Kolte Patil Life Republic', 'gated_community_villa_or_bungalow', 'new_launching', 'Baner, Pune',
 '3 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Anita Verma', '+919876543409', 'Deepak Agarwal', '+919876543410',
 true, true, true, true, 'New launch luxury villa project',
 '75 units', 'P52100012351', '70%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 8
('Sobha Limited', 'Sobha Neopolis', 'residence', 'under_construction', 'Kharadi, Pune',
 '4 units per floor', 'Yes', 'Modern residential project with green features',
 'Pooja Nair', '+919876543411', null, null,
 true, true, true, true, 'Green building with sustainable features',
 '160 units', 'P52100012352', '78%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- New Project 9
('Puravankara', 'Puravankara Provident', 'residence', 'ready_to_move', 'Viman Nagar, Pune',
 '6 units per floor', 'Yes', 'Ready to move project with modern amenities',
 'Manoj Tiwari', '+919876543412', 'Shilpa Rao', '+919876543413',
 true, true, true, true, 'Ready to move project, immediate possession available',
 '220 units', 'P52100012353', '88%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 10
('Brigade Group', 'Brigade Cornerstone', 'commercial', 'under_construction', 'Hinjewadi, Pune',
 '8 units per floor', 'Yes', 'Commercial project with modern amenities',
 'Rajesh Malhotra', '+919876543414', null, null,
 true, true, true, true, 'Commercial project with excellent connectivity',
 '100 units', 'P52100012354', '65%',
 true, false, false, true, true, true, false, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- New Project 11
('DLF Limited', 'DLF Garden City', 'gated_community_villa_or_bungalow', 'new_launching', 'Baner, Pune',
 '2 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Neha Kapoor', '+919876543415', 'Vikash Jain', '+919876543416',
 true, true, true, true, 'New launch luxury villa project',
 '60 units', 'P52100012355', '72%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 12
('Oberoi Realty', 'Oberoi Garden City', 'residence', 'under_construction', 'Kharadi, Pune',
 '4 units per floor', 'Yes', 'Premium residential project with modern amenities',
 'Ritu Sharma', '+919876543417', null, null,
 true, true, true, true, 'Premium project with excellent connectivity',
 '140 units', 'P52100012356', '79%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 13
('Shapoorji Pallonji', 'Shapoorji Pallonji Joyville', 'residence', 'ready_to_move', 'Wakad, Pune',
 '6 units per floor', 'Yes', 'Ready to move project with modern amenities',
 'Amit Kumar', '+919876543418', 'Suman Gupta', '+919876543419',
 true, true, true, true, 'Ready to move project, immediate possession available',
 '250 units', 'P52100012357', '92%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 14
('Hiranandani', 'Hiranandani Gardens', 'gated_community_villa_or_bungalow', 'under_construction', 'Hinjewadi, Pune',
 '3 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Ravi Singh', '+919876543420', null, null,
 true, true, true, true, 'Luxury villa project with premium amenities',
 '80 units', 'P52100012358', '76%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 15
('Kalpataru', 'Kalpataru Vista', 'residence', 'new_launching', 'Baner, Pune',
 '4 units per floor', 'Yes', 'New launch residential project with modern amenities',
 'Kavita Patel', '+919876543421', 'Suresh Reddy', '+919876543422',
 true, true, true, true, 'New launch project with excellent connectivity',
 '120 units', 'P52100012359', '68%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 16
('Lodha Group', 'Lodha Upper Thane', 'residence', 'under_construction', 'Kharadi, Pune',
 '6 units per floor', 'Yes', 'Premium residential project with modern amenities',
 'Anita Iyer', '+919876543423', null, null,
 true, true, true, true, 'Premium project with excellent connectivity',
 '180 units', 'P52100012360', '81%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 17
('Prestige Group', 'Prestige Tech Park', 'commercial', 'ready_to_move', 'Viman Nagar, Pune',
 '10 units per floor', 'Yes', 'Ready to move commercial project',
 'Deepak Verma', '+919876543424', 'Pooja Agarwal', '+919876543425',
 true, true, true, true, 'Ready to move commercial project',
 '150 units', 'P52100012361', '89%',
 true, false, false, true, true, true, false, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}'),

-- New Project 18
('Godrej Properties', 'Godrej Woods II', 'residence', 'new_launching', 'Wakad, Pune',
 '4 units per floor', 'Yes', 'New launch residential project with modern amenities',
 'Manoj Nair', '+919876543426', null, null,
 true, true, true, true, 'New launch project with excellent connectivity',
 '160 units', 'P52100012362', '71%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 19
('Tata Housing', 'Tata Eureka Park II', 'gated_community_villa_or_bungalow', 'under_construction', 'Baner, Pune',
 '2 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Shilpa Tiwari', '+919876543427', 'Rajesh Rao', '+919876543428',
 true, true, true, true, 'Luxury villa project with premium amenities',
 '70 units', 'P52100012363', '77%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 20
('Kolte Patil', 'Kolte Patil Life Republic II', 'residence', 'ready_to_move', 'Hinjewadi, Pune',
 '6 units per floor', 'Yes', 'Ready to move project with modern amenities',
 'Neha Malhotra', '+919876543429', null, null,
 true, true, true, true, 'Ready to move project, immediate possession available',
 '200 units', 'P52100012364', '86%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 21
('Sobha Limited', 'Sobha Neopolis II', 'residence', 'new_launching', 'Kharadi, Pune',
 '4 units per floor', 'Yes', 'New launch residential project with modern amenities',
 'Ravi Kumar', '+919876543430', 'Priya Sharma', '+919876543431',
 true, true, true, true, 'New launch project with excellent connectivity',
 '130 units', 'P52100012365', '69%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 22
('Puravankara', 'Puravankara Provident II', 'gated_community_villa_or_bungalow', 'under_construction', 'Viman Nagar, Pune',
 '3 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Amit Patel', '+919876543432', null, null,
 true, true, true, true, 'Luxury villa project with premium amenities',
 '85 units', 'P52100012366', '74%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 23
('Brigade Group', 'Brigade Cornerstone II', 'residence', 'ready_to_move', 'Wakad, Pune',
 '6 units per floor', 'Yes', 'Ready to move project with modern amenities',
 'Sunita Reddy', '+919876543433', 'Vikram Singh', '+919876543434',
 true, true, true, true, 'Ready to move project, immediate possession available',
 '240 units', 'P52100012367', '91%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 24
('DLF Limited', 'DLF Garden City II', 'residence', 'new_launching', 'Baner, Pune',
 '4 units per floor', 'Yes', 'New launch residential project with modern amenities',
 'Meera Joshi', '+919876543435', null, null,
 true, true, true, true, 'New launch project with excellent connectivity',
 '110 units', 'P52100012368', '67%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 25
('Oberoi Realty', 'Oberoi Garden City II', 'gated_community_villa_or_bungalow', 'under_construction', 'Hinjewadi, Pune',
 '2 units per floor', 'Yes', 'Luxury villa project with premium amenities',
 'Ravi Gupta', '+919876543436', 'Kavita Desai', '+919876543437',
 true, true, true, true, 'Luxury villa project with premium amenities',
 '65 units', 'P52100012369', '73%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 26
('Shapoorji Pallonji', 'Shapoorji Pallonji Joyville II', 'residence', 'new_launching', 'Kharadi, Pune',
 '4 units per floor', 'Yes', 'New launch residential project with modern amenities',
 'Suresh Iyer', '+919876543438', null, null,
 true, true, true, true, 'New launch project with excellent connectivity',
 '140 units', 'P52100012370', '70%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 27
('Hiranandani', 'Hiranandani Gardens II', 'residence', 'ready_to_move', 'Viman Nagar, Pune',
 '6 units per floor', 'Yes', 'Ready to move project with modern amenities',
 'Anita Verma', '+919876543439', 'Deepak Agarwal', '+919876543440',
 true, true, true, true, 'Ready to move project, immediate possession available',
 '210 units', 'P52100012371', '87%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 28
('Kalpataru', 'Kalpataru Vista II', 'gated_community_villa_or_bungalow', 'new_launching', 'Wakad, Pune',
 '3 units per floor', 'Yes', 'New launch luxury villa project',
 'Pooja Nair', '+919876543441', null, null,
 true, true, true, true, 'New launch luxury villa project',
 '90 units', 'P52100012372', '66%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'agent3@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]}}',
 '{"luxury_amenities": {"swimming_pool": true, "gym": true, "park": true, "club_house": true}}'),

-- New Project 29
('Lodha Group', 'Lodha Upper Thane II', 'residence', 'under_construction', 'Baner, Pune',
 '4 units per floor', 'Yes', 'Premium residential project with modern amenities',
 'Manoj Tiwari', '+919876543442', 'Shilpa Rao', '+919876543443',
 true, true, true, true, 'Premium project with excellent connectivity',
 '150 units', 'P52100012373', '83%',
 true, true, true, true, true, true, true, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder1@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "luxury_amenities": {"swimming_pool": true, "gym": true}}'),

-- New Project 30
('Prestige Group', 'Prestige Tech Park II', 'commercial', 'new_launching', 'Hinjewadi, Pune',
 '8 units per floor', 'Yes', 'New launch commercial project',
 'Rajesh Malhotra', '+919876543444', null, null,
 true, true, true, true, 'New launch commercial project',
 '120 units', 'P52100012374', '64%',
 true, false, false, true, true, true, false, true, true, true, true, true, true, true,
 'active', (SELECT id FROM users WHERE email = 'builder2@aspireprop.com'),
 '{"general_photos": {"exterior": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]}}',
 '{"basic_amenities": {"power_backup": true, "lift": true, "security": true}, "infrastructure": {"gas_pipeline": true}}');

-- Verification query
SELECT 'New projects created:' as info, COUNT(*) as count FROM new_projects;
