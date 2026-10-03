import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../store/AppContext';
import { FadeUp, FadeLeft, FadeRight } from '../components/Animation';

export const ProgramDetailPage = ({ programId, onNavigate }) => {
  const { programs, registerForProgram, enrolledProgramIds } = useApp();
  const [openWeekIdx, setOpenWeekIdx] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const program = programs.find(p => p.id === programId) || programs[0];
  const isEnrolled = enrolledProgramIds.includes(program.id);

  const handleEnroll = () => {
    setIsRegistering(true);
    setTimeout(() => {
      registerForProgram(program.id);
      setIsRegistering(false);
      setShowSuccessModal(true);

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 800);
  };

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
                {program.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-mono bg-white text-[#667085] border border-[#E5E7EB]">
                {program.mode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-[40px] font-extrabold tracking-tight text-[#101828] font-heading leading-tight">
              {program.title}
            </h1>

            <p className="text-[16px] sm:text-[16.5px] text-[#4B5563] leading-[1.65] max-w-2xl font-normal">
              {program.overview}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-[13.5px] text-[#667085]">
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Starts On</span>
                <strong className="text-[#101828] text-[15px]">{program.startDate}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Cohort Duration</span>
                <strong className="text-[#101828] text-[15px]">{program.duration}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Lead Instructor</span>
                <strong className="text-[#101828] text-[15px]">{program.leadMentor}</strong>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4 flex-wrap">
              {isEnrolled ? (
                <div className="px-6 py-3.5 rounded-xl bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/30 font-semibold text-[14.5px] flex items-center gap-2 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3] text-[#00A86B]" />
                  <span>Enrolled in this Cohort (View on Dashboard)</span>
                </div>
              ) : (
                <button
                  disabled={isRegistering}
                  onClick={handleEnroll}
                  className="px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[15.5px] shadow-sm transition disabled:opacity-50 btn-primary-action"
                >
                  {isRegistering ? (
                    <span>Securing Seat...</span>
                  ) : (
                    <span>{program.isFree ? 'Enroll for Free Now' : `Enroll Now for ₹${program.price}`}</span>
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
          
          {/* Learning Outcomes */}
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

          {/* Eligibility & FAQs */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-[19px] sm:text-[21px] font-bold text-[#101828] font-heading">Who is Eligible?</h2>
            <p className="text-[15px] text-[#4B5563] leading-[1.65] bg-[#F8FAF9] p-4 rounded-xl border border-[#E5E7EB]">
              {program.eligibility}
            </p>

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

        {/* Right Sidebar: Schedule & Certificate Guarantee */}
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
                <div className="text-2xl font-black text-[#101828] font-mono">
                  {program.isFree ? (
                    <span className="text-[#087A52]">FREE</span>
                  ) : (
                    <span>₹{program.price}</span>
                  )}
                </div>
              </div>

              {isEnrolled ? (
                <span className="text-[13.5px] font-bold text-[#087A52]">✓ Enrolled</span>
              ) : (
                <button
                  disabled={isRegistering}
                  onClick={handleEnroll}
                  className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[14px] shadow-sm transition disabled:opacity-50 btn-primary-action"
                >
                  {isRegistering ? 'Enrolling...' : 'Join Cohort'}
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
              Upon submitting the final capstone assessment, you receive a cryptographically verified credential with a permanent public verification link at <span className="text-[#087A52] font-semibold">pharmnexia.in/verify</span>.
            </p>
          </div>

        </FadeRight>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-[#E5E7EB] shadow-2xl animate-fadeIn text-[#111827]">
            <div className="w-14 h-14 rounded-full bg-[#E8F8F1] text-[#087A52] flex items-center justify-center mx-auto border border-[#00A86B]/20">
              <CheckCircle2 className="w-8 h-8 text-[#00A86B]" />
            </div>

            <h3 className="text-lg font-bold text-[#101828] font-heading">You're In! Enrollment Confirmed</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              You are officially registered for <strong>{program.title}</strong>. Access links and session schedule have been added to your Student Dashboard.
            </p>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('/dashboard');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[#111827] font-semibold text-xs hover:bg-[#F8FAF9]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
