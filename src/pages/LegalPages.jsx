import React from 'react';
import { Shield, FileText, CheckCircle2, Lock, ArrowLeft, RefreshCw, AlertCircle, Building2 } from 'lucide-react';

export const PrivacyPolicyPage = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      <div>
        <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#00A86B] transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6 text-xs text-[#667085] leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] border border-[#00A86B]/20 text-[#00A86B] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#101828] font-heading">Privacy Policy</h1>
            <p className="text-[#667085]">Compliant with the Digital Personal Data Protection (DPDP) Act, India</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#101828] font-heading">1. Data Minimization Principle</h2>
          <p>
            PharmNexia collects only the minimum necessary data required to connect pharmacy students with verified mentors: your name, academic email, degree program, college name, and career interests.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">2. No Sensitive Government Identifiers</h2>
          <p>
            We strictly do NOT collect Aadhaar numbers, PAN cards, or private financial account credentials. Payment processing occurs through tokenized gateways (e.g. Razorpay) where no raw credit card or UPI security pins are stored on our servers.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">3. Mentor & Student Privacy Shield</h2>
          <p>
            Mentors' personal phone numbers, home addresses, and private contact channels remain hidden from students. All advisory sessions occur through secured virtual conference rooms.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">4. Your Data Rights</h2>
          <p>
            Under Indian DPDP regulations, you retain the right to access, rectify, or request the complete deletion of your student profile and activity records at any time by contacting our Data Protection Officer at privacy@pharmnexia.in.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      <div>
        <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#00A86B] transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6 text-xs text-[#667085] leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] border border-[#00A86B]/20 text-[#00A86B] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#101828] font-heading">Terms of Service</h1>
            <p className="text-[#667085]">PharmNexia Mentorship & Academic Code of Conduct</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#101828] font-heading">1. Nature of the Ecosystem</h2>
          <p>
            PharmNexia is a pharmacy career guidance, skill acceleration, and mentorship discovery platform. Guidance provided by mentors reflects personal academic and industrial experiences and does not constitute statutory legal advice or guaranteed exam cutoffs.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">2. Code of Professional Conduct</h2>
          <p>
            Both students and mentors agree to conduct themselves with academic integrity, mutual respect, and zero tolerance for harassment, unauthorized solicitation, or recording of sessions without explicit consent.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">3. Verification of Credentials</h2>
          <p>
            Mentors undergo review of their degrees and credentials. Attempting to upload forged credentials results in immediate suspension and notification to respective institutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyPage = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      <div>
        <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#00A86B] transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6 text-xs text-[#667085] leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] border border-[#00A86B]/20 text-[#00A86B] flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#101828] font-heading">Refund Policy</h1>
            <p className="text-[#667085]">Fair & Transparent Student Protection</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#101828] font-heading">1. Mentorship Session Cancellation</h2>
          <p>
            If a mentor is unable to attend or cancels a scheduled 1-on-1 session, the student receives a 100% full automatic refund within 3-5 business days or can choose to reschedule at no additional charge.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">2. Student Cancellations</h2>
          <p>
            Sessions cancelled by students at least 12 hours prior to the scheduled start time receive a full refund. Cancellations within 12 hours may be subject to a nominal rescheduling fee to respect the mentor's reserved calendar block.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">3. Skill Cohorts & Programs</h2>
          <p>
            Students enrolled in paid cohorts can request a full refund within 48 hours after attending the first live module if unsatisfied with the curriculum depth.
          </p>
        </div>
      </div>
    </div>
  );
};

export const CancellationPolicyPage = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      <div>
        <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#00A86B] transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6 text-xs text-[#667085] leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] border border-[#00A86B]/20 text-[#00A86B] flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#101828] font-heading">Cancellation & Rescheduling Guidelines</h1>
            <p className="text-[#667085]">Calendar Etiquette for Students & Mentors</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#101828] font-heading">1. Rescheduling Protocol</h2>
          <p>
            Both students and mentors can initiate a reschedule directly from the dashboard up to 4 hours before the session.
          </p>

          <h2 className="text-sm font-bold text-[#101828] font-heading">2. No-Show Policy</h2>
          <p>
            If a participant fails to join the virtual room within 15 minutes of the start time, the session is marked as completed or forfeited.
          </p>
        </div>
      </div>
    </div>
  );
};

export const AboutPage = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      <div>
        <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#00A86B] transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-8 text-xs text-[#667085] leading-relaxed">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#087A52] bg-[#E8F8F1] px-3 py-1 rounded-full font-bold border border-[#00A86B]/20">
            Our Purpose
          </span>
          <h1 className="text-3xl font-extrabold text-[#101828] mt-3 font-heading tracking-tight">
            About PharmNexia
          </h1>
          <p className="text-sm font-semibold text-[#00A86B] mt-1">
            "Your Pharmacy Career, Connected."
          </p>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#667085]">
          <p>
            PharmNexia was founded to solve a massive structural challenge across India's pharmaceutical education landscape: <strong className="text-[#101828]">over 1,500 pharmacy colleges produce hundreds of thousands of B.Pharm and D.Pharm graduates every year, yet the vast majority have zero direct access to seniors who have cracked CAT, NIPER, USFDA regulatory filings, or global MS scholarships.</strong>
          </p>

          <p>
            Career advice was previously confined to informal WhatsApp rumors, fragmented YouTube clips, and generic advice. PharmNexia changes that by building a verified mentorship and practical learning matrix.
          </p>
        </div>

        {/* Institutional Roadmap */}
        <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-3">
          <div className="flex items-center gap-2.5 text-[#101828] font-bold text-sm font-heading">
            <Building2 className="w-5 h-5 text-[#00A86B]" />
            <span>Pilot College Ecosystem & Pan-India Expansion</span>
          </div>
          <p className="text-xs text-[#667085] leading-relaxed">
            PharmNexia is architected initially around pharmacy student pilot communities, designed with modular role-based architecture (Supabase RLS, verified credential pipelines, faculty honorarium governance) to seamlessly scale to pharmacy institutions across all states in India.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('/career-paths')}
            className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
          >
            Explore Career Trajectories
          </button>
          <button
            onClick={() => onNavigate('/mentors')}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#111827] font-semibold text-xs border border-[#E5E7EB] transition"
          >
            Find a Mentor
          </button>
        </div>
      </div>
    </div>
  );
};
