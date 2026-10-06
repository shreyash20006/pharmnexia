-- ==============================================================================
-- PHARMNEXIA - MENTOR GOOGLE CALENDAR & MEET INTEGRATION
-- SECURITY-HARDENED TOKEN ISOLATION (ZERO TOKEN EXPOSURE TO FRONTEND)
-- STRICT SAFETY GUARANTEE: ZERO DROPS, ZERO TRUNCATES, ADDITIVE ONLY
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SECURE TOKEN VAULT (ACCESSIBLE ONLY BY BACKEND EDGE FUNCTIONS)
-- Mentors have ZERO SELECT permissions to this table.
CREATE TABLE IF NOT EXISTS public.mentor_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT ARRAY['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/userinfo.email'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRITICAL SECURITY HARDENING:
-- Enable Row Level Security with NO POLICIES for 'anon' or 'authenticated'.
-- Only service_role (Edge Functions) can read or write to this table.
ALTER TABLE public.mentor_google_tokens ENABLE ROW LEVEL SECURITY;

-- 3. SAFE CONNECTION METADATA TABLE (FRONTEND READABLE)
-- Contains ONLY non-sensitive status flags. Zero tokens stored here.
CREATE TABLE IF NOT EXISTS public.mentor_calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  google_account_email VARCHAR(255) NOT NULL,
  calendar_id VARCHAR(255) NOT NULL DEFAULT 'primary',
  is_connected BOOLEAN NOT NULL DEFAULT TRUE,
  sync_status VARCHAR(50) NOT NULL DEFAULT 'SYNCED', -- 'SYNCED', 'CALENDAR_PENDING', 'FAILED', 'DISCONNECTED'
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.mentor_calendar_connections ENABLE ROW LEVEL SECURITY;

-- Mentors can ONLY read their own connection status metadata
DROP POLICY IF EXISTS "Mentors can read own connection metadata" ON public.mentor_calendar_connections;
CREATE POLICY "Mentors can read own connection metadata"
ON public.mentor_calendar_connections FOR SELECT
TO authenticated
USING (auth.uid() = mentor_id);

-- 4. ADDITIVE COLUMNS TO BOOKINGS & PROGRAMS (FOR CALENDAR EVENT TRACKING)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS google_event_id VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS google_meet_link TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS calendar_sync_status VARCHAR(50) DEFAULT 'NOT_SYNCED';

ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS google_event_id VARCHAR(255);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS google_meet_url TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS calendar_sync_status VARCHAR(50) DEFAULT 'NOT_SYNCED';
