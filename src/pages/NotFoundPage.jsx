import React from 'react';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import { PharmNexiaLogo } from '../components/PharmNexiaLogo';

/**
 * Clean, modern 404 page for PharmNexia
 */
export const NotFoundPage = ({ onNavigate }) => {
  return (
    <div className="min-h-[550px] flex items-center justify-center p-6 bg-white text-[#111827]">
      <div className="max-w-md w-full bg-[#F8FAF9] rounded-3xl p-8 sm:p-10 border border-[#E5E7EB] shadow-sm text-center space-y-5 animate-fadeIn">
        <div className="flex justify-center mb-1">
          <PharmNexiaLogo size="modal" theme="light" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#087A52] text-xs font-mono font-bold border border-emerald-200">
          <span>Error 404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#101828] font-heading">
            Page Not Found
          </h1>
          <p className="text-xs text-[#667085] leading-relaxed">
            The page you are looking for doesn't exist, has been archived, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => onNavigate('/career-paths')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Explore Career Paths</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
