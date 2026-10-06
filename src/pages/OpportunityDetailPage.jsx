import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  Building, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../store/AppContext';
import { FadeUp } from '../components/Animation';

export const OpportunityDetailPage = ({ opportunityId, onNavigate }) => {
  const { opportunities, savedOpportunityIds, toggleSaveOpportunity, addNotification } = useApp();
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const opp = opportunities.find(o => o.id === opportunityId) || opportunities[0];
  const isSaved = savedOpportunityIds.includes(opp.id);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setHasApplied(true);
      setIsApplying(false);
      addNotification({
        title: "Application Submitted",
        message: `Your student profile has been submitted for ${opp.title} at ${opp.organization}.`,
        type: "SYSTEM"
      });
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-[#111827]">
      
      {/* Back link */}
      <div>
        <button
          onClick={() => onNavigate('/opportunities')}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#667085] hover:text-[#00A86B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>
      </div>

      {/* Main Details Card */}
      <FadeUp>
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">
                  {opp.category}
                </span>
                <span className="text-[13px] text-[#667085] flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>{opp.location} ({opp.remote})</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-[34px] font-extrabold text-[#101828] tracking-tight font-heading leading-tight">
                {opp.title}
              </h1>

              <div className="text-[15.5px] font-semibold text-[#087A52] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#00A86B]" />
                <span>{opp.organization}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveOpportunity(opp.id)}
                className={`p-2.5 rounded-xl border transition ${
                  isSaved ? 'bg-[#E8F8F1] text-[#087A52] border-[#00A86B]/40' : 'bg-white text-[#667085] border-[#E5E7EB] hover:text-[#111827]'
                }`}
                title={isSaved ? "Saved" : "Save"}
              >
                {isSaved ? <Bookmark className="w-5 h-5 fill-[#00A86B] text-[#00A86B]" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB] text-[13.5px]">
            <div>
              <span className="text-[#667085] block text-[11px] uppercase font-mono">Compensation</span>
              <strong className="text-[#087A52] font-bold font-mono text-[14.5px]">{opp.stipend}</strong>
            </div>
            <div>
              <span className="text-[#667085] block text-[11px] uppercase font-mono">Job Type</span>
              <strong className="text-[#101828] font-bold">{opp.type}</strong>
            </div>
            <div>
              <span className="text-[#667085] block text-[11px] uppercase font-mono">Deadline</span>
              <strong className="text-rose-600 font-bold font-mono">{opp.deadline}</strong>
            </div>
            <div>
              <span className="text-[#667085] block text-[11px] uppercase font-mono">Posted Date</span>
              <strong className="text-[#667085] font-medium font-mono">{opp.postedDate}</strong>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-[15px] text-[#4B5563] leading-[1.65]">
            <h2 className="text-[17px] font-bold text-[#101828] font-heading">Role Overview</h2>
            <p>{opp.description}</p>
          </div>

          {/* Eligibility */}
          <div className="space-y-3 text-[15px] text-[#4B5563] leading-[1.65]">
            <h2 className="text-[17px] font-bold text-[#101828] font-heading">Eligibility & Qualifications</h2>
            <p className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E5E7EB] font-medium text-[#111827]">
              {opp.eligibility}
            </p>
          </div>

          {/* Required Skills */}
          {opp.skillsRequired && (
            <div className="space-y-2">
              <h2 className="text-[17px] font-bold text-[#101828] font-heading">Relevant Skill Sets</h2>
              <div className="flex flex-wrap gap-2">
                {opp.skillsRequired.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-[13px] bg-[#F8FAF9] text-[#087A52] border border-[#E5E7EB]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply CTA Bar */}
          <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[13.5px] text-[#667085]">
              Apply with your PharmNexia verified student profile directly.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {hasApplied ? (
                <div className="px-6 py-3.5 rounded-xl bg-[#E8F8F1] text-[#087A52] font-semibold text-[14.5px] border border-[#00A86B]/30 flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
                  <span>Application Submitted Successfully</span>
                </div>
              ) : (
                <button
                  disabled={isApplying}
                  onClick={handleApply}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[15.5px] shadow-sm transition disabled:opacity-50 btn-primary-action"
                >
                  {isApplying ? 'Submitting Application...' : 'Apply Now (1-Click)'}
                </button>
              )}
            </div>
          </div>

        </div>
      </FadeUp>

    </div>
  );
};
