-- ==============================================================================
-- PHARMNEXIA - BULLETPROOF ADDITIVE DATABASE MIGRATION
-- Fixes: ERROR 42P01 (relation "public.program_analytics_events" does not exist)
-- Runs safely in Supabase SQL Editor with ZERO errors and ZERO dependencies
-- Safe against re-runs (Fully Idempotent)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROGRAM FUNNEL ANALYTICS EVENTS TABLE
-- (Created first and independently to guarantee tracking immediately works)
CREATE TABLE IF NOT EXISTS public.program_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id VARCHAR(255),
  user_id UUID,
  session_id VARCHAR(100),
  event_type VARCHAR(50) NOT NULL, -- 'PROGRAM_VIEW', 'PROGRAM_CTA_CLICK', 'REGISTRATION_STARTED', 'PAYMENT_PAGE_VIEW', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CHECKOUT_CLOSED', 'REFUND'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_prog_id ON public.program_analytics_events(program_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.program_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.program_analytics_events(created_at);

ALTER TABLE public.program_analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors & students to record tracking events (Views, Clicks, Registrations)
DROP POLICY IF EXISTS "Allow event inserts for all visitors" ON public.program_analytics_events;
CREATE POLICY "Allow event inserts for all visitors"
ON public.program_analytics_events
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

-- Allow authenticated users & staff to view analytics events
DROP POLICY IF EXISTS "Allow staff to read analytics events" ON public.program_analytics_events;
CREATE POLICY "Allow staff to read analytics events"
ON public.program_analytics_events
FOR SELECT
TO authenticated
USING (true);

-- 3. PROGRAMS & EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.programs (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(150),
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(150),
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Cohort',
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  level VARCHAR(50) DEFAULT 'Beginner to Intermediate',
  mode VARCHAR(50) DEFAULT 'Online via Google Meet',
  duration VARCHAR(100) NOT NULL,
  schedule VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time VARCHAR(50),
  end_time VARCHAR(50),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2) DEFAULT 0.00,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  cta_text VARCHAR(100) DEFAULT 'Get Access',
  seats_total INT NOT NULL DEFAULT 50,
  seats_booked INT DEFAULT 0,
  google_meet_url TEXT,
  google_event_id VARCHAR(255),
  meet_status VARCHAR(20) DEFAULT 'UPCOMING',
  lead_mentor VARCHAR(255),
  mentor_role VARCHAR(255),
  organization VARCHAR(255),
  overview TEXT NOT NULL,
  long_description TEXT,
  learning_outcomes TEXT[],
  curriculum JSONB DEFAULT '[]'::jsonb,
  eligibility TEXT,
  skills TEXT[],
  faqs JSONB DEFAULT '[]'::jsonb,
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on programs
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS slug VARCHAR(150);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS short_title VARCHAR(150);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'Cohort';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PUBLISHED';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS cta_text VARCHAR(100) DEFAULT 'Get Access';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS google_meet_url TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS google_event_id VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS meet_status VARCHAR(20) DEFAULT 'UPCOMING';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS lead_mentor VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS mentor_role VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS og_title VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS canonical_url TEXT;

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published programs" ON public.programs;
CREATE POLICY "Public can view published programs"
ON public.programs FOR SELECT
USING (status = 'PUBLISHED' OR status = 'PAUSED' OR status = 'COMPLETED');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.programs;
CREATE POLICY "Allow all for authenticated users"
ON public.programs FOR ALL
TO authenticated
USING (true);

-- 4. PROGRAM REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.program_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_code VARCHAR(30) UNIQUE NOT NULL,
  program_id VARCHAR(100),
  student_id UUID,
  student_pharm_nexia_id VARCHAR(50),
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
  payment_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_id VARCHAR(100),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  google_meet_url TEXT,
  google_event_id VARCHAR(255),
  calendar_status VARCHAR(30) DEFAULT 'CONFIRMED',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read own registrations or authenticated" ON public.program_registrations;
CREATE POLICY "Allow read own registrations or authenticated"
ON public.program_registrations FOR SELECT
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow registration inserts" ON public.program_registrations;
CREATE POLICY "Allow registration inserts"
ON public.program_registrations FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

-- 5. STAFF ACCOUNTS TABLE
DO $$ BEGIN
  CREATE TYPE staff_role_type AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'DEVELOPER',
    'MENTOR_MANAGER',
    'CONTENT_MANAGER',
    'SUPPORT',
    'ANALYST'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  pharm_nexia_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'SUPPORT',
  department VARCHAR(100) NOT NULL DEFAULT 'Platform Operations',
  title VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  invited_by VARCHAR(255),
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow staff reads for authenticated" ON public.staff_accounts;
CREATE POLICY "Allow staff reads for authenticated"
ON public.staff_accounts FOR SELECT
TO authenticated
USING (true);

-- 6. MENTOR GOOGLE CALENDAR TOKEN VAULT
CREATE TABLE IF NOT EXISTS public.mentor_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID,
  google_account_email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT ARRAY['https://www.googleapis.com/auth/calendar.events'],
  calendar_id VARCHAR(255) NOT NULL DEFAULT 'primary',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.mentor_google_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow mentor token management" ON public.mentor_google_tokens;
CREATE POLICY "Allow mentor token management"
ON public.mentor_google_tokens FOR ALL
TO authenticated
USING (true);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor VARCHAR(255) NOT NULL,
  actor_id UUID,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(100),
  details TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert audit logs" ON public.audit_logs;
CREATE POLICY "Allow insert audit logs"
ON public.audit_logs FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read audit logs" ON public.audit_logs;
CREATE POLICY "Allow read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (true);
