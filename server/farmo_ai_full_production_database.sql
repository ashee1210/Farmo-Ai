
CREATE DATABASE IF NOT EXISTS farmo_ai_db;
USE farmo_ai_db;


CREATE USER IF NOT EXISTS 'farmer'@'localhost' IDENTIFIED BY 'farmer123';
GRANT ALL PRIVILEGES ON farmo_ai_db.* TO 'farmer'@'localhost';
FLUSH PRIVILEGES;


CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL DEFAULT 'Farmer@123',
  phone VARCHAR(50),
  role ENUM('admin', 'farmer', 'agronomist') DEFAULT 'farmer',
  district VARCHAR(100) NOT NULL DEFAULT 'Kerala',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_email (email)
);

-- ------------------------------------------------------------
-- 2. Farmers Table (Linked 1:1 to Users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  crop VARCHAR(255) NOT NULL,
  acres DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
  soil_type VARCHAR(100) DEFAULT 'Alluvial',
  status ENUM('active', 'pending', 'suspended', 'inactive') DEFAULT 'active',
  join_date DATE,
  phone VARCHAR(50),
  disease_scans INT DEFAULT 0,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 3. Farmer Crops Table (User Land Portions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmer_crops (
  id VARCHAR(36) PRIMARY KEY,
  farmer_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  variety VARCHAR(255),
  area DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
  health INT DEFAULT 90,
  stage VARCHAR(100) DEFAULT 'Planning',
  next_action TEXT,
  image_url LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_farmer_crop (farmer_id, name, variety)
);

-- ------------------------------------------------------------
-- 4. Products Table (User-Added Products & Marketplace Items)
-- ------------------------------------------------------------
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
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_farmer_product (farmer_id, product_name, variety)
);

-- ------------------------------------------------------------
-- 5. Market Prices Table (District Mandi Rates)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS market_prices (
  id VARCHAR(36) PRIMARY KEY,
  crop_name VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  min_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  max_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  modal_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  unit VARCHAR(50) DEFAULT 'Quintal',
  trend ENUM('up', 'down', 'stable') DEFAULT 'stable',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_crop_district (crop_name, district)
);

-- ------------------------------------------------------------
-- 6. Duplicate Prevention Cleanup (Workbench Safe)
-- ------------------------------------------------------------
SET SQL_SAFE_UPDATES = 0;

DELETE FROM users 
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id 
        FROM users 
        GROUP BY email
    ) AS temp_users
);

DELETE FROM farmer_crops 
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id 
        FROM farmer_crops 
        GROUP BY farmer_id, name, variety
    ) AS temp_crops
);

DELETE FROM products 
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id 
        FROM products 
        GROUP BY farmer_id, product_name, variety
    ) AS temp_products
);

SET SQL_SAFE_UPDATES = 1;

-- ------------------------------------------------------------
-- 7. Unified Master All-in-One View
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW view_unified_all_in_one AS
SELECT DISTINCT
  u.id AS user_id,
  u.full_name AS user_name,
  u.email,
  u.phone,
  u.role,
  u.district,
  fc.id AS product_id,
  fc.name AS crop_name,
  fc.variety,
  fc.area AS crop_acres,
  fc.health AS health_percentage,
  fc.stage AS growth_stage,
  u.created_at AS registered_at
FROM users u
LEFT JOIN farmer_crops fc ON u.id = fc.farmer_id
ORDER BY u.created_at DESC;

-- ------------------------------------------------------------
-- 8. Production Verification Queries (Zero Inserts)
-- ------------------------------------------------------------
SELECT id, full_name, email, phone, role, district, created_at FROM users ORDER BY created_at DESC;
SELECT id, farmer_id, farmer_name, product_name, variety, quantity_acres, price_per_unit, health_rating, growth_stage, location_district, status, image_url, created_at FROM products ORDER BY created_at DESC;
SELECT * FROM view_unified_all_in_one;
