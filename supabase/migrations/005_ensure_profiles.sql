-- Update handle_new_user trigger to be idempotent (ON CONFLICT DO NOTHING)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer_id UUID;
BEGIN
  ref_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    SELECT id INTO referrer_id
    FROM public.profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'full_name',
    ref_code,
    referrer_id
  )
  ON CONFLICT (id) DO NOTHING;

  IF referrer_id IS NOT NULL THEN
    UPDATE public.profiles
    SET vip_expires_at = COALESCE(vip_expires_at, NOW()) + INTERVAL '7 days',
        plan = CASE WHEN plan = 'free' THEN 'vip' ELSE plan END
    WHERE id = referrer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profiles for any existing auth.users who are missing one
INSERT INTO public.profiles (id, email, referral_code)
SELECT
  u.id,
  COALESCE(u.email, ''),
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
