-- FARMO AI Seed Data Script
-- Run this script in the Supabase SQL Editor after 001_admin_schema.sql

-- 1. Seed Farmers
INSERT INTO public.farmers (name, location, district, crop, acres, status, join_date, phone, disease_scans) VALUES
('Ramanan K.', 'Palakkad', 'Palakkad', 'Paddy (Jyothi)', 4.2, 'active', '2024-01-15', '+91 94471 23456', 14),
('Sukumaran Nair', 'Kuttanad', 'Alappuzha', 'Paddy (Uma)', 6.8, 'active', '2024-02-01', '+91 98460 34567', 22),
('Mary Joseph', 'Wayanad', 'Wayanad', 'Black Pepper', 2.5, 'active', '2024-02-12', '+91 94952 45678', 8),
('Abdul Rahman', 'Malappuram', 'Malappuram', 'Arecanut', 3.0, 'pending', '2024-03-05', '+91 97441 56789', 3),
('Thomas Varghese', 'Idukki', 'Idukki', 'Cardamom', 5.0, 'active', '2024-03-18', '+91 94463 67890', 31),
('Biju Kumar', 'Thrissur', 'Thrissur', 'Banana (Nendran)', 1.8, 'suspended', '2024-04-02', '+91 98954 78901', 0),
('Lakshmi Amma', 'Kollam', 'Kollam', 'Coconut', 3.5, 'active', '2024-04-20', '+91 94005 89012', 6),
('Gopalan Pillai', 'Kottayam', 'Kottayam', 'Rubber', 8.0, 'active', '2024-05-11', '+91 97476 90123', 19)
ON CONFLICT DO NOTHING;

-- 2. Seed Disease Logs
INSERT INTO public.disease_logs (farmer_name, crop, disease_name, confidence_score, district, status, severity) VALUES
('Sukumaran Nair', 'Paddy', 'Bacterial Leaf Blight', 94.5, 'Alappuzha', 'treating', 'High'),
('Thomas Varghese', 'Cardamom', 'Kattee Virus', 91.2, 'Idukki', 'detected', 'High'),
('Mary Joseph', 'Pepper', 'Quick Wilt (Phytophthora)', 88.7, 'Wayanad', 'treating', 'Medium'),
('Ramanan K.', 'Paddy', 'Brown Plant Hopper', 96.1, 'Palakkad', 'resolved', 'High'),
('Biju Kumar', 'Banana', 'Sigatoka Leaf Spot', 85.0, 'Thrissur', 'detected', 'Medium')
ON CONFLICT DO NOTHING;

-- 3. Seed Market Prices
INSERT INTO public.market_prices (crop_name, district, min_price, max_price, modal_price, unit, trend) VALUES
('Paddy (Jyothi)', 'Palakkad', 2850, 3100, 2980, 'Quintal', 'up'),
('Coconut (Raw)', 'Kozhikode', 32, 41, 38, 'Kg', 'up'),
('Banana (Nendran)', 'Thrissur', 3800, 4400, 4150, 'Quintal', 'down'),
('Black Pepper', 'Wayanad', 58000, 64000, 61500, 'Quintal', 'up'),
('Cardamom (Small)', 'Idukki', 1850, 2400, 2150, 'Kg', 'stable'),
('Rubber (RSI-4)', 'Kottayam', 17200, 18500, 18100, 'Quintal', 'up'),
('Arecanut (Ripe)', 'Kasargod', 42000, 48000, 45500, 'Quintal', 'down'),
('Tapioca', 'Trivandrum', 1600, 2100, 1850, 'Quintal', 'stable')
ON CONFLICT (crop_name, district) DO UPDATE SET modal_price = EXCLUDED.modal_price, updated_at = NOW();
