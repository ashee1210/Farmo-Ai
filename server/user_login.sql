-- ============================================================
-- FARMO AI — USER REGISTRATION & LOGIN
-- File: user_login.sql
-- Description: User accounts table, registration, and login queries.
-- ============================================================

CREATE DATABASE IF NOT EXISTS farmo_ai_db;
USE farmo_ai_db;

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL DEFAULT 'Farmer@123',
  phone VARCHAR(50),
  role ENUM('farmer', 'agronomist', 'admin') DEFAULT 'farmer',
  district VARCHAR(100) NOT NULL DEFAULT 'Kerala',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sample Farmer Registration
INSERT INTO users (id, full_name, email, password, phone, role, district)
VALUES (
  'u_farmer_01',
  'Ramesh Kumar',
  'ramesh@gmail.com',
  'Farmer@123',
  '+91 94470 12345',
  'farmer',
  'Palakkad'
)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 3. Farmer Login Verification Query (By Email and Password)
SELECT id, full_name, email, role, district, phone, created_at 
FROM users 
WHERE email = 'ramesh@gmail.com' AND password = 'Farmer@123';

-- 4. View All Registered Farmers
SELECT id, full_name, email, phone, district, created_at 
FROM users 
WHERE role = 'farmer'
ORDER BY created_at DESC;
