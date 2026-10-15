-- ==============================================================================
-- FLIXCORE STUDIOS - DATABASE SCHEMA (MIGRATION 01)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  name text not null,
  tagline text not null,
  description text not null,
  category text not null default 'Core Plugin',
  cover_image text not null,
  gallery_images jsonb default '[]'::jsonb not null,
  version text not null default '1.0.0',
  supported_mc_versions text not null,
  server_software text not null,
  dependencies text not null,
  documentation_url text,
  purchase_url text,
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  features jsonb default '[]'::jsonb not null,
  changelog jsonb default '[]'::jsonb not null,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TICKETS TABLE
create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  ticket_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  type text not null check (type in ('custom_dev', 'product_support')),
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  category text not null,
  description text not null,
  mc_version text,
  server_software text,
  dependencies text,
  budget_range text,
  timeframe text,
  reference_links text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TICKET MESSAGES TABLE
create table if not exists public.ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_email text not null,
  sender_role text not null check (sender_role in ('customer', 'admin')),
  message text not null,
  is_internal_note boolean default false not null,
  attachments jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PURCHASER VERIFICATION & REVIEW PERMISSIONS TABLE
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  customer_email text not null,
  customer_id uuid references public.profiles(id) on delete set null,
  product_id uuid references public.products(id) on delete cascade not null,
  product_name text not null,
  verified_by text not null,
  verification_status text not null default 'verified' check (verification_status in ('verified', 'unverified', 'revoked')),
  verification_reason text,
  review_permitted boolean default true not null,
  tags jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (customer_email, product_id)
);

-- 6. REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  product_name text not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  customer_name text not null,
  customer_email text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  content text not null,
  usage_context text,
  images jsonb default '[]'::jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'featured')),
  moderation_reason text,
  is_verified_purchaser boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id text primary key default 'primary',
  company_name text not null default 'FlixCore Studios',
  company_email text not null default 'collaborate@flixcorestudios.com',
  support_destination text not null default 'collaborate@flixcorestudios.com',
  notification_email text not null default 'collaborate@flixcorestudios.com',
  discord_webhook_configured boolean default false not null,
  headline_override text,
  subheadline_override text,
  cta_primary_override text,
  social_links jsonb default '{"twitter":"https://x.com/","instagram":"https://instagram.com/","github":"https://github.com/","linkedin":"https://linkedin.com/"}'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. AUDIT LOGS TABLE
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id text not null,
  admin_email text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  details text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_tickets_customer on public.tickets(customer_id);
create index if not exists idx_tickets_status on public.tickets(status);
create index if not exists idx_ticket_messages_ticket on public.ticket_messages(ticket_id);
create index if not exists idx_purchases_email on public.purchases(customer_email);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_status on public.reviews(status);

-- 9. STORAGE BUCKET FOR VERIFIED REVIEWS
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict (id) do nothing;
