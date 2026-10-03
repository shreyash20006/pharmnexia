import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Lock, 
  Search, 
  Filter, 
  Eye, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  X,
  FileCheck
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const ResourcesPage = () => {
  const { resources, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [previewResource, setPreviewResource] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const categories = [
    "ALL",
    "Notes",
    "Career Guides",
    "Exam Preparation",
    "Templates",
    "PPTs",
    "Videos"
  ];

  const filtered = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.careerPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || res.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDownload = (res) => {
    setDownloadSuccessId(res.id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#111827]">
      
      {/* Header */}
      <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-xs font-semibold border border-[#00A86B]/20">
            <BookOpen className="w-4 h-4 text-[#00A86B]" />
            <span>Digital Pharmacy Resource Repository</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading">
            Pharmacy Knowledge & Exam Preparation Hub
          </h1>

          <p className="text-[#667085] text-sm leading-relaxed">
            Free high-yield reaction handbooks, CTD Module 3 guides, ATS resume templates, and Drug Inspector bare acts curated by verified faculty and industry experts.
          </p>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, templates, exam guides..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B]"
            />
          </div>

          <div className="text-xs text-[#667085]">
            Showing <strong className="text-[#101828] font-mono">{filtered.length}</strong> resources
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-[#E5E7EB] flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#667085] font-semibold mr-1">Categories:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-medium transition ${
                selectedCategory === cat 
                  ? 'bg-[#00A86B] text-white font-semibold' 
                  : 'bg-white text-[#667085] hover:text-[#111827] border border-[#E5E7EB]'
              }`}
            >
              {cat === "ALL" ? "All Formats" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(res => (
          <div 
            key={res.id}
            className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:border-[#00A86B] hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-[#087A52] bg-[#E8F8F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                  {res.category}
                </span>
                <span className="text-[#667085] font-mono text-[11px]">{res.format}</span>
              </div>

              <h2 className="text-base font-bold text-[#101828] mb-1.5 leading-snug font-heading">
                {res.title}
              </h2>

              <div className="text-[11px] font-semibold text-[#087A52] mb-2 font-mono">
                Trajectory: {res.careerPath}
              </div>

              <p className="text-xs text-[#667085] leading-relaxed line-clamp-3 mb-4">
                {res.description}
              </p>

              <div className="text-[11px] text-[#667085] flex items-center justify-between border-t border-[#E5E7EB] pt-3 mb-4 font-mono">
                <span>By {res.author}</span>
                <span>{res.fileSize} • {res.pages}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => setPreviewResource(res)}
                className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-[#00A86B] bg-white text-[#111827] font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleDownload(res)}
                className="px-4 py-1.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                {downloadSuccessId === res.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Resource Reader Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 border border-[#E5E7EB] shadow-2xl animate-fadeIn text-[#111827]">
            <div className="flex items-start justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <span className="text-xs font-mono uppercase text-[#087A52] font-bold">{previewResource.category}</span>
                <h3 className="text-lg font-bold text-[#101828] mt-0.5 font-heading">{previewResource.title}</h3>
                <p className="text-xs text-[#667085]">Author: {previewResource.author} • {previewResource.format}</p>
              </div>
              <button 
                onClick={() => setPreviewResource(null)}
                className="p-1 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-[#F8FAF9] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] text-xs space-y-3">
              <div className="font-bold text-[#087A52] uppercase tracking-wider text-[10px] font-mono">Resource Excerpt Preview:</div>
              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] font-serif text-[#111827] leading-relaxed italic">
                "{previewResource.previewContent}"
              </div>
              <p className="text-[#667085] text-[11px] leading-relaxed">
                {previewResource.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#667085] font-mono">
                Downloads: {previewResource.downloads.toLocaleString()} verified students
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] font-semibold text-xs hover:bg-[#F8FAF9] transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewResource);
                    setPreviewResource(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download Complete File ({previewResource.fileSize})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
