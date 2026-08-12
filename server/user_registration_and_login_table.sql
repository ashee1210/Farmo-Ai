
CREATE DATABASE IF NOT EXISTS farmo_ai_db;
USE farmo_ai_db;


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

SET SQL_SAFE_UPDATES = 0;

DELETE FROM users 
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id 
        FROM users 
        GROUP BY email
    ) AS temp_users
);

SET SQL_SAFE_UPDATES = 1;

INSERT INTO users (id, full_name, email, password, phone, role, district)
VALUES (
  'u_admin_default', 
  'Admin Kumar', 
  'admin@gmail.com', 
  'admin@1234', 
  '+91 94470 00001', 
  'admin', 
  'Kerala'
)
AS new_adm ON DUPLICATE KEY UPDATE 
  password = new_adm.password, 
  role = 'admin';


SELECT id, full_name, email, role, district, created_at 
FROM users 
ORDER BY created_at DESC;
