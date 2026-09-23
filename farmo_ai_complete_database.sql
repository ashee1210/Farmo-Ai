-- ==============================================================================
-- FARMO AI — COMPLETE UNIFIED MASTER MYSQL DATABASE SCHEMA
-- File: farmo_ai_complete_database.sql
-- Platform: FARMO AI Agricultural SaaS & Admin Management Platform
-- Engine: MySQL 8.0+ (InnoDB) / Compatible with SQL Clients (phpMyAdmin, Workbench, DBeaver)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- DATABASE INITIALIZATION
-- ------------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS farmo_ai_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE farmo_ai_db;

-- ------------------------------------------------------------------------------
-- TABLE 1: USERS (Authentication & Role Management)
-- Unified user table for Farmers, Agronomists, and Platform Administrators.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Unified Unique User ID (e.g. u_admin_default, u_123456)',
  full_name VARCHAR(255) NOT NULL COMMENT 'Full Name of User or Farmer',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique Login Email Address',
  password VARCHAR(255) NOT NULL DEFAULT 'Farmer@123' COMMENT 'Login Password',
  phone VARCHAR(50) DEFAULT '+91 90000 00000' COMMENT 'Contact Mobile Number',
  role ENUM('farmer', 'agronomist', 'admin') NOT NULL DEFAULT 'farmer' COMMENT 'Access Role Level',
  district VARCHAR(100) NOT NULL DEFAULT 'Kerala' COMMENT 'Primary Agricultural District',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Account Registration Timestamp',
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 2: FARMERS (Farmer Profiles & Agricultural Summary)
-- 1:1 Unified profile linked directly to users table via id.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS farmers;
CREATE TABLE IF NOT EXISTS farmers (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Unified ID matching users.id',
  name VARCHAR(255) NOT NULL COMMENT 'Farmer Display Name',
  location VARCHAR(255) NOT NULL DEFAULT 'Kerala' COMMENT 'Specific Farm Village or Panchayath',
  district VARCHAR(100) NOT NULL DEFAULT 'Kerala' COMMENT 'District Location (e.g. Palakkad, Wayanad)',
  crop VARCHAR(255) NOT NULL DEFAULT 'Paddy (Jyothi)' COMMENT 'Primary Cultivated Crop',
  acres DECIMAL(6, 2) NOT NULL DEFAULT 1.00 COMMENT 'Total Farm Land Area in Acres',
  soil_type VARCHAR(100) DEFAULT 'Alluvial' COMMENT 'Predominant Soil Composition',
  status ENUM('active', 'pending', 'suspended', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Farmer Account Status',
  join_date DATE DEFAULT (CURRENT_DATE) COMMENT 'Platform Joining Date',
  phone VARCHAR(50) DEFAULT '+91 90000 00000' COMMENT 'Direct Phone Number',
  disease_scans INT NOT NULL DEFAULT 0 COMMENT 'Count of AI Disease Scans Completed',
  last_active TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Platform Activity',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record Creation Timestamp',
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmers_status (status),
  INDEX idx_farmers_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 3: FARMER_CROPS (Individual Crop Land Portions & Agronomy)
-- Tracks individual crop varieties cultivated by each farmer with health & stage.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS farmer_crops;
CREATE TABLE IF NOT EXISTS farmer_crops (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Crop Record ID (e.g. crop_1, crop_2)',
  farmer_id VARCHAR(36) NOT NULL COMMENT 'Owner Farmer ID matching users.id',
  name VARCHAR(255) NOT NULL COMMENT 'Crop Name (e.g. Paddy, Banana, Pepper, Cardamom)',
  variety VARCHAR(255) DEFAULT 'Hybrid / Standard' COMMENT 'Seed / Hybrid Variety Name',
  area DECIMAL(6, 2) NOT NULL DEFAULT 1.00 COMMENT 'Allocated Acreage',
  health INT NOT NULL DEFAULT 90 COMMENT 'Crop Health Score (0-100%)',
  stage VARCHAR(100) NOT NULL DEFAULT 'Vegetative Growth' COMMENT 'Current Growth Stage',
  next_action TEXT COMMENT 'Recommended Action from AI Engine',
  image_url LONGTEXT COMMENT 'Crop Picture or Thumbnail URL',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Crop Planting / Registration Date',
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmer_crops_farmer (farmer_id),
  INDEX idx_farmer_crops_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 4: PRODUCTS (Marketplace Produce & Crop Listings)
-- Marketplace listings added by farmers for direct commercial sale.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Unique Product Listing ID (e.g. p_1, prod_123)',
  farmer_id VARCHAR(36) NOT NULL COMMENT 'Selling Farmer ID matching users.id',
  farmer_name VARCHAR(255) NOT NULL COMMENT 'Farmer Full Name',
  product_name VARCHAR(255) NOT NULL COMMENT 'Commodity / Product Name',
  variety VARCHAR(255) DEFAULT 'Standard' COMMENT 'Variety Specification',
  quantity_acres DECIMAL(6, 2) NOT NULL DEFAULT 1.00 COMMENT 'Available Cultivated Acreage',
  price_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Price per Quintal / KG in INR (₹)',
  health_rating INT NOT NULL DEFAULT 90 COMMENT 'Quality / Health Rating (0-100%)',
  growth_stage VARCHAR(100) NOT NULL DEFAULT 'Harvest Ready' COMMENT 'Crop Stage at Listing',
  location_district VARCHAR(100) NOT NULL DEFAULT 'Kerala' COMMENT 'Origin Mandi / District',
  status ENUM('Available', 'Sold', 'Pending') NOT NULL DEFAULT 'Available' COMMENT 'Inventory Status',
  image_url LONGTEXT COMMENT 'Product Image URL',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Listing Date',
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_products_farmer (farmer_id),
  INDEX idx_products_name (product_name),
  INDEX idx_products_district (location_district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 5: DISEASE_LOGS (AI Crop Disease Diagnostic Scans)
-- Diagnostic scan records processed by deep learning vision model.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS disease_logs;
CREATE TABLE IF NOT EXISTS disease_logs (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Scan Log Unique ID',
  farmer_id VARCHAR(36) COMMENT 'Scanning Farmer ID (Optional for anonymous)',
  farmer_name VARCHAR(255) NOT NULL DEFAULT 'Registered Farmer' COMMENT 'Farmer Name',
  crop VARCHAR(255) NOT NULL COMMENT 'Target Crop Identified',
  disease_name VARCHAR(255) NOT NULL COMMENT 'Identified Disease Name / Diagnosis',
  confidence_score DECIMAL(5, 2) NOT NULL DEFAULT 95.00 COMMENT 'AI Model Confidence Score (e.g. 96.5%)',
  district VARCHAR(100) NOT NULL DEFAULT 'Kerala' COMMENT 'Outbreak District Location',
  status ENUM('detected', 'treating', 'resolved') NOT NULL DEFAULT 'detected' COMMENT 'Resolution Status',
  severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium' COMMENT 'Disease Severity',
  treatment_plan TEXT COMMENT 'Recommended Chemical / Organic Treatment Advice',
  image_url LONGTEXT COMMENT 'Captured Leaf Image Data',
  detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Scan Timestamp',
  INDEX idx_disease_crop (crop),
  INDEX idx_disease_status (status),
  INDEX idx_disease_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 6: MARKET_PRICES (Agricultural Mandi Daily Market Rates)
-- Real-time prices across 28+ Kerala mandis and agricultural trading centers.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS market_prices;
CREATE TABLE IF NOT EXISTS market_prices (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Price Feed Unique ID',
  crop_name VARCHAR(255) NOT NULL COMMENT 'Agricultural Commodity Name',
  district VARCHAR(100) NOT NULL COMMENT 'Trading Mandi / District Name',
  min_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Minimum Trade Price (₹/Quintal)',
  max_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Maximum Trade Price (₹/Quintal)',
  modal_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Modal Average Market Price (₹/Quintal)',
  unit VARCHAR(50) NOT NULL DEFAULT 'Quintal' COMMENT 'Trading Unit (Quintal, KG, Bunch)',
  trend ENUM('up', 'down', 'stable') NOT NULL DEFAULT 'stable' COMMENT '30-Day AI Price Trend',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Feed Refresh Timestamp',
  UNIQUE KEY unique_crop_district (crop_name, district),
  INDEX idx_market_crop (crop_name),
  INDEX idx_market_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 7: ADMIN_NOTIFICATIONS (Broadcast Alerts & Advisories)
-- Admin broadcast notifications dispatched to farmers.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS admin_notifications;
CREATE TABLE IF NOT EXISTS admin_notifications (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Notification Unique ID',
  title VARCHAR(255) NOT NULL COMMENT 'Announcement Subject Title',
  message TEXT NOT NULL COMMENT 'Full Advisory Body Text',
  category VARCHAR(50) NOT NULL DEFAULT 'Advisory' COMMENT 'Category (Advisory, Weather Alert, Market Rate, Disease Alert)',
  priority VARCHAR(20) NOT NULL DEFAULT 'Normal' COMMENT 'Priority Level (Normal, High, Urgent)',
  target_audience VARCHAR(50) NOT NULL DEFAULT 'all' COMMENT 'Target Filter (all, district, crop)',
  target_value VARCHAR(100) DEFAULT NULL COMMENT 'Target Filter Value (e.g. Palakkad, Paddy)',
  sender_admin VARCHAR(100) NOT NULL DEFAULT 'Admin Administrator' COMMENT 'Author Administrator Name',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT 'Broadcast State',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Broadcast Timestamp',
  INDEX idx_notif_target (target_audience),
  INDEX idx_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- TABLE 8: AI_CONSULTATIONS (AI Farming Assistant Conversation Logs)
-- Logs of farmer inquiries processed by the multimodal Malayalam/English AI.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS ai_consultations;
CREATE TABLE IF NOT EXISTS ai_consultations (
  id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'Consultation Session ID',
  farmer_id VARCHAR(36) COMMENT 'Inquiring Farmer ID',
  topic VARCHAR(255) NOT NULL COMMENT 'Inquiry Subject (Pest, Fertilizer, Weather, Market)',
  language VARCHAR(50) NOT NULL DEFAULT 'Malayalam' COMMENT 'Language Used (Malayalam, English)',
  query_text TEXT COMMENT 'Farmer Question',
  response_text TEXT COMMENT 'AI Recommendation Output',
  satisfaction_rating INT DEFAULT 5 COMMENT 'User Rating (1-5 Stars)',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Consultation Timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- MASTER UNIFIED VIEW: view_unified_all_in_one
-- High performance consolidated view combining Users, Farmers, Crops, and Products.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_unified_all_in_one AS
SELECT 
  u.id AS user_id,
  u.full_name AS user_name,
  u.full_name AS farmer_name,
  u.email,
  u.phone,
  u.role,
  COALESCE(p.location_district, f.district, u.district) AS district,
  f.soil_type,
  COALESCE(f.status, 'active') AS account_status,
  COALESCE(p.id, fc.id) AS product_id,
  COALESCE(p.product_name, fc.name) AS product_name,
  COALESCE(p.product_name, fc.name) AS crop_name,
  COALESCE(p.variety, fc.variety) AS variety,
  COALESCE(p.quantity_acres, fc.area) AS quantity_acres,
  COALESCE(p.quantity_acres, fc.area) AS crop_acres,
  p.price_per_unit,
  COALESCE(p.health_rating, fc.health, 90) AS health_rating,
  COALESCE(p.growth_stage, fc.stage, 'Planning') AS growth_stage,
  COALESCE(p.location_district, u.district) AS location_district,
  COALESCE(p.status, 'Available') AS status,
  COALESCE(p.image_url, fc.image_url) AS image_url,
  fc.next_action AS ai_recommendation,
  COALESCE(p.created_at, fc.created_at) AS product_created_at,
  u.created_at AS registered_at
FROM users u
LEFT JOIN farmers f ON u.id = f.id
LEFT JOIN products p ON u.id = p.farmer_id OR u.email = p.farmer_id
LEFT JOIN farmer_crops fc ON (u.id = fc.farmer_id OR u.email = fc.farmer_id) AND (p.id = fc.id OR (p.id IS NULL AND fc.id IS NOT NULL))
ORDER BY u.created_at DESC;

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA
-- ------------------------------------------------------------------------------

-- 1. Seed Master Super Administrator
INSERT INTO users (id, full_name, email, password, phone, role, district, created_at)
VALUES (
  'u_admin_default',
  'Admin Administrator',
  'admin@gmail.com',
  'admin123',
  '+91 94470 00001',
  'admin',
  'Kerala',
  '2026-08-11 08:00:00'
) ON DUPLICATE KEY UPDATE 
  full_name = VALUES(full_name),
  password = VALUES(password),
  role = 'admin';

-- 2. Seed Real Farmer Accounts
INSERT INTO users (id, full_name, email, password, phone, role, district, created_at)
VALUES 
  ('f_demo', 'Ravi Chandran', 'farmer@gmail.com', 'Farmer@123', '+91 94470 12345', 'farmer', 'Palakkad', '2026-08-11 09:30:00'),
  ('f_lekha', 'Lekha Menon', 'lekha.menon@gmail.com', 'Farmer@123', '+91 97110 33445', 'farmer', 'Alappuzha', '2026-08-11 10:15:00'),
  ('f_binu', 'Binu George', 'binu.george@gmail.com', 'Farmer@123', '+91 99480 77889', 'farmer', 'Ernakulam', '2026-08-12 11:00:00'),
  ('f_suresh', 'Suresh Kumar', 'suresh.kumar@gmail.com', 'Farmer@123', '+91 98450 11223', 'farmer', 'Wayanad', '2026-08-12 14:20:00')
ON DUPLICATE KEY UPDATE 
  full_name = VALUES(full_name),
  password = VALUES(password),
  role = 'farmer';

-- 3. Seed Farmer Profiles (1:1 with Users)
INSERT INTO farmers (id, name, location, district, crop, acres, soil_type, status, join_date, phone, disease_scans, created_at)
VALUES 
  ('f_demo', 'Ravi Chandran', 'Chittur, Palakkad', 'Palakkad', 'Paddy (Jyothi)', 3.50, 'Alluvial', 'active', '2026-08-11', '+91 94470 12345', 12, '2026-08-11 09:30:00'),
  ('f_lekha', 'Lekha Menon', 'Kuttanad, Alappuzha', 'Alappuzha', 'Rice (Uma)', 4.10, 'Clay Loam', 'active', '2026-08-11', '+91 97110 33445', 8, '2026-08-11 10:15:00'),
  ('f_binu', 'Binu George', 'Aluva, Ernakulam', 'Ernakulam', 'Coconut & Banana', 2.40, 'Laterite', 'active', '2026-08-12', '+91 99480 77889', 5, '2026-08-12 11:00:00'),
  ('f_suresh', 'Suresh Kumar', 'Sulthan Bathery, Wayanad', 'Wayanad', 'Black Pepper & Coffee', 5.00, 'Red Sandy Loam', 'active', '2026-08-12', '+91 98450 11223', 15, '2026-08-12 14:20:00')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  acres = VALUES(acres),
  crop = VALUES(crop);

-- 4. Seed Farmer Crops (Land Allocations)
INSERT INTO farmer_crops (id, farmer_id, name, variety, area, health, stage, next_action, created_at)
VALUES 
  ('fc_1', 'f_demo', 'Paddy', 'Jyothi Special', 2.50, 94, 'Grain Filling', 'Apply organic potash fertilizer in 3 days', '2026-08-11 09:40:00'),
  ('fc_2', 'f_demo', 'Vegetables', 'Snake Gourd & Chilli', 1.00, 88, 'Flowering', 'Check for fruit fly infestation weekly', '2026-08-11 09:45:00'),
  ('fc_3', 'f_lekha', 'Rice', 'Uma Matta', 4.10, 96, 'Tillering', 'Maintain 5cm standing water in paddy block', '2026-08-11 10:20:00'),
  ('fc_4', 'f_binu', 'Coconut', 'West Coast Tall', 1.80, 91, 'Maturity', 'Harvest window optimal in 10 days', '2026-08-12 11:10:00'),
  ('fc_5', 'f_suresh', 'Black Pepper', 'Panniyur-1', 3.00, 92, 'Berry Setting', 'Spray 1% Bordeaux mixture before monsoon rain', '2026-08-12 14:30:00')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  health = VALUES(health);

-- 5. Seed Marketplace Products
INSERT INTO products (id, farmer_id, farmer_name, product_name, variety, quantity_acres, price_per_unit, health_rating, growth_stage, location_district, status, created_at)
VALUES 
  ('p_1', 'f_demo', 'Ravi Chandran', 'Paddy', 'Jyothi Premium', 2.50, 2450.00, 94, 'Harvest Ready', 'Palakkad', 'Available', '2026-08-11 10:00:00'),
  ('p_2', 'f_lekha', 'Lekha Menon', 'Rice', 'Uma Matta Red', 4.10, 2680.00, 96, 'Flowering', 'Alappuzha', 'Available', '2026-08-11 10:30:00'),
  ('p_3', 'f_binu', 'Binu George', 'Coconut', 'Dry Organic Copra', 1.80, 3400.00, 91, 'Harvest Ready', 'Ernakulam', 'Available', '2026-08-12 11:20:00'),
  ('p_4', 'f_suresh', 'Suresh Kumar', 'Pepper', 'Panniyur Black Grade A', 3.00, 58000.00, 92, 'Berry Setting', 'Wayanad', 'Available', '2026-08-12 14:40:00')
ON DUPLICATE KEY UPDATE 
  price_per_unit = VALUES(price_per_unit),
  status = VALUES(status);

-- 6. Seed Kerala Mandi Agricultural Prices
INSERT INTO market_prices (id, crop_name, district, min_price, max_price, modal_price, unit, trend)
VALUES 
  ('m_1', 'Paddy (Jyothi)', 'Palakkad Mandi', 2180.00, 2450.00, 2380.00, 'Quintal', 'up'),
  ('m_2', 'Rice (Uma)', 'Alappuzha APMC', 2400.00, 2750.00, 2680.00, 'Quintal', 'up'),
  ('m_3', 'Black Pepper', 'Wayanad Spices Mandi', 54000.00, 61500.00, 58500.00, 'Quintal', 'up'),
  ('m_4', 'Cardamom (Small)', 'Idukki Spices Exchange', 145000.00, 185000.00, 172000.00, 'Quintal', 'up'),
  ('m_5', 'Coconut (Milled Copra)', 'Thrissur Mandi', 8500.00, 10200.00, 9600.00, 'Quintal', 'stable'),
  ('m_6', 'Rubber (RSS-4)', 'Kottayam Rubber Market', 18200.00, 21500.00, 20400.00, 'Quintal', 'up'),
  ('m_7', 'Banana (Nendran)', 'Thrissur Vegetable Market', 3800.00, 4800.00, 4450.00, 'Quintal', 'stable'),
  ('m_8', 'Tapioca (Cassava)', 'Kollam Agricultural Market', 1400.00, 1850.00, 1650.00, 'Quintal', 'stable')
ON DUPLICATE KEY UPDATE 
  min_price = VALUES(min_price),
  max_price = VALUES(max_price),
  modal_price = VALUES(modal_price),
  trend = VALUES(trend);

-- 7. Seed Disease Diagnostics Scans
INSERT INTO disease_logs (id, farmer_id, farmer_name, crop, disease_name, confidence_score, district, status, severity, treatment_plan, detected_at)
VALUES 
  ('scan_1', 'f_demo', 'Ravi Chandran', 'Paddy', 'Bacterial Leaf Blight', 96.50, 'Palakkad', 'resolved', 'Medium', 'Sprayed Streptomycin Sulphate + Copper Oxychloride (500g/ha)', '2026-08-11 11:20:00'),
  ('scan_2', 'f_suresh', 'Suresh Kumar', 'Black Pepper', 'Quick Wilt (Phytophthora)', 94.20, 'Wayanad', 'treating', 'High', 'Soil drenching with 0.2% Copper Oxychloride + Trichoderma', '2026-08-12 15:10:00'),
  ('scan_3', 'f_lekha', 'Lekha Menon', 'Rice', 'Brown Spot (Bipolaris)', 97.80, 'Alappuzha', 'resolved', 'Low', 'Seed treatment with Mancozeb @ 2g/kg seed', '2026-08-12 16:45:00')
ON DUPLICATE KEY UPDATE 
  status = VALUES(status);

-- 8. Seed Admin Broadcast Notifications
INSERT INTO admin_notifications (id, title, message, category, priority, target_audience, target_value, sender_admin, status, created_at)
VALUES 
  ('notif_1', 'Heavy Rainfall & Humidity Advisory', 'High humidity levels detected in Wayanad and Palakkad. Inspect pepper vines for fungal infection symptoms.', 'Advisory', 'High', 'all', NULL, 'Admin Administrator', 'active', '2026-08-12 09:00:00'),
  ('notif_2', 'Paddy Procurement MSP Subsidy Update', 'Government paddy procurement baseline rate increased to ₹28.20/kg across all Kerala state warehouses.', 'Market Rate', 'Normal', 'crop', 'Paddy', 'Admin Administrator', 'active', '2026-08-12 12:30:00')
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  message = VALUES(message);

-- ------------------------------------------------------------------------------
-- VERIFICATION & AUDIT QUERIES
-- ------------------------------------------------------------------------------
SELECT '=== USERS TABLE ===' AS report_section;
SELECT id, full_name, email, role, district, created_at FROM users ORDER BY created_at DESC;

SELECT '=== FARMERS TABLE ===' AS report_section;
SELECT id, name, location, district, crop, acres, status FROM farmers;

SELECT '=== MARKETPLACE PRODUCTS ===' AS report_section;
SELECT id, farmer_name, product_name, variety, quantity_acres, price_per_unit, status FROM products;

SELECT '=== CONSOLIDATED UNIFIED VIEW (TOP 10) ===' AS report_section;
SELECT user_id, user_name, email, role, district, crop_name, quantity_acres, price_per_unit, status FROM view_unified_all_in_one LIMIT 10;
