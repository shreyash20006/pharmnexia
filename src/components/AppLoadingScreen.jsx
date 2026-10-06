import React from 'react';
import { Loader2 } from 'lucide-react';
import { PharmNexiaLogo } from './PharmNexiaLogo';

/**
 * Minimal, premium PharmNexia branded loading screen
 */
export const AppLoadingScreen = ({ message = 'Loading your workspace...' }) => {
  return (
    <div className="min-h-[400px] flex-1 flex flex-col items-center justify-center p-6 bg-white text-[#111827]">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center animate-fadeIn">
        {/* Brand Emblem */}
        <div className="relative">
          <PharmNexiaLogo size="modal" theme="light" />
        </div>

        {/* Loading Spinner & Label */}
        <div className="flex items-center gap-2.5 pt-2">
          <Loader2 className="w-4 h-4 text-[#00A86B] animate-spin" />
          <span className="text-xs font-semibold text-[#475467] font-heading tracking-wide">
            {message}
          </span>
        </div>

        <p className="text-[11px] text-[#98A2B3]">
          Connecting securely to PharmNexia services...
        </p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
