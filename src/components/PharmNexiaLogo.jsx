import React from 'react';

const LOGO_IMG_URL = "https://res.cloudinary.com/axgam8br/image/upload/v1791048434/1000481602.jpg";

/**
 * Official PharmNexia Brand Logo Component
 * Incorporates the official Cloudinary PharmNexia emblem image
 * with the signature "PharmNexia" wordmark and tagline.
 * 
 * @param {'light' | 'dark'} theme - 'light' for white/neutral backgrounds, 'dark' for dark backgrounds
 * @param {'sm' | 'md' | 'lg' | 'hero'} size - scale variant
 * @param {boolean} showTagline - whether to display "YOUR PHARMACY CAREER, CONNECTED."
 * @param {boolean} showIconOnly - whether to display only the emblem icon
 */
export const PharmNexiaLogo = ({
  theme = 'light',
  size = 'md',
  showTagline = false,
  showIconOnly = false,
  className = ''
}) => {
  const isDark = theme === 'dark';
  const pharmTextColor = isDark ? '#FFFFFF' : '#101828';
  const taglineTextColor = isDark ? '#E5E7EB' : '#475467';

  // Sizing dimensions
  const sizeConfig = {
    sm: {
      iconSize: 38,
      fontSize: 'text-xl sm:text-2xl',
      leafSize: { w: 10, h: 5.5, ml: -5, mb: 16 },
      gap: 'gap-2.5',
      taglineSize: 'text-[9px]',
      lineWidth: 'w-10'
    },
    md: {
      iconSize: 46,
      fontSize: 'text-2xl sm:text-3xl',
      leafSize: { w: 14, h: 7.5, ml: -7, mb: 22 },
      gap: 'gap-3',
      taglineSize: 'text-[10px]',
      lineWidth: 'w-16'
    },
    lg: {
      iconSize: 64,
      fontSize: 'text-4xl sm:text-5xl',
      leafSize: { w: 18, h: 10, ml: -9, mb: 32 },
      gap: 'gap-4',
      taglineSize: 'text-xs',
      lineWidth: 'w-24'
    },
    hero: {
      iconSize: 96,
      fontSize: 'text-5xl sm:text-7xl lg:text-8xl',
      leafSize: { w: 28, h: 15, ml: -14, mb: 50 },
      gap: 'gap-5',
      taglineSize: 'text-xs sm:text-sm',
      lineWidth: 'w-24 sm:w-36'
    }
  }[size] || {
    iconSize: 46,
    fontSize: 'text-2xl sm:text-3xl',
    leafSize: { w: 14, h: 7.5, ml: -7, mb: 22 },
    gap: 'gap-3',
    taglineSize: 'text-[10px]',
    lineWidth: 'w-16'
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className={`flex items-center justify-center ${sizeConfig.gap}`}>
        
        {/* ====================================================================
            1. PHARMNEXIA OFFICIAL EMBLEM (Cloudinary Image with local fallback)
            ==================================================================== */}
        <div 
          className="relative flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-sm bg-black border border-white/10"
          style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
        >
          <img
            src={LOGO_IMG_URL}
            alt="PharmNexia Emblem"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
            }}
          />
        </div>

        {/* ====================================================================
            2. WORDMARK ("Pharm" + "Nexia" + Organic Leaf)
            ==================================================================== */}
        {!showIconOnly && (
          <div className="flex items-center leading-none">
            <span 
              className={`font-extrabold tracking-tight font-heading ${sizeConfig.fontSize}`}
              style={{ color: pharmTextColor }}
            >
              Pharm
            </span>
            <span 
              className={`font-extrabold tracking-tight font-heading ${sizeConfig.fontSize} bg-gradient-to-r from-[#0BE879] via-[#18E7A0] to-[#16D9C4] bg-clip-text text-transparent`}
            >
              Nexia
            </span>
            {/* Organic Leaf Accent */}
            <span 
              className="inline-block flex-shrink-0 bg-[#14E889] shadow-sm"
              style={{ 
                width: sizeConfig.leafSize.w, 
                height: sizeConfig.leafSize.h, 
                borderRadius: '100% 0 100% 0',
                transform: 'rotate(-35deg)',
                marginLeft: sizeConfig.leafSize.ml,
                marginBottom: sizeConfig.leafSize.mb
              }}
              title="PharmNexia leaf"
            />
          </div>
        )}

      </div>

      {/* ====================================================================
          3. TAGLINE ROW (With left & right gradient lines)
          ==================================================================== */}
      {showTagline && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-2.5">
          <div 
            className={`h-[1.5px] bg-gradient-to-r from-transparent to-[#15E8A0] ${sizeConfig.lineWidth}`}
          />
          <span 
            className={`font-semibold tracking-[0.25em] sm:tracking-[0.35em] uppercase font-mono whitespace-nowrap ${sizeConfig.taglineSize}`}
            style={{ color: taglineTextColor }}
          >
            Your Pharmacy Career, Connected.
          </span>
          <div 
            className={`h-[1.5px] bg-gradient-to-r from-[#15E8A0] to-transparent ${sizeConfig.lineWidth}`}
          />
        </div>
      )}

    </div>
  );
};

export default PharmNexiaLogo;
