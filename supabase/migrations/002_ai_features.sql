-- AI features additions
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS image_hash TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS ai_verdict TEXT; -- approved/rejected/uncertain
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS ai_notes TEXT;

-- Blacklist table
CREATE TABLE IF NOT EXISTS public.blacklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT,
  reason TEXT NOT NULL,
  added_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage blacklist" ON public.blacklist
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Update profiles role to allow blocked
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'admin', 'blocked'));
