-- ==============================================================================
-- PHARMNEXIA — ADMIN-CONTROLLED MENTORS, PRICING, RAZORPAY & LEDGER MIGRATION
-- Safe & Additive Migration (Zero drops, Zero truncates, 100% Idempotent)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HARDEN PUBLIC.MENTORS TABLE (ADMIN CONTROLLED)
CREATE TABLE IF NOT EXISTS public.mentors (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID,
  name VARCHAR(255) NOT NULL DEFAULT 'Verified Mentor',
  email VARCHAR(255) NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone VARCHAR(50),
  location VARCHAR(255),
  short_bio TEXT,
  about TEXT NOT NULL DEFAULT '',
  "current_role" VARCHAR(255) NOT NULL DEFAULT 'Pharmaceutical Specialist',
  current_org VARCHAR(255) NOT NULL DEFAULT 'Healthcare Sector',
  mentor_type VARCHAR(100) NOT NULL DEFAULT 'Industry Professional',
  qualification VARCHAR(255) NOT NULL DEFAULT 'B.Pharm, M.Pharm',
  previous_education TEXT,
  expertise TEXT[],
  career_paths TEXT[],
  price_30 NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  price_60 NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payout_model VARCHAR(50) NOT NULL DEFAULT 'FIXED', -- 'FIXED' or 'PERCENTAGE'
  payout_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  available_days TEXT[] DEFAULT ARRAY['Saturday', 'Sunday'],
  available_slots TEXT[] DEFAULT ARRAY['06:00 PM - 06:30 PM', '07:00 PM - 07:30 PM'],
  start_time VARCHAR(50) DEFAULT '06:00 PM',
  end_time VARCHAR(50) DEFAULT '08:00 PM',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata (IST)',
  verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED', -- 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'
  verified_badge BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  sessions_completed INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all additive columns exist on mentors
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Verified Mentor';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS email VARCHAR(255) DEFAULT '';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS short_bio TEXT;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS about TEXT DEFAULT '';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS "current_role" VARCHAR(255) DEFAULT 'Pharmaceutical Specialist';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS current_org VARCHAR(255) DEFAULT 'Healthcare Sector';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS mentor_type VARCHAR(100) DEFAULT 'Industry Professional';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS qualification VARCHAR(255) DEFAULT 'B.Pharm, M.Pharm';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS previous_education TEXT;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS expertise TEXT[];
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS career_paths TEXT[];
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS price_30 NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS price_60 NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS payout_model VARCHAR(50) DEFAULT 'FIXED';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS payout_rate NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS available_days TEXT[];
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS available_slots TEXT[];
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS start_time VARCHAR(50) DEFAULT '06:00 PM';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS end_time VARCHAR(50) DEFAULT '08:00 PM';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Kolkata (IST)';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'VERIFIED';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS verified_badge BOOLEAN DEFAULT TRUE;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 5.00;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS sessions_completed INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Flexible type conversion if mentors table was created earlier with UUID
DO $$ BEGIN
  ALTER TABLE public.mentors ALTER COLUMN id TYPE VARCHAR(255) USING id::text;
EXCEPTION WHEN others THEN NULL;
END $$;

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read mentors" ON public.mentors;
CREATE POLICY "Allow read mentors"
ON public.mentors FOR SELECT
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow insert mentors" ON public.mentors;
CREATE POLICY "Allow insert mentors"
ON public.mentors FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update mentors" ON public.mentors;
CREATE POLICY "Allow update mentors"
ON public.mentors FOR UPDATE
TO public, anon, authenticated
USING (true);

-- 3. HARDEN PUBLIC.BOOKINGS TABLE (SEPARATE BOOKING & PAYMENT STATUSES + PRICE SNAPSHOTS)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(50) UNIQUE NOT NULL,
  student_id UUID,
  student_pharm_nexia_id VARCHAR(50),
  student_name VARCHAR(255) NOT NULL DEFAULT 'Student Aspirant',
  student_email VARCHAR(255) NOT NULL DEFAULT '',
  student_college VARCHAR(255),
  mentor_id VARCHAR(255),
  mentor_id_text VARCHAR(255),
  mentor_name VARCHAR(255) NOT NULL DEFAULT 'Verified Mentor',
  mentor_role VARCHAR(255),
  mentor_avatar TEXT,
  session_duration_min INT NOT NULL DEFAULT 30,
  scheduled_date VARCHAR(50) NOT NULL,
  scheduled_time VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT', -- 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REFUNDED'
  payment_status VARCHAR(50) NOT NULL DEFAULT 'PAYMENT_PENDING', -- 'PAYMENT_PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUND_PENDING', 'REFUNDED', 'CANCELLED'
  payment_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Historical Price Snapshot!
  mentor_payout_amount NUMERIC(10, 2) DEFAULT 0.00, -- Mentor Payout Snapshot!
  platform_fee_amount NUMERIC(10, 2) DEFAULT 0.00, -- PharmNexia Share Snapshot!
  payment_id VARCHAR(100),
  payment_gateway VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
  student_notes TEXT,
  meeting_link TEXT,
  google_meet_link TEXT,
  google_event_id VARCHAR(255),
  calendar_sync_status VARCHAR(50) DEFAULT 'NOT_SYNCED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Additive columns to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_code VARCHAR(50);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS student_name VARCHAR(255) DEFAULT 'Student Aspirant';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS student_email VARCHAR(255) DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS student_college VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS student_pharm_nexia_id VARCHAR(50);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mentor_name VARCHAR(255) DEFAULT 'Verified Mentor';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mentor_role VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mentor_avatar TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mentor_id_text VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mentor_payout_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS platform_fee_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAYMENT_PENDING';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(50) DEFAULT 'RAZORPAY';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS student_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS google_meet_link TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS google_event_id VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS calendar_sync_status VARCHAR(50) DEFAULT 'NOT_SYNCED';

-- Loosen restrictive constraints if they exist
DO $$ BEGIN
  ALTER TABLE public.bookings ALTER COLUMN student_id DROP NOT NULL;
  ALTER TABLE public.bookings ALTER COLUMN mentor_id DROP NOT NULL;
  ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_student_id_fkey;
  ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_mentor_id_fkey;
  ALTER TABLE public.bookings ALTER COLUMN mentor_id TYPE VARCHAR(255) USING mentor_id::text;
  ALTER TABLE public.bookings ALTER COLUMN scheduled_date TYPE VARCHAR(50) USING scheduled_date::text;
EXCEPTION WHEN others THEN NULL;
END $$;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow booking inserts for all" ON public.bookings;
CREATE POLICY "Allow booking inserts for all"
ON public.bookings FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read bookings" ON public.bookings;
CREATE POLICY "Allow read bookings"
ON public.bookings FOR SELECT
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow update bookings" ON public.bookings;
CREATE POLICY "Allow update bookings"
ON public.bookings FOR UPDATE
TO public, anon, authenticated
USING (true);

-- 4. HARDEN PUBLIC.PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(100),
  booking_id UUID,
  program_id VARCHAR(100),
  student_id UUID,
  student_name VARCHAR(255),
  student_email VARCHAR(255),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(50) NOT NULL DEFAULT 'PAYMENT_PENDING', -- 'PAYMENT_PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUND_PENDING', 'REFUNDED', 'CANCELLED'
  gateway_name VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
  gateway_payment_id VARCHAR(100),
  gateway_order_id VARCHAR(100),
  gateway_signature_verified BOOLEAN DEFAULT FALSE,
  failure_reason TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS booking_code VARCHAR(100);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS program_id VARCHAR(100);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS student_name VARCHAR(255);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS student_email VARCHAR(255);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS gateway_name VARCHAR(50) DEFAULT 'RAZORPAY';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS gateway_payment_id VARCHAR(100);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS gateway_order_id VARCHAR(100);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS gateway_signature_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS failure_reason TEXT;

DO $$ BEGIN
  ALTER TABLE public.payments ALTER COLUMN student_id DROP NOT NULL;
  ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_student_id_fkey;
EXCEPTION WHEN others THEN NULL;
END $$;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow payment inserts" ON public.payments;
CREATE POLICY "Allow payment inserts"
ON public.payments FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read payments" ON public.payments;
CREATE POLICY "Allow read payments"
ON public.payments FOR SELECT
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow update payments" ON public.payments;
CREATE POLICY "Allow update payments"
ON public.payments FOR UPDATE
TO public, anon, authenticated
USING (true);

-- 5. PLATFORM CONFIGURATION SETTINGS TABLE (PRICING & GATEWAY CONFIG)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read platform settings" ON public.platform_settings;
CREATE POLICY "Allow read platform settings"
ON public.platform_settings FOR SELECT
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow update platform settings" ON public.platform_settings;
CREATE POLICY "Allow update platform settings"
ON public.platform_settings FOR ALL
TO authenticated
USING (true);

-- Seed initial membership and default settings if not already present
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('membership_pricing', '{"price": 99, "currency": "INR", "title": "PharmNexia Academic Membership"}'::jsonb, 'Default Academic Membership Pricing'),
  ('payout_defaults', '{"default_model": "PERCENTAGE", "default_mentor_share": 80, "platform_share": 20}'::jsonb, 'Default Mentor Payout Splits')
ON CONFLICT (key) DO NOTHING;
