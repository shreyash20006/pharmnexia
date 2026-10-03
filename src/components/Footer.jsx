import React from 'react';
import { Award, Shield, ArrowUpRight } from 'lucide-react';
import { PharmNexiaLogo } from './PharmNexiaLogo';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-white text-[#5F6663] border-t border-[#E5EAE7] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E5EAE7]">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start">
              <PharmNexiaLogo size="md" theme="light" showTagline={false} />
            </div>

            <p className="text-[#111111] text-[15.5px] font-semibold">
              Your Pharmacy Career, Connected.
            </p>

            <p className="text-[14.5px] text-[#5F6663] leading-[1.65] max-w-sm">
              India's dedicated pharmacy career and mentorship ecosystem. Connecting B.Pharm, D.Pharm, M.Pharm, and Pharm.D students with verified people who have already walked the path they want to take.
            </p>

            {/* Verification Badge */}
            <div className="pt-2 flex items-center gap-2">
              <button 
                onClick={() => onNavigate('/verify-certificate')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAF9] border border-[#E5EAE7] hover:border-[#00A86B] text-[13px] text-[#5F6663] hover:text-[#00A86B] transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Certificate Verification</span>
              </button>
            </div>
          </div>

          {/* Navigation: Career Paths */}
          <div>
            <h4 className="text-[13.5px] font-bold text-[#111111] uppercase tracking-wider mb-4">
              Career Paths
            </h4>
            <ul className="space-y-3 text-[14.5px]">
              <li>
                <button onClick={() => onNavigate('/career-paths/mba-after-bpharm')} className="hover:text-[#00A86B] transition-colors text-left">
                  MBA / Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/career-paths/gpat-niper')} className="hover:text-[#00A86B] transition-colors text-left">
                  GPAT & NIPER
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/career-paths/pharmacovigilance')} className="hover:text-[#00A86B] transition-colors text-left">
                  Pharmacovigilance (PV)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/career-paths/regulatory-affairs')} className="hover:text-[#00A86B] transition-colors text-left">
                  Regulatory Affairs (RA)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/career-paths/higher-studies-abroad')} className="hover:text-[#00A86B] transition-colors text-left">
                  Higher Studies Abroad
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/career-paths/government-careers')} className="hover:text-[#00A86B] transition-colors text-left">
                  Government Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation: Ecosystem */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-3 text-[14.5px]">
              <li>
                <button onClick={() => onNavigate('/mentors')} className="hover:text-[#00A86B] transition-colors text-left">
                  Mentors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/programs')} className="hover:text-[#00A86B] transition-colors text-left">
                  Programs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/opportunities')} className="hover:text-[#00A86B] transition-colors text-left">
                  Opportunities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/resources')} className="hover:text-[#00A86B] transition-colors text-left">
                  Resources
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#00A86B] transition-colors text-left">
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-[13.5px] font-bold text-[#111111] uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-[14.5px]">
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-[#00A86B] transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-[#00A86B] transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/refund-policy')} className="hover:text-[#00A86B] transition-colors text-left">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/verify-certificate')} className="hover:text-[#00A86B] transition-colors text-left">
                  Certificate Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-[#5F6663] hover:text-[#00A86B] transition-colors text-left flex items-center gap-1">
                  <span>Admin Console</span>
                  <ArrowUpRight className="w-3 h-3 text-[#00A86B]" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13.5px] text-[#5F6663]">
          <div>
            <span>© 2026 PharmNexia. All rights reserved.</span>
          </div>

          <div className="text-center md:text-right">
            <span>"Your Pharmacy Career, Connected." Built for pharmacy students and professionals.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
