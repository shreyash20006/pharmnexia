import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  ShieldCheck,
  Check,
  Star,
  Video,
  ExternalLink,
  Tag,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../store/AppContext';
import { FadeUp, FadeLeft, FadeRight } from '../components/Animation';

export const ProgramDetailPage = ({ programId, onNavigate }) => {
  const { programs, registerForProgram, enrolledProgramIds, trackAnalyticsEvent } = useApp();
  const [openWeekIdx, setOpenWeekIdx] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedRegData, setConfirmedRegData] = useState(null);

  const program = (programs || []).find(p => p.id === programId) || programs?.[0];

  if (!program) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 animate-fadeIn">
        <h2 className="text-xl font-bold text-[#101828] font-heading">Program Not Found</h2>
        <p className="text-xs text-[#667085] max-w-sm mx-auto">
          The requested training cohort or masterclass is currently unavailable.
        </p>
        <button
          onClick={() => onNavigate('/programs')}
          className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition"
        >
          Browse All Programs
        </button>
      </div>
    );
  }

  const isEnrolled = (enrolledProgramIds || []).includes(program.id);

  // SEO & Meta Object Synchronization
  useEffect(() => {
    if (program) {
      document.title = `${program.metaTitle || program.title} | PharmNexia`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', program.metaDescription || program.overview || '');
      }
    }
  }, [program]);

  // Funnel Analytics: Track Page View
  useEffect(() => {
    if (program?.id && trackAnalyticsEvent) {
      trackAnalyticsEvent({ programId: program.id, eventType: 'PAGE_VIEW' });
    }
  }, [program?.id]);

  const handleEnroll = () => {
    // Funnel Analytics: CTA Click & Registration Visit
    if (trackAnalyticsEvent) {
      trackAnalyticsEvent({ programId: program.id, eventType: 'CTA_CLICK' });
      trackAnalyticsEvent({ programId: program.id, eventType: 'REGISTRATION_VISIT' });
    }

    setIsRegistering(true);
    setTimeout(() => {
      const reg = registerForProgram(program.id);
      setConfirmedRegData(reg);
      setIsRegistering(false);
      setShowSuccessModal(true);

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  const discountPercent = program.originalPrice && program.originalPrice > program.price
    ? Math.round(((program.originalPrice - program.price) / program.originalPrice) * 100)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-white text-[#111827]">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('/programs')}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#667085] hover:text-[#00A86B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Programs</span>
        </button>
      </div>

      {/* Program Hero Header */}
      <FadeUp>
        <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[12.5px] font-semibold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">
                {program.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-mono bg-white text-[#667085] border border-[#E5E7EB]">
                {program.type || 'Cohort'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-mono bg-white text-[#667085] border border-[#E5E7EB]">
                {program.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-mono bg-white text-[#667085] border border-[#E5E7EB] flex items-center gap-1">
                <Video className="w-3 h-3 text-[#00A86B]" />
                <span>{program.mode || 'Online via Google Meet'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-[40px] font-extrabold tracking-tight text-[#101828] font-heading leading-tight">
              {program.title}
            </h1>

            <p className="text-[16px] sm:text-[16.5px] text-[#4B5563] leading-[1.65] max-w-2xl font-normal">
              {program.overview}
            </p>

            {/* Program Key Metrics Grid */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-[13.5px] text-[#667085]">
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Date Span</span>
                <strong className="text-[#101828] text-[15px]">{program.startDate} to {program.endDate}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Cohort Duration</span>
                <strong className="text-[#101828] text-[15px]">{program.duration}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Lead Instructor</span>
                <strong className="text-[#101828] text-[15px]">{program.leadMentor}</strong>
              </div>
              {program.organization && (
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-mono">Organization</span>
                  <strong className="text-[#101828] text-[15px]">{program.organization}</strong>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex items-center gap-4 flex-wrap">
              {isEnrolled ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-5 py-3 rounded-xl bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/30 font-semibold text-[14px] flex items-center gap-2 shadow-sm">
                    <Check className="w-4 h-4 stroke-[3] text-[#00A86B]" />
                    <span>Enrolled in this Cohort</span>
                  </div>
                  <button
                    onClick={() => onNavigate(`/programs/${program.id}/access`)}
                    className="px-6 py-3 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[14px] shadow-sm transition flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Enter Live Google Meet Room →</span>
                  </button>
                </div>
              ) : (
                <button
                  disabled={isRegistering}
                  onClick={handleEnroll}
                  className="px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[15.5px] shadow-sm transition disabled:opacity-50 btn-primary-action flex items-center gap-2"
                >
                  {isRegistering ? (
                    <span>Securing Seat...</span>
                  ) : (
                    <span>
                      {program.ctaText || (program.isFree ? 'Register for Free' : `Get Access — ₹${program.price}`)}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#111827] font-semibold text-[14.5px] border border-[#E5E7EB] transition btn-secondary-action"
              >
                My Dashboard
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Main Grid: Learning Outcomes, Curriculum & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <FadeLeft delay={80} className="lg:col-span-2 space-y-8">
          
          {/* What You Will Master */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-[19px] sm:text-[21px] font-bold text-[#101828] tracking-tight font-heading">What You Will Master</h2>
            <div className="space-y-2.5">
              {program.learningOutcomes?.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[15px] text-[#111827]">
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[19px] sm:text-[21px] font-bold text-[#101828] tracking-tight font-heading">Curriculum & Syllabus Breakdown</h2>
              <span className="text-[13px] text-[#667085] font-mono">{program.curriculum?.length || 4} Modules</span>
            </div>

            <div className="space-y-3">
              {program.curriculum?.map((module, idx) => {
                const isOpen = openWeekIdx === idx;
                return (
                  <div key={idx} className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#F8FAF9]">
                    <button
                      onClick={() => setOpenWeekIdx(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left font-bold text-[14.5px] text-[#101828] hover:bg-white flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#E8F8F1] text-[#087A52] text-[11px] font-mono border border-[#00A86B]/20">
                          {module.week}
                        </span>
                        <span>{module.title}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#667085] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white border-t border-[#E5E7EB] text-[14px] space-y-2.5">
                        {module.topics?.map((topic, tidx) => (
                          <div key={tidx} className="flex items-center gap-2.5 text-[#4B5563]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] flex-shrink-0" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speaker / Mentor Profile */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-[19px] sm:text-[21px] font-bold text-[#101828] font-heading">Lead Mentor & Speaker Profile</h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F8F1] text-[#087A52] flex items-center justify-center font-bold text-lg border border-[#00A86B]/20 flex-shrink-0">
                {program.leadMentor ? program.leadMentor.charAt(0) : 'M'}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#101828] text-[16px]">{program.leadMentor}</h3>
                <p className="text-xs text-[#087A52] font-semibold">{program.mentorRole}</p>
                {program.organization && (
                  <p className="text-xs text-[#667085]">{program.organization}</p>
                )}
              </div>
            </div>
          </div>

          {/* Eligibility & Who Should Attend */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-[19px] sm:text-[21px] font-bold text-[#101828] font-heading">Who Should Attend / Eligibility</h2>
            <p className="text-[15px] text-[#4B5563] leading-[1.65] bg-[#F8FAF9] p-4 rounded-xl border border-[#E5E7EB]">
              {program.eligibility}
            </p>

            {program.skills && program.skills.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[12px] font-mono uppercase text-[#667085] block">Target Skills Acquired:</span>
                <div className="flex flex-wrap gap-1.5">
                  {program.skills.map((sk, sidx) => (
                    <span key={sidx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {program.faqs && program.faqs.length > 0 && (
              <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
                <h3 className="text-[12.5px] font-bold uppercase tracking-wider text-[#667085] font-mono">Frequently Asked Questions</h3>
                {program.faqs.map((f, i) => (
                  <div key={i} className="text-[14.5px] space-y-1">
                    <div className="font-semibold text-[#101828]">Q: {f.q}</div>
                    <div className="text-[#4B5563] leading-[1.6] pl-3 border-l-2 border-[#00A86B]">{f.a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </FadeLeft>

        {/* Right Sidebar: Schedule, Price Box & Access */}
        <FadeRight delay={120} className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-5 card-lift">
            <h3 className="font-bold text-[#101828] text-[16px] font-heading">Cohort Logistics</h3>

            <div className="space-y-3 text-[14px] text-[#667085]">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-mono">Date Span</span>
                  <span className="font-semibold text-[#101828]">{program.startDate} to {program.endDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-mono">Live Timings</span>
                  <span className="font-semibold text-[#101828]">{program.schedule}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Video className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-mono">Delivery Mode</span>
                  <span className="font-semibold text-[#101828]">{program.mode || 'Google Meet Live'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-mono">Seats Status</span>
                  <span className="font-semibold text-[#101828]">{program.seatsBooked} of {program.seatsTotal} enrolled</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#667085] uppercase font-mono">Program Fee</span>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-black text-[#101828] font-mono">
                    {program.isFree ? (
                      <span className="text-[#087A52]">FREE</span>
                    ) : (
                      <span>₹{program.price}</span>
                    )}
                  </div>
                  {discountPercent && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-[#9CA3AF] line-through font-mono">₹{program.originalPrice}</span>
                      <span className="px-1.5 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-700 rounded border border-amber-200">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => onNavigate(`/programs/${program.id}/access`)}
                  className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[13px] shadow-sm transition flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Live</span>
                </button>
              ) : (
                <button
                  disabled={isRegistering}
                  onClick={handleEnroll}
                  className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[14px] shadow-sm transition disabled:opacity-50 btn-primary-action"
                >
                  {isRegistering ? 'Enrolling...' : (program.isFree ? 'Join Cohort' : 'Get Access')}
                </button>
              )}
            </div>
          </div>

          {/* Certificate Badge Card */}
          <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-3 shadow-sm card-lift">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] text-[#087A52] flex items-center justify-center font-bold border border-[#00A86B]/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#101828] text-[16px] font-heading">Verifiable Credential Included</h3>
            <p className="text-[14px] text-[#667085] leading-relaxed">
              Upon submitting the final capstone assessment, you receive a cryptographically verified credential accessible in your Student Dashboard.
            </p>
          </div>

        </FadeRight>

      </div>

      {/* Success Modal (System SMALL Modal) */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/35 backdrop-blur-[4px] flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-[20px] max-w-[420px] w-full p-6 sm:p-7 text-center space-y-4 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-modal-pop text-[#111827] relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-[#E8F8F1] text-[#087A52] flex items-center justify-center mx-auto border border-[#00A86B]/20">
              <CheckCircle2 className="w-8 h-8 text-[#00A86B]" />
            </div>

            <h3 className="text-lg font-bold text-[#101828] font-heading">You're In! Enrollment Confirmed</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              You are officially registered for <strong>{program.title}</strong>. Your ticket code is <strong className="text-[#087A52] font-mono">{confirmedRegData?.registrationCode || 'PHN-REG-ACTIVE'}</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-left text-xs space-y-1.5">
              <div className="font-semibold text-[#101828] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Google Meet Live Room Ready</span>
              </div>
              <p className="text-[#667085]">
                Your live room access is active. Click below to launch your session pass.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate(`/programs/${program.id}/access`);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Go to Live Access Room</span>
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('/dashboard');
                }}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[#111827] font-semibold text-xs hover:bg-[#F8FAF9]"
              >
                My Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
