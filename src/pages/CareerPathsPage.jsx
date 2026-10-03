import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Filter
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const CareerPathsPage = ({ onNavigate }) => {
  const { careerPaths } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = [
    "ALL",
    "Management & Strategy",
    "Higher Studies & Research",
    "Clinical & Corporate",
    "Compliance & Global Strategy",
    "Manufacturing & Quality",
    "Public Sector & Civil Services",
    "Global Education",
    "Business & Innovation"
  ];

  const filtered = careerPaths.filter(cp => {
    const matchesSearch = cp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cp.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cp.overview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || cp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-[#111827]">
      
      {/* Header Banner */}
      <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F1] text-[#087A52] text-xs font-semibold border border-[#00A86B]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>14 Verified Pharmacy Trajectories</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828] font-heading">
            Pharmacy Career Directory
          </h1>
          <p className="text-[#667085] text-sm leading-relaxed">
            Every major pathway accessible to B.Pharm, D.Pharm, and M.Pharm students with entry criteria, syllabus breakdowns, compensation standards, and verified mentor networks.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#F8FAF9] p-4 rounded-2xl border border-[#E5E7EB]">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-[#667085] mr-1 flex-shrink-0" />
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat 
                  ? 'bg-[#00A86B] text-white shadow-sm' 
                  : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
              }`}
            >
              {cat === "ALL" ? "All Pathways" : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-2.5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
          />
        </div>

      </div>

      {/* Career Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(path => (
          <div 
            key={path.id}
            className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:border-[#00A86B] hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                  {path.category}
                </span>
                {path.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F8FAF9] text-[#667085] border border-[#E5E7EB]">
                    {path.badge}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-[#101828] group-hover:text-[#00A86B] transition-colors mb-2 font-heading">
                {path.title}
              </h2>
              
              <div className="text-xs font-semibold text-[#667085] mb-2">
                {path.fullTitle}
              </div>

              <p className="text-xs text-[#667085] leading-relaxed line-clamp-3 mb-4">
                {path.shortDesc}
              </p>

              <div className="space-y-1.5 text-xs pt-3 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span className="text-[#667085]">Typical Package:</span>
                  <span className="font-bold text-[#00A86B] font-mono">{path.averageSalary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#667085]">Duration:</span>
                  <span className="font-medium text-[#111827]">{path.duration}</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[11px] text-[#667085] font-mono">
                {path.entranceExams?.[0] || 'Direct'}
              </span>
              <button
                onClick={() => onNavigate(`/career-paths/${path.slug}`)}
                className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
