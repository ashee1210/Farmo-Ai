-- FARMO AI Admin Panel Schema Migration
-- Run this script in the Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('admin', 'farmer', 'agronomist')),
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Farmers Table
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  crop TEXT NOT NULL,
  acres NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
  soil_type TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
  join_date DATE DEFAULT CURRENT_DATE,
  phone TEXT,
  disease_scans INT DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Disease Logs Table
CREATE TABLE IF NOT EXISTS public.disease_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  crop TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  confidence_score NUMERIC(5, 2) NOT NULL,
  district TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'treating', 'resolved')),
  image_url TEXT,
  severity TEXT DEFAULT 'Medium',
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Market Prices Table
CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_name TEXT NOT NULL,
  district TEXT NOT NULL,
  min_price NUMERIC(10, 2) NOT NULL,
  max_price NUMERIC(10, 2) NOT NULL,
  modal_price NUMERIC(10, 2) NOT NULL,
  unit TEXT DEFAULT 'Quintal',
  trend TEXT DEFAULT 'up' CHECK (trend IN ('up', 'down', 'stable')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (crop_name, district)
);

-- 6. AI Consultations Table
CREATE TABLE IF NOT EXISTS public.ai_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  language TEXT DEFAULT 'Malayalam',
  satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated reads/writes for admin API client
CREATE POLICY "Allow public select for demo" ON public.farmers FOR SELECT USING (true);
CREATE POLICY "Allow public select for demo" ON public.disease_logs FOR SELECT USING (true);
CREATE POLICY "Allow public select for demo" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Allow public select for demo" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public select for demo" ON public.ai_consultations FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert/update" ON public.farmers FOR ALL USING (true);
CREATE POLICY "Allow authenticated insert/update" ON public.disease_logs FOR ALL USING (true);
CREATE POLICY "Allow authenticated insert/update" ON public.market_prices FOR ALL USING (true);

-- Enable Realtime for disease_logs and market_prices
ALTER PUBLICATION supabase_realtime ADD TABLE public.disease_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_prices;
