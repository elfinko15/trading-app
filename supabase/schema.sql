-- ============================================================
--  TradeMaster Pro · Supabase Database Schema
--  Paste this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Profiles table (extends auth.users) ─────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username        TEXT        UNIQUE NOT NULL
                              CHECK (length(username) >= 3 AND length(username) <= 20),
  avatar          TEXT        DEFAULT '🧑‍💼',
  level           INT         DEFAULT 1,
  xp              INT         DEFAULT 0,
  total_trades    INT         DEFAULT 0,
  win_rate        FLOAT       DEFAULT 0,
  streak_days     INT         DEFAULT 0,
  portfolio_value FLOAT       DEFAULT 10000,
  total_pnl       FLOAT       DEFAULT 0,
  total_pnl_pct   FLOAT       DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Friendships table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.friendships (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id  UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  addressee_id  UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status        TEXT        DEFAULT 'pending'
                            CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read (for leaderboard & friend search)
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (true);

-- Profiles: only owner can update
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Friendships: users can see their own
CREATE POLICY "Users can see own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Friendships: users can send requests (as requester)
CREATE POLICY "Users can send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Friendships: users can update friendships they're part of
CREATE POLICY "Users can respond to requests"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Friendships: users can delete their own friendships
CREATE POLICY "Users can remove friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- ── Trigger: auto-create profile on registration ─────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Trader_' || substr(NEW.id::text, 1, 6))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Index for performance ────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_portfolio_value ON public.profiles(portfolio_value DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username        ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_friendships_requester    ON public.friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee    ON public.friendships(addressee_id);
