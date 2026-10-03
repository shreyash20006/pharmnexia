import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';

export const MentorsPage = ({ onNavigate }) => {
  const { mentors, careerPaths } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCareerPath, setSelectedCareerPath] = useState("ALL");
  const [selectedPriceModel, setSelectedPriceModel] = useState("ALL");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);

  const mentorTypes = ["ALL", "Faculty", "Alumni", "Industry", "Researchers", "Exam/Entrance Mentors"];
  const priceModels = ["ALL", "Free / Volunteer", "Paid / Honorarium"];

  const filteredMentors = mentors.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.currentOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "ALL" || m.mentorType === selectedType;
    const matchesPath = selectedCareerPath === "ALL" || m.careerPathSlugs?.includes(selectedCareerPath);
    
    let matchesPrice = true;
    if (selectedPriceModel === "Free / Volunteer") {
      matchesPrice = m.price30 === 0;
    } else if (selectedPriceModel === "Paid / Honorarium") {
      matchesPrice = m.price30 > 0;
    }

    return matchesSearch && matchesType && matchesPath && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "sessions") return b.sessionsCompleted - a.sessionsCompleted;
    if (sortBy === "priceAsc") return a.price30 - b.price30;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-[#111827]">
      
      {/* Page Header */}
      <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-xs font-semibold border border-[#00A86B]/20">
            <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
            <span>Verified 1-on-1 Mentorship Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828] font-heading">
            Connect With Verified Mentors
          </h1>

          <p className="text-[#667085] text-sm leading-relaxed">
            Book private 30 or 60 minute video sessions with verified alumni, industry scientists, academic researchers, and entrance toppers.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        
        {/* Top row: Search and Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, expertise, role (e.g. Argus, IIM, NIPER)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
            <span className="text-[#667085] font-medium whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#00A86B]"
            >
              <option value="rating">Top Rated (4.9+)</option>
              <option value="sessions">Most Sessions Completed</option>
              <option value="priceAsc">Price: Free & Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="pt-2 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#667085] font-semibold mr-1">Category:</span>
          {mentorTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedType === t 
                  ? 'bg-[#00A86B] text-white font-semibold shadow-sm' 
                  : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
              }`}
            >
              {t === "ALL" ? "All Mentors" : t}
            </button>
          ))}

          <span className="text-[#667085] font-semibold ml-3 mr-1">Pricing:</span>
          {priceModels.map(pm => (
            <button
              key={pm}
              onClick={() => setSelectedPriceModel(pm)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedPriceModel === pm 
                  ? 'bg-[#00A86B] text-white font-semibold' 
                  : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>

      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div 
            key={mentor.id}
            className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:border-[#00A86B] hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Photo, Name, Badge, Type */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={mentor.avatarUrl} 
                    alt={mentor.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00A86B] shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[#101828] text-base leading-snug font-heading">{mentor.name}</h3>
                      {mentor.verifiedBadge && (
                        <ShieldCheck className="w-4 h-4 text-[#00A86B]" title="Verified Credential" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#087A52]">{mentor.currentRole}</p>
                    <p className="text-[11px] text-[#667085] truncate max-w-[190px]">{mentor.currentOrg}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20 flex-shrink-0 font-medium">
                  {mentor.mentorType}
                </span>
              </div>

              {/* Education & Qualification */}
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs mb-3 space-y-1">
                <div className="text-[10px] text-[#667085] uppercase font-mono">Qualification & Journey</div>
                <div className="font-semibold text-[#101828] text-[11px]">{mentor.qualification}</div>
                <div className="text-[#667085] text-[11px] italic font-serif">{mentor.previousEducation}</div>
              </div>

              {/* About snippet */}
              <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 mb-3">
                {mentor.about}
              </p>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise.slice(0, 3).map((exp, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F8FAF9] text-[#111827] border border-[#E5E7EB]"
                  >
                    {exp}
                  </span>
                ))}
                {mentor.expertise.length > 3 && (
                  <span className="text-[10px] text-[#667085] self-center">
                    +{mentor.expertise.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Meta & CTAs */}
            <div className="pt-4 border-t border-[#E5E7EB] space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#667085]">
                <div className="flex items-center gap-1 font-bold text-[#101828]">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{mentor.rating}</span>
                  <span className="text-[#667085] font-normal">({mentor.reviewCount} reviews)</span>
                </div>
                <span className="font-mono text-[11px] text-[#667085]">
                  {mentor.sessionsCompleted} sessions completed
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-[10px] text-[#667085] uppercase font-mono">30 Min Session</div>
                  <div className="font-extrabold text-[#101828] text-sm font-heading">
                    {mentor.price30 === 0 ? (
                      <span className="text-[#087A52]">Free Session</span>
                    ) : (
                      <span>₹{mentor.price30}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/mentors/${mentor.id}`)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] hover:text-[#00A86B] text-[#111827] font-semibold text-xs transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setSelectedMentorForBooking(mentor)}
                    className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
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
