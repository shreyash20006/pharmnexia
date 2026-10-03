import React, { useState } from 'react';
import { 
  ArrowRight, 
  Compass, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Calendar, 
  Clock, 
  BookOpen, 
  MapPin, 
  CheckCircle2,
  FileText,
  Building2,
  TrendingUp,
  Search
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';

export const HomePage = ({ onNavigate }) => {
  const { careerPaths, mentors, programs, opportunities } = useApp();
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);

  // Featured 4 mentors
  const featuredMentors = mentors.slice(0, 4);

  // Top 3 programs
  const featuredPrograms = programs.slice(0, 3);

  // Top 4 opportunities
  const featuredOpportunities = opportunities.slice(0, 4);

  return (
    <div className="bg-[#FFFFFF] text-[#111111] overflow-hidden">
      
      {/* ==============================================================================
          1. HERO SECTION (Minimalist, Clean, Large Whitespace)
          ============================================================================== */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Eyebrow */}
        <div className="inline-block mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#00A86B] bg-[#F8FAF9] border border-[#E5EAE7] px-4 py-1.5 rounded-full">
            The Pharmacy Career & Mentorship Ecosystem
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#111111] leading-[1.08] font-heading">
          Your Pharmacy Career,<br />
          <span className="text-[#00A86B]">Connected.</span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#5F6663] max-w-2xl mx-auto leading-relaxed">
          Discover career paths, learn from people who have already walked them, build practical skills, and find opportunities — all in one place.
        </p>

        {/* Hero Buttons (Only Two Primary Actions) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/career-paths')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-medium text-base transition-colors shadow-sm flex items-center justify-center gap-2 group"
          >
            <span>Explore Career Paths</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('/mentors')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#111111] border border-[#00A86B] font-medium text-base transition-colors flex items-center justify-center gap-2"
          >
            <span>Find a Mentor</span>
          </button>
        </div>

        {/* Subtle Minimal Pharmacy Connection Line */}
        <div className="mt-16 pt-10 border-t border-[#E5EAE7]">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#5F6663]">
            <span className="font-semibold text-[#111111]">B.Pharm</span>
            <span className="text-[#00A86B]">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7]">MBA / Management</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7]">GPAT & NIPER</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7]">Pharmacovigilance</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7]">Regulatory Affairs</span>
            <span className="text-[#E5EAE7]">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7]">Abroad</span>
          </div>
        </div>

      </section>

      {/* ==============================================================================
          2. TRUST / REAL DATA SECTION (Horizontal, Minimal)
          ============================================================================== */}
      <section className="bg-[#F8FAF9] border-y border-[#E5EAE7] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#111111] font-heading">14+</div>
            <div className="text-xs text-[#5F6663] mt-1 font-medium">Curated Career Paths</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#00A86B] font-heading">Verified</div>
            <div className="text-xs text-[#5F6663] mt-1 font-medium">Alumni & Industry Mentors</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#111111] font-heading">Practical</div>
            <div className="text-xs text-[#5F6663] mt-1 font-medium">Skill Cohorts & Workshops</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#00A86B] font-heading">Pan-India</div>
            <div className="text-xs text-[#5F6663] mt-1 font-medium">Pharmacy Student Network</div>
          </div>
        </div>
      </section>

      {/* ==============================================================================
          3. CAREER PATHS PREVIEW ("Explore Your Career Path")
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-[#00A86B] uppercase tracking-wider">
            Explore Your Career Path
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] tracking-tight mt-2 font-heading">
            See where your pharmacy degree can take you.
          </h2>
          <p className="text-sm text-[#5F6663] mt-2">
            Structured roadmaps, required skills, and direct access to seniors who have walked each pathway.
          </p>
        </div>

        {/* Clean Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {careerPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => onNavigate(`/career-paths/${path.slug}`)}
              className="group p-6 rounded-xl bg-white border border-[#E5EAE7] hover:border-[#00A86B] transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#F8FAF9] border border-[#E5EAE7] flex items-center justify-center text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-white transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#5F6663] bg-[#F8FAF9] px-2 py-0.5 rounded border border-[#E5EAE7]">
                    {path.category}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#111111] group-hover:text-[#00A86B] transition-colors font-heading mb-1.5">
                  {path.title}
                </h3>

                <p className="text-xs text-[#5F6663] leading-relaxed line-clamp-2">
                  {path.shortDesc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5EAE7] flex items-center justify-between text-xs font-medium text-[#5F6663] group-hover:text-[#00A86B]">
                <span>Explore Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==============================================================================
          4. MENTOR SECTION ("Learn From Someone Who Has Been There")
          ============================================================================== */}
      <section className="bg-[#F8FAF9] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y border-[#E5EAE7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold text-[#00A86B] uppercase tracking-wider">
                1-on-1 Guidance
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] tracking-tight mt-2 font-heading">
                Learn From Someone Who Has Been There.
              </h2>
              <p className="text-sm text-[#5F6663] mt-2 max-w-xl">
                Connect with mentors who have actually walked the career path you're considering.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/mentors')}
              className="text-xs sm:text-sm font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors self-start sm:self-end"
            >
              <span>View All Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Minimal Mentor Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMentors.map((mentor) => (
              <div 
                key={mentor.id}
                className="p-6 rounded-xl bg-white border border-[#E5EAE7] hover:border-[#00A86B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-4 w-16 h-16">
                    <img 
                      src={mentor.avatarUrl} 
                      alt={mentor.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-[#E5EAE7]"
                    />
                    {mentor.verifiedBadge && (
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#00A86B] text-white" title="Verified Practitioner">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#111111] font-heading">
                    {mentor.name}
                  </h3>

                  <div className="text-xs font-medium text-[#00A86B] mt-0.5">
                    {mentor.qualification}
                  </div>

                  <p className="text-xs text-[#5F6663] mt-1 leading-snug line-clamp-1">
                    {mentor.currentRole} • {mentor.currentOrg}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#E5EAE7] text-xs text-[#5F6663]">
                    <span className="text-[11px] font-medium text-[#111111] block mb-1">Focus Areas:</span>
                    <p className="line-clamp-2 leading-relaxed">
                      {mentor.whatICanHelpWith?.[0] || mentor.about}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5EAE7] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#5F6663]">Fee: </span>
                    <span className="font-semibold text-[#111111]">
                      {mentor.price30 === 0 ? 'Free' : `₹${mentor.price30}`}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate(`/mentors/${mentor.id}`)}
                    className="text-xs font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================================================
          5. HOW IT WORKS (3 Simple Steps)
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-[#00A86B] uppercase tracking-wider">
            Clear Progression
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] tracking-tight mt-2 font-heading">
            How It Works
          </h2>
          <p className="text-sm text-[#5F6663] mt-2">
            A simple, transparent process to go from uncertainty to a clear career roadmap.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-white border border-[#E5EAE7] relative">
            <div className="text-2xl font-bold text-[#00A86B] font-mono mb-4">01</div>
            <h3 className="text-lg font-bold text-[#111111] font-heading mb-2">
              Choose Your Path
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6663] leading-relaxed">
              Explore 14+ distinct career trajectories across industry, research, government exams, and global studies with realistic timelines and entry criteria.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-white border border-[#E5EAE7] relative">
            <div className="text-2xl font-bold text-[#00A86B] font-mono mb-4">02</div>
            <h3 className="text-lg font-bold text-[#111111] font-heading mb-2">
              Connect With a Mentor
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6663] leading-relaxed">
              Book private 1-on-1 virtual sessions with verified seniors and working professionals who have navigated the exact roadmap you're targeting.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-white border border-[#E5EAE7] relative">
            <div className="text-2xl font-bold text-[#00A86B] font-mono mb-4">03</div>
            <h3 className="text-lg font-bold text-[#111111] font-heading mb-2">
              Build Your Career
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6663] leading-relaxed">
              Master hands-on industry skills through live cohorts, earn verifiable digital credentials, and apply directly to curated opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ==============================================================================
          6. PROGRAMS & OPPORTUNITIES (Clean & Compact)
          ============================================================================== */}
      <section className="bg-[#F8FAF9] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y border-[#E5EAE7]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Programs Block */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#00A86B] uppercase tracking-wider">
                  Skill Cohorts
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1 font-heading">
                  Practical Programs & Masterclasses
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6663] mt-1">
                  Bridging the gap between textbook syllabi and corporate job requirements.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/programs')}
                className="text-xs font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors self-start sm:self-end"
              >
                <span>View All Programs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPrograms.map((prog) => (
                <div 
                  key={prog.id}
                  className="p-6 rounded-xl bg-white border border-[#E5EAE7] hover:border-[#00A86B] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-medium text-[#00A86B] bg-[#F8FAF9] px-2.5 py-0.5 rounded border border-[#E5EAE7]">
                        {prog.category}
                      </span>
                      <span className="text-[#5F6663] font-mono text-[11px]">{prog.duration}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#111111] font-heading mb-2 leading-snug">
                      {prog.title}
                    </h3>

                    <p className="text-xs text-[#5F6663] leading-relaxed line-clamp-2 mb-4">
                      {prog.overview}
                    </p>

                    <div className="text-xs text-[#5F6663] space-y-1 bg-[#F8FAF9] p-3 rounded-lg border border-[#E5EAE7] mb-4">
                      <div>Instructor: <strong className="text-[#111111]">{prog.leadMentor}</strong></div>
                      <div>Starts: <strong className="text-[#111111]">{prog.startDate}</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5EAE7] flex items-center justify-between">
                    <div className="text-sm font-bold text-[#111111]">
                      {prog.isFree ? (
                        <span className="text-[#00A86B]">Free</span>
                      ) : (
                        <span>₹{prog.price}</span>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate(`/programs/${prog.id}`)}
                      className="text-xs font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors"
                    >
                      <span>View Syllabus</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities Block */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#00A86B] uppercase tracking-wider">
                  Vetted Openings
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1 font-heading">
                  Curated Opportunities
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6663] mt-1">
                  Direct openings across CROs, regulatory firms, clinical sites, and research institutions.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/opportunities')}
                className="text-xs font-semibold text-[#00A86B] hover:text-[#087A52] flex items-center gap-1 transition-colors self-start sm:self-end"
              >
                <span>View All Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredOpportunities.map((opp) => (
                <div 
                  key={opp.id}
                  className="p-5 rounded-xl bg-white border border-[#E5EAE7] hover:border-[#00A86B] transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F8FAF9] text-[#00A86B] border border-[#E5EAE7]">
                        {opp.category}
                      </span>
                      <span className="text-[11px] text-[#5F6663] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#00A86B]" />
                        <span>{opp.location} ({opp.remote})</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#111111] font-heading leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-[#5F6663]">
                      {opp.organization}
                    </p>

                    <div className="text-xs font-medium text-[#00A86B] pt-0.5">
                      Stipend / CTC: {opp.stipend}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pt-1">
                    <button
                      onClick={() => onNavigate(`/opportunities/${opp.id}`)}
                      className="px-3.5 py-1.5 rounded-lg border border-[#E5EAE7] hover:border-[#00A86B] text-[#111111] hover:text-[#00A86B] text-xs font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
          7. TESTIMONIALS (3 Clean Minimal Cards)
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-[#00A86B] uppercase tracking-wider">
            Student Reflections
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] tracking-tight mt-2 font-heading">
            Guidance That Made a Difference
          </h2>
          <p className="text-sm text-[#5F6663] mt-2">
            Real outcomes from students who planned their career steps through PharmNexia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#E5EAE7] flex flex-col justify-between">
            <div>
              <div className="text-2xl text-[#00A86B] font-serif mb-2">“</div>
              <p className="text-xs sm:text-sm text-[#5F6663] leading-relaxed">
                Speaking with an alumnus who transitioned from B.Pharm to IIM gave me the exact CAT preparation strategy and clarity on answering interview panels about my pharmacy background.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E5EAE7]">
              <div className="font-semibold text-xs text-[#111111]">Aman K.</div>
              <div className="text-[11px] text-[#5F6663]">Targeting CAT & Pharma Management</div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E5EAE7] flex flex-col justify-between">
            <div>
              <div className="text-2xl text-[#00A86B] font-serif mb-2">“</div>
              <p className="text-xs sm:text-sm text-[#5F6663] leading-relaxed">
                The Pharmacovigilance case-narrative workshop covered practical Argus Safety concepts that college syllabi never touch. It gave me complete confidence in my technical interviews.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E5EAE7]">
              <div className="font-semibold text-xs text-[#111111]">Sneha M.</div>
              <div className="text-[11px] text-[#5F6663]">Placed as Drug Safety Associate</div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E5EAE7] flex flex-col justify-between">
            <div>
              <div className="text-2xl text-[#00A86B] font-serif mb-2">“</div>
              <p className="text-xs sm:text-sm text-[#5F6663] leading-relaxed">
                Having clear breakdowns of Drug Inspector PSC exams alongside research fellowships saved me months of searching through random WhatsApp groups and forums.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E5EAE7]">
              <div className="font-semibold text-xs text-[#111111]">Rohan D.</div>
              <div className="text-[11px] text-[#5F6663]">M.Pharm Research Aspirant</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================================
          8. FINAL CALL TO ACTION (Clean, Spacious, Focused)
          ============================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E5EAE7] bg-[#F8FAF9]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] font-heading">
            Your next career step starts with the right connection.
          </h2>
          <p className="text-sm sm:text-base text-[#5F6663] mt-4 max-w-xl mx-auto leading-relaxed">
            Explore career paths, meet mentors and discover opportunities built for pharmacy students.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onNavigate('/career-paths')}
              className="px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-medium text-base transition-colors shadow-sm inline-flex items-center gap-2 group"
            >
              <span>Explore PharmNexia</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
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
