-- =============================================
-- QADAM Platform - Initial Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'vip')),
  vip_expires_at TIMESTAMPTZ,
  referral_code TEXT UNIQUE NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer_id UUID;
BEGIN
  ref_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  -- Check referral
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    SELECT id INTO referrer_id
    FROM public.profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    ref_code,
    referrer_id
  );

  -- Give referrer 7 bonus days if valid
  IF referrer_id IS NOT NULL THEN
    UPDATE public.profiles
    SET vip_expires_at = COALESCE(vip_expires_at, NOW()) + INTERVAL '7 days',
        plan = CASE WHEN plan = 'free' THEN 'vip' ELSE plan END
    WHERE id = referrer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- GOALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (
    category IN ('house', 'car', 'business', 'education', 'travel', 'family', 'health', 'other')
  ),
  target_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  milestones JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all goals" ON public.goals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- SAVINGS PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.savings_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  monthly_target NUMERIC(15, 2) NOT NULL DEFAULT 0,
  interest_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.savings_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own savings" ON public.savings_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_savings_updated_at
  BEFORE UPDATE ON public.savings_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- JOURNAL ENTRIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'bad', 'terrible')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- STRICT: Only owner can access journal entries
CREATE POLICY "Users can CRUD own journal entries" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_journal_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_url TEXT,
  category TEXT NOT NULL DEFAULT 'investing' CHECK (
    category IN ('investing', 'bonds', 'gold', 'silver', 'savings', 'business', 'personal_finance')
  ),
  author_id UUID REFERENCES public.profiles(id),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Published articles visible to all authenticated users
CREATE POLICY "Anyone can read published articles" ON public.articles
  FOR SELECT USING (published = TRUE);

-- Admins can do everything
CREATE POLICY "Admins can manage articles" ON public.articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- BOOKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT NOT NULL DEFAULT 'money' CHECK (
    category IN ('money', 'business', 'self_development', 'investing')
  ),
  rating NUMERIC(3, 1),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  buy_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read books" ON public.books
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage books" ON public.books
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- MOVIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  director TEXT,
  description TEXT,
  poster_url TEXT,
  category TEXT NOT NULL DEFAULT 'money' CHECK (
    category IN ('money', 'business', 'success', 'investing', 'documentary')
  ),
  year INTEGER,
  rating NUMERIC(4, 1),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  watch_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read movies" ON public.movies
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage movies" ON public.movies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 990,
  months INTEGER NOT NULL DEFAULT 1,
  bonus_months INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_url TEXT,
  kaspi_number TEXT,
  notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  FALSE,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Users can upload own payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view payment proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- =============================================
