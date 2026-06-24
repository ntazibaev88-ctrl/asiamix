-- Site settings key-value store for admin-editable content
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow authenticated users to read settings (needed by dashboard server component)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify site_settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Default values
INSERT INTO site_settings (key, value) VALUES
  ('dashboard_subtitle',    'Бүгін де алға қарай жыл!'),
  ('announcement',          ''),
  ('announcement_color',    'blue'),
  ('challenge_title',       'Апта челленджі'),
  ('challenge_desc',        '7 күн бойы күнделігіңе жаз. Ойлаған нәрсені жазу — ой тазарту мен мотивацияның ең жақсы жолы.'),
  ('challenge_progress',    '40')
ON CONFLICT (key) DO NOTHING;
