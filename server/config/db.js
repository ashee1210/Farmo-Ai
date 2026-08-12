import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.join(process.cwd(), 'farmo_ai.sqlite');
let sqliteDb = null;
let mysqlPool = null;
let activeEngine = 'sqlite';

export async function initDatabase() {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const database = process.env.MYSQL_DATABASE || 'farmo_ai_db';

  const credentialPairs = [
    { user: process.env.MYSQL_USER || 'root', password: process.env.MYSQL_PASSWORD || 'aswin#123456789' },
    { user: 'root', password: 'aswin#123456789' },
    { user: 'root', password: 'admin@123456789' },
    { user: 'farmer', password: 'farmer123' },
    { user: 'root', password: '' },
    { user: 'root', password: 'root' },
    { user: 'root', password: '123456' },
    { user: 'root', password: 'farmer123' }
  ];

  for (const cred of credentialPairs) {
    try {
      // Ensure database exists
      try {
        const rootConn = await mysql.createConnection({ host, port, user: cred.user, password: cred.password });
        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await rootConn.end();
      } catch (e) {}

      mysqlPool = mysql.createPool({
        host,
        port,
        user: cred.user,
        password: cred.password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
      });

      const conn = await mysqlPool.getConnection();
      conn.release();
      activeEngine = 'mysql';
      console.log(`✅ Connected to MySQL Database '${database}' on ${host}:${port} (user: ${cred.user})`);
      
      // Auto-create MySQL Tables if not present
      await createMysqlTables();
      return { engine: 'mysql' };
    } catch (err) {
      // Continue trying next credentials pair
    }
  }

  console.warn(`⚠️ MySQL Connection Notice. Falling back to Local SQLite Engine...`);

  // Fallback: Local SQL Engine (farmo_ai.sqlite)
  return new Promise((resolve, reject) => {
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ SQLite error:', err.message);
        reject(err);
      } else {
        activeEngine = 'sqlite';
        console.log(`✅ Connected to Local SQL Database (farmo_ai.sqlite)`);
        seedSqliteTables().then(() => resolve({ engine: 'sqlite' })).catch(reject);
      }
    });
  });
}

async function createMysqlTables() {
  if (!mysqlPool) return;
  try {
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL DEFAULT 'Farmer@123',
        phone VARCHAR(50),
        role ENUM('admin', 'farmer', 'agronomist') DEFAULT 'farmer',
        district VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auto-migrate unique index on email to prevent duplicates
    try {
      await mysqlPool.query(`ALTER TABLE users ADD UNIQUE KEY unique_user_email (email)`);
    } catch (colErr) {}

    // Seed Admin login account with clean defaults (User will enter their details manually inside Admin Panel)
    try {
      await mysqlPool.query(`
        INSERT INTO users (id, full_name, email, password, phone, role, district)
        VALUES ('u_admin_default', 'Admin', 'admin@gmail.com', 'admin@1234', '', 'admin', 'Kerala')
        AS new_adm ON DUPLICATE KEY UPDATE 
          password = new_adm.password,
          role = 'admin'
      `);
    } catch (adminErr) {}

    // Auto-migrate legacy user_id column if present
    try {
      await mysqlPool.query(`ALTER TABLE farmers DROP COLUMN user_id`);
    } catch (colErr) {}

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        district VARCHAR(100) NOT NULL,
        crop VARCHAR(255) NOT NULL,
        acres DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
        soil_type VARCHAR(100),
        status ENUM('active', 'pending', 'suspended', 'inactive') DEFAULT 'active',
        join_date DATE,
        phone VARCHAR(50),
        disease_scans INT DEFAULT 0,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_farmer_name_district (name, district)
      )
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS disease_logs (
        id VARCHAR(36) PRIMARY KEY,
        farmer_id VARCHAR(36),
        farmer_name VARCHAR(255) NOT NULL,
        crop VARCHAR(255) NOT NULL,
        disease_name VARCHAR(255) NOT NULL,
        confidence_score DECIMAL(5, 2) NOT NULL,
        district VARCHAR(100) NOT NULL,
        status ENUM('detected', 'treating', 'resolved') DEFAULT 'detected',
        image_url TEXT,
        severity ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
      )
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS market_prices (
        id VARCHAR(36) PRIMARY KEY,
        crop_name VARCHAR(255) NOT NULL,
        district VARCHAR(100) NOT NULL,
        min_price DECIMAL(10, 2) NOT NULL,
        max_price DECIMAL(10, 2) NOT NULL,
        modal_price DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50) DEFAULT 'Quintal',
        trend ENUM('up', 'down', 'stable') DEFAULT 'up',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_crop_district (crop_name, district)
      )
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS ai_consultations (
        id VARCHAR(36) PRIMARY KEY,
        farmer_id VARCHAR(36),
        topic VARCHAR(255) NOT NULL,
        language VARCHAR(50) DEFAULT 'Malayalam',
        satisfaction_rating INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
      )
    `);

    // Create Unified All-in-One Master Table & View
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS unified_farmer_products (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'farmer',
        district VARCHAR(100) NOT NULL,
        state VARCHAR(100) DEFAULT 'Kerala',
        primary_crop VARCHAR(255),
        total_farm_acres DECIMAL(6, 2) DEFAULT 1.0,
        soil_type VARCHAR(100) DEFAULT 'Alluvial',
        status VARCHAR(50) DEFAULT 'active',
        product_id VARCHAR(36),
        crop_name VARCHAR(255),
        variety VARCHAR(255),
        crop_area DECIMAL(6, 2),
        crop_health INT DEFAULT 90,
        growth_stage VARCHAR(100) DEFAULT 'Planning',
        next_action TEXT,
        image_url LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await mysqlPool.query(`
      CREATE OR REPLACE VIEW view_unified_all_in_one AS
      SELECT 
        u.id AS user_id,
        u.full_name AS farmer_name,
        u.email,
        u.phone,
        u.role,
        u.district,
        f.soil_type,
        f.status AS account_status,
        fc.id AS product_id,
        fc.name AS crop_name,
        fc.variety,
        fc.area AS crop_acres,
        fc.health AS health_percentage,
        fc.stage AS growth_stage,
        fc.next_action AS ai_recommendation,
        fc.image_url,
        u.created_at AS registered_at
      FROM users u
      LEFT JOIN farmers f ON u.id = f.id
      LEFT JOIN farmer_crops fc ON u.id = fc.farmer_id
      ORDER BY u.created_at DESC, fc.created_at DESC
    `);

    await mysqlPool.query(`
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
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.warn('MySQL table initialization warning:', e.message);
  }
}

