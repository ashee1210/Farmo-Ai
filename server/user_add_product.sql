-- ============================================================
-- FARMO AI — USER ADD PRODUCT & CROPS
-- File: user_add_product.sql
-- Description: Table schema and queries for adding farm crops,
--              land portions, and marketplace products.
-- ============================================================

CREATE DATABASE IF NOT EXISTS farmo_ai_db;
USE farmo_ai_db;

-- 1. Farmer Crops Table (Land Portions & Crop Status)
CREATE TABLE IF NOT EXISTS farmer_crops (
  id VARCHAR(36) PRIMARY KEY,
  farmer_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  variety VARCHAR(255) DEFAULT 'Hybrid / Standard',
  area DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
  health INT DEFAULT 90,
  stage VARCHAR(100) DEFAULT 'Planning',
  next_action TEXT,
  image_url LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Products Table (User-Added Marketplace Products)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  farmer_id VARCHAR(36) NOT NULL,
  farmer_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  variety VARCHAR(255) DEFAULT 'Standard',
  quantity_acres DECIMAL(6, 2) DEFAULT 1.0,
  price_per_unit DECIMAL(10, 2) DEFAULT 0.0,
  health_rating INT DEFAULT 90,
  growth_stage VARCHAR(100) DEFAULT 'Planning',
  location_district VARCHAR(100) NOT NULL,
  status ENUM('Available', 'Sold', 'Pending') DEFAULT 'Available',
  image_url LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Sample: Farmer Adds a Land Portion & Crop
INSERT INTO farmer_crops (id, farmer_id, name, variety, area, health, stage, next_action)
VALUES (
  'crop_paddy_01',
  'u_farmer_01',
  'Paddy (Jyothi)',
  'Jyothi Hybrid',
  2.5,
  95,
  'Tillering',
  'Apply organic fertilizer before upcoming rain'
)
ON DUPLICATE KEY UPDATE area = VALUES(area), health = VALUES(health);

-- 4. Sample: Farmer Adds a Product for Sale in Marketplace
INSERT INTO products (id, farmer_id, farmer_name, product_name, variety, quantity_acres, price_per_unit, location_district)
VALUES (
  'prod_paddy_01',
  'u_farmer_01',
  'Ramesh Kumar',
  'Organic Paddy',
  'Jyothi Hybrid',
  2.5,
  3200.00,
  'Palakkad'
)
ON DUPLICATE KEY UPDATE quantity_acres = VALUES(quantity_acres), price_per_unit = VALUES(price_per_unit);

-- 5. Query: View All Crops Added by a Specific Farmer
SELECT id, name, variety, area, health, stage, next_action, created_at
FROM farmer_crops
WHERE farmer_id = 'u_farmer_01'
ORDER BY created_at DESC;

-- 6. Query: View All Available Marketplace Products
SELECT p.id, p.farmer_name, p.product_name, p.variety, p.quantity_acres, p.price_per_unit, p.location_district, p.status, p.created_at
FROM products p
ORDER BY p.created_at DESC;
