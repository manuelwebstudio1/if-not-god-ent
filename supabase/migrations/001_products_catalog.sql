-- IF NOT GOD ENT — product catalog (run in Supabase SQL editor or via CLI)

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  unique (category_id, slug)
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  sku text not null unique,
  category_id uuid not null references public.categories(id),
  subcategory_id uuid references public.subcategories(id) on delete set null,
  brand_id uuid not null references public.brands(id),
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}',
  short_description text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  specifications jsonb not null default '{}',
  warranty text default '',
  shipping_info text default '',
  is_featured boolean not null default false,
  is_available boolean not null default true,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  rating numeric(3, 2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists products_featured_idx on public.products (is_featured) where is_available = true;
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_brand_idx on public.products (brand_id);
create index if not exists products_search_idx on public.products using gin (to_tsvector('english', name || ' ' || sku || ' ' || short_description));

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;

create policy "Public read categories" on public.categories for select using (true);
create policy "Public read subcategories" on public.subcategories for select using (true);
create policy "Public read brands" on public.brands for select using (true);
create policy "Public read available products" on public.products for select using (is_available = true);

-- Storage bucket (create in dashboard): product-images, public read
