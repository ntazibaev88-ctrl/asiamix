-- CodeOrda Database Schema
-- Kazakh IT Education Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Courses table
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text not null,
  price integer not null default 0,
  lesson_count integer not null default 0,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lessons table
create table if not exists lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- Payments table
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  amount integer not null,
  screenshot_url text,
  note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enrollments table
create table if not exists enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, course_id)
);

-- Lesson progress table
create table if not exists lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

-- Certificates table
create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  issued_at timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

drop trigger if exists courses_updated_at on courses;
create trigger courses_updated_at
  before update on courses
  for each row execute function handle_updated_at();

drop trigger if exists payments_updated_at on payments;
create trigger payments_updated_at
  before update on payments
  for each row execute function handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table payments enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table certificates enable row level security;

-- PROFILES policies
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_admin_select" on profiles;
create policy "profiles_admin_select"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- COURSES policies (public read)
drop policy if exists "courses_public_select" on courses;
create policy "courses_public_select"
  on courses for select
  using (true);

drop policy if exists "courses_admin_all" on courses;
create policy "courses_admin_all"
  on courses for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- LESSONS policies (public read)
drop policy if exists "lessons_public_select" on lessons;
create policy "lessons_public_select"
  on lessons for select
  using (true);

drop policy if exists "lessons_admin_all" on lessons;
create policy "lessons_admin_all"
  on lessons for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- PAYMENTS policies
drop policy if exists "payments_select_own" on payments;
create policy "payments_select_own"
  on payments for select
  using (auth.uid() = user_id);

drop policy if exists "payments_insert_own" on payments;
create policy "payments_insert_own"
  on payments for insert
  with check (auth.uid() = user_id);

drop policy if exists "payments_admin_all" on payments;
create policy "payments_admin_all"
  on payments for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ENROLLMENTS policies
drop policy if exists "enrollments_select_own" on enrollments;
create policy "enrollments_select_own"
  on enrollments for select
  using (auth.uid() = user_id);

drop policy if exists "enrollments_insert_own" on enrollments;
create policy "enrollments_insert_own"
  on enrollments for insert
  with check (auth.uid() = user_id);

drop policy if exists "enrollments_admin_all" on enrollments;
create policy "enrollments_admin_all"
  on enrollments for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- LESSON_PROGRESS policies
drop policy if exists "lesson_progress_select_own" on lesson_progress;
create policy "lesson_progress_select_own"
  on lesson_progress for select
  using (auth.uid() = user_id);

drop policy if exists "lesson_progress_insert_own" on lesson_progress;
create policy "lesson_progress_insert_own"
  on lesson_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_update_own" on lesson_progress;
create policy "lesson_progress_update_own"
  on lesson_progress for update
  using (auth.uid() = user_id);

-- CERTIFICATES policies
drop policy if exists "certificates_select_own" on certificates;
create policy "certificates_select_own"
  on certificates for select
  using (auth.uid() = user_id);

drop policy if exists "certificates_admin_all" on certificates;
create policy "certificates_admin_all"
  on certificates for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- SEED DATA FUNCTION
-- ============================================================

create or replace function seed_codeorda_data()
returns void as $$
declare
  html_id uuid := uuid_generate_v4();
  css_id uuid := uuid_generate_v4();
  js_id uuid := uuid_generate_v4();
