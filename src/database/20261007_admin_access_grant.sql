-- ==============================================================================
-- PHARMNEXIA — ADMIN ACCESS GRANT MIGRATION
-- Targets: sb108750@gmail.com & pharmanexia@gmail.com
-- Role: SUPER_ADMIN (Full Platform Governance, Mentors, Pricing, & Payments)
-- ==============================================================================

-- 1. Ensure public.profiles table exists and role is VARCHAR(50)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'STUDENT',
  avatar_url TEXT,
  phone VARCHAR(50),
  college VARCHAR(255),
  degree VARCHAR(100),
  year VARCHAR(50),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely convert profiles.role to VARCHAR(50) if it was previously an enum
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'role' 
      AND udt_name != 'varchar'
  ) THEN
    ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE public.profiles ALTER COLUMN role TYPE VARCHAR(50) USING role::VARCHAR(50);
    ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'STUDENT';
  END IF;
END $$;

-- 2. Ensure public.staff_accounts table exists
CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  pharm_nexia_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'SUPPORT',
  department VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  avatar TEXT,
  invited_by VARCHAR(255) DEFAULT 'System Genesis',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Upsert sb108750@gmail.com into staff_accounts as SUPER_ADMIN
INSERT INTO public.staff_accounts (
  pharm_nexia_id,
  name,
  email,
  role,
  department,
  title,
  status,
  invited_by
) VALUES (
  'PHN-ADM-001087',
  'Shreyash B.',
  'sb108750@gmail.com',
  'SUPER_ADMIN',
  'Executive Governance',
  'Chief Platform Administrator',
  'ACTIVE',
  'System Genesis'
)
ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  department = 'Executive Governance',
  title = 'Chief Platform Administrator',
  status = 'ACTIVE',
  updated_at = NOW();

-- 4. Upsert pharmanexia@gmail.com into staff_accounts as SUPER_ADMIN
INSERT INTO public.staff_accounts (
  pharm_nexia_id,
  name,
  email,
  role,
  department,
  title,
  status,
  invited_by
) VALUES (
  'PHN-ADM-001088',
  'PharmNexia Executive',
  'pharmanexia@gmail.com',
  'SUPER_ADMIN',
  'Executive Governance',
  'Chief Platform Administrator',
  'ACTIVE',
  'System Genesis'
)
ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  department = 'Executive Governance',
  title = 'Chief Platform Administrator',
  status = 'ACTIVE',
  updated_at = NOW();

-- 5. Synchronize auth.users and public.profiles for both administrators
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN (
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    WHERE LOWER(email) IN ('sb108750@gmail.com', 'pharmanexia@gmail.com', 'pharmnexia@gmail.com')
  ) LOOP
    -- Link user_id in staff_accounts
    UPDATE public.staff_accounts
    SET user_id = rec.id, updated_at = NOW()
    WHERE LOWER(email) = LOWER(rec.email);

    -- Upsert profile with SUPER_ADMIN role
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      rec.id, 
      rec.email, 
      COALESCE(rec.raw_user_meta_data->>'full_name', rec.raw_user_meta_data->>'name', 'Platform Admin'), 
      'SUPER_ADMIN'
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'SUPER_ADMIN',
      updated_at = NOW();

    -- Update auth metadata for immediate session recognition
    UPDATE auth.users
    SET 
      raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"SUPER_ADMIN"'
      ),
      raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        '"SUPER_ADMIN"'
      )
    WHERE id = rec.id;
  END LOOP;
END $$;

-- 6. Future-proof Trigger: Whenever any of these emails registers in the future,
-- automatically elevate them to SUPER_ADMIN immediately.
CREATE OR REPLACE FUNCTION public.handle_admin_auth_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(NEW.email) IN ('sb108750@gmail.com', 'pharmanexia@gmail.com', 'pharmnexia@gmail.com') THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"SUPER_ADMIN"'
    );
    NEW.raw_app_meta_data = jsonb_set(
      COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"SUPER_ADMIN"'
    );

    -- Ensure profiles is populated
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Platform Admin'),
      'SUPER_ADMIN'
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'SUPER_ADMIN',
      updated_at = NOW();

    -- Link staff_accounts
    UPDATE public.staff_accounts
    SET user_id = NEW.id, updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_admin_auth_sync ON auth.users;
CREATE TRIGGER trg_admin_auth_sync
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_admin_auth_sync();
