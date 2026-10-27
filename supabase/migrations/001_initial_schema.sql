-- ============================================================
-- Migration: 001_initial_schema
-- Description: Core tables for Intelligent Expense Tracker
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Profiles ───────────────────────────────────────────────
-- Extends Supabase Auth users with app-specific profile data
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT,
  currency        TEXT NOT NULL DEFAULT 'INR'
                    CHECK (currency IN ('INR','USD','EUR','GBP','AED')),
  monthly_budget  DECIMAL(12,2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ─── Categories ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- ─── Expenses ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount        DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description   TEXT NOT NULL,
  date          DATE NOT NULL,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  receipt_url   TEXT,
  ai_tagged     BOOLEAN NOT NULL DEFAULT false,
  voice_logged  BOOLEAN NOT NULL DEFAULT false,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Performance indexes
CREATE INDEX idx_expenses_user_date     ON expenses(user_id, date DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_expenses_user_month    ON expenses(user_id, date_trunc('month', date));

-- ─── Budgets ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budgets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount        DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  period        TEXT NOT NULL CHECK (period IN ('weekly','monthly','yearly')),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  CHECK (end_date >= start_date)
);

-- ─── AI Insight Cache ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insight_cache (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_key  TEXT NOT NULL,  -- e.g. "2026-10-monthly"
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_key)
);

-- ─── Row Level Security (RLS) ─────────────────────────────────
-- Users can ONLY see their own data — enforced at the DB level

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_cache ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Categories
CREATE POLICY "users_own_categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- Expenses
CREATE POLICY "users_own_expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);

-- Budgets
CREATE POLICY "users_own_budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id);

-- Insight cache
CREATE POLICY "users_own_insights" ON insight_cache
  FOR ALL USING (auth.uid() = user_id);