-- SAMPLE DATA (Books & Movies)
-- =============================================
INSERT INTO public.books (title, author, description, category, rating, is_premium) VALUES
  ('Ойша ойлан, бай бол', 'Napoleon Hill', 'Табыстың 13 принципі туралы классикалық кітап', 'money', 4.7, FALSE),
  ('Ақшаңды жұмысқа жібер', 'Robert Kiyosaki', 'Байлық туралы ақиқат және қаржылық еркіндік', 'investing', 4.5, FALSE),
  ('Бизнес нуль деңгейден', 'Michael Gerber', 'Бизнес иесі немесе жұмыскер — айырмашылық қандай?', 'business', 4.3, FALSE),
  ('Күн тәртібі', 'Robin Sharma', 'Таңғы 5-те оянып, өміріңізді өзгертіңіз', 'self_development', 4.6, FALSE),
  ('Кішкентай кітап — үлкен пайда', 'Benjamin Graham', 'Ақылды инвестор болу жолдары', 'investing', 4.8, TRUE),
  ('Сіздің ақшаңыз немесе өміріңіз', 'Vicki Robin', 'Қаржылық еркіндікке жету стратегиялары', 'money', 4.4, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO public.movies (title, director, description, category, year, rating, is_premium) VALUES
  ('Уолл Стриттің Бөрісі', 'Martin Scorsese', 'Уолл Стриттегі алаяқтар туралы керемет фильм', 'money', 2013, 8.2, FALSE),
  ('Табыстың 100 қадамы', 'Alejandro González', 'Кедей отбасыдан миллионерге дейін', 'success', 2016, 7.8, FALSE),
  ('Социалды желі', 'David Fincher', 'Facebook негізін қалаушы туралы', 'business', 2010, 7.7, FALSE),
  ('Үлкен қысқа мерзімді', 'Adam McKay', '2008 жылғы қаржы дағдарысы туралы', 'investing', 2015, 7.8, FALSE),
  ('Пирамида: Алтын шыңға', NULL, 'Алтынға инвестиция туралы документалды', 'investing', 2019, 7.2, TRUE),
  ('Биткоин: Желі', NULL, 'Криптовалюта мен блокчейн туралы', 'investing', 2022, 7.5, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO public.articles (title, slug, content, excerpt, category, published) VALUES
  (
    'Инвестицияны қайдан бастау керек?',
    'investiciyany-kaydan-bastau-kerek',
    '## Инвестицияны бастау\n\nИнвестиция — бұл болашақ байлыққа жасалатын қадам. Бастаушылар үшін бірнеше қарапайым қадам бар:\n\n### 1. Қаржылық жастықшаны жасаңыз\n\nИнвестиция бастамас бұрын 3-6 айлық шығындарға жететін жастықша қоры болуы керек.\n\n### 2. Мақсат қойыңыз\n\nҚысқа мерзімді (1-3 жыл) және ұзақ мерзімді (3+ жыл) мақсаттарыңызды анықтаңыз.\n\n### 3. Тәуекелді бағалаңыз\n\nҚанша тәуекелге дайынсыз? Бұл сіздің инвестиция стратегияңызды анықтайды.\n\n### 4. Алғашқы инвестиция\n\nКасынды немесе Halyk банкі арқылы облигациялар немесе ETF-тен бастаңыз.',
    'Бастаушыларға арналған инвестиция нұсқаулығы',
    'investing',
    TRUE
  ),
  (
    'Алтынға инвестиция: Қазақстандықтарға арналған нұсқаулық',
    'altynna-investiciya-kazakhstandardar',
    '## Неге алтын?\n\nАлтын — инфляциядан қорғаудың классикалық құралы. Қазақстанда алтынға инвестиция жасаудың бірнеше жолы бар:\n\n### 1. Ұлттық Банктен алтын монеталар\n\nҚазақстан Ұлттық Банкі алтын монеталар шығарады — бұл ең қауіпсіз инвестиция.\n\n### 2. ETF арқылы алтын\n\nАлтын ETF-тері арқылы физикалық алтын сатып алмай-ақ алтынға инвестиция жасауға болады.\n\n### 3. Банктегі алтын шоттар\n\nКейбір банктер алтын шоттар ұсынады.',
    'Алтынға инвестиция жасаудың жолдары',
    'gold',
    TRUE
  ),
  (
    'Ай сайын ₸50,000 жинасаңыз не болады?',
    'ay-sayyn-50000-jinasanyz',
    '## Аз жинақтың үлкен нәтижесі\n\nАй сайын ₸50,000 жинасаңыз және банкке 10% жылдық пайызбен қойсаңыз:\n\n- 1 жылда: ~₸628,000\n- 3 жылда: ~₺2,170,000\n- 5 жылда: ~₺3,880,000\n- 10 жылда: ~₺9,750,000\n\n### Күрделі пайыздың күші\n\nАй сайынғы аз жинақ ұзақ мерзімде үлкен байлыққа айналады. Басты принцип — жүйелілік.',
    'Аз жинақтың ұзақ мерзімдегі нәтижесі',
    'savings',
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON public.savings_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON public.journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
