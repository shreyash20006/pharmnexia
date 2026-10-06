import React from 'react';

// High-resolution cropped emblem with excessive whitespace padding removed
const PRIMARY_LOGO_SRC = "/logo_emblem.png";
const FALLBACK_LOGO_SRC = "https://res.cloudinary.com/axgam8br/image/upload/v1791050025/1000481598.jpg";

/**
 * Official PharmNexia Brand Logo Component
 * Incorporates the official PharmNexia emblem image
 * with the signature "PharmNexia" wordmark and tagline.
 * 
 * @param {'light' | 'dark'} theme - 'light' for white/neutral backgrounds, 'dark' for dark backgrounds
 * @param {'navbar' | 'sm' | 'md' | 'lg' | 'hero'} size - scale variant
 * @param {boolean} showTagline - whether to display "YOUR PHARMACY CAREER, CONNECTED."
 * @param {boolean} showIconOnly - whether to display only the emblem icon
 */
export const PharmNexiaLogo = ({
  theme = 'light',
  size = 'navbar',
  showTagline = false,
  showIconOnly = false,
  className = ''
}) => {
  const isDark = theme === 'dark';
  const pharmTextColor = isDark ? '#FFFFFF' : '#101828';
  const taglineTextColor = isDark ? '#E5E7EB' : '#475467';

  // Sizing dimensions with full ratio preservation and balanced wordmark
  const sizeConfig = {
    navbar: {
      iconClasses: 'w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] lg:w-[38px] lg:h-[38px]',
      fontSize: 'text-[21px] sm:text-[23px] lg:text-[25px]',
      gap: 'gap-2 sm:gap-2.5',
      leafClasses: 'w-2.5 h-1.5 ml-[-5px] mb-3 sm:mb-3.5',
      taglineSize: 'text-[8.5px]',
      lineWidth: 'w-8',
      containerHeight: 'h-[36px] sm:h-[38px] lg:h-[40px]'
    },
    sm: {
      iconClasses: 'w-[30px] h-[30px] sm:w-[32px] sm:h-[32px]',
      fontSize: 'text-[18px] sm:text-[20px]',
      gap: 'gap-2',
      leafClasses: 'w-2 h-1 ml-[-4px] mb-2.5',
      taglineSize: 'text-[8px]',
      lineWidth: 'w-8',
      containerHeight: 'h-[32px] sm:h-[34px]'
    },
    md: {
      iconClasses: 'w-[40px] h-[40px]',
      fontSize: 'text-xl sm:text-2xl',
      gap: 'gap-2.5',
      leafClasses: 'w-3 h-1.5 ml-[-6px] mb-4',
      taglineSize: 'text-[9.5px]',
      lineWidth: 'w-12',
      containerHeight: 'h-auto'
    },
    lg: {
      iconClasses: 'w-[52px] h-[52px]',
      fontSize: 'text-3xl sm:text-4xl',
      gap: 'gap-3.5',
      leafClasses: 'w-3.5 h-2 ml-[-7px] mb-5',
      taglineSize: 'text-xs',
      lineWidth: 'w-20',
      containerHeight: 'h-auto'
    },
    hero: {
      iconClasses: 'w-[72px] h-[72px] sm:w-[84px] sm:h-[84px]',
      fontSize: 'text-4xl sm:text-6xl',
      gap: 'gap-4 sm:gap-5',
      leafClasses: 'w-5 h-3 ml-[-10px] mb-8 sm:mb-10',
      taglineSize: 'text-xs sm:text-sm',
      lineWidth: 'w-24 sm:w-36',
      containerHeight: 'h-auto'
    }
  }[size] || {
    iconClasses: 'w-[36px] h-[36px]',
    fontSize: 'text-[22px]',
    gap: 'gap-2.5',
    leafClasses: 'w-2.5 h-1.5 ml-[-5px] mb-3',
    taglineSize: 'text-[9px]',
    lineWidth: 'w-10',
    containerHeight: 'h-[38px]'
  };

  return (
    <div className={`inline-flex flex-col justify-center select-none ${className}`}>
      <div className={`flex items-center ${sizeConfig.gap}`}>
        
        {/* ====================================================================
            1. PHARMNEXIA OFFICIAL EMBLEM (42px Mobile / 44px Desktop, Full Ratio)
            ==================================================================== */}
        <div 
          className={`relative flex-shrink-0 flex items-center justify-center overflow-hidden transition-transform duration-200 ${sizeConfig.iconClasses} ${
            isDark ? 'bg-white rounded-xl p-1 shadow-sm' : 'bg-transparent'
          }`}
        >
          <img
            src={PRIMARY_LOGO_SRC}
            alt="PharmNexia Emblem"
            className="w-full h-full object-contain aspect-square select-none pointer-events-none"
            loading="eager"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_LOGO_SRC) {
                e.currentTarget.src = FALLBACK_LOGO_SRC;
              }
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
              className={`inline-block flex-shrink-0 bg-[#14E889] shadow-xs rounded-[100%_0_100%_0] rotate-[-35deg] ${sizeConfig.leafClasses}`}
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