export async function query(sql, params = []) {
  if (activeEngine === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  }

  return new Promise((resolve, reject) => {
    // Adapt MySQL syntax for SQLite if needed
    let sqliteSql = sql
      .replace(/CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'CURRENT_TIMESTAMP')
      .replace(/ENUM\([^)]+\)/gi, 'TEXT')
      .replace(/DECIMAL\([^)]+\)/gi, 'REAL')
      .replace(/VARCHAR\([^)]+\)/gi, 'TEXT')
      .replace(/ON DUPLICATE KEY UPDATE.*/gi, '');

    const isSelect = sqliteSql.trim().toUpperCase().startsWith('SELECT');

    if (isSelect) {
      sqliteDb.all(sqliteSql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    } else {
      sqliteDb.run(sqliteSql, params, function (err) {
        if (err) reject(err);
        else resolve({ affectedRows: this.changes, insertId: this.lastID });
      });
    }
  });
}

async function seedSqliteTables() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      phone TEXT,
      role TEXT DEFAULT 'farmer',
      district TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS farmers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      district TEXT NOT NULL,
      crop TEXT NOT NULL,
      acres REAL DEFAULT 1.0,
      soil_type TEXT,
      status TEXT DEFAULT 'active',
      join_date TEXT,
      phone TEXT,
      disease_scans INTEGER DEFAULT 0,
      last_active TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS disease_logs (
      id TEXT PRIMARY KEY,
      farmer_id TEXT,
      farmer_name TEXT NOT NULL,
      crop TEXT NOT NULL,
      disease_name TEXT NOT NULL,
      confidence_score REAL NOT NULL,
      district TEXT NOT NULL,
      status TEXT DEFAULT 'detected',
      image_url TEXT,
      severity TEXT DEFAULT 'Medium',
      detected_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS market_prices (
      id TEXT PRIMARY KEY,
      crop_name TEXT NOT NULL,
      district TEXT NOT NULL,
      min_price REAL NOT NULL,
      max_price REAL NOT NULL,
      modal_price REAL NOT NULL,
      unit TEXT DEFAULT 'Quintal',
      trend TEXT DEFAULT 'up',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(crop_name, district)
    );

    CREATE TABLE IF NOT EXISTS ai_consultations (
      id TEXT PRIMARY KEY,
      farmer_id TEXT,
      topic TEXT NOT NULL,
      language TEXT DEFAULT 'Malayalam',
      satisfaction_rating INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS farmer_crops (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL,
      name TEXT NOT NULL,
      variety TEXT,
      area REAL DEFAULT 1.0,
      health INTEGER DEFAULT 90,
      stage TEXT DEFAULT 'Planning',
      next_action TEXT,
      image_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  return new Promise((resolve, reject) => {
    sqliteDb.exec(schema, (err) => {
      if (err) return reject(err);

      // Ensure password column exists in users
      sqliteDb.run('ALTER TABLE users ADD COLUMN password TEXT', () => {
        resolve();
      });
    });
  });
}

export function getEngine() {
  return activeEngine;
}
