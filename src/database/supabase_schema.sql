-- ==============================================================================
-- PHARMNEXIA - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Pharmacy Career & Mentorship Ecosystem
-- "Your Pharmacy Career, Connected."
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
CREATE TYPE user_role AS ENUM (
  'STUDENT',
  'MENTOR',
  'ADMIN',
  'SUPER_ADMIN',
  'CONTENT_MANAGER'
);

CREATE TYPE mentor_status AS ENUM (
  'PENDING',
  'VERIFIED',
  'REJECTED',
  'SUSPENDED'
);

CREATE TYPE mentor_type AS ENUM (
  'FACULTY',
  'ALUMNI',
  'INDUSTRY',
  'RESEARCHERS',
  'EXAM_MENTORS'
);

CREATE TYPE payment_model AS ENUM (
  'FREE',
  'PAID',
  'HONORARIUM',
  'VOLUNTEER'
);

CREATE TYPE booking_status AS ENUM (
  'PENDING_PAYMENT',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED_BY_STUDENT',
  'CANCELLED_BY_MENTOR',
  'RESCHEDULED'
);

CREATE TYPE payment_status AS ENUM (
  'CREATED',
  'SUCCESS',
  'FAILED',
  'REFUNDED'
);

CREATE TYPE opportunity_category AS ENUM (
  'INTERNSHIP',
  'JOB',
  'RESEARCH',
  'FELLOWSHIP',
  'SCHOLARSHIP',
  'COMPETITION',
  'CONFERENCE'
);

CREATE TYPE resource_category AS ENUM (
  'NOTES',
  'CAREER_GUIDES',
  'RESEARCH',
  'EXAM_PREP',
  'TEMPLATES',
  'PPTS',
  'ARTICLES',
  'VIDEOS'
);

-- ==============================================================================
-- 3. CORE IDENTITY & USER PROFILES
-- ==============================================================================

-- Base Profiles Table (linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'STUDENT',
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_masked VARCHAR(50), -- Only masked representation stored for display
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Students Detailed Profile
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_name VARCHAR(255) NOT NULL,
  degree_enrolled VARCHAR(100) NOT NULL, -- e.g., B.Pharm, D.Pharm, M.Pharm, Pharm.D
  current_year INT CHECK (current_year BETWEEN 1 AND 6),
  expected_graduation_year INT NOT NULL,
  state VARCHAR(100),
  target_career_paths TEXT[], -- Array of career path slugs
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentors Detailed Profile
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  verification_status mentor_status NOT NULL DEFAULT 'PENDING',
  verified_badge BOOLEAN NOT NULL DEFAULT FALSE,
  mentor_type mentor_type NOT NULL DEFAULT 'ALUMNI',
  payment_model payment_model NOT NULL DEFAULT 'PAID',
  current_role VARCHAR(255) NOT NULL,
  current_org VARCHAR(255) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  previous_education TEXT NOT NULL, -- e.g. B.Pharm -> CAT -> IIM
  about TEXT NOT NULL,
  career_journey JSONB DEFAULT '[]'::jsonb, -- Array of milestones
  what_i_can_help_with TEXT[],
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  sessions_completed INT DEFAULT 0,
  price_30_min NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  price_60_min NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentor Credential Verification Documents (Private admin-only bucket reference)
CREATE TABLE IF NOT EXISTS public.mentor_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- Degree Certificate, Employer ID, Appointment Letter
  document_url TEXT NOT NULL, -- Secured storage path (Signed URL only)
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  verification_notes TEXT,
  status mentor_status NOT NULL DEFAULT 'PENDING'
);

-- ==============================================================================
-- 4. CAREER PATHS & TAXONOMY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.career_paths (
  id VARCHAR(100) PRIMARY KEY, -- Slug: 'mba-after-bpharm'
  title VARCHAR(255) NOT NULL,
  badge VARCHAR(100),
  category VARCHAR(100) NOT NULL,
  short_desc TEXT NOT NULL,
  full_title VARCHAR(255) NOT NULL,
  overview TEXT NOT NULL,
  is_high_demand BOOLEAN DEFAULT FALSE,
  average_salary VARCHAR(100),
  duration VARCHAR(100),
  who_should_consider TEXT[],
  step_roadmap JSONB DEFAULT '[]'::jsonb,
  entrance_exams TEXT[],
  recommended_prep TEXT,
  typical_timeline TEXT,
  skills_required TEXT[],
  possible_roles TEXT[],
  higher_studies TEXT[],
  faqs JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentor Career Path Link Table
CREATE TABLE IF NOT EXISTS public.mentor_career_paths (
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
  career_path_id VARCHAR(100) REFERENCES public.career_paths(id) ON DELETE CASCADE,
  PRIMARY KEY (mentor_id, career_path_id)
);

-- Mentor Expertise Tags
CREATE TABLE IF NOT EXISTS public.mentor_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL
);

-- Mentor Available Timeslots
CREATE TABLE IF NOT EXISTS public.mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL, -- 'Monday', 'Saturday'
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================================================
-- 5. PROGRAMS & WORKSHOPS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.programs (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  mode VARCHAR(50) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  schedule VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2) DEFAULT 0.00,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  seats_total INT NOT NULL,
  seats_booked INT DEFAULT 0,
  certificate_included BOOLEAN DEFAULT TRUE,
  certificate_type VARCHAR(255),
  lead_mentor_id UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
  overview TEXT NOT NULL,
  learning_outcomes TEXT[],
  curriculum JSONB DEFAULT '[]'::jsonb,
  eligibility TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.program_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id VARCHAR(100) REFERENCES public.programs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  payment_id UUID,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completion_status VARCHAR(50) DEFAULT 'IN_PROGRESS',
  attendance_percentage NUMERIC(5, 2) DEFAULT 0.00,
  UNIQUE(program_id, student_id)
);