begin
  -- Insert courses (use fixed IDs so we can reference them for lessons)
  insert into courses (id, slug, title, description, price, lesson_count, is_published)
  values
    (html_id, 'html', 'HTML Fundamentals', 'Веб-беттердің негізін үйреніңіз. Тегтер, атрибуттар, семантикалық HTML, формалар және кестелер. Нақты жобалар арқылы практика.', 4990, 15, true),
    (css_id, 'css', 'CSS Fundamentals', 'Веб-беттерді стильдеу. Flexbox, Grid, анимациялар, responsive дизайн және CSS айнымалылары. Заманауи CSS тәсілдері.', 4990, 15, true),
    (js_id, 'javascript', 'JavaScript Fundamentals', 'Бағдарламалаудың негіздерін үйреніңіз. DOM манипуляциясы, Events, Fetch API, Async/Await, ES6+ синтаксис.', 7990, 15, true)
  on conflict (slug) do nothing;

  -- Get actual IDs in case they already existed
  select id into html_id from courses where slug = 'html';
  select id into css_id from courses where slug = 'css';
  select id into js_id from courses where slug = 'javascript';

  -- HTML Lessons
  insert into lessons (course_id, title, description, order_index) values
    (html_id, '1-сабақ: HTML дегеніміз не?', 'HTML негіздері, тарихы және браузерде қалай жұмыс істейді', 1),
    (html_id, '2-сабақ: Негізгі HTML тегтер', 'html, head, body, div, span, p, h1-h6 тегтерін үйрену', 2),
    (html_id, '3-сабақ: Мәтін форматтау', 'strong, em, br, hr, pre, code тегтері', 3),
    (html_id, '4-сабақ: Сілтемелер', 'a тегі, href атрибуты, ішкі және сыртқы сілтемелер', 4),
    (html_id, '5-сабақ: Суреттер', 'img тегі, src, alt, width, height атрибуттары', 5),
    (html_id, '6-сабақ: Тізімдер', 'ul, ol, li, dl, dt, dd тегтері', 6),
    (html_id, '7-сабақ: Кестелер', 'table, tr, td, th, thead, tbody, tfoot тегтері', 7),
    (html_id, '8-сабақ: Формалар', 'form, input, button, label, textarea, select тегтері', 8),
    (html_id, '9-сабақ: Input типтері', 'text, email, password, number, date, checkbox, radio', 9),
    (html_id, '10-сабақ: Семантикалық HTML5', 'header, nav, main, footer, article, section, aside', 10),
    (html_id, '11-сабақ: Meta тегтер', 'charset, viewport, description, keywords, og теги', 11),
    (html_id, '12-сабақ: Медиа элементтер', 'video, audio, iframe, canvas тегтері', 12),
    (html_id, '13-сабақ: HTML атрибуттары', 'id, class, style, data-*, aria атрибуттары', 13),
    (html_id, '14-сабақ: Жоба: Портфолио беті', 'Меңгерген білімді пайдаланып портфолио сайт жасау', 14),
    (html_id, '15-сабақ: HTML лучшие практики', 'Код сапасы, accessibility, SEO бойынша кеңестер', 15)
  on conflict do nothing;

  -- CSS Lessons
  insert into lessons (course_id, title, description, order_index) values
    (css_id, '1-сабақ: CSS дегеніміз не?', 'CSS негіздері, браузерде қалай жұмыс істейді', 1),
    (css_id, '2-сабақ: CSS қосу тәсілдері', 'Inline, internal, external CSS', 2),
    (css_id, '3-сабақ: Селекторлар', 'Element, class, id, attribute, pseudo-class селекторлары', 3),
    (css_id, '4-сабақ: Каскадтылық пен специфтілік', 'CSS қасиеттерінің басымдық тәртібі', 4),
    (css_id, '5-сабақ: Бокс моделі', 'margin, padding, border, width, height', 5),
    (css_id, '6-сабақ: Мәтін стильдеу', 'font-family, size, weight, color, line-height, letter-spacing', 6),
    (css_id, '7-сабақ: Түстер мен фондар', 'color, background, gradient, opacity', 7),
    (css_id, '8-сабақ: Display және Позиционирование', 'block, inline, flex, grid, position', 8),
    (css_id, '9-сабақ: Flexbox', 'flex-container, flex-items, justify-content, align-items', 9),
    (css_id, '10-сабақ: CSS Grid', 'grid-template, grid-area, gap, fr unit', 10),
    (css_id, '11-сабақ: Responsive дизайн', 'Media queries, mobile-first, viewport', 11),
    (css_id, '12-сабақ: CSS айнымалылары', 'Custom properties, :root, var() функциясы', 12),
    (css_id, '13-сабақ: Анимациялар', 'transition, animation, keyframes, transform', 13),
    (css_id, '14-сабақ: Жоба: Лендинг беті', 'CSS арқылы заманауи лендинг сайт жасау', 14),
    (css_id, '15-сабақ: CSS лучшие практики', 'BEM методологиясы, код организациясы', 15)
  on conflict do nothing;

  -- JavaScript Lessons
  insert into lessons (course_id, title, description, order_index) values
    (js_id, '1-сабақ: JavaScript дегеніміз не?', 'JS тарихы, браузерде қалай жұмыс істейді, console.log', 1),
    (js_id, '2-сабақ: Айнымалылар', 'var, let, const, деректер типтері', 2),
    (js_id, '3-сабақ: Операторлар', 'Арифметикалық, салыстыру, логикалық операторлар', 3),
    (js_id, '4-сабақ: Шартты операторлар', 'if/else, switch/case, тернарлық оператор', 4),
    (js_id, '5-сабақ: Циклдар', 'for, while, do-while, for...of, for...in', 5),
    (js_id, '6-сабақ: Функциялар', 'function declaration, expression, arrow functions', 6),
    (js_id, '7-сабақ: Массивтер', 'Array, push, pop, map, filter, reduce, find', 7),
    (js_id, '8-сабақ: Объектілер', 'Object, properties, methods, destructuring', 8),
    (js_id, '9-сабақ: DOM манипуляция', 'getElementById, querySelector, innerHTML, classList', 9),
    (js_id, '10-сабақ: Events', 'addEventListener, click, input, submit, preventDefault', 10),
    (js_id, '11-сабақ: Fetch API', 'fetch(), JSON, REST API-мен жұмыс', 11),
    (js_id, '12-сабақ: Async/Await', 'Promise, async, await, try/catch', 12),
    (js_id, '13-сабақ: ES6+ синтаксис', 'Spread, rest, template literals, modules', 13),
    (js_id, '14-сабақ: Жоба: Todo App', 'Толық функционалды todo қосымша жасау', 14),
    (js_id, '15-сабақ: JavaScript лучшие практики', 'Таза код, debugging, performance', 15)
  on conflict do nothing;
