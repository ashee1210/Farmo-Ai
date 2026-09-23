-- ============================================================
-- FARMO AI — ADMIN LOGIN & CREDENTIALS
-- File: admin_login.sql
-- Description: Master Administrator credentials, login verification,
--              and admin management queries.
-- ============================================================

CREATE DATABASE IF NOT EXISTS farmo_ai_db;
USE farmo_ai_db;

-- 1. Ensure Users Table Exists
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL DEFAULT 'admin@1234',
  phone VARCHAR(50),
  role ENUM('farmer', 'agronomist', 'admin') DEFAULT 'admin',
  district VARCHAR(100) NOT NULL DEFAULT 'Kerala',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Admin Account
-- Email: admin@gmail.com | Password: admin@1234
INSERT INTO users (id, full_name, email, password, phone, role, district)
VALUES (
  'u_admin_default',
  'Admin Administrator',
  'admin@gmail.com',
  'admin@1234',
  '+91 94470 00001',
  'admin',
  'Kerala'
)
ON DUPLICATE KEY UPDATE 
  password = VALUES(password),
  role = 'admin';

-- 3. Master Admin Login Authentication Query
SELECT id, full_name, email, role, district, phone, created_at 
FROM users 
WHERE email = 'admin@gmail.com' AND password = 'admin@1234' AND role = 'admin';

-- 4. View All Administrator Accounts
SELECT id, full_name, email, phone, role, district, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;
