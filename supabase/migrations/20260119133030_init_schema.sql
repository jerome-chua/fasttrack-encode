-- FastTrack Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- 1. Users table - User profiles from onboarding funnel
CREATE TABLE IF NOT EXISTS users (
  telegram_id BIGINT PRIMARY KEY,
  first_name TEXT NOT NULL,
  current_weight DECIMAL(5,2),
  goal_weight DECIMAL(5,2),
  height DECIMAL(5,1),
  onboarding_step TEXT NOT NULL DEFAULT 'weight' CHECK (onboarding_step IN ('weight', 'goal', 'height', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Weight logs - Daily weight tracking
CREATE TABLE IF NOT EXISTS weight_logs (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_telegram_id ON weight_logs(telegram_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_logged_at ON weight_logs(telegram_id, logged_at DESC);

-- 3. Fasting periods - Fasting tracking
CREATE TABLE IF NOT EXISTS fasting_periods (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_fasting_periods_telegram_id ON fasting_periods(telegram_id);
CREATE INDEX IF NOT EXISTS idx_fasting_periods_active ON fasting_periods(telegram_id) WHERE ended_at IS NULL;

-- 4. Food logs - Meals from image analysis
CREATE TABLE IF NOT EXISTS food_logs (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  image_url TEXT,
  calories INTEGER NOT NULL,
  protein DECIMAL(6,2),
  carbs DECIMAL(6,2),
  fat DECIMAL(6,2),
  food_items JSONB,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'beverage')),
  notes TEXT,
  fasting_period_id INTEGER REFERENCES fasting_periods(id) ON DELETE SET NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_logs_telegram_id ON food_logs(telegram_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_logged_at ON food_logs(telegram_id, logged_at DESC);

-- 5. Daily summaries - On-demand AI insights
CREATE TABLE IF NOT EXISTS daily_summaries (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  total_calories INTEGER,
  total_protein DECIMAL(6,2),
  total_carbs DECIMAL(6,2),
  total_fat DECIMAL(6,2),
  fasting_hours DECIMAL(4,1),
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(telegram_id, summary_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_summaries_telegram_id ON daily_summaries(telegram_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all operations (bot uses service role key)
-- For users table
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);

-- For weight_logs table
CREATE POLICY "Allow all for weight_logs" ON weight_logs FOR ALL USING (true) WITH CHECK (true);

-- For fasting_periods table
CREATE POLICY "Allow all for fasting_periods" ON fasting_periods FOR ALL USING (true) WITH CHECK (true);

-- For food_logs table
CREATE POLICY "Allow all for food_logs" ON food_logs FOR ALL USING (true) WITH CHECK (true);

-- For daily_summaries table
CREATE POLICY "Allow all for daily_summaries" ON daily_summaries FOR ALL USING (true) WITH CHECK (true);
