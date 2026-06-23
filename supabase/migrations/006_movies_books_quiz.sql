-- =============================================
-- Migration 006: Movies, Books new columns + Quiz table
-- Run this in Supabase SQL Editor
-- =============================================

-- Movies: new columns
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS trailer_url TEXT;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 0;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;

-- Books: new columns
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS epub_url TEXT;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS pages INTEGER;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 0;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;

-- Financial Quizzes table
CREATE TABLE IF NOT EXISTS public.financial_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INT NOT NULL DEFAULT 0,
  explanation TEXT DEFAULT '',
  xp INT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.financial_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can read active quizzes" ON public.financial_quizzes
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY IF NOT EXISTS "Admin full access" ON public.financial_quizzes
  FOR ALL USING (TRUE) WITH CHECK (TRUE);
