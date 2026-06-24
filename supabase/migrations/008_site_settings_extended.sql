-- Additional site settings for admin control
INSERT INTO site_settings (key, value) VALUES
  ('kaspi_phone',          '+7 771 412 15 73'),
  ('kaspi_card',           '4400 4303 3787 7838'),
  ('kaspi_recipient',      'Fariza T'),
  ('show_tips_block',      'true'),
  ('show_challenge_block', 'true'),
  ('show_news_block',      'true'),
  ('show_articles_block',  'true'),
  ('ai_auto_suggestions',  'true'),
  ('daily_tips', '[
    {"tip":"Кірісіңіздің 20%-ін жинаққа салыңыз. 50/30/20 ережесі: 50% қажеттілік, 30% тілек, 20% жинақ.","emoji":"💡"},
    {"tip":"Депозит ашу — ақшаңызды жұмысқа жіберудің ең қауіпсіз жолы. Қазақстанда жылдық 14–16% пайыз бар.","emoji":"🏦"},
    {"tip":"Шығындарыңызды жазып отырыңыз. Не жұмсайтыныңызды білмей, жинауға болмайды.","emoji":"📊"},
    {"tip":"Кредит картасының қарызын толығымен өтеңіз. Айлық пайыз жылдық 30–40%-ке жетуі мүмкін.","emoji":"💳"},
    {"tip":"Алтынға инвестиция — инфляциядан қорғаудың классикалық әдісі. Ұлттық Банктен монета сатып алуға болады.","emoji":"🥇"},
    {"tip":"Апта сайын кем дегенде 1 қаржы мақаласын оқыңыз. Білім — ең жақсы инвестиция.","emoji":"📚"},
    {"tip":"Қаржылық жастықша жасаңыз: 3–6 айлық шығындарыңызды депозитке салыңыз.","emoji":"🛡️"}
  ]'),
  ('goal_categories', '[
    {"key":"house","label":"Үй","icon":"🏠"},
    {"key":"car","label":"Көлік","icon":"🚗"},
    {"key":"business","label":"Бизнес","icon":"💼"},
    {"key":"education","label":"Білім","icon":"🎓"},
    {"key":"travel","label":"Саяхат","icon":"✈️"},
    {"key":"family","label":"Отбасы","icon":"👨‍👩‍👧"},
    {"key":"health","label":"Денсаулық","icon":"💪"},
    {"key":"other","label":"Басқа","icon":"🎯"}
  ]')
ON CONFLICT (key) DO NOTHING;