-- ==============================================================================
-- 6. BOOKINGS, MENTORSHIPS & PAYMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'BK-2026-9812'
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  career_path_id VARCHAR(100) REFERENCES public.career_paths(id),
  session_duration_min INT NOT NULL CHECK (session_duration_min IN (30, 60)),
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(50) NOT NULL,
  status booking_status NOT NULL DEFAULT 'CONFIRMED',
  student_notes TEXT,
  meeting_link TEXT, -- Secure room / Google Meet / Zoom link (visible only when session confirmed)
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strict Payment Ledger (PCI-DSS compliant: ZERO raw card/UPI details stored)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  program_registration_id UUID REFERENCES public.program_registrations(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES public.students(id),
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'CREATED',
  gateway_name VARCHAR(50) NOT NULL, -- 'RAZORPAY', 'STRIPE', 'HONORARIUM_WAIVER'
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  gateway_signature_verified BOOLEAN DEFAULT FALSE,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key back to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id);

-- ==============================================================================
-- 7. CERTIFICATES & PUBLIC VERIFICATION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id VARCHAR(50) UNIQUE NOT NULL, -- 'PHN-2026-000001'
  student_id UUID NOT NULL REFERENCES public.students(id),
  student_display_name VARCHAR(255) NOT NULL,
  program_id VARCHAR(100) REFERENCES public.programs(id),
  program_title VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_date DATE NOT NULL,
  grade VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'Authentic & Verified',
  issuer_name VARCHAR(255) NOT NULL DEFAULT 'PharmNexia Academic & Career Council',
  signatory_name VARCHAR(255) NOT NULL,
  signatory_title VARCHAR(255) NOT NULL,
  credential_hash VARCHAR(128) NOT NULL,
  skills_acquired TEXT[],
  is_revoked BOOLEAN DEFAULT FALSE,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificate_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id VARCHAR(50) NOT NULL REFERENCES public.certificates(certificate_id),
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address_hashed VARCHAR(64),
  user_agent TEXT
);

-- ==============================================================================
-- 8. OPPORTUNITIES & RESOURCES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.opportunities (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  category opportunity_category NOT NULL,
  type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  remote_mode VARCHAR(50) NOT NULL, -- 'Remote', 'On-site', 'Hybrid'
  stipend VARCHAR(100),
  deadline DATE NOT NULL,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  eligibility TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_required TEXT[],
  apply_link TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resources (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category resource_category NOT NULL,
  career_path VARCHAR(100) NOT NULL,
  format VARCHAR(50) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  pages VARCHAR(50),
  access_level VARCHAR(50) NOT NULL DEFAULT 'Free Community', -- 'Free Community', 'Student Verified'
  is_restricted BOOLEAN DEFAULT FALSE,
  downloads INT DEFAULT 0,
  author VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  storage_path TEXT, -- Secured S3/Supabase Storage bucket path
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. REVIEWS, ANNOUNCEMENTS, NOTIFICATIONS & AUDIT LOGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'BOOKING', 'PAYMENT', 'CERTIFICATE', 'SYSTEM'
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_role user_role, -- NULL = ALL
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- e.g. 'MENTOR_VERIFIED', 'PAYMENT_RECEIVED', 'CERTIFICATE_ISSUED'
  target_table VARCHAR(100) NOT NULL,
  target_id VARCHAR(100) NOT NULL,
  metadata JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_mentors_status ON public.mentors(verification_status, is_active);
CREATE INDEX IF NOT EXISTS idx_mentors_type ON public.mentors(mentor_type);
CREATE INDEX IF NOT EXISTS idx_mentor_availability ON public.mentor_availability(mentor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status_date ON public.bookings(status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON public.certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_category_deadline ON public.opportunities(category, deadline);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at);

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can read basic profile; users can edit own profile; admins can do all
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Students: Only the student or an admin can view private student data
CREATE POLICY "Students can view own data"
  ON public.students FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Students can update own data"
  ON public.students FOR UPDATE
  USING (auth.uid() = id);

-- Mentors: Public can view verified mentors; Mentors can edit own profile
CREATE POLICY "Verified mentors viewable by everyone"
  ON public.mentors FOR SELECT
  USING (verification_status = 'VERIFIED' OR auth.uid() = id OR public.is_admin());

CREATE POLICY "Mentors can update own profile"
  ON public.mentors FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- Mentor Credentials: Private, visible ONLY to the mentor and Admins
CREATE POLICY "Mentor credentials viewable by mentor and admin"
  ON public.mentor_credentials FOR SELECT
  USING (mentor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins can approve/update mentor credentials"
  ON public.mentor_credentials FOR UPDATE
  USING (public.is_admin());

-- Bookings: Viewable only by involved student, mentor, or admin
CREATE POLICY "Bookings viewable by student, mentor, or admin"
  ON public.bookings FOR SELECT
  USING (student_id = auth.uid() OR mentor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students can insert own booking"
  ON public.bookings FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Booking status updateable by participants or admin"
  ON public.bookings FOR UPDATE
  USING (student_id = auth.uid() OR mentor_id = auth.uid() OR public.is_admin());

-- Payments: Only student and admins can view payment logs
CREATE POLICY "Payments viewable by payer or admin"
  ON public.payments FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

-- Certificates: Public can view authentic certificates by certificate_id
CREATE POLICY "Certificates public for verification"
  ON public.certificates FOR SELECT
  USING (is_revoked = false OR public.is_admin());

-- Notifications: Only recipient can view/mark as read
CREATE POLICY "Notifications viewable by recipient"
  ON public.notifications FOR ALL
  USING (user_id = auth.uid());

-- Audit logs: Strict Admin only access
CREATE POLICY "Audit logs admin access only"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());
