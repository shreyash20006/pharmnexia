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

  // Sizing dimensions with full ratio preservation
  const sizeConfig = {
    navbar: {
      iconClasses: 'w-[39px] h-[39px] min-[360px]:w-[42px] min-[360px]:h-[42px] lg:w-[44px] lg:h-[44px]',
      fontSize: 'text-[22px] min-[360px]:text-[26px] min-[390px]:text-[28px] sm:text-[29px] lg:text-[33px] xl:text-[35px]',
      gap: 'gap-2 min-[360px]:gap-2.5 lg:gap-3',
      leafClasses: 'w-2.5 h-1.5 min-[360px]:w-3 min-[360px]:h-2 sm:w-3.5 sm:h-2 lg:w-4 lg:h-2.5 ml-[-5px] min-[360px]:ml-[-6px] sm:ml-[-7px] lg:ml-[-8px] mb-3.5 min-[360px]:mb-4.5 sm:mb-5 lg:mb-6',
      taglineSize: 'text-[9px]',
      lineWidth: 'w-10',
      containerHeight: 'h-[42px] sm:h-[44px] lg:h-[46px]'
    },
    sm: {
      iconClasses: 'w-[39px] h-[39px] min-[360px]:w-[42px] min-[360px]:h-[42px] lg:w-[44px] lg:h-[44px]',
      fontSize: 'text-[22px] min-[360px]:text-[26px] min-[390px]:text-[28px] sm:text-[29px] lg:text-[33px] xl:text-[35px]',
      gap: 'gap-2 min-[360px]:gap-2.5 lg:gap-3',
      leafClasses: 'w-2.5 h-1.5 min-[360px]:w-3 min-[360px]:h-2 sm:w-3.5 sm:h-2 lg:w-4 lg:h-2.5 ml-[-5px] min-[360px]:ml-[-6px] sm:ml-[-7px] lg:ml-[-8px] mb-3.5 min-[360px]:mb-4.5 sm:mb-5 lg:mb-6',
      taglineSize: 'text-[9px]',
      lineWidth: 'w-10',
      containerHeight: 'h-[42px] sm:h-[44px] lg:h-[46px]'
    },
    md: {
      iconClasses: 'w-[46px] h-[46px]',
      fontSize: 'text-2xl sm:text-3xl',
      gap: 'gap-3',
      leafClasses: 'w-3.5 h-2 ml-[-7px] mb-5',
      taglineSize: 'text-[10px]',
      lineWidth: 'w-16',
      containerHeight: 'h-auto'
    },
    lg: {
      iconClasses: 'w-[64px] h-[64px]',
      fontSize: 'text-4xl sm:text-5xl',
      gap: 'gap-4',
      leafClasses: 'w-4.5 h-2.5 ml-[-9px] mb-7',
      taglineSize: 'text-xs',
      lineWidth: 'w-24',
      containerHeight: 'h-auto'
    },
    hero: {
      iconClasses: 'w-[96px] h-[96px]',
      fontSize: 'text-5xl sm:text-7xl lg:text-8xl',
      gap: 'gap-5',
      leafClasses: 'w-7 h-4 ml-[-14px] mb-12',
      taglineSize: 'text-xs sm:text-sm',
      lineWidth: 'w-24 sm:w-36',
      containerHeight: 'h-auto'
    }
  }[size] || {
    iconClasses: 'w-[42px] h-[42px]',
    fontSize: 'text-[26px] sm:text-[29px] lg:text-[34px]',
    gap: 'gap-2.5 lg:gap-3',
    leafClasses: 'w-3 h-2 ml-[-6px] mb-4.5',
    taglineSize: 'text-[10px]',
    lineWidth: 'w-16',
    containerHeight: 'h-[44px]'
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
