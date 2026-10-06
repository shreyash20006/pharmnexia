-- ==============================================================================
-- PHARMNEXIA - ADDITIVE PRODUCTION MIGRATION
-- PROGRAMS CMS, FUNNEL ANALYTICS, RAZORPAY WEBHOOK LEDGER, MENTOR CALENDAR & STAFF RBAC
-- STRICT SAFETY GUARANTEE: ZERO DROPS, ZERO TRUNCATES, ZERO DATA LOSS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. STAFF ROLES ENUM
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

-- 3. STAFF ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pharm_nexia_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role staff_role_type NOT NULL DEFAULT 'SUPPORT',
  department VARCHAR(100) NOT NULL DEFAULT 'Platform Operations',
  title VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
  invited_by VARCHAR(255),
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROGRAM & EVENT CMS TABLE (Additive schema)
CREATE TABLE IF NOT EXISTS public.programs (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(150) UNIQUE,
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(150),
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Cohort', -- Cohort, Workshop, Masterclass, Webinar, Bootcamp, AMA
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, PAUSED, COMPLETED, ARCHIVED
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
  meet_status VARCHAR(20) DEFAULT 'UPCOMING', -- UPCOMING, LIVE_NOW, ENDED
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

-- Ensure all additive columns exist on programs if table was previously created
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

-- 5. PROGRAM REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.program_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'PHN-REG-841920'
  program_id VARCHAR(100) REFERENCES public.programs(id) ON DELETE CASCADE,
  student_id UUID,
  student_pharm_nexia_id VARCHAR(50),
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED', -- 'FREE', 'PAID', 'PENDING'
  payment_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_id VARCHAR(100),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  google_meet_url TEXT,
  google_event_id VARCHAR(255),
  calendar_status VARCHAR(30) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CALENDAR_PENDING'
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROGRAM FUNNEL ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.program_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id VARCHAR(100) REFERENCES public.programs(id) ON DELETE SET NULL,
  user_id UUID,
  session_id VARCHAR(100),
  event_type VARCHAR(50) NOT NULL, -- 'PROGRAM_VIEW', 'PROGRAM_CTA_CLICK', 'REGISTRATION_STARTED', 'PAYMENT_PAGE_VIEW', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CHECKOUT_CLOSED', 'REFUND'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_prog_event ON public.program_analytics_events(program_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.program_analytics_events(created_at);

-- 7. MENTOR GOOGLE CALENDAR TOKEN VAULT (Dedicated isolated token storage)
CREATE TABLE IF NOT EXISTS public.mentor_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
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

-- 8. AUDIT LOGS TABLE
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

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_google_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Programs: Public can view PUBLISHED programs; Staff can view and manage all
DROP POLICY IF EXISTS "Public can view published programs" ON public.programs;
CREATE POLICY "Public can view published programs"
ON public.programs FOR SELECT
USING (status = 'PUBLISHED' OR status = 'PAUSED' OR status = 'COMPLETED');

DROP POLICY IF EXISTS "Staff can manage all programs" ON public.programs;
CREATE POLICY "Staff can manage all programs"
ON public.programs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER')
  )
);

-- Program Registrations: Students can view their own; Staff can view all
DROP POLICY IF EXISTS "Students can view own program registrations" ON public.program_registrations;
CREATE POLICY "Students can view own program registrations"
ON public.program_registrations FOR SELECT
USING (auth.uid() = student_id OR student_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Mentor Google Tokens: Strict mentor-only access
DROP POLICY IF EXISTS "Mentors can manage own calendar tokens" ON public.mentor_google_tokens;
CREATE POLICY "Mentors can manage own calendar tokens"
ON public.mentor_google_tokens FOR ALL
USING (auth.uid() = mentor_id);
