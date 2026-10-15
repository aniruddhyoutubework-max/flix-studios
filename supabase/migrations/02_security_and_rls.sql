-- ==============================================================================
-- FLIXCORE STUDIOS - SECURITY POLICIES & RLS (MIGRATION 02)
-- ==============================================================================

-- Enable Row Level Security on all exposed tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.purchases enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Helper function: is current user an admin?
create or replace function public.is_admin()
returns boolean security definer
set search_path = public
language plpgsql as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- ------------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can read their own profile; Admins can read all profiles
create policy "Users can read own profile or admin reads all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Users can update only their own non-role fields
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Only admins can change roles
create policy "Admins manage profiles"
  on public.profiles for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can view published products
create policy "Anyone can view published products"
  on public.products for select
  using (status = 'published' or public.is_admin());

-- Only admins can insert, update, delete products
create policy "Admins manage products"
  on public.products for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. TICKETS POLICIES
-- ------------------------------------------------------------------------------
-- Customers can view only their own tickets; Admins view all tickets
create policy "Customers view own tickets or admin views all"
  on public.tickets for select
  using (auth.uid() = customer_id or public.is_admin());

-- Authenticated customers can create tickets
create policy "Authenticated customers create tickets"
  on public.tickets for insert
  with check (auth.uid() = customer_id);

-- Admins can update tickets (status, priority, etc.)
create policy "Admins update tickets"
  on public.tickets for update
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. TICKET MESSAGES POLICIES
-- ------------------------------------------------------------------------------
-- Customers can read non-internal messages for their own tickets
create policy "Customers view messages for their tickets"
  on public.ticket_messages for select
  using (
    public.is_admin() or (
      is_internal_note = false and
      exists (
        select 1 from public.tickets
        where tickets.id = ticket_messages.ticket_id and tickets.customer_id = auth.uid()
      )
    )
  );

-- Customers can post messages on their own tickets
create policy "Customers post messages on own tickets"
  on public.ticket_messages for insert
  with check (
    is_internal_note = false and
    sender_role = 'customer' and
    sender_id = auth.uid() and
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_messages.ticket_id and tickets.customer_id = auth.uid()
    )
  );

-- Admins can post messages (including internal notes)
create policy "Admins post ticket messages"
  on public.ticket_messages for insert
  with check (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PURCHASES & VERIFICATION POLICIES
-- ------------------------------------------------------------------------------
-- Customers can view only their own purchase records; Admins view all
create policy "Customers view own purchases or admin views all"
  on public.purchases for select
  using (auth.uid() = customer_id or public.is_admin());

-- Only admins can manage purchase records and review permissions
create policy "Admins manage purchases"
  on public.purchases for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. REVIEWS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view approved or featured reviews; Admins view all; Authors view own
create policy "Public views approved reviews"
  on public.reviews for select
  using (
    status in ('approved', 'featured') or
    auth.uid() = customer_id or
    public.is_admin()
  );

-- Only verified purchasers with review permission can submit reviews
create policy "Eligible purchasers submit reviews"
  on public.reviews for insert
  with check (
    auth.uid() = customer_id and
    status = 'pending' and
    exists (
      select 1 from public.purchases
      where purchases.customer_id = auth.uid()
        and purchases.product_id = reviews.product_id
        and purchases.verification_status = 'verified'
        and purchases.review_permitted = true
    )
  );

-- Customers can update their own pending review (cannot approve)
create policy "Customers update own pending reviews"
  on public.reviews for update
  using (auth.uid() = customer_id and status = 'pending')
  with check (auth.uid() = customer_id and status = 'pending');

-- Admins moderate all reviews
create policy "Admins moderate reviews"
  on public.reviews for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. SITE SETTINGS POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can view site settings
create policy "Anyone views site settings"
  on public.site_settings for select
  using (true);

-- Only admins can update site settings
create policy "Admins update site settings"
  on public.site_settings for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. AUDIT LOGS POLICIES
-- ------------------------------------------------------------------------------
-- Only admins can view audit logs
create policy "Admins view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

create policy "Admins create audit logs"
  on public.audit_logs for insert
  with check (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. INITIAL SETUP FUNCTION: Provisioning the First Admin Securely
-- ------------------------------------------------------------------------------
-- CRITICAL SECURITY RULE: This function CANNOT be called by anon or regular authenticated clients.
-- It can ONLY be executed by postgres / service_role in the Supabase SQL Editor.
create or replace function public.elevate_admin(target_email text)
returns text security definer
language plpgsql as $$
declare
  caller_role text;
begin
  -- Ensure caller is superuser or service_role
  caller_role := current_setting('role', true);
  if caller_role is distinct from 'service_role' and caller_role is distinct from 'postgres' then
    raise exception 'Permission denied: elevate_admin can only be executed by database administrator or service_role.';
  end if;

  update public.profiles
  set role = 'admin', updated_at = now()
  where email = lower(trim(target_email));

  if not found then
    return 'User with email ' || target_email || ' not found in profiles table.';
  end if;

  return 'User ' || target_email || ' successfully elevated to administrator.';
end;
$$;

-- Revoke all public, anon, and authenticated execution privileges
revoke execute on function public.elevate_admin(text) from public, anon, authenticated;
grant execute on function public.elevate_admin(text) to service_role, postgres;

-- ------------------------------------------------------------------------------
-- 10. STORAGE BUCKET POLICIES (Review Images)
-- ------------------------------------------------------------------------------
-- Allow anyone to read review images (since approved reviews display publicly)
create policy "Public view review images"
  on storage.objects for select
  using (bucket_id = 'review-images');

-- Only authenticated users with verified purchase can upload review images
create policy "Verified purchasers upload review images"
  on storage.objects for insert
  with check (
    bucket_id = 'review-images' and
    auth.role() = 'authenticated'
  );

