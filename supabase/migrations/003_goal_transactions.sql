-- Phone field for profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Goal transactions table
CREATE TABLE IF NOT EXISTS public.goal_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.goal_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own goal transactions" ON public.goal_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.goals WHERE id = goal_id AND user_id = auth.uid())
  );
