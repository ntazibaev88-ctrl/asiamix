-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query

-- Movies: add new columns
ALTER TABLE public.movies 
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS trailer_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS duration INTEGER,
  ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

-- Books: add new columns
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS epub_url TEXT,
  ADD COLUMN IF NOT EXISTS pages INTEGER,
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 30;

-- Watch history (continue watching)
CREATE TABLE IF NOT EXISTS public.user_watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);
ALTER TABLE public.user_watch_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users watch history" ON public.user_watch_history;
CREATE POLICY "Users watch history" ON public.user_watch_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users favorites" ON public.user_favorites;
CREATE POLICY "Users favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reading progress
CREATE TABLE IF NOT EXISTS public.user_reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 1,
  total_pages INTEGER,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users reading progress" ON public.user_reading_progress;
CREATE POLICY "Users reading progress" ON public.user_reading_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