end;
$$ language plpgsql;

-- Run seed data
select seed_codeorda_data();

-- ============================================================
-- CodeOrda V2 Schema additions
-- ============================================================

-- Quiz questions (5 per quiz, one quiz per 3 lessons)
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  lesson_index integer not null, -- quiz appears after lesson 3,6,9,12,15
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check(correct_option in ('a','b','c','d')),
  order_index integer not null default 0
);

-- Quiz results per user
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  lesson_index integer not null,
  score integer not null default 0,
  total integer not null default 5,
  created_at timestamptz default now()
);

-- Achievements definition
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  icon text not null,
  points integer not null default 50
);

-- User earned achievements
create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  achievement_id uuid references achievements(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

-- User points (leaderboard)
create table if not exists user_points (
  user_id uuid primary key references profiles(id) on delete cascade,
  total_points integer not null default 0,
  updated_at timestamptz default now()
);

-- Lesson comments
create table if not exists lesson_comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
alter table lesson_comments enable row level security;
create policy lc_read on lesson_comments for select using (true);
create policy lc_insert on lesson_comments for insert with check (user_id = auth.uid());
create policy lc_delete on lesson_comments for delete using (user_id = auth.uid());

-- Favorites
create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(user_id, lesson_id)
);
alter table favorites enable row level security;
create policy fav_all on favorites for all using (user_id = auth.uid());

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
create policy notif_own on notifications for all using (user_id = auth.uid());

-- Profile extras (add columns if not exists)
alter table profiles add column if not exists telegram text;
alter table profiles add column if not exists specialty text;
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists points integer default 0;
alter table profiles add column if not exists theme text default 'dark';

-- Seed achievements
insert into achievements(slug,title,description,icon,points) values
('first_lesson','Алғашқы қадам','Бірінші сабақты аяқтадыңыз!','🏅',50),
('html_complete','HTML шебері','HTML курсын толық аяқтадыңыз!','🥇',200),
('css_complete','CSS шебері','CSS курсын толық аяқтадыңыз!','🥈',200),
('js_complete','JS шебері','JavaScript курсын толық аяқтадыңыз!','🥉',300),
('all_complete','CodeOrda Чемпионы','Барлық курстарды аяқтадыңыз!','🏆',500),
('quiz_ace','Тест жеңімпазы','Тестте 5/5 нәтиже көрсеттіңіз!','⭐',100),
('streak_7','7 күн қатарынан','7 күн қатарынан оқыдыңыз!','🔥',150)
on conflict(slug) do nothing;
