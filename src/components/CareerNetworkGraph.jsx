import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  ShieldAlert, 
  FileCheck, 
  Microscope, 
  Globe, 
  Landmark, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const CareerNetworkGraph = ({ onSelectPath }) => {
  const [activeNode, setActiveNode] = useState('mba-after-bpharm');

  const nodes = [
    {
      id: 'mba-after-bpharm',
      label: 'MBA / IIM',
      sub: 'Pharma Strategy & Brand',
      icon: Briefcase,
      badge: '₹14-32 LPA',
      demand: 'High Growth',
      exam: 'CAT / XAT / NMAT'
    },
    {
      id: 'gpat-niper',
      label: 'GPAT / NIPER',
      sub: 'Premier Postgrad & Fellowship',
      icon: GraduationCap,
      badge: 'AICTE ₹12.4K/mo',
      demand: 'Premier Academic',
      exam: 'GPAT / NIPER JEE'
    },
    {
      id: 'pharmacovigilance',
      label: 'Drug Safety (PV)',
      sub: 'MNC Corporate Operations',
      icon: ShieldAlert,
      badge: '₹5-12 LPA',
      demand: 'High Volume',
      exam: 'Direct Recruitment'
    },
    {
      id: 'regulatory-affairs',
      label: 'Regulatory Affairs',
      sub: 'USFDA & Global Dossiers',
      icon: FileCheck,
      badge: '₹6-18 LPA',
      demand: 'Recession Proof',
      exam: 'CTD / eCTD'
    },
    {
      id: 'research-phd',
      label: 'Research / PhD',
      sub: 'Drug Discovery & Nanotech',
      icon: Microscope,
      badge: 'JRF ₹37K/mo',
      demand: 'Intellectual R&D',
      exam: 'CSIR-NET / GATE'
    },
    {
      id: 'higher-studies-abroad',
      label: 'Abroad (MS/PhD)',
      sub: 'USA, UK & Europe Scholarships',
      icon: Globe,
      badge: '$80K+ Global',
      demand: 'High Return',
      exam: 'GRE / IELTS'
    },
    {
      id: 'government-careers',
      label: 'Drug Inspector',
      sub: 'UPSC / State PSC Gazetted',
      icon: Landmark,
      badge: 'Govt Pay Matrix',
      demand: 'High Prestige',
      exam: 'State PSC / UPSC'
    }
  ];

  const currentNode = nodes.find(n => n.id === activeNode) || nodes[0];

  return (
    <div className="w-full max-w-5xl mx-auto p-5 sm:p-7 rounded-3xl bg-[#F8FAF9] border border-[#E5E7EB] shadow-sm relative overflow-hidden">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10 border-b border-[#E5E7EB] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087A52] bg-[#E8F8F1] px-3 py-1 rounded-full border border-[#00A86B]/20 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Interactive Career Topology</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#101828] font-heading tracking-tight">
            The Pharmacy Pathway Matrix
          </h3>
          <p className="text-xs text-[#667085]">
            Click on any trajectory below to inspect entrance exams, roadmaps, and compensation
          </p>
        </div>

        {/* Selected Quick Action Button */}
        <button
          onClick={() => onSelectPath(`/career-paths/${currentNode.id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs transition-all shadow-sm group"
        >
          <span>Explore {currentNode.label}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Central Root: Pharmacy Degree Anchor Node */}
      <div className="flex flex-col items-center justify-center mb-6 relative z-10">
        <div className="relative group">
          <div className="px-6 py-3 rounded-2xl bg-white border-2 border-[#00A86B] text-[#111827] flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#E8F8F1] text-[#087A52] flex items-center justify-center font-bold font-mono text-sm border border-[#00A86B]/30">
              Rx
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#087A52] font-bold font-mono">Foundational Education</div>
              <div className="text-sm sm:text-base font-extrabold text-[#101828] font-heading">B.Pharm / D.Pharm / M.Pharm</div>
            </div>
          </div>
        </div>

        {/* Downward Connector Line */}
        <div className="h-6 w-0.5 bg-[#00A86B] my-1"></div>
        <div className="text-[10px] text-[#667085] font-mono tracking-widest uppercase font-semibold">
          Select Your Trajectory
        </div>
      </div>

      {/* Interactive Branching Pathway Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 relative z-10">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-200 border relative overflow-hidden group ${
                isSelected 
                  ? 'bg-white border-[#00A86B] shadow-md ring-2 ring-[#00A86B]/20 scale-[1.02]' 
                  : 'bg-white border-[#E5E7EB] hover:border-[#00A86B] hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-bl bg-[#00A86B]"></div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-[#00A86B] text-white' : 'bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-[#F8FAF9] text-[#087A52] border border-[#E5E7EB]">
                  {node.badge}
                </span>
              </div>

              <div className="font-bold text-[#101828] text-xs tracking-tight group-hover:text-[#00A86B] transition-colors font-heading">
                {node.label}
              </div>
              <div className="text-[11px] text-[#667085] truncate mt-0.5">
                {node.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Quick Stats Drawer */}
      <div className="mt-5 p-3.5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[#667085]">Selected Path:</span>
          <span className="font-bold text-[#00A86B] font-heading">{currentNode.label}</span>
          <span className="text-[#E5E7EB]">•</span>
          <span className="text-[#111827]">{currentNode.sub}</span>
        </div>

        <div className="flex items-center gap-4 text-[#111827]">
          <div>
            <span className="text-[#667085]">Key Entrance:</span>{" "}
            <strong className="text-[#101828] font-semibold">{currentNode.exam}</strong>
          </div>
          <div>
            <span className="text-[#667085]">Outlook:</span>{" "}
            <span className="inline-flex items-center text-[#087A52] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline text-[#00A86B]" />
              {currentNode.demand}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
