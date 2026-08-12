
CREATE DATABASE IF NOT EXISTS farmo_ai_db;
USE farmo_ai_db;


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


SET SQL_SAFE_UPDATES = 0;

DELETE FROM products 
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id 
        FROM products 
        GROUP BY farmer_id, product_name, variety
    ) AS temp_products
);

SET SQL_SAFE_UPDATES = 1;


SELECT 
  id, 
  farmer_id, 
  farmer_name, 
  product_name, 
  variety, 
  quantity_acres, 
  price_per_unit, 
  health_rating, 
  growth_stage, 
  location_district, 
  status, 
  image_url, 
  created_at 
FROM products 
ORDER BY created_at DESC;
