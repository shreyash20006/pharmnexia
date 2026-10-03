import React, { useState } from 'react';
import { 
  ArrowRight, 
  Compass, 
  Users, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';
import { 
  ScrollReveal, 
  FadeUp, 
  FadeLeft, 
  FadeRight, 
  StaggerContainer 
} from '../components/Animation';

export const HomePage = ({ onNavigate }) => {
  const { careerPaths, mentors, programs, opportunities } = useApp();
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);

  // Top 4 mentors (if any exist in Supabase DB)
  const featuredMentors = mentors.slice(0, 4);

  // Top 3 programs
  const featuredPrograms = programs.slice(0, 3);

  // Top 4 opportunities
  const featuredOpportunities = opportunities.slice(0, 4);

  return (
    <div className="bg-[#FFFFFF] text-[#111111] overflow-hidden">
      
      {/* ==============================================================================
          1. HERO SECTION (Minimalist, Clean, Large Whitespace, Staggered Load)
          ============================================================================== */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Eyebrow (0ms entrance) */}
        <div className="inline-block mb-6 animate-hero-eyebrow">
          <span className="text-[13.5px] sm:text-[14px] font-semibold tracking-wider uppercase text-[#00A86B] bg-[#F8FAF9] border border-[#E5EAE7] px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>The Pharmacy Career & Mentorship Ecosystem</span>
          </span>
        </div>

        {/* Main Heading (Line 1: 100ms, Line 2: 220ms) */}
        <h1 className="text-[40px] sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-[#111111] leading-[1.08] font-heading">
          <span className="block animate-hero-h1-1">Your Pharmacy Career,</span>
          <span className="text-[#00A86B] block animate-hero-h1-2 mt-1 sm:mt-2">Connected.</span>
        </h1>

        {/* Hero Description (320ms entrance) */}
        <p className="mt-6 text-[17px] sm:text-[19px] text-[#5F6663] max-w-2xl mx-auto leading-[1.65] animate-hero-desc">
          Discover career paths, learn from people who have already walked them, build practical skills, and find opportunities — all in one place.
        </p>

        {/* Hero Buttons (Primary from Left 420ms, Secondary from Right 500ms) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/career-paths')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[16px] shadow-sm flex items-center justify-center gap-2 group btn-primary-action animate-hero-btn-primary"
          >
            <span>Explore Career Paths</span>
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </button>

          <button
            onClick={() => onNavigate('/mentors')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#111111] border border-[#00A86B] font-semibold text-[16px] flex items-center justify-center gap-2 btn-secondary-action animate-hero-btn-secondary"
          >
            <span>Find a Mentor</span>
          </button>
        </div>

        {/* Subtle Minimal Pharmacy Connection Line (580ms entrance) */}
        <div className="mt-16 pt-10 border-t border-[#E5EAE7] animate-hero-paths">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[14px] text-[#5F6663]">
            <span className="font-bold text-[#111111]">B.Pharm</span>
            <span className="text-[#00A86B] font-semibold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7] font-medium">MBA / Management</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7] font-medium">GPAT & NIPER</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7] font-medium">Pharmacovigilance</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7] font-medium">Regulatory Affairs</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7] font-medium">Research & PhD</span>
          </div>
        </div>

      </section>

      {/* ==============================================================================
          2. TRUST / REAL DATA SECTION (Horizontal, Minimal)
          ============================================================================== */}
      <section className="bg-[#F8FAF9] border-y border-[#E5EAE7] py-10 px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111111] font-heading">14+</div>
              <div className="text-[13.5px] text-[#5F6663] mt-1 font-medium">Curated Career Paths</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#00A86B] font-heading">Verified</div>
              <div className="text-[13.5px] text-[#5F6663] mt-1 font-medium">Alumni & Industry Mentors</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111111] font-heading">Practical</div>
              <div className="text-[13.5px] text-[#5F6663] mt-1 font-medium">Skill Cohorts & Workshops</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#00A86B] font-heading">Pan-India</div>
              <div className="text-[13.5px] text-[#5F6663] mt-1 font-medium">Pharmacy Student Network</div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ==============================================================================
          3. CAREER PATHS PREVIEW ("Explore Your Career Path")
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp className="max-w-3xl mb-12">
          <span className="text-[13.5px] font-semibold text-[#00A86B] uppercase tracking-wider">
            Explore Your Career Path
          </span>
          <h2 className="text-[28px] sm:text-[38px] lg:text-[42px] font-bold text-[#111111] tracking-tight mt-2 font-heading leading-[1.15]">
            See where your pharmacy degree can take you.
          </h2>
          <p className="text-[17px] text-[#5F6663] mt-2.5 leading-[1.6]">
            Structured roadmaps, required skills, and direct access to seniors who have walked each pathway.
          </p>
        </FadeUp>

        {/* Clean Alternating Directional Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((path, idx) => {
            const direction = idx % 2 === 0 ? 'left' : 'right';
            const delay = Math.min((idx % 3) * 80, 200);

            return (
              <ScrollReveal
                key={path.id}
                direction={direction}
                delay={delay}
                className="h-full"
              >
                <div
                  onClick={() => onNavigate(`/career-paths/${path.slug}`)}
                  className="group p-6 rounded-2xl bg-white border border-[#E5EAE7] card-lift cursor-pointer flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F8FAF9] border border-[#E5EAE7] flex items-center justify-center text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-white transition-colors">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="text-[12px] font-medium text-[#5F6663] bg-[#F8FAF9] px-2.5 py-1 rounded-md border border-[#E5EAE7]">
                        {path.category}
                      </span>
                    </div>

                    <h3 className="text-[20px] sm:text-[21px] font-bold text-[#111111] group-hover:text-[#00A86B] transition-colors font-heading mb-2">
                      {path.title}
                    </h3>

                    <p className="text-[15px] sm:text-[15.5px] text-[#5F6663] leading-[1.55] line-clamp-2">
                      {path.shortDesc}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-[#E5EAE7] flex items-center justify-between text-[14.5px] font-semibold text-[#5F6663] group-hover:text-[#00A86B]">
                    <span>Explore Path</span>
                    <ArrowRight className="w-4 h-4 card-arrow" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ==============================================================================
          4. MENTOR SECTION ("Learn From Someone Who Has Been There")
          ============================================================================== */}
      <section className="bg-[#F8FAF9] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y border-[#E5EAE7]">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[13.5px] font-semibold text-[#00A86B] uppercase tracking-wider">
                1-on-1 Guidance
              </span>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[42px] font-bold text-[#111111] tracking-tight mt-2 font-heading leading-[1.15]">
                Learn From Someone Who Has Been There.
              </h2>
              <p className="text-[17px] text-[#5F6663] mt-2.5 max-w-xl leading-[1.6]">
                Connect with mentors who have actually walked the career path you're considering.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/mentors')}
              className="text-[15px] sm:text-[16px] font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1.5 transition-colors self-start sm:self-end group"
            >
              <span>View All Mentors</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeUp>

          {/* Staggered Mentor Cards OR Invitation Callout */}
          {featuredMentors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMentors.map((mentor, index) => (
                <ScrollReveal
                  key={mentor.id}
                  direction="up"
                  delay={index * 80}
                  className="h-full"
                >
                  <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] card-lift flex flex-col justify-between h-full">
                    <div>
                      <div className="relative mb-4 w-16 h-16">
                        <img 
                          src={mentor.avatarUrl} 
                          alt={mentor.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-[#E5EAE7] avatar-zoom"
                        />
                        {mentor.verifiedBadge && (
                          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#00A86B] text-white" title="Verified Practitioner">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111111] font-heading">
                        {mentor.name}
                      </h3>

                      <div className="text-[14.5px] font-medium text-[#00A86B] mt-0.5">
                        {mentor.qualification}
                      </div>

                      <p className="text-[15px] text-[#5F6663] mt-1 leading-snug line-clamp-1">
                        {mentor.currentRole} • {mentor.currentOrg}
                      </p>

                      <div className="mt-3 pt-3 border-t border-[#E5EAE7] text-[14px] text-[#5F6663]">
                        <span className="text-[12px] font-semibold text-[#111111] block mb-1">Focus Areas:</span>
                        <p className="line-clamp-2 leading-relaxed">
                          {mentor.whatICanHelpWith?.[0] || mentor.about}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E5EAE7] flex items-center justify-between">
                      <div className="text-[14px]">
                        <span className="text-[#5F6663]">Fee: </span>
                        <span className="font-bold text-[#111111]">
                          {mentor.price30 === 0 ? 'Free' : `₹${mentor.price30}`}
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigate(`/mentors/${mentor.id}`)}
                        className="text-[14px] font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors group"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <FadeUp>
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5EAE7] text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-[22px] sm:text-[24px] font-bold text-[#111111] font-heading">
                  Verified Mentor Directory Launching
                </h3>
                <p className="text-[16px] text-[#5F6663] leading-[1.65]">
                  Connect directly with verified pharmacists, clinical scientists, and alumni who have walked your target path. Are you a pharmacy practitioner, researcher, or faculty member?
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => onNavigate('/mentors')}
                    className="px-6 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-[15px] font-semibold shadow-sm btn-primary-action"
                  >
                    Apply as a Verified Mentor
                  </button>
                  <button
                    onClick={() => onNavigate('/career-paths')}
                    className="px-6 py-3.5 rounded-xl bg-white border border-[#E5EAE7] hover:border-[#00A86B] text-[#111111] text-[15px] font-semibold transition"
                  >
                    Explore Career Paths
                  </button>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ==============================================================================
          5. HOW IT WORKS (Directional: 01 Left, 02 Bottom, 03 Right)
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[13.5px] font-semibold text-[#00A86B] uppercase tracking-wider">
            Clear Progression
          </span>
          <h2 className="text-[28px] sm:text-[38px] lg:text-[42px] font-bold text-[#111111] tracking-tight mt-2 font-heading leading-[1.15]">
            How It Works
          </h2>
          <p className="text-[17px] text-[#5F6663] mt-2.5 leading-[1.6]">
            A simple, transparent process to go from uncertainty to a clear career roadmap.
          </p>
        </FadeUp>

        {/* 3 Directional Steps: 01 Left, 02 Up, 03 Right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 01: Left -> Center */}
          <ScrollReveal direction="left" delay={0} className="h-full">
            <div className="p-8 rounded-2xl bg-white border border-[#E5EAE7] card-lift h-full flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold text-[#00A86B] font-mono mb-4">01</div>
                <h3 className="text-[21px] sm:text-[22px] font-bold text-[#111111] font-heading mb-2.5">
                  Choose Your Path
                </h3>
                <p className="text-[15.5px] text-[#5F6663] leading-[1.6]">
                  Explore 14+ distinct career trajectories across industry, research, government exams, and global studies with realistic timelines and entry criteria.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5EAE7] flex items-center text-[14px] font-semibold text-[#00A86B]">
                <span>Self-guided Roadmaps</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Step 02: Bottom -> Center */}
          <ScrollReveal direction="up" delay={90} className="h-full">
            <div className="p-8 rounded-2xl bg-white border border-[#E5EAE7] card-lift h-full flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold text-[#00A86B] font-mono mb-4">02</div>
                <h3 className="text-[21px] sm:text-[22px] font-bold text-[#111111] font-heading mb-2.5">
                  Connect With a Mentor
                </h3>
                <p className="text-[15.5px] text-[#5F6663] leading-[1.6]">
                  Book private 1-on-1 virtual sessions with verified seniors and working professionals who have navigated the exact roadmap you're targeting.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5EAE7] flex items-center text-[14px] font-semibold text-[#00A86B]">
                <span>Verified 1-on-1 Advice</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Step 03: Right -> Center */}
          <ScrollReveal direction="right" delay={180} className="h-full">
            <div className="p-8 rounded-2xl bg-white border border-[#E5EAE7] card-lift h-full flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold text-[#00A86B] font-mono mb-4">03</div>
                <h3 className="text-[21px] sm:text-[22px] font-bold text-[#111111] font-heading mb-2.5">
                  Build Your Career
                </h3>
                <p className="text-[15.5px] text-[#5F6663] leading-[1.6]">
                  Master hands-on industry skills through live cohorts, earn verifiable digital credentials, and apply directly to curated opportunities.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5EAE7] flex items-center text-[14px] font-semibold text-[#00A86B]">
                <span>Industry Placements</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ==============================================================================
          6. PROGRAMS & OPPORTUNITIES (Clean & Compact)
          ============================================================================== */}
      <section className="bg-[#F8FAF9] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y border-[#E5EAE7]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Programs Block */}
          <div>
            <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[13.5px] font-semibold text-[#00A86B] uppercase tracking-wider">
                  Skill Cohorts
                </span>
                <h2 className="text-[26px] sm:text-[34px] font-bold text-[#111111] tracking-tight mt-1 font-heading leading-[1.15]">
                  Practical Programs & Masterclasses
                </h2>
                <p className="text-[15.5px] text-[#5F6663] mt-1.5 leading-[1.6]">
                  Bridging the gap between textbook syllabi and corporate job requirements.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/programs')}
                className="text-[15px] sm:text-[16px] font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1.5 transition-colors self-start sm:self-end group"
              >
                <span>View All Programs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPrograms.map((prog, index) => (
                <ScrollReveal
                  key={prog.id}
                  direction="up"
                  delay={index * 80}
                  className="h-full"
                >
                  <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] card-lift flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3 text-[13px]">
                        <span className="font-semibold text-[#00A86B] bg-[#F8FAF9] px-2.5 py-0.5 rounded-md border border-[#E5EAE7]">
                          {prog.category}
                        </span>
                        <span className="text-[#5F6663] font-mono text-[12px]">{prog.duration}</span>
                      </div>

                      <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111111] font-heading mb-2 leading-snug">
                        {prog.title}
                      </h3>

                      <p className="text-[15px] text-[#5F6663] leading-[1.55] line-clamp-2 mb-4">
                        {prog.overview}
                      </p>

                      <div className="text-[14px] text-[#5F6663] space-y-1 bg-[#F8FAF9] p-3.5 rounded-xl border border-[#E5EAE7] mb-4">
                        <div>Instructor: <strong className="text-[#111111]">{prog.leadMentor}</strong></div>
                        <div>Starts: <strong className="text-[#111111]">{prog.startDate}</strong></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5EAE7] flex items-center justify-between">
                      <div className="text-[16px] font-bold text-[#111111]">
                        {prog.isFree ? (
                          <span className="text-[#00A86B]">Free</span>
                        ) : (
                          <span>₹{prog.price}</span>
                        )}
                      </div>

                      <button
                        onClick={() => onNavigate(`/programs/${prog.id}`)}
                        className="text-[14.5px] font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors group"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Opportunities Block */}
          <div>
            <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[13.5px] font-semibold text-[#00A86B] uppercase tracking-wider">
                  Vetted Openings
                </span>
                <h2 className="text-[26px] sm:text-[34px] font-bold text-[#111111] tracking-tight mt-1 font-heading leading-[1.15]">
                  Curated Opportunities
                </h2>
                <p className="text-[15.5px] text-[#5F6663] mt-1.5 leading-[1.6]">
                  Direct openings across CROs, regulatory firms, clinical sites, and research institutions.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/opportunities')}
                className="text-[15px] sm:text-[16px] font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1.5 transition-colors self-start sm:self-end group"
              >
                <span>View All Openings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredOpportunities.map((opp, index) => (
                <ScrollReveal
                  key={opp.id}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  delay={index * 60}
                  className="h-full"
                >
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE7] card-lift flex items-start justify-between gap-4 h-full">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F8FAF9] text-[#00A86B] border border-[#E5EAE7]">
                          {opp.category}
                        </span>
                        <span className="text-[12px] text-[#5F6663] flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#00A86B]" />
                          <span>{opp.location} ({opp.remote})</span>
                        </span>
                      </div>

                      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#111111] font-heading leading-snug">
                        {opp.title}
                      </h3>
                      <p className="text-[14.5px] text-[#5F6663]">
                        {opp.organization}
                      </p>

                      <div className="text-[13.5px] font-semibold text-[#00A86B] pt-0.5">
                        Stipend / CTC: {opp.stipend}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pt-1">
                      <button
                        onClick={() => onNavigate(`/opportunities/${opp.id}`)}
                        className="px-4 py-2 rounded-xl border border-[#E5EAE7] hover:border-[#00A86B] text-[#111111] hover:text-[#00A86B] text-[13.5px] font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
          7. TESTIMONIALS (3 Clean Minimal Cards)
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[13.5px] font-semibold text-[#00A86B] uppercase tracking-wider">
            Student Reflections
          </span>
          <h2 className="text-[28px] sm:text-[38px] lg:text-[42px] font-bold text-[#111111] tracking-tight mt-2 font-heading leading-[1.15]">
            Guidance That Made a Difference
          </h2>
          <p className="text-[17px] text-[#5F6663] mt-2.5 leading-[1.6]">
            Real outcomes from students who planned their career steps through PharmNexia.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal direction="up" delay={0} className="h-full">
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAE7] card-lift flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl text-[#00A86B] font-serif mb-2">“</div>
                <p className="text-[15px] text-[#5F6663] leading-[1.65]">
                  Speaking with an alumnus who transitioned from B.Pharm to IIM gave me the exact CAT preparation strategy and clarity on answering interview panels about my pharmacy background.
                </p>
              </div>
              <div className="pt-4 mt-5 border-t border-[#E5EAE7]">
                <div className="font-bold text-[15px] text-[#111111]">Aman K.</div>
                <div className="text-[12.5px] text-[#5F6663]">Targeting CAT & Pharma Management</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={90} className="h-full">
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAE7] card-lift flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl text-[#00A86B] font-serif mb-2">“</div>
                <p className="text-[15px] text-[#5F6663] leading-[1.65]">
                  The Pharmacovigilance case-narrative workshop covered practical Argus Safety concepts that college syllabi never touch. It gave me complete confidence in my technical interviews.
                </p>
              </div>
              <div className="pt-4 mt-5 border-t border-[#E5EAE7]">
                <div className="font-bold text-[15px] text-[#111111]">Sneha M.</div>
                <div className="text-[12.5px] text-[#5F6663]">Placed as Drug Safety Associate</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={180} className="h-full">
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAE7] card-lift flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl text-[#00A86B] font-serif mb-2">“</div>
                <p className="text-[15px] text-[#5F6663] leading-[1.65]">
                  Having clear breakdowns of Drug Inspector PSC exams alongside research fellowships saved me months of searching through random WhatsApp groups and forums.
                </p>
              </div>
              <div className="pt-4 mt-5 border-t border-[#E5EAE7]">
                <div className="font-bold text-[15px] text-[#111111]">Rohan D.</div>
                <div className="text-[12.5px] text-[#5F6663]">M.Pharm Research Aspirant</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==============================================================================
          8. FINAL CALL TO ACTION (Clean, Spacious, Focused)
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E5EAE7] bg-[#F8FAF9]">
        <FadeUp className="max-w-3xl mx-auto text-center">
          <h2 className="text-[30px] sm:text-[42px] font-bold tracking-tight text-[#111111] font-heading leading-[1.15]">
            Your next career step starts with the right connection.
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#5F6663] mt-4 max-w-xl mx-auto leading-[1.65]">
            Explore career paths, meet mentors and discover opportunities built specifically for pharmacy students.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onNavigate('/career-paths')}
              className="px-8 py-4 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[16px] shadow-sm inline-flex items-center gap-2 group btn-primary-action"
            >
              <span>Explore PharmNexia</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </button>
          </div>
        </FadeUp>
      </section>

      {/* Booking Modal (If triggered directly) */}
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

export default HomePage;
