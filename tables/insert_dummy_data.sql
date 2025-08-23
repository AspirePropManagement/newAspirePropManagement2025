-- Insert dummy data for all user roles
-- Admin users
INSERT INTO public.users (email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('admin1@aspire.com', '$2a$10$dummyhash1', 'John', 'Admin', '+1234567890', 'ADMIN', true),
('admin2@aspire.com', '$2a$10$dummyhash2', 'Sarah', 'Manager', '+1234567891', 'ADMIN', true);

-- Agent users
INSERT INTO public.users (email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('agent1@aspire.com', '$2a$10$dummyhash3', 'Mike', 'Johnson', '+1234567892', 'AGENT', true),
('agent2@aspire.com', '$2a$10$dummyhash4', 'Lisa', 'Smith', '+1234567893', 'AGENT', true),
('agent3@aspire.com', '$2a$10$dummyhash5', 'David', 'Wilson', '+1234567894', 'AGENT', true),
('agent4@aspire.com', '$2a$10$dummyhash6', 'Emma', 'Brown', '+1234567895', 'AGENT', true);

-- Buyer users
INSERT INTO public.users (email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('buyer1@aspire.com', '$2a$10$dummyhash7', 'Alex', 'Davis', '+1234567896', 'BUYER', true),
('buyer2@aspire.com', '$2a$10$dummyhash8', 'Maria', 'Garcia', '+1234567897', 'BUYER', true),
('buyer3@aspire.com', '$2a$10$dummyhash9', 'James', 'Miller', '+1234567898', 'BUYER', true),
('buyer4@aspire.com', '$2a$10$dummyhash10', 'Sophia', 'Taylor', '+1234567899', 'BUYER', true),
('buyer5@aspire.com', '$2a$10$dummyhash11', 'Robert', 'Anderson', '+1234567900', 'BUYER', true);

-- Builder users
INSERT INTO public.users (email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('builder1@aspire.com', '$2a$10$dummyhash12', 'Tom', 'Clark', '+1234567901', 'BUILDER', true),
('builder2@aspire.com', '$2a$10$dummyhash13', 'Jennifer', 'Lewis', '+1234567902', 'BUILDER', true),
('builder3@aspire.com', '$2a$10$dummyhash14', 'Kevin', 'Hall', '+1234567903', 'BUILDER', true);

-- Some inactive users for testing
INSERT INTO public.users (email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('inactive@aspire.com', '$2a$10$dummyhash15', 'Inactive', 'User', '+1234567904', 'BUYER', false);
