-- Create extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CHARITIES TABLE
CREATE TABLE IF NOT EXISTS charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROFILES TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'subscriber',
    subscription_status TEXT DEFAULT 'inactive',
    stripe_customer_id TEXT,
    chosen_charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
    charity_percentage NUMERIC DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Just in case it existed previously without full_name
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- SCORES TABLE
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS scores_user_id_idx ON scores(user_id);

-- trigger to keep only latest 5 scores per user
CREATE OR REPLACE FUNCTION keep_latest_five_scores()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM scores
    WHERE user_id = NEW.user_id
    AND id NOT IN (
        SELECT id FROM scores
        WHERE user_id = NEW.user_id
        ORDER BY date DESC, created_at DESC
        LIMIT 5
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_keep_latest_five_scores ON scores;
CREATE TRIGGER trg_keep_latest_five_scores
AFTER INSERT ON scores
FOR EACH ROW
EXECUTE FUNCTION keep_latest_five_scores();

-- DRAWS TABLE
CREATE TABLE IF NOT EXISTS draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    winning_numbers INTEGER[] CHECK (array_length(winning_numbers, 1) = 5 OR winning_numbers IS NULL),
    total_pool NUMERIC DEFAULT 0,
    pool_5_match NUMERIC DEFAULT 0,
    pool_4_match NUMERIC DEFAULT 0,
    pool_3_match NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    drawn_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WINNINGS TABLE
CREATE TABLE IF NOT EXISTS winnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    match_type INTEGER NOT NULL CHECK (match_type IN (3, 4, 5)),
    amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    verification_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winnings ENABLE ROW LEVEL SECURITY;

-- Charities RLS
DROP POLICY IF EXISTS "Charities are viewable by everyone" ON charities;
CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);

-- Profiles RLS
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Scores RLS
DROP POLICY IF EXISTS "Users can view own scores" ON scores;
DROP POLICY IF EXISTS "Users can insert own scores" ON scores;
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Draws RLS
DROP POLICY IF EXISTS "Everyone can view published draws" ON draws;
CREATE POLICY "Everyone can view published draws" ON draws FOR SELECT USING (status = 'published');

-- Winnings RLS
DROP POLICY IF EXISTS "Users can view own winnings" ON winnings;
DROP POLICY IF EXISTS "Users can update own winnings (for verification images)" ON winnings;
CREATE POLICY "Users can view own winnings" ON winnings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own winnings (for verification images)" ON winnings FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to securely create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    'subscriber'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
