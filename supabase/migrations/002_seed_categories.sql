-- ============================================================
-- Migration: 002_seed_default_categories
-- Description: Seed default categories for new users via a
--              stored procedure called after profile creation
-- ============================================================

-- Function to seed default categories for a new user
CREATE OR REPLACE FUNCTION seed_default_categories(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color, is_default) VALUES
    (p_user_id, 'Food & Dining',      '🍔', '#FF6B6B', true),
    (p_user_id, 'Groceries',          '🛒', '#4ECDC4', true),
    (p_user_id, 'Transport',          '🚗', '#45B7D1', true),
    (p_user_id, 'Shopping',           '🛍️',  '#96CEB4', true),
    (p_user_id, 'Bills & Utilities',  '💡', '#FFEAA7', true),
    (p_user_id, 'Rent',               '🏠', '#DDA0DD', true),
    (p_user_id, 'Health',             '💊', '#98D8C8', true),
    (p_user_id, 'Entertainment',      '🎬', '#F7DC6F', true),
    (p_user_id, 'Education',          '📚', '#82E0AA', true),
    (p_user_id, 'Travel',             '✈️',  '#AED6F1', true),
    (p_user_id, 'Personal Care',      '💅', '#F1948A', true),
    (p_user_id, 'Other',              '📦', '#BDC3C7', true)
  ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user trigger to also seed categories
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');

  PERFORM seed_default_categories(new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
