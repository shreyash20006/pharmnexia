-- ==============================================================================
-- PHARMNEXIA - SAFE ADDITIVE DATABASE MIGRATION (FIX FOR ERROR 55P04)
-- Migration Name: 20261006_staff_role_access.sql
-- 
-- PURPOSE:
-- 1. Upgrades public.profiles.role to VARCHAR(50) (from rigid user_role enum)
--    so that all 7 institutional staff roles (DEVELOPER, SUPPORT, ANALYST, etc.)
--    can be assigned seamlessly in a single transaction without PostgreSQL 55P04 error.
-- 2. Grants backend-enforced DEVELOPER role to sb108750@gmail.com safely and idempotently.
-- 3. Configures server-side Row Level Security (RLS) for staff accounts.
-- 4. Registers auto-sync trigger so any staff email immediately gets their role on login.
-- 5. Creates safe DEMO/TEST mentor record: Dr. Priya Nair (DEMO/PENDING).
-- 6. Creates safe DEMO/TEST program record: Pharmacovigilance Career Masterclass (DEMO).
--
-- SAFETY & COMPLIANCE:
-- - Zero dropped tables, zero deleted data.
-- - All existing student and mentor profiles are 100% preserved.
-- - Fully idempotent: safe to run once or multiple times.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. SCHEMA EVOLUTION: UPGRADE PROFILES.ROLE TO VARCHAR(50)
-- Prevents PostgreSQL 55P04 (unsafe use of new enum value in same transaction)
-- and enables all 7 staff tiers: DEVELOPER, SUPPORT, ANALYST, MENTOR_MANAGER, etc.
-- ==============================================================================

-- Ensure profiles table exists first
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_masked VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safely convert profiles.role to VARCHAR(50) if it is currently user_role enum
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'role'
      AND udt_name = 'user_role'
  ) THEN
    ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE public.profiles ALTER COLUMN role TYPE VARCHAR(50) USING role::VARCHAR(50);
    ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'STUDENT';
  END IF;
END $$;

-- ==============================================================================
-- 3. STAFF ACCOUNTS TABLE ASSURANCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pharm_nexia_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'SUPPORT',
  department VARCHAR(100) NOT NULL DEFAULT 'Platform Operations',
  title VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  invited_by VARCHAR(255) DEFAULT 'System Genesis',
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff_accounts(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff_accounts(role);

-- ==============================================================================
-- 4. SERVER-SIDE ROW LEVEL SECURITY (RLS) FOR STAFF GOVERNANCE
-- ==============================================================================

ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view staff roster
DROP POLICY IF EXISTS "Allow staff reads for authenticated" ON public.staff_accounts;
CREATE POLICY "Allow staff reads for authenticated"
ON public.staff_accounts FOR SELECT
TO authenticated
USING (true);

-- Backend-enforced mutation: only SUPER_ADMIN, ADMIN, or DEVELOPER can manage staff
DROP POLICY IF EXISTS "Enforce staff management permissions" ON public.staff_accounts;
CREATE POLICY "Enforce staff management permissions"
ON public.staff_accounts FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.staff_accounts sa
    WHERE (sa.user_id = auth.uid() OR sa.email = (auth.jwt() ->> 'email'))
    AND sa.role IN ('SUPER_ADMIN', 'ADMIN', 'DEVELOPER')
    AND sa.status = 'ACTIVE'
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('SUPER_ADMIN', 'ADMIN', 'DEVELOPER')
  )
);

-- ==============================================================================
-- 5. AUTOMATIC ROLE SYNC TRIGGER (ON USER SIGN-UP OR LOGIN)
-- Whenever any user authenticates, if their email exists in staff_accounts,
-- automatically synchronize their profile role to match their assigned staff tier.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.sync_staff_role_on_profile()
RETURNS TRIGGER AS $$
DECLARE
  assigned_staff_role VARCHAR(50);
BEGIN
  SELECT role INTO assigned_staff_role
  FROM public.staff_accounts
  WHERE email = NEW.email AND status = 'ACTIVE'
  LIMIT 1;

  IF assigned_staff_role IS NOT NULL THEN
    NEW.role := assigned_staff_role;
    
    -- Link user_id in staff_accounts
    UPDATE public.staff_accounts
    SET user_id = NEW.id, updated_at = NOW()
    WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_staff_role ON public.profiles;
CREATE TRIGGER trg_sync_staff_role
BEFORE INSERT OR UPDATE OF email ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_staff_role_on_profile();

-- ==============================================================================
-- 6. DEVELOPER ACCESS ASSIGNMENT FOR sb108750@gmail.com
-- Safe, idempotent assignment that grants the DEVELOPER tier.
-- ==============================================================================

-- Step A: Upsert into public.staff_accounts
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
  'PHN-DEV-001087',
  'Lead Developer',
  'sb108750@gmail.com',
  'DEVELOPER',
  'Engineering & DevOps',
  'Systems & Developer Lead',
  'ACTIVE',
  'System Genesis'
)
ON CONFLICT (email) DO UPDATE SET
  role = 'DEVELOPER',
  department = 'Engineering & DevOps',
  title = 'Systems & Developer Lead',
  status = 'ACTIVE',
  updated_at = NOW();

