import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ScrollReveal, FadeUp } from '../components/Animation';

export const ProgramsPage = ({ onNavigate }) => {
  const { programs } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("ALL"); // 'ALL' | 'FREE' | 'PAID'
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const categories = [
    "ALL",
    "Pharmacovigilance",
    "Regulatory Affairs",
    "AI in Pharmacy",
    "Scientific Writing",
    "Clinical Research",
    "Career Bootcamps"
  ];

  const filtered = programs.filter(prog => {
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.overview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || prog.category === selectedCategory;
    const matchesPrice = selectedPriceFilter === "ALL" || 
                         (selectedPriceFilter === "FREE" && prog.isFree) || 
                         (selectedPriceFilter === "PAID" && !prog.isFree);
    const matchesLevel = selectedLevel === "ALL" || prog.level.includes(selectedLevel);

    return matchesSearch && matchesCat && matchesPrice && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      
      {/* Header */}
      <FadeUp>
        <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-[13.5px] font-semibold border border-[#00A86B]/20">
              <Sparkles className="w-4 h-4 text-[#00A86B]" />
              <span>Practical Pharmacy Skill Cohorts</span>
            </div>

            <h1 className="text-[30px] sm:text-[42px] font-extrabold tracking-tight text-[#101828] font-heading leading-[1.15]">
              Industry Skill Masterclasses & Bootcamps
            </h1>

            <p className="text-[#667085] text-[15.5px] leading-[1.65]">
              Bridge the gap between college theory and corporate reality. Master Argus Safety, CTD Module 3 dossiers, CADD molecular docking, and ATS resume engineering with verifiable credentials.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Filters & Search */}
      <FadeUp delay={80}>
        <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-96 relative">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs by title or topic..."
                className="w-full pl-10 pr-4 py-2.5 text-[14.5px] rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto text-[13.5px]">
              <span className="text-[#667085] font-medium">Pricing:</span>
              <button
                onClick={() => setSelectedPriceFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition text-[13.5px] ${
                  selectedPriceFilter === "ALL" ? 'bg-[#00A86B] text-white' : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPriceFilter("FREE")}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition text-[13.5px] ${
                  selectedPriceFilter === "FREE" ? 'bg-[#00A86B] text-white' : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
                }`}
              >
                Free Programs
              </button>
              <button
                onClick={() => setSelectedPriceFilter("PAID")}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition text-[13.5px] ${
                  selectedPriceFilter === "PAID" ? 'bg-[#00A86B] text-white' : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
                }`}
              >
                Paid Cohorts
              </button>
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
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prog, idx) => (
          <ScrollReveal 
            key={prog.id}
            direction="up" 
            delay={(idx % 6) * 75}
          >
            <div 
              className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:border-[#00A86B]/60 transition-all duration-200 flex flex-col justify-between card-lift h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-[13px]">
                  <span className="font-semibold text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                    {prog.category}
                  </span>
                  <span className="text-[#667085] font-mono text-[12px]">{prog.duration}</span>
                </div>

                <h2 className="text-[19px] sm:text-[20px] font-bold text-[#101828] mb-2 leading-snug font-heading">
                  {prog.title}
                </h2>

                <p className="text-[14.5px] text-[#667085] leading-[1.6] line-clamp-3 mb-4">
                  {prog.overview}
                </p>

                <div className="space-y-2 text-[13.5px] text-[#667085] bg-[#F8FAF9] p-3.5 rounded-xl border border-[#E5E7EB] mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Instructor:</span>
                    <strong className="text-[#101828] truncate max-w-[170px]">{prog.leadMentor}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Schedule:</span>
                    <span className="text-[#111827] font-mono text-[12px]">{prog.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Seats:</span>
                    <span className="font-mono text-[#087A52] font-bold">{prog.seatsBooked} / {prog.seatsTotal} enrolled</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="text-[18px] font-black text-[#101828] font-mono">
                    {prog.isFree ? (
                      <span className="text-[#087A52]">100% Free</span>
                    ) : (
                      <span>₹{prog.price}</span>
                    )}
                  </div>
                  {prog.originalPrice > 0 && !prog.isFree && (
                    <div className="text-[11px] text-[#667085] line-through font-mono">₹{prog.originalPrice}</div>
                  )}
                </div>

                <button
                  onClick={() => onNavigate(`/programs/${prog.id}`)}
                  className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[14px] shadow-sm transition flex items-center gap-1.5 btn-primary-action"
                >
                  <span>View Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
};
