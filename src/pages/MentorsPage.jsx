import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  ChevronRight, 
  Award, 
  Sparkles,
  UserCheck,
  PlusCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';
import { ScrollReveal, FadeUp, FadeLeft, FadeRight } from '../components/Animation';

export const MentorsPage = ({ onNavigate }) => {
  const { mentors = [], authLoading } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCareerPath, setSelectedCareerPath] = useState("ALL");
  const [selectedPriceModel, setSelectedPriceModel] = useState("ALL");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);

  const mentorTypes = ["ALL", "Faculty", "Alumni", "Industry", "Researchers", "Exam/Entrance Mentors"];
  const priceModels = ["ALL", "Free / Volunteer", "Paid / Honorarium"];

  const safeMentors = Array.isArray(mentors) ? mentors : [];

  const filteredMentors = safeMentors.filter(m => {
    if (!m) return false;
    // Strict requirement: Only verified and active mentors are shown in public directory
    const isVerified = (m.verificationStatus || '').toLowerCase() === 'verified';
    const isActive = m.isActive !== false;
    if (!isVerified || !isActive) return false;

    const name = (m.name || '').toLowerCase();
    const currentRole = (m.currentRole || '').toLowerCase();
    const currentOrg = (m.currentOrg || '').toLowerCase();
    const expertiseList = Array.isArray(m.expertise) ? m.expertise : [];
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query ||
      name.includes(query) ||
      currentRole.includes(query) ||
      currentOrg.includes(query) ||
      expertiseList.some(e => typeof e === 'string' && e.toLowerCase().includes(query));

    const matchesType = selectedType === "ALL" || m.mentorType === selectedType;
    const matchesPath = selectedCareerPath === "ALL" || (Array.isArray(m.careerPathSlugs) && m.careerPathSlugs.includes(selectedCareerPath));
    
    let matchesPrice = true;
    const price = Number(m.price30) || 0;
    if (selectedPriceModel === "Free / Volunteer") {
      matchesPrice = price === 0;
    } else if (selectedPriceModel === "Paid / Honorarium") {
      matchesPrice = price > 0;
    }

    return matchesSearch && matchesType && matchesPath && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "rating") return (Number(b?.rating) || 0) - (Number(a?.rating) || 0);
    if (sortBy === "sessions") return (Number(b?.sessionsCompleted) || 0) - (Number(a?.sessionsCompleted) || 0);
    if (sortBy === "priceAsc") return (Number(a?.price30) || 0) - (Number(b?.price30) || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-[#111827]">
      
      {/* Page Header */}
      <FadeUp>
        <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-[13.5px] font-semibold border border-[#00A86B]/20">
              <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
              <span>Verified 1-on-1 Mentorship Marketplace</span>
            </div>

            <h1 className="text-[30px] sm:text-[44px] font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
              Connect With Verified Mentors
            </h1>

            <p className="text-[#667085] text-[15.5px] leading-[1.65]">
              Book private 30 or 60 minute video sessions with verified alumni, industry scientists, academic researchers, and entrance toppers.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Search and Filters Bar */}
      <FadeUp delay={80}>
        <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
          
          {/* Top row: Search and Sort */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-96 relative">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, expertise, role (e.g. Argus, IIM, NIPER)..."
                className="w-full pl-10 pr-4 py-2.5 text-[14.5px] rounded-xl bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end text-[14px]">
              <span className="text-[#667085] font-medium whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#00A86B]"
              >
                <option value="rating">Top Rated (4.9+)</option>
                <option value="sessions">Most Sessions Completed</option>
                <option value="priceAsc">Price: Free & Low to High</option>
              </select>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="pt-2 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2 text-[13.5px]">
            <span className="text-[#667085] font-semibold mr-1">Category:</span>
            {mentorTypes.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition text-[13.5px] ${
                  selectedType === t 
                    ? 'bg-[#00A86B] text-white shadow-sm font-semibold' 
                    : 'bg-white text-[#667085] border border-[#E5E7EB] hover:border-[#00A86B] hover:text-[#111827]'
                }`}
              >
                {t}
              </button>
            ))}

            <span className="text-[#667085] font-semibold ml-auto mr-1">Pricing:</span>
            {priceModels.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPriceModel(p)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition text-[13.5px] ${
                  selectedPriceModel === p 
                    ? 'bg-[#101828] text-white font-semibold' 
                    : 'bg-white text-[#667085] border border-[#E5E7EB] hover:border-[#00A86B] hover:text-[#111827]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

        </div>
      </FadeUp>

      {/* Mentors Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor, idx) => (
            <ScrollReveal 
              key={mentor.id}
              direction="up" 
              delay={(idx % 6) * 75}
            >
              <div 
                className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B]/60 transition-all shadow-sm flex flex-col justify-between group card-lift h-full"
              >
                
                <div className="space-y-4">
                  
                  {/* Header row: Avatar, Info, Badge */}
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={mentor.avatarUrl} 
                        alt={mentor.name} 
                        className="w-14 h-14 rounded-2xl object-cover border border-[#E5E7EB] group-hover:border-[#00A86B] transition avatar-zoom"
                      />
                      {mentor.verifiedBadge && (
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#00A86B] text-white shadow-sm" title="Credential Verified">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase font-mono font-semibold text-[#087A52] tracking-wider">
                          {mentor.mentorType}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#101828] text-[19px] sm:text-[20px] truncate font-heading group-hover:text-[#00A86B] transition">
                        {mentor.name}
                      </h3>

                      <p className="text-[14.5px] text-[#667085] truncate font-medium">
                        {mentor.currentRole}
                      </p>

                      <p className="text-[13px] text-[#667085] truncate">
                        {mentor.currentOrg}
                      </p>
                    </div>
                  </div>

                  {/* Qualification & Academic Heritage */}
                  <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-[13.5px] space-y-1">
                    <div className="font-semibold text-[#101828] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#00A86B]" />
                      <span className="truncate">{mentor.qualification}</span>
                    </div>
                    {mentor.previousEducation && (
                      <div className="text-[12px] text-[#667085] truncate font-mono">
                        {mentor.previousEducation}
                      </div>
                    )}
                  </div>

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Array.isArray(mentor.expertise) ? mentor.expertise : []).slice(0, 3).map((exp, eIdx) => (
                      <span 
                        key={eIdx}
                        className="px-2.5 py-0.5 rounded-md text-[11.5px] font-medium bg-[#F8FAF9] text-[#111827] border border-[#E5E7EB]"
                      >
                        {exp}
                      </span>
                    ))}
                    {Array.isArray(mentor.expertise) && mentor.expertise.length > 3 && (
                      <span className="text-[11.5px] text-[#667085] self-center">
                        +{mentor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Meta & CTAs */}
                <div className="pt-4 mt-4 border-t border-[#E5E7EB] space-y-3 text-[13.5px]">
                  <div className="flex items-center justify-between text-[#667085]">
                    <div className="flex items-center gap-1 font-bold text-[#101828]">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{mentor.rating || 5.0}</span>
                      <span className="text-[#667085] font-normal">({mentor.reviewCount || 0} reviews)</span>
                    </div>
                    <span className="font-mono text-[12px] text-[#667085]">
                      {mentor.sessionsCompleted || 0} sessions completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-[10px] text-[#667085] uppercase font-mono">30 Min Session</div>
                      <div className="font-extrabold text-[#101828] text-[15.5px] font-heading">
                        {Number(mentor.price30) > 0 ? (
                          <span>₹{mentor.price30}</span>
                        ) : (
                          <span className="text-amber-600 text-[12.5px] font-semibold">Price not configured</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate(`/mentors/${mentor.id}`)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] hover:text-[#00A86B] text-[#111827] font-semibold text-[13.5px] transition btn-secondary-action"
                      >
                        View Profile
                      </button>
                      {Number(mentor.price30) > 0 ? (
                        <button
                          onClick={() => setSelectedMentorForBooking(mentor)}
                          className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[14px] shadow-sm transition btn-primary-action"
                        >
                          Book Session
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold text-[13px] border border-gray-200 cursor-not-allowed"
                          title="Price not configured yet"
                        >
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : safeMentors.length === 0 ? (
        /* Empty state when NO mentors are registered in database */
        <div className="p-12 sm:p-16 text-center bg-[#F8FAF9] rounded-3xl border border-[#E5E7EB] max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#101828] font-heading">
            Verified Mentor Directory
          </h2>
          <p className="text-sm text-[#667085] leading-relaxed max-w-md mx-auto">
            No mentors are available yet. Mentors are curated and verified directly by the PharmNexia Academic Council. Check back soon.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/career-paths')}
              className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
            >
              Explore Career Paths
            </button>
          </div>
        </div>
      ) : (
        /* Empty filter result */
        <div className="p-12 text-center bg-[#F8FAF9] rounded-2xl border border-[#E5E7EB] text-[#667085] space-y-2">
          <p className="text-sm font-semibold text-[#101828]">No mentors match your selected filters.</p>
          <p className="text-xs">Try resetting the search keyword or selecting "All Mentors".</p>
        </div>
      )}

      {/* Booking Modal */}
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

export default MentorsPage;