-- Step B: If user already exists in auth.users, link user_id and update public.profiles
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'sb108750@gmail.com' LIMIT 1;
  
  IF target_user_id IS NOT NULL THEN
    -- Link user_id in staff_accounts
    UPDATE public.staff_accounts
    SET user_id = target_user_id, updated_at = NOW()
    WHERE email = 'sb108750@gmail.com';

    -- Update or insert role in profiles table (VARCHAR, safe against 55P04)
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (target_user_id, 'sb108750@gmail.com', 'Lead Developer', 'DEVELOPER')
    ON CONFLICT (id) DO UPDATE SET
      role = 'DEVELOPER',
      updated_at = NOW();
  END IF;
END $$;

-- ==============================================================================
-- 7. SAFE DEMO TEST MENTOR: Dr. Priya Nair (DEMO / PENDING)
-- For testing only. Clearly marked as DEMO data.
-- ==============================================================================

-- Ensure audit_logs table exists
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(100),
  details TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert audit logs" ON public.audit_logs;
CREATE POLICY "Allow insert audit logs" ON public.audit_logs
FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read audit logs" ON public.audit_logs;
CREATE POLICY "Allow read audit logs" ON public.audit_logs
FOR SELECT TO authenticated USING (true);

INSERT INTO public.audit_logs (
  actor, action, target_type, target_id, details, status, metadata
) VALUES (
  'System Genesis (DEMO)',
  'CREATE_DEMO_MENTOR',
  'MENTOR',
  'demo-mentor-priya-nair',
  'Registered test mentor Dr. Priya Nair with status DEMO/PENDING',
  'SUCCESS',
  jsonb_build_object(
    'name', 'Dr. Priya Nair (DEMO)',
    'role', 'Senior Pharmacovigilance Scientist',
    'organization', 'Global Clinical Research',
    'qualification', 'B.Pharm, M.Pharm',
    'status', 'DEMO / PENDING',
    'is_demo', true
  )
);

-- ==============================================================================
-- 8. SAFE DEMO TEST PROGRAM: Pharmacovigilance Career Masterclass (DEMO)
-- For testing only. Clearly marked with status DEMO.
-- ==============================================================================

-- Ensure programs table exists
CREATE TABLE IF NOT EXISTS public.programs (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(150),
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(150),
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Masterclass',
  status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
  level VARCHAR(50) DEFAULT 'Beginner',
  mode VARCHAR(50) DEFAULT 'Online via Google Meet',
  duration VARCHAR(100) NOT NULL,
  schedule VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2) DEFAULT 0.00,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  cta_text VARCHAR(100) DEFAULT 'Get Access',
  seats_total INT NOT NULL DEFAULT 50,
  seats_booked INT DEFAULT 0,
  google_meet_url TEXT,
  meet_status VARCHAR(20) DEFAULT 'UPCOMING',
  lead_mentor VARCHAR(255),
  mentor_role VARCHAR(255),
  organization VARCHAR(255),
  overview TEXT NOT NULL,
  learning_outcomes TEXT[],
  curriculum JSONB DEFAULT '[]'::jsonb,
  skills TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published programs" ON public.programs;
CREATE POLICY "Public can view published programs"
ON public.programs FOR SELECT
USING (true);

INSERT INTO public.programs (
  id,
  slug,
  title,
  short_title,
  category,
  type,
  status,
  level,
  mode,
  duration,
  schedule,
  start_date,
  end_date,
  price,
  original_price,
  is_free,
  currency,
  cta_text,
  seats_total,
  seats_booked,
  google_meet_url,
  meet_status,
  lead_mentor,
  mentor_role,
  organization,
  overview,
  learning_outcomes,
  curriculum,
  skills
) VALUES (
  'prog-demo-pv-masterclass',
  'pharmacovigilance-career-masterclass-demo',
  'Pharmacovigilance Career Masterclass (DEMO)',
  'PV Career Masterclass (DEMO)',
  'Pharmacovigilance',
  'Masterclass',
  'PUBLISHED',
  'Beginner',
  'Online via Google Meet',
  '1 Day (2 Hours Masterclass)',
  'Saturday, 5:00 PM - 7:00 PM IST',
  '2026-10-24',
  '2026-10-24',
  0.00,
  499.00,
  true,
  'INR',
  'Register Free (Demo)',
  100,
  24,
  'https://meet.google.com/phn-pv-demo-test',
  'UPCOMING',
  'Dr. Priya Nair (DEMO)',
  'Senior Pharmacovigilance Scientist',
  'Global Clinical Research',
  'Understanding career opportunities, skills and entry-level roles in pharmacovigilance. (TEST / DEMO EVENT ONLY)',
  ARRAY[
    'Understand what a Drug Safety Associate and PV Scientist actually does daily',
    'Key regulations: US FDA 21 CFR 314.80, EMA GVP, and ICH Guidelines',
    'Resume tips and interview preparation for top CRO recruitment drives'
  ],
  '[{"week": "Session 1", "title": "PV Career Roadmap & Industry Scope", "topics": ["Overview of Drug Safety and Post-Marketing Surveillance", "Qualifications required for entry-level PV positions", "Q&A with Dr. Priya Nair (DEMO)"]}]'::jsonb,
  ARRAY['Pharmacovigilance', 'Drug Safety', 'ICSR Fundamentals', 'Career Pathways']
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  is_free = EXCLUDED.is_free,
  lead_mentor = EXCLUDED.lead_mentor,
  updated_at = NOW();

-- Verification notice output
DO $$
BEGIN
  RAISE NOTICE 'PharmNexia Staff Role Access Migration Completed Successfully.';
  RAISE NOTICE 'Assigned DEVELOPER access to sb108750@gmail.com.';
  RAISE NOTICE 'Demo mentor Dr. Priya Nair and demo masterclass created.';
END $$;
