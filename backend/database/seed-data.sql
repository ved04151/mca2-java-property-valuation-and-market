-- =========================================================================
-- PROPVALUATE NCR - ENTERPRISE REAL ESTATE DATA SEED
-- Realistic Delhi NCR, Gurugram, Noida & Ghaziabad Compendium
-- Matches Frontend Mock Data Exactly
-- =========================================================================

USE `propval_db`;

-- Passwords below are BCrypt hashes:
-- 'admin123' -> '$2a$10$7ZrqhKz70Vb2oX8K6zV/E.jE9tqW1dMfvH6Z5N8H9gTf6h0W5f2j2' (or handled via Initializer)
-- Clear text fallback supported for direct testing if required:
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `title`, `location`, `phone`, `status`, `valuations_conducted`, `last_login`, `created_at`)
VALUES
('usr_admin_1', 'Vikramaditya Sharma', 'admin@propval.in', '$2a$10$w09y.fK01p92W9dEfgG8v.eO8rI4Pz6zV/E.jE9tqW1dMfvH6Z5N8', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', 'Chief Real Estate Analyst & Admin', 'Cyber City, Gurugram', '+91 98101 23456', 'ACTIVE', 142, '2026-11-19 08:30:00', '2025-01-15 09:00:00'),
('usr_user_1', 'Priya Mehra', 'priya@propval.in', '$2a$10$w09y.fK01p92W9dEfgG8v.eO8rI4Pz6zV/E.jE9tqW1dMfvH6Z5N8', 'USER', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', 'Senior Valuation Surveyor', 'Sector 62, Noida', '+91 98712 34567', 'ACTIVE', 89, '2026-11-18 16:45:00', '2025-02-10 11:00:00'),
('usr_user_2', 'Amitabh Sen', 'amitabh@propval.in', '$2a$10$w09y.fK01p92W9dEfgG8v.eO8rI4Pz6zV/E.jE9tqW1dMfvH6Z5N8', 'USER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', 'Commercial Property Assessor', 'Indirapuram, Ghaziabad', '+91 99112 87654', 'ACTIVE', 54, '2026-11-17 14:15:00', '2025-04-01 10:00:00'),
('usr_user_3', 'Rohan Deshmukh', 'rohan@propval.in', '$2a$10$w09y.fK01p92W9dEfgG8v.eO8rI4Pz6zV/E.jE9tqW1dMfvH6Z5N8', 'USER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80', 'Associate Field Appraiser', 'Golf Course Road, Gurugram', '+91 97188 90123', 'SUSPENDED', 12, '2026-10-30 10:10:00', '2025-06-18 12:00:00')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Locality Benchmarks
INSERT INTO `locality_benchmarks` (`city`, `locality`, `average_rate_sq_ft`, `yoy_growth_pct`, `quarterly_growth_pct`, `rental_yield_pct`, `inventory_months`, `demand_index`, `trend_direction`, `top_driver`)
VALUES
('Gurugram', 'Golf Course Road', 38500.00, 18.40, 4.20, 3.80, 4.10, 96, 'up', 'Corporate headquarters, high-net-worth influx, limited land availability.'),
('Gurugram', 'Sector 65', 19800.00, 14.20, 3.10, 4.10, 6.20, 88, 'up', 'Rapid transit connectivity, modern highrise communities.'),
('Noida', 'Sector 124', 28200.00, 16.50, 3.80, 3.50, 5.40, 91, 'up', 'Expressway prime location, luxury river-facing projects.'),
('Noida', 'Sector 78', 11400.00, 11.80, 2.50, 4.40, 7.10, 84, 'up', 'High occupancy, metro station connectivity, mature retail infrastructure.'),
('Noida', 'Sector 143', 9200.00, 13.90, 3.00, 4.60, 8.50, 79, 'up', 'Upcoming FNG expressway connection and tech office parks.'),
('Ghaziabad', 'Indirapuram', 8600.00, 8.20, 1.80, 4.80, 5.90, 82, 'stable', 'Established social infrastructure, proximity to East Delhi and Noida.'),
('Ghaziabad', 'Raj Nagar Extension', 4850.00, 7.50, 1.20, 5.20, 9.80, 74, 'stable', 'Affordable price point, elevated corridor to Hindon civil terminal.'),
('Delhi NCR', 'Vasant Vihar', 58000.00, 9.10, 2.00, 2.20, 8.00, 90, 'stable', 'Ultra-exclusive diplomatic zip code, scarcity of independent freehold land.')
ON DUPLICATE KEY UPDATE `average_rate_sq_ft`=VALUES(`average_rate_sq_ft`);

-- Property Price History
INSERT INTO `property_price_history` (`year_quarter`, `gurugram_rate`, `noida_rate`, `ghaziabad_rate`, `delhi_ncr_rate`)
VALUES
('2023 Q1', 14800, 7900, 5200, 32000),
('2023 Q2', 15400, 8200, 5350, 32800),
('2023 Q3', 16100, 8600, 5500, 33400),
('2023 Q4', 17200, 9100, 5700, 34500),
('2024 Q1', 18500, 9600, 5900, 35800),
('2024 Q2', 19800, 10200, 6150, 37200),
('2024 Q3', 21300, 10900, 6400, 38900),
('2024 Q4', 23100, 11600, 6680, 40500),
('2025 Q1', 25000, 12400, 6950, 42300),
('2025 Q2', 27200, 13300, 7200, 44200),
('2025 Q3', 29500, 14200, 7450, 46100),
('2025 Q4', 31800, 15100, 7750, 48000),
('2026 Q1', 34200, 16000, 8100, 50200),
('2026 Q2', 36800, 17100, 8400, 52400),
('2026 Q3', 38500, 18200, 8700, 54600)
ON DUPLICATE KEY UPDATE `gurugram_rate`=VALUES(`gurugram_rate`);

-- Properties
INSERT INTO `properties` (`id`, `title`, `property_type`, `city`, `locality`, `address`, `pincode`, `bhk`, `bathrooms`, `area_sq_ft`, `price`, `price_per_sq_ft`, `status`, `furnishing`, `floor`, `age_of_property_years`, `facing`, `parking`, `description`, `verified`, `added_by`, `created_at`)
VALUES
('prop_001', 'DLF The Camellias Ultra Luxury Residence', 'Apartment', 'Gurugram', 'Golf Course Road', 'Club Drive, DLF Phase 5, Golf Course Road', '122002', 4, 5, 7400.00, 360000000.00, 48648.00, 'Ready to Move', 'Furnished', '18th of 26', 2, 'North-East', '3 Covered', 'An architectural masterpiece overlooking the 18-hole Arnold Palmer golf course. Features double-height living room, Italian marble, private elevator lobby, and panoramic Aravalli views.', TRUE, 'usr_admin_1', '2026-08-10 10:30:00'),
('prop_002', 'ATS Knightsbridge Signature Sky Villa', 'Penthouse', 'Noida', 'Sector 124', 'Plot No. 1, Sector 124, Expressway corridor', '201301', 5, 6, 6050.00, 185000000.00, 30578.00, 'Ready to Move', 'Semi-Furnished', '38th of 47', 1, 'East', '4 Covered', 'Iconic gateway tower positioned at the threshold of Delhi and Noida with unobstructed 360-degree skyline views and ultra-high ceiling heights.', TRUE, 'usr_user_1', '2026-09-02 11:15:00'),
('prop_003', 'Mahagun Moderne Premium Highrise Unit', 'Apartment', 'Noida', 'Sector 78', 'Near Metro Station, Sector 78', '201305', 3, 3, 1850.00, 21500000.00, 11621.00, 'Ready to Move', 'Semi-Furnished', '12th of 22', 5, 'North-East', '1 Covered', 'Well-ventilated three-bedroom flat located 500 meters from Sector 76 Metro. Complete modular kitchen and wood work done.', TRUE, 'usr_user_1', '2026-09-14 08:20:00'),
('prop_004', 'M3M Golfestate Skyward Luxury Tower', 'Apartment', 'Gurugram', 'Sector 65', 'Golf Course Extension Road, Sector 65', '122018', 4, 4, 3800.00, 78000000.00, 20526.00, 'Ready to Move', 'Furnished', '15th of 32', 3, 'South-East', '2 Covered', 'Seven-star resort style condominium with wraparound balconies giving scenic views of lush fairways and greens.', TRUE, 'usr_admin_1', '2026-07-22 14:40:00'),
('prop_005', 'Shipra Krishna Vista Elegance Suite', 'Apartment', 'Ghaziabad', 'Indirapuram', 'Ahinsa Khand 1, Indirapuram', '201014', 3, 2, 1550.00, 13500000.00, 8709.00, 'Ready to Move', 'Furnished', '7th of 14', 8, 'North', '1 Open', 'Centrally located prime residential property in Indirapuram, seamlessly connected to NH-24 (Delhi-Meerut Expressway) and Sector 62 Noida.', FALSE, 'usr_user_2', '2026-08-19 09:10:00'),
('prop_006', 'Gaur City 2 - 14th Avenue Smart Home', 'Apartment', 'Ghaziabad', 'Noida Extension / Greater Noida West', 'Sector 16C, Greater Noida West', '201009', 2, 2, 980.00, 6800000.00, 6938.00, 'Ready to Move', 'Unfurnished', '9th of 25', 4, 'East', '1 Open', 'Affordable modern living in high-density township with immediate access to schools, hospital, and retail hubs.', TRUE, 'usr_user_2', '2026-09-30 13:20:00'),
('prop_007', 'Heritage Kothi Bungalow', 'Independent House / Villa', 'Delhi NCR', 'Vasant Vihar', 'Block E, Vasant Vihar, South West Delhi', '110057', 6, 7, 5400.00, 320000000.00, 59259.00, 'Ready to Move', 'Semi-Furnished', 'G+2 Floors with Basement', 12, 'North-East', '4 Covered Driveway', 'Prestige diplomatic enclave address with wide tree-lined road frontage. Exceptional resale value and redevelopment potential.', TRUE, 'usr_admin_1', '2026-06-11 16:00:00'),
('prop_008', 'Sikka Kaamna Greens Modern Tower', 'Apartment', 'Noida', 'Sector 143', 'Near FNG Expressway Junction, Sector 143', '201306', 3, 2, 1420.00, 12800000.00, 9014.00, 'Under Construction', 'Unfurnished', '14th of 19', 0, 'South', '1 Covered', 'Upcoming high-growth sector alongside Noida-Greater Noida Expressway. Great investment appreciation outlook for 2027.', FALSE, 'usr_user_1', '2026-10-01 12:00:00'),
('prop_009', 'Grand Commercial Corporate Floor - One Horizon Center', 'Commercial Office', 'Gurugram', 'Golf Course Road', 'DLF Phase 5, Sector 43', '122002', 0, 8, 11500.00, 414000000.00, 36000.00, 'Ready to Move', 'Furnished', '11th of 25', 6, 'East', '15 Dedicated Bays', 'Institutional grade office space occupied by fortune 500 tenants. Yields consistent 8.2% gross rental yield.', TRUE, 'usr_user_2', '2026-05-18 10:00:00'),
('prop_010', 'Raj Nagar Extension River Heights Flat', 'Apartment', 'Ghaziabad', 'Raj Nagar Extension', 'Near Meerut Bypass & Elevated Road', '201017', 2, 2, 1100.00, 5200000.00, 4727.00, 'Ready to Move', 'Semi-Furnished', '4th of 14', 7, 'West', '1 Open', 'Excellent affordable starter home with seamless connection into East Delhi via the 10km uninterrupted elevated expressway.', FALSE, 'usr_user_2', '2026-07-04 15:20:00')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Property Images
INSERT INTO `property_images` (`property_id`, `image_url`, `display_order`) VALUES
('prop_001', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 0),
('prop_001', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 1),
('prop_001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 2),
('prop_002', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 0),
('prop_002', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 1),
('prop_003', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 0),
('prop_003', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 1),
('prop_004', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', 0),
('prop_004', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 1),
('prop_005', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 0),
('prop_006', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 0),
('prop_007', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', 0),
('prop_007', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 1),
('prop_008', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 0),
('prop_009', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 0),
('prop_009', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', 1),
('prop_010', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80', 0);

-- Property Amenities
INSERT INTO `property_amenities` (`property_id`, `amenity`) VALUES
('prop_001', 'Private Golf Course'), ('prop_001', 'Clubhouse'), ('prop_001', 'Olympic Pool'), ('prop_001', 'Concierge'), ('prop_001', 'Helipad Access'), ('prop_001', '24/7 Power Backup'), ('prop_001', 'Smart Home Automation'),
('prop_002', 'Yamuna River View'), ('prop_002', 'Infinity Pool'), ('prop_002', 'Private Elevator'), ('prop_002', 'Spa & Salon'), ('prop_002', 'Banquet Hall'), ('prop_002', 'EV Charging Station'),
('prop_003', 'Clubhouse'), ('prop_003', 'Swimming Pool'), ('prop_003', 'Tennis Court'), ('prop_003', 'Children Play Area'), ('prop_003', 'Shopping Arcade within campus'),
('prop_004', '9-hole Executive Golf Course'), ('prop_004', 'Clubhouse'), ('prop_004', 'Gym & Spa'), ('prop_004', 'Cafe Lounge'), ('prop_004', 'Badminton Court'), ('prop_004', 'CCTV Security'),
('prop_005', 'Swimming Pool'), ('prop_005', 'Community Center'), ('prop_005', 'Power Backup'), ('prop_005', 'Security Guard'), ('prop_005', 'Proximity to DPS & Fortis'),
('prop_006', 'Gaur City Mall Access'), ('prop_006', 'Multi-level Security'), ('prop_006', 'Sports Complex'), ('prop_006', 'Club'), ('prop_006', 'Jogging Track'),
('prop_007', 'Lush Private Lawn'), ('prop_007', 'Servant Quarters'), ('prop_007', 'Solar Panel Array'), ('prop_007', 'Borewell & Dual Water Storage'), ('prop_007', 'High Perimeter Walls'),
('prop_008', 'Metro Station 200m away'), ('prop_008', 'Podium Garden'), ('prop_008', 'Infinity Pool'), ('prop_008', 'Gymnasium'), ('prop_008', 'Fire Safety Sprinklers'),
('prop_009', 'LEED Platinum Certified'), ('prop_009', 'Grade A Building'), ('prop_009', 'High Speed Mitsubishi Elevators'), ('prop_009', 'Central Chilled Water HVAC'), ('prop_009', 'Triple Height Atrium'),
('prop_010', '24/7 Security'), ('prop_010', 'Lush Park'), ('prop_010', 'Commercial Market'), ('prop_010', 'Power Backup'), ('prop_010', 'Cricket Practice Pitch');

-- Valuations & Breakdowns
INSERT INTO `valuations` (`id`, `property_id`, `property_title`, `client_name`, `city`, `locality`, `property_type`, `area_sq_ft`, `bhk`, `age_years`, `condition_type`, `amenities_score`, `base_rate_sq_ft`, `adjusted_rate_sq_ft`, `estimated_price`, `price_range_low`, `price_range_high`, `confidence_score`, `assessor_id`, `assessor_name`, `status`, `notes`, `date`)
VALUES
('val_101', 'prop_001', 'DLF The Camellias Ultra Luxury Residence', 'Sanjay Singhania (Capita Capital)', 'Gurugram', 'Golf Course Road', 'Apartment', 7400.00, 4, 2, 'Excellent', 95, 42000.00, 48650.00, 360010000.00, 342000000.00, 378000000.00, 94, 'usr_admin_1', 'Vikramaditya Sharma', 'COMPLETED', 'Premium pricing justified by top 1% luxury amenities, high security and golf club view.', '2026-10-25 11:30:00'),
('val_102', 'prop_002', 'ATS Knightsbridge Signature Sky Villa', 'Harpreet Kaur', 'Noida', 'Sector 124', 'Penthouse', 6050.00, 5, 1, 'Excellent', 92, 26000.00, 30580.00, 185009000.00, 175000000.00, 194000000.00, 91, 'usr_user_1', 'Priya Mehra', 'COMPLETED', 'Yamuna front premium, high ceiling sky villa with great resale liquidity.', '2026-11-04 14:10:00'),
('val_103', 'prop_003', 'Mahagun Moderne Premium Highrise Unit', 'Rajesh & Sunita Gupta', 'Noida', 'Sector 78', 'Apartment', 1850.00, 3, 5, 'Good', 80, 10500.00, 11620.00, 21497000.00, 20400000.00, 22500000.00, 89, 'usr_user_1', 'Priya Mehra', 'COMPLETED', 'Standard residential valuation; rapid metro access elevates rental demand.', '2026-11-12 10:15:00'),
('val_104', 'prop_005', 'Shipra Krishna Vista Elegance Suite', 'Deepak Varma (Axis Home Loans)', 'Ghaziabad', 'Indirapuram', 'Apartment', 1550.00, 3, 8, 'Average', 68, 8200.00, 8710.00, 13500500.00, 12800000.00, 14200000.00, 85, 'usr_user_2', 'Amitabh Sen', 'COMPLETED', 'Mortgage appraisal for primary resident purchase. Solid construction track record.', '2026-11-15 16:20:00')
ON DUPLICATE KEY UPDATE `property_title`=VALUES(`property_title`);

INSERT INTO `valuation_breakdowns` (`valuation_id`, `base_rate_per_sq_ft`, `base_value`, `condition_adjustment`, `amenities_adjustment`, `depreciation_deduction`, `floor_adjustment`)
VALUES
('val_101', 42000.00, 310800000.00, 31080000.00, 15540000.00, -3108000.00, 5698000.00),
('val_102', 26000.00, 157300000.00, 18876000.00, 9438000.00, -605000.00, 0.00),
('val_103', 10500.00, 19425000.00, 1942500.00, 971250.00, -841750.00, 0.00),
('val_104', 8200.00, 12710000.00, 1016800.00, 508400.00, -734700.00, 0.00)
ON DUPLICATE KEY UPDATE `base_value`=VALUES(`base_value`);
