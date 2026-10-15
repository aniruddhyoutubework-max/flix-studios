-- ==============================================================================
-- FLIXCORE STUDIOS - INITIAL ADMINISTRATOR SETUP (MIGRATION 03)
-- ==============================================================================
-- This migration safely provisions the designated studio administrator account:
-- flixcorestudios@gmail.com
--
-- It updates existing records in public.profiles and configures an idempotent trigger
-- to guarantee that when this specific administrator signs up or verifies their email,
-- their role is automatically and securely elevated to 'admin'.

DO $$
BEGIN
  -- 1. Upgrade existing profile if user has already authenticated
  UPDATE public.profiles
  SET role = 'admin', updated_at = timezone('utc'::text, now())
  WHERE lower(email) = 'flixcorestudios@gmail.com';

  -- 2. Create trigger function to ensure future sign-in for this designated email is always granted admin role
  CREATE OR REPLACE FUNCTION public.handle_admin_provisioning()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $fn$
  BEGIN
    IF lower(NEW.email) = 'flixcorestudios@gmail.com' THEN
      NEW.role := 'admin';
    END IF;
    RETURN NEW;
  END;
  $fn$;

  -- Drop trigger if it already exists to be idempotent
  DROP TRIGGER IF EXISTS tr_ensure_admin_role ON public.profiles;

  -- Create BEFORE INSERT or UPDATE trigger
  CREATE TRIGGER tr_ensure_admin_role
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_provisioning();

END $$;
