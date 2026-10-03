import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ScrollReveal, FadeUp } from '../components/Animation';

export const OpportunitiesPage = ({ onNavigate }) => {
  const { opportunities, savedOpportunityIds, toggleSaveOpportunity } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedRemote, setSelectedRemote] = useState("ALL"); // 'ALL' | 'Remote' | 'On-site' | 'Hybrid'

  const categories = [
    "ALL",
    "Internships",
    "Jobs",
    "Research",
    "Fellowships",
    "Scholarships",
    "Competitions",
    "Conferences"
  ];

  const filtered = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || opp.category === selectedCategory;
    const matchesRemote = selectedRemote === "ALL" || opp.remote === selectedRemote;

    return matchesSearch && matchesCat && matchesRemote;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      
      {/* Header */}
      <FadeUp>
        <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-[13.5px] font-semibold border border-[#00A86B]/20">
              <Sparkles className="w-4 h-4 text-[#00A86B]" />
              <span>Curated Pharmacy Opportunities</span>
            </div>

            <h1 className="text-[30px] sm:text-[42px] font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
              Internships, Fellowships & Jobs
            </h1>

            <p className="text-[#667085] text-[15.5px] leading-[1.65]">
              Directly curated openings across CROs, clinical trial sites, regulatory consulting firms, government laboratories, and national research grants.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Search and Filters */}
      <FadeUp delay={80}>
        <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-96 relative">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company, or city..."
                className="w-full pl-10 pr-4 py-2.5 text-[14.5px] rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
              />
            </div>

            <div className="flex items-center gap-2 text-[13.5px]">
              <span className="text-[#667085] font-medium">Work Mode:</span>
              {["ALL", "Remote", "On-site", "Hybrid"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedRemote(mode)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition text-[13.5px] ${
                    selectedRemote === mode ? 'bg-[#00A86B] text-white' : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="pt-2 border-t border-[#E5E7EB] flex flex-wrap items-center gap-1.5 text-[13.5px]">
            <span className="text-[#667085] font-semibold mr-1">Categories:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition text-[13.5px] ${
                  selectedCategory === cat 
                    ? 'bg-[#00A86B] text-white font-semibold' 
                    : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
                }`}
              >
                {cat === "ALL" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filtered.map((opp, idx) => {
          const isSaved = savedOpportunityIds.includes(opp.id);
          return (
            <ScrollReveal 
              key={opp.id}
              direction="up" 
              delay={(idx % 6) * 75}
            >
              <div 
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:border-[#00A86B]/60 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-lift"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">
                      {opp.category}
                    </span>
                    <span className="text-[13px] text-[#667085] flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#00A86B]" />
                      <span>{opp.location}</span>
                    </span>
                    <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-[#F8FAF9] text-[#087A52] border border-[#E5E7EB]">
                      {opp.remote}
                    </span>
                  </div>

                  <h2 className="text-[19px] sm:text-[21px] font-bold text-[#101828] leading-snug font-heading">
                    {opp.title}
                  </h2>

                  <div className="text-[14.5px] font-semibold text-[#087A52]">
                    {opp.organization}
                  </div>

                  <p className="text-[14.5px] text-[#667085] leading-[1.6] max-w-3xl line-clamp-2">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[13px] pt-1">
                    <div className="text-[#00A86B] font-bold font-mono text-[14px]">
                      Stipend / CTC: {opp.stipend}
                    </div>
                    <div className="text-[#667085] font-mono text-[12px]">
                      Deadline: {opp.deadline}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-end gap-2 w-full md:w-auto flex-shrink-0">
                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={`p-2.5 rounded-xl border transition ${
                      isSaved ? 'bg-[#E8F8F1] text-[#087A52] border-[#00A86B]/40' : 'bg-white text-[#667085] border-[#E5E7EB] hover:text-[#111827]'
                    }`}
                    title={isSaved ? "Saved to your bookmarks" : "Save opportunity"}
                  >
                    {isSaved ? <BookmarkCheck className="w-5 h-5 fill-[#00A86B] text-[#00A86B]" /> : <Bookmark className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => onNavigate(`/opportunities/${opp.id}`)}
                    className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[14px] shadow-sm transition flex items-center gap-1.5 btn-primary-action"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </div>
  );
};
