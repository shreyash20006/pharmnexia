import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';
import { FadeUp, FadeLeft, FadeRight, ScrollReveal } from '../components/Animation';

export const CareerPathDetailPage = ({ slug, onNavigate }) => {
  const { careerPaths, mentors, programs, resources } = useApp();
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const path = careerPaths.find(p => p.slug === slug || p.id === slug) || careerPaths[0];

  const relatedMentors = mentors.filter(m => m.careerPathSlugs?.includes(path.slug));

  const relatedPrograms = programs.filter(p => 
    p.category.toLowerCase().includes(path.title.toLowerCase()) ||
    path.title.toLowerCase().includes(p.category.toLowerCase()) ||
    p.category === "Career Bootcamps"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-white text-[#111827]">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => onNavigate('/career-paths')}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#667085] hover:text-[#00A86B] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Career Paths</span>
        </button>
      </div>

      {/* Hero Section */}
      <FadeUp>
        <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-14 border border-[#E5E7EB] relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[13px] font-semibold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 font-mono">
                {path.fullTitle}
              </span>
              {path.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-white text-[#667085] border border-[#E5E7EB]">
                  {path.badge}
                </span>
              )}
            </div>

            <h1 className="text-[32px] sm:text-5xl font-extrabold tracking-tight text-[#101828] font-heading leading-tight">
              {path.title}
            </h1>

            <p className="text-[17px] text-[#667085] leading-[1.65] font-normal">
              {path.shortDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-8 text-[14px]">
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Expected Compensation</span>
                <strong className="text-[#00A86B] text-[17px] font-mono">{path.averageSalary}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Typical Timeline</span>
                <strong className="text-[#101828] text-[17px]">{path.duration}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[11px] uppercase font-mono">Key Entrances</span>
                <strong className="text-[#101828] text-[17px]">{path.entranceExams?.[0] || 'Direct Industry'}</strong>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              {relatedMentors.length > 0 ? (
                <button
                  onClick={() => setSelectedMentorForBooking(relatedMentors[0])}
                  className="px-6 py-3 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[15px] shadow-sm transition flex items-center gap-2 btn-primary-action"
                >
                  <Users className="w-4 h-4" />
                  <span>Talk to a {path.title} Mentor</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('/mentors')}
                  className="px-6 py-3 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[15px] shadow-sm transition flex items-center gap-2 btn-primary-action"
                >
                  <Users className="w-4 h-4" />
                  <span>Find Mentors For This Path</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('/programs')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#111827] font-semibold text-[15px] border border-[#E5E7EB] transition"
              >
                Explore Skill Cohorts
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Main Grid: Overview & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview Section */}
          <FadeLeft>
            <div className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h2 className="text-[22px] sm:text-[24px] font-bold text-[#101828] font-heading tracking-tight">
                Is {path.title} Right for You?
              </h2>
              <p className="text-[16px] text-[#667085] leading-[1.65]">
                {path.overview}
              </p>

              <div className="pt-4">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#087A52] mb-3">
                  Who Should Consider This Pathway
                </h3>
                <div className="space-y-3">
                  {path.whoShouldConsider?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[15px] text-[#111827]">
                      <CheckCircle2 className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeLeft>

          {/* Step-by-Step Roadmap */}
          <FadeLeft delay={80}>
            <div className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[12.5px] font-bold uppercase tracking-wider text-[#087A52] font-mono">Milestone Plan</span>
                  <h2 className="text-[22px] sm:text-[24px] font-bold text-[#101828] font-heading tracking-tight mt-1">
                    Step-by-Step Execution Roadmap
                  </h2>
                </div>
                <span className="text-[13px] text-[#667085] font-mono">
                  {path.stepRoadmap?.length || 4} Key Stages
                </span>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                {path.stepRoadmap?.map((step) => (
                  <div key={step.step} className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#00A86B] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm flex-shrink-0 z-10 font-heading">
                      {step.step}
                    </div>
                    <div className="p-5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex-1">
                      <h3 className="font-bold text-[#101828] text-[17px] mb-1 font-heading">{step.title}</h3>
                      <p className="text-[14.5px] text-[#667085] leading-[1.6]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeLeft>

          {/* Entrance Exams & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeLeft delay={120}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3 h-full">
                <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#101828] text-[18px] font-heading">Key Entrance Exams</h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {path.entranceExams?.map((exam, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-[13px] font-semibold bg-[#F8FAF9] text-[#111827] border border-[#E5E7EB]">
                      {exam}
                    </span>
                  ))}
                </div>
                <p className="text-[14.5px] text-[#667085] pt-2 leading-[1.6]">
                  {path.recommendedPrep}
                </p>
              </div>
            </FadeLeft>

            <FadeRight delay={120}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3 h-full">
                <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#101828] text-[18px] font-heading">Core Skills Required</h3>
                <div className="space-y-2 pt-1">
                  {path.skillsRequired?.map((skill, idx) => (
                    <div key={idx} className="text-[14.5px] text-[#111827] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]"></span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeRight>
          </div>

          {/* Career Roles & Higher Studies */}
          <FadeUp delay={100}>
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-bold text-[#101828] text-[19px] font-heading">Possible Career Roles & Job Titles</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {path.possibleRoles?.map((role, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[14px] font-medium text-[#111827]">
                    💼 {role}
                  </div>
                ))}
              </div>

              {path.higherStudies && (
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#087A52] block mb-2 font-mono">
                    Higher Study Progression
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {path.higherStudies.map((hs, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-[13px] bg-[#E8F8F1] border border-[#00A86B]/20 text-[#087A52] font-medium">
                        🎓 {hs}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Frequently Asked Questions */}
          {path.faqs && path.faqs.length > 0 && (
            <FadeUp delay={120}>
              <div className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-[20px] font-bold text-[#101828] font-heading tracking-tight">
                  Frequently Asked Questions about {path.title}
                </h3>
                <div className="space-y-3">
                  {path.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#F8FAF9]">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                          className="w-full p-4 text-left font-semibold text-[15px] text-[#101828] hover:bg-white flex items-center justify-between transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-[#00A86B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 text-[14.5px] text-[#667085] bg-white border-t border-[#E5E7EB] leading-[1.6]">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeUp>
          )}

        </div>

        {/* Right Column: Related Mentors & Programs */}
        <div className="space-y-8">
          
          {/* Related Mentors Card */}
          <FadeRight>
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4 card-lift">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#101828] text-[16px] font-heading">Verified Mentors</h3>
                <span className="text-[13px] text-[#087A52] font-mono font-semibold">{relatedMentors.length} Available</span>
              </div>

              {relatedMentors.length === 0 ? (
                <p className="text-[14.5px] text-[#667085] py-3 leading-[1.6]">Explore mentors available across industry and research paths.</p>
              ) : (
                <div className="space-y-3">
                  {relatedMentors.map(m => (
                    <div key={m.id} className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-start gap-3">
                      <img 
                        src={m.avatarUrl} 
                        alt={m.name} 
                        className="w-11 h-11 rounded-xl object-cover border border-[#00A86B] flex-shrink-0 avatar-zoom"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#101828] text-[14px] truncate flex items-center gap-1 font-heading">
                          <span>{m.name}</span>
                          {m.verifiedBadge && <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" />}
                        </div>
                        <div className="text-[12px] text-[#087A52] font-semibold truncate">{m.currentRole}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">{m.sessionDuration} • {m.price30 === 0 ? 'Free' : `₹${m.price30}`}</div>

                        <button
                          onClick={() => setSelectedMentorForBooking(m)}
                          className="mt-2.5 w-full py-2 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[13px] shadow-sm transition btn-primary-action"
                        >
                          Book 1-on-1 Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => onNavigate('/mentors')}
                className="w-full py-2.5 text-center text-[14px] font-semibold text-[#667085] hover:text-[#00A86B] transition"
              >
                Browse All Mentors →
              </button>
            </div>
          </FadeRight>

          {/* Related Programs */}
          {relatedPrograms.length > 0 && (
            <FadeRight delay={100}>
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4 card-lift">
                <h3 className="font-bold text-[#101828] text-[16px] font-heading">Skill Cohorts</h3>
                <div className="space-y-3">
                  {relatedPrograms.map(p => (
                    <div key={p.id} className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-2">
                      <div className="text-[11.5px] font-semibold text-[#087A52]">{p.category}</div>
                      <div className="font-bold text-[#101828] text-[15px] leading-snug font-heading">{p.title}</div>
                      <div className="flex items-center justify-between text-[13px] text-[#667085] pt-1">
                        <span>{p.duration}</span>
                        <strong className="text-[#101828]">{p.isFree ? 'Free' : `₹${p.price}`}</strong>
                      </div>
                      <button
                        onClick={() => onNavigate(`/programs/${p.id}`)}
                        className="mt-1 w-full py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] font-semibold text-[13px] hover:border-[#00A86B] hover:text-[#00A86B] transition"
                      >
                        View Syllabus & Enroll
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FadeRight>
          )}

        </div>

      </div>

      {/* Booking Modal Trigger */}
      {selectedMentorForBooking && (
        <BookingModal 
          mentor={selectedMentorForBooking} 
          onClose={() => setSelectedMentorForBooking(null)}
          onNavigateToDashboard={onNavigate}
        />
      )}

    </div>
  );
};

export default CareerPathDetailPage;
