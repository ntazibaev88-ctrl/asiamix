-- ============================================================================
-- NOMI Delivery Platform — database schema (PostgreSQL / Supabase)
--
-- Designed to scale to 100k+ orders/day. Run in the Supabase SQL editor, or
-- via the Supabase CLI migrations. Multi-city, multi-store marketplace with
-- four roles: customer, courier, store_admin, super_admin.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---- Enums -----------------------------------------------------------------
do $$ begin
  create type user_role as enum ('customer','courier','store_admin','super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum
    ('pending','accepted','ready','on_the_way','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cash','card','kaspi');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('unpaid','paid','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_type as enum ('delivery','pickup');
exception when duplicate_object then null; end $$;

do $$ begin
  create type courier_status as enum ('online','offline','busy');
exception when duplicate_object then null; end $$;

-- ---- Shared updated_at trigger ---------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---- Geography -------------------------------------------------------------
create table if not exists cities (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  is_active   boolean not null default true
);

-- ---- Profiles (1:1 with auth.users) ----------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'customer',
  full_name   text,
  phone       text unique,
  avatar_url  text,
  city_id     uuid references cities(id),
  is_banned   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists profiles_role_idx on profiles(role);
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ---- Stores ----------------------------------------------------------------
create table if not exists stores (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid references profiles(id) on delete set null,
  name            text not null,
  description     text,
  logo_url        text,
  cover_url       text,
  city_id         uuid references cities(id),
  address         text,
  lat             double precision,
  lng             double precision,
  rating          numeric(2,1) not null default 0,
  commission_rate numeric(5,2) not null default 12.00,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists stores_city_idx on stores(city_id);
create trigger stores_updated before update on stores
  for each row execute function set_updated_at();

-- ---- Categories & products -------------------------------------------------
create table if not exists categories (
  id        uuid primary key default uuid_generate_v4(),
  store_id  uuid references stores(id) on delete cascade,
  slug      text not null,
  name_kk   text not null,
  name_ru   text not null,
  name_en   text not null,
  sort      int not null default 0
);
create index if not exists categories_store_idx on categories(store_id);

create table if not exists products (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid not null references stores(id) on delete cascade,
  category_id   uuid references categories(id) on delete set null,
  name_kk       text not null,
  name_ru       text not null,
  name_en       text not null,
  desc_kk       text,
  desc_ru       text,
  desc_en       text,
  price         integer not null check (price >= 0),
  old_price     integer check (old_price >= 0),
  image_url     text,
  tags          text[] not null default '{}',
  stock         integer,                       -- null = unlimited
  is_available  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists products_store_idx on products(store_id);
create index if not exists products_category_idx on products(category_id);
create trigger products_updated before update on products
  for each row execute function set_updated_at();

-- ---- Couriers --------------------------------------------------------------
create table if not exists couriers (
  profile_id  uuid primary key references profiles(id) on delete cascade,
  status      courier_status not null default 'offline',
  vehicle     text,
  balance     integer not null default 0,
  rating      numeric(2,1) not null default 0,
  city_id     uuid references cities(id),
  last_lat    double precision,
  last_lng    double precision,
  updated_at  timestamptz not null default now()
);
create index if not exists couriers_status_idx on couriers(status);
create trigger couriers_updated before update on couriers
  for each row execute function set_updated_at();

-- ---- Orders ----------------------------------------------------------------
create table if not exists orders (
  id             uuid primary key default uuid_generate_v4(),
  num            bigserial unique,             -- human-friendly order number
  customer_id    uuid references profiles(id) on delete set null,
  store_id       uuid references stores(id) on delete set null,
  courier_id     uuid references profiles(id) on delete set null,
  status         order_status not null default 'pending',
  delivery       delivery_type not null default 'delivery',
  payment        payment_method not null default 'cash',
  payment_state  payment_status not null default 'unpaid',
  customer_name  text,
  customer_phone text,
  address        text,
  lat            double precision,
  lng            double precision,
  subtotal       integer not null default 0,
  delivery_fee   integer not null default 0,
  discount       integer not null default 0,
  total          integer not null default 0,
  items          jsonb not null default '[]',  -- denormalized snapshot
  promo_code     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists orders_customer_idx on orders(customer_id);
create index if not exists orders_store_idx on orders(store_id);
create index if not exists orders_courier_idx on orders(courier_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_idx on orders(created_at desc);
create trigger orders_updated before update on orders
  for each row execute function set_updated_at();

-- Normalized line items (kept alongside the jsonb snapshot for analytics)
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  name        text not null,
  price       integer not null,
  qty         integer not null check (qty > 0)
);
create index if not exists order_items_order_idx on order_items(order_id);

-- Live courier tracking points (for the map view)
create table if not exists deliveries (
  order_id    uuid primary key references orders(id) on delete cascade,
  courier_id  uuid references profiles(id) on delete set null,
  lat         double precision,
  lng         double precision,
  updated_at  timestamptz not null default now()
);

-- Courier payout requests ("шығаруға өтінім")
create table if not exists payouts (
  id          uuid primary key default uuid_generate_v4(),
  courier_id  uuid not null references profiles(id) on delete cascade,
  amount      integer not null check (amount > 0),
  status      text not null default 'pending', -- pending | paid | rejected
  created_at  timestamptz not null default now()
);

-- ---- Engagement: reviews, favorites, promos, loyalty -----------------------
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references orders(id) on delete set null,
  customer_id uuid references profiles(id) on delete set null,
  store_id    uuid references stores(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_store_idx on reviews(store_id);

create table if not exists favorites (
  customer_id uuid references profiles(id) on delete cascade,
  store_id    uuid references stores(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (customer_id, store_id)
);

create table if not exists promo_codes (
  id            uuid primary key default uuid_generate_v4(),
  code          text unique not null,
  discount_pct  int check (discount_pct between 0 and 100),
  discount_flat integer,
  max_uses      int,
  used_count    int not null default 0,
  expires_at    timestamptz,
  is_active     boolean not null default true
);

create table if not exists referrals (
  id           uuid primary key default uuid_generate_v4(),
  referrer_id  uuid references profiles(id) on delete cascade,
  referred_id  uuid references profiles(id) on delete cascade,
  reward       integer not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists loyalty (
  customer_id uuid primary key references profiles(id) on delete cascade,
  points      integer not null default 0,
  cashback    integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---- Support chat ----------------------------------------------------------
create table if not exists support_threads (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid references profiles(id) on delete cascade,
  is_open     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists support_messages (
  id          uuid primary key default uuid_generate_v4(),
  thread_id   uuid not null references support_threads(id) on delete cascade,
  sender_id   uuid references profiles(id) on delete set null,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists support_messages_thread_idx on support_messages(thread_id);

-- ============================================================================
-- Row Level Security (starter policies — extend per your needs)
-- ============================================================================
alter table profiles enable row level security;
alter table orders   enable row level security;
alter table products enable row level security;

-- Helper: current user's role
create or replace function current_role_is(target user_role)
returns boolean language sql stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = target
  );
$$;

-- Profiles: a user reads/updates their own row; super admins read all.
drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles
  for all using (id = auth.uid() or current_role_is('super_admin'));

-- Products: public read; store owners and super admins write.
drop policy if exists products_read on products;
create policy products_read on products for select using (true);

drop policy if exists products_write on products;
create policy products_write on products for all using (
  current_role_is('super_admin')
  or store_id in (select id from stores where owner_id = auth.uid())
);

-- Orders: customers see their own; couriers see assigned; store sees its own;
-- super admins see all.
drop policy if exists orders_access on orders;
create policy orders_access on orders for select using (
  customer_id = auth.uid()
  or courier_id = auth.uid()
  or current_role_is('super_admin')
  or store_id in (select id from stores where owner_id = auth.uid())
);

-- Customers can create their own orders.
drop policy if exists orders_insert on orders;
create policy orders_insert on orders for insert
  with check (customer_id = auth.uid() or customer_id is null);
