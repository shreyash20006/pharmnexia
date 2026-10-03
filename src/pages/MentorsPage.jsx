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
  Sparkles,
  UserCheck,
  PlusCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BookingModal } from '../components/BookingModal';

export const MentorsPage = ({ onNavigate }) => {
  const { mentors, addMentor, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCareerPath, setSelectedCareerPath] = useState("ALL");
  const [selectedPriceModel, setSelectedPriceModel] = useState("ALL");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);

  // Apply as Mentor Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentRole: '',
    currentOrg: '',
    qualification: 'B.Pharm, M.Pharm',
    mentorType: 'Industry',
    price30: 0,
    about: '',
    expertise: 'Pharmacovigilance, Regulatory Affairs'
  });

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

  const handleApplySubmit = (e) => {
    e.preventDefault();
    addMentor({
      name: applyForm.name,
      email: applyForm.email,
      currentRole: applyForm.currentRole,
      currentOrg: applyForm.currentOrg,
      qualification: applyForm.qualification,
      mentorType: applyForm.mentorType,
      price30: Number(applyForm.price30) || 0,
      price60: (Number(applyForm.price30) || 0) * 1.8,
      about: applyForm.about,
      expertise: applyForm.expertise.split(',').map(s => s.trim()).filter(Boolean),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(applyForm.name)}`
    });

    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setIsApplyModalOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-[#111827]">
      
      {/* Page Header */}
      <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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

        <div className="relative z-10 flex-shrink-0">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Apply as a Mentor</span>
          </button>
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
              className={`px-3 py-1.5 rounded-lg font-medium transition text-xs ${
                selectedType === t 
                  ? 'bg-[#00A86B] text-white shadow-sm' 
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
              className={`px-3 py-1.5 rounded-lg font-medium transition text-xs ${
                selectedPriceModel === p 
                  ? 'bg-[#101828] text-white' 
                  : 'bg-white text-[#667085] border border-[#E5E7EB] hover:border-[#00A86B] hover:text-[#111827]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

      </div>

      {/* Mentors Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div 
              key={mentor.id}
              className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] transition shadow-sm flex flex-col justify-between group"
            >
              
              <div className="space-y-4">
                
                {/* Header row: Avatar, Info, Badge */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={mentor.avatarUrl} 
                      alt={mentor.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E5E7EB] group-hover:border-[#00A86B] transition"
                    />
                    {mentor.verifiedBadge && (
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#00A86B] text-white shadow-sm" title="Credential Verified">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-semibold text-[#087A52] tracking-wider">
                        {mentor.mentorType}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#101828] text-base truncate font-heading group-hover:text-[#00A86B] transition">
                      {mentor.name}
                    </h3>

                    <p className="text-xs text-[#667085] truncate font-medium">
                      {mentor.currentRole}
                    </p>

                    <p className="text-[11px] text-[#667085] truncate">
                      {mentor.currentOrg}
                    </p>
                  </div>
                </div>

                {/* Qualification & Academic Heritage */}
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs space-y-1">
                  <div className="font-semibold text-[#101828] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#00A86B]" />
                    <span className="truncate">{mentor.qualification}</span>
                  </div>
                  {mentor.previousEducation && (
                    <div className="text-[11px] text-[#667085] truncate font-mono">
                      {mentor.previousEducation}
                    </div>
                  )}
                </div>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
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
              <div className="pt-4 mt-4 border-t border-[#E5E7EB] space-y-3 text-xs">
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
      ) : mentors.length === 0 ? (
        /* Empty state when NO mentors are registered in database */
        <div className="p-12 sm:p-16 text-center bg-[#F8FAF9] rounded-3xl border border-[#E5E7EB] max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#101828] font-heading">
            Verified Mentor Directory
          </h2>
          <p className="text-xs text-[#667085] leading-relaxed max-w-md mx-auto">
            We are actively onboarding verified pharmacy alumni, industry specialists, and faculty members. Are you a pharmacy practitioner interested in guiding students?
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
            >
              Apply as a Verified Mentor
            </button>
            <button
              onClick={() => onNavigate('/career-paths')}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] font-semibold text-xs transition"
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

      {/* Apply as Mentor Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5E7EB] overflow-hidden text-[#111827]">
            <div className="bg-[#F8FAF9] p-5 flex items-center justify-between border-b border-[#E5E7EB]">
              <div>
                <h3 className="font-bold text-[#101828] text-base font-heading">Apply as a Verified Mentor</h3>
                <p className="text-xs text-[#087A52] font-semibold">Join PharmNexia Practitioner Network</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySubmitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00A86B] mx-auto" />
                <h4 className="font-bold text-base text-[#101828]">Application Submitted!</h4>
                <p className="text-xs text-[#667085]">
                  Our Academic & Career Council will review your credentials. Thank you for contributing to the pharmacy student ecosystem.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="p-6 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                      placeholder="e.g. Dr. Priya Nair"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                      placeholder="name@organization.com"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Current Role / Designation</label>
                    <input 
                      type="text" 
                      required
                      value={applyForm.currentRole}
                      onChange={(e) => setApplyForm({...applyForm, currentRole: e.target.value})}
                      placeholder="e.g. Senior PV Scientist"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Organization / College</label>
                    <input 
                      type="text" 
                      required
                      value={applyForm.currentOrg}
                      onChange={(e) => setApplyForm({...applyForm, currentOrg: e.target.value})}
                      placeholder="e.g. Global CRO / Top Biopharma"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Qualification</label>
                    <input 
                      type="text" 
                      required
                      value={applyForm.qualification}
                      onChange={(e) => setApplyForm({...applyForm, qualification: e.target.value})}
                      placeholder="e.g. B.Pharm, M.Pharm (NIPER)"
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#667085] mb-1">Mentor Type</label>
                    <select
                      value={applyForm.mentorType}
                      onChange={(e) => setApplyForm({...applyForm, mentorType: e.target.value})}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white text-xs"
                    >
                      <option value="Industry">Industry Professional</option>
                      <option value="Faculty">Faculty / Professor</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Researchers">PhD / Research Scholar</option>
                      <option value="Exam/Entrance Mentors">Exam Topper (GPAT/CAT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#667085] mb-1">Expertise Areas (comma separated)</label>
                  <input 
                    type="text" 
                    value={applyForm.expertise}
                    onChange={(e) => setApplyForm({...applyForm, expertise: e.target.value})}
                    placeholder="e.g. Pharmacovigilance, Argus, Clinical Data Management"
                    className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#667085] mb-1">Short Bio</label>
                  <textarea 
                    rows={3}
                    value={applyForm.about}
                    onChange={(e) => setApplyForm({...applyForm, about: e.target.value})}
                    placeholder="Briefly describe your career journey and how you can guide students..."
                    className="w-full p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] focus:outline-none focus:border-[#00A86B] focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold hover:bg-[#F8FAF9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default MentorsPage;
