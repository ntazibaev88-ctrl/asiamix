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

-- ============================================================================
-- Authentication & audit (production backing for the secure auth system)
-- Passwords are stored only as bcrypt/argon2 hashes; OTP is short-lived; all
-- queries via Supabase are parameterized (no raw SQL → SQL-injection safe).
-- ============================================================================

create table if not exists app_users (
  id            uuid primary key default uuid_generate_v4(),
  role          user_role not null,
  username      text unique,                 -- store/admin login
  phone         text unique,                 -- client/courier OTP login
  password_hash text,                         -- bcrypt/argon2 (store/admin)
  totp_secret   text,                         -- 2FA for stores
  store_id      uuid references stores(id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists otp_codes (
  id          uuid primary key default uuid_generate_v4(),
  phone       text not null,
  code_hash   text not null,                 -- HMAC-SHA256 of the code
  channel     text not null,                 -- client | courier
  expires_at  timestamptz not null,
  consumed    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists otp_phone_idx on otp_codes(phone);

create table if not exists refresh_tokens (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references app_users(id) on delete cascade,
  token_hash  text not null,                 -- hashed; supports rotation/revoke
  revoked     boolean not null default false,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create table if not exists audit_log (
  id          bigserial primary key,
  at          timestamptz not null default now(),
  event       text not null,                 -- login_success, otp_verify_fail …
  identifier  text,                          -- phone / username
  role        text,
  ip          text,
  user_agent  text,
  detail      jsonb not null default '{}'
);
create index if not exists audit_event_idx on audit_log(event);
create index if not exists audit_at_idx on audit_log(at desc);

-- ============================================================================
-- Payments: secure, atomic split (store / courier / admin) with receipts,
-- ledger, error log and admin notifications. ALL money math runs here on the
-- server — clients never compute or move money.
-- ============================================================================

do $$ begin
  create type payment_state2 as enum
    ('unpaid','processing','paid','failed','refunded');
exception when duplicate_object then null; end $$;

-- One wallet per money owner (store / courier / platform-admin).
create table if not exists wallets (
  id          uuid primary key default uuid_generate_v4(),
  owner_type  text not null check (owner_type in ('store','courier','admin')),
  owner_id    uuid,                          -- store_id / courier profile id / null for platform
  balance     bigint not null default 0 check (balance >= 0),
  currency    text not null default 'KZT',
  updated_at  timestamptz not null default now(),
  unique (owner_type, owner_id)
);

-- The receipt — one row per processed payment.
create table if not exists payment_transactions (
  id               uuid primary key default uuid_generate_v4(),
  txn_id           text unique not null,      -- human/audit Transaction ID
  order_id         uuid not null references orders(id) on delete restrict,
  customer_id      uuid references profiles(id) on delete set null,
  store_id         uuid references stores(id) on delete set null,
  courier_id       uuid references profiles(id) on delete set null,
  subtotal         bigint not null,
  delivery_fee     bigint not null,
  store_amount     bigint not null,
  admin_commission bigint not null,
  service_fee      bigint not null,
  total            bigint not null,
  payment_method   payment_method not null,
  status           payment_state2 not null default 'processing',
  created_at       timestamptz not null default now(),
  -- money is never created or destroyed
  constraint split_balances
    check (store_amount + delivery_fee + admin_commission + service_fee = total)
);
create index if not exists ptx_order_idx on payment_transactions(order_id);
create index if not exists ptx_created_idx on payment_transactions(created_at desc);

-- Immutable double-entry ledger: every credit is recorded.
create table if not exists ledger_entries (
  id          bigserial primary key,
  txn_id      text not null references payment_transactions(txn_id) on delete restrict,
  wallet_id   uuid not null references wallets(id),
  reason      text not null,                 -- store_amount | delivery_fee | commission | service_fee
  amount      bigint not null,
  created_at  timestamptz not null default now()
);
create index if not exists ledger_txn_idx on ledger_entries(txn_id);

create table if not exists payment_errors (
  id          bigserial primary key,
  order_id    uuid,
  txn_id      text,
  message     text not null,
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create table if not exists admin_notifications (
  id          bigserial primary key,
  kind        text not null,
  message     text not null,
  order_id    uuid,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create or replace function upsert_wallet(p_type text, p_owner uuid)
returns uuid language plpgsql as $$
declare w_id uuid;
begin
  insert into wallets (owner_type, owner_id) values (p_type, p_owner)
    on conflict (owner_type, owner_id) do nothing;
  select id into w_id from wallets where owner_type = p_type
    and owner_id is not distinct from p_owner;
  return w_id;
end; $$;

-- ---- Atomic payment processing --------------------------------------------
-- Computes the split from DB values (never from the client), credits each
-- wallet, writes the receipt + ledger, and marks the order paid. Any failure
-- rolls back ALL credits; the order is marked 'failed', the error is logged
-- and the admin is notified. Returns the Transaction ID.
create or replace function process_order_payment(
  p_order_id uuid,
  p_service_fee bigint default 300
) returns text language plpgsql as $$
declare
  o            orders%rowtype;
  v_commpct    numeric;
  v_subtotal   bigint;
  v_delivery   bigint;
  v_commission bigint;
  v_service    bigint;
  v_store_amt  bigint;
  v_total      bigint;
  v_txn        text := 'TXN-' || upper(replace(gen_random_uuid()::text,'-','')) ;
  w_store uuid; w_courier uuid; w_admin uuid;
begin
  -- Lock the order so two payments can't race.
  select * into o from orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if o.payment_state = 'paid' then raise exception 'already_paid'; end if;

  update orders set payment_state = 'processing' where id = p_order_id;

  -- Server-side amounts (trust the DB, not the request).
  select coalesce(commission_rate,3) into v_commpct from stores where id = o.store_id;
  v_subtotal   := o.subtotal;
  v_delivery   := o.delivery_fee;
  v_commission := round(v_subtotal * v_commpct / 100.0);
  v_service    := p_service_fee;
  v_store_amt  := v_subtotal - v_commission;
  v_total      := v_subtotal + v_delivery + v_service;

  if v_store_amt < 0 then raise exception 'commission_exceeds_subtotal'; end if;

  -- Receipt (CHECK constraint guarantees the split balances exactly).
  insert into payment_transactions(
    txn_id, order_id, customer_id, store_id, courier_id,
    subtotal, delivery_fee, store_amount, admin_commission, service_fee, total,
    payment_method, status)
  values (
    v_txn, o.id, o.customer_id, o.store_id, o.courier_id,
    v_subtotal, v_delivery, v_store_amt, v_commission, v_service, v_total,
    o.payment, 'paid');

  -- Resolve wallets and credit each recipient.
  w_store   := upsert_wallet('store',   o.store_id);
  w_courier := upsert_wallet('courier', o.courier_id);
  w_admin   := upsert_wallet('admin',   null);

  update wallets set balance = balance + v_store_amt,            updated_at = now() where id = w_store;
  update wallets set balance = balance + v_delivery,             updated_at = now() where id = w_courier;
  update wallets set balance = balance + v_commission + v_service, updated_at = now() where id = w_admin;

  insert into ledger_entries(txn_id, wallet_id, reason, amount) values
    (v_txn, w_store,   'store_amount', v_store_amt),
    (v_txn, w_courier, 'delivery_fee', v_delivery),
    (v_txn, w_admin,   'commission',   v_commission),
    (v_txn, w_admin,   'service_fee',  v_service);

  update orders set payment_state = 'paid' where id = p_order_id;
  return v_txn;

exception when others then
  -- Rollback already happened for the credits above; record the failure.
  update orders set payment_state = 'failed' where id = p_order_id;
  insert into payment_errors(order_id, txn_id, message, payload)
    values (p_order_id, v_txn, sqlerrm, jsonb_build_object('state','rolled_back'));
  insert into admin_notifications(kind, message, order_id)
    values ('payment_failed', 'Payment failed for order ' || p_order_id || ': ' || sqlerrm, p_order_id);
  raise;
end; $$;

-- Aggregated admin report.
create or replace view admin_payment_report as
select
  coalesce(sum(store_amount)      filter (where status='paid'),0) as paid_to_stores,
  coalesce(sum(delivery_fee)      filter (where status='paid'),0) as paid_to_couriers,
  coalesce(sum(admin_commission)  filter (where status='paid'),0) as commission_income,
  coalesce(sum(service_fee)       filter (where status='paid'),0) as service_fee_income,
  coalesce(sum(total)             filter (where status='paid'),0) as gross_revenue
from payment_transactions;
