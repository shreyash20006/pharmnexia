import React from 'react';

/**
 * Official PharmNexia Brand Logo Component
 * Incorporates the official 'P' pharmacy symbol with capsule & medical cross,
 * the radiant gradient wordmark with organic leaf, and optional tagline.
 * 
 * @param {'light' | 'dark'} theme - 'light' for white/neutral backgrounds, 'dark' for dark navy/black
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
  // Color tokens based on theme
  const isDark = theme === 'dark';
  const pStemColor = isDark ? '#FFFFFF' : '#101828';
  const pharmTextColor = isDark ? '#FFFFFF' : '#101828';
  const taglineTextColor = isDark ? '#E5E7EB' : '#475467';
  const capsuleTopColor = isDark ? '#FFFFFF' : '#F8FAF9';

  // Sizing dimensions
  const sizeConfig = {
    sm: {
      iconSize: 34,
      fontSize: 'text-xl sm:text-2xl',
      leafSize: { w: 10, h: 5.5, ml: -5, mb: 16 },
      gap: 'gap-2',
      taglineSize: 'text-[9px]',
      lineWidth: 'w-10'
    },
    md: {
      iconSize: 44,
      fontSize: 'text-2xl sm:text-3xl',
      leafSize: { w: 14, h: 7.5, ml: -7, mb: 22 },
      gap: 'gap-2.5',
      taglineSize: 'text-[10px]',
      lineWidth: 'w-16'
    },
    lg: {
      iconSize: 64,
      fontSize: 'text-4xl sm:text-5xl',
      leafSize: { w: 18, h: 10, ml: -9, mb: 32 },
      gap: 'gap-3.5',
      taglineSize: 'text-xs',
      lineWidth: 'w-24'
    },
    hero: {
      iconSize: 110,
      fontSize: 'text-5xl sm:text-7xl lg:text-8xl',
      leafSize: { w: 28, h: 15, ml: -14, mb: 50 },
      gap: 'gap-5',
      taglineSize: 'text-xs sm:text-sm',
      lineWidth: 'w-24 sm:w-36'
    }
  }[size] || {
    iconSize: 44,
    fontSize: 'text-3xl',
    leafSize: { w: 14, h: 7.5, ml: -7, mb: 22 },
    gap: 'gap-2.5',
    taglineSize: 'text-[10px]',
    lineWidth: 'w-16'
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className={`flex items-center justify-center ${sizeConfig.gap}`}>
        
        {/* ====================================================================
            1. PHARMNEXIA 'P' EMBLEM (150x150 Vector Matrix)
            Includes: Stem, Top Curve, Green Split Capsule, Medical Cross
            ==================================================================== */}
        <div 
          className="relative flex-shrink-0 flex items-center justify-center"
          style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
        >
          <svg
            viewBox="0 0 150 150"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Capsule Gradient */}
              <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={capsuleTopColor} />
                <stop offset="48%" stopColor={capsuleTopColor} />
                <stop offset="48.1%" stopColor="#14E889" />
                <stop offset="100%" stopColor="#0BE879" />
              </linearGradient>

              {/* Capsule Glow Filter */}
              <filter id="capsuleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#14E889" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* A. Capital 'P' Structure */}
            {/* 1. Top bar */}
            <rect 
              x="15" 
              y="15" 
              width="105" 
              height="48" 
              rx="24" 
              fill={pStemColor} 
            />

            {/* 2. Vertical main stem */}
            <rect 
              x="15" 
              y="15" 
              width="40" 
              height="120" 
              rx="20" 
              fill={pStemColor} 
            />

            {/* 3. Bottom curve loop */}
            <path
              d="M 50 63 H 88 C 110 63, 118 78, 118 95 C 118 115, 102 123, 76 123 H 50"
              stroke={pStemColor}
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* B. Green Capsule (Diagonal at 25deg) */}
            <g transform="translate(37, 102) rotate(25)">
              <rect
                x="-20"
                y="-34"
                width="40"
                height="68"
                rx="20"
                fill="url(#capsuleGrad)"
                filter="url(#capsuleGlow)"
                stroke={isDark ? "none" : "#E5E7EB"}
                strokeWidth="0.8"
              />
              {/* Capsule divider line */}
              <line 
                x1="-20" 
                y1="-1.5" 
                x2="20" 
                y2="-1.5" 
                stroke="#087A52" 
                strokeWidth="1.5" 
                opacity="0.25" 
              />
            </g>

            {/* C. Medical Cross (Top Right, #10E879) */}
            <g transform="translate(88, 0)">
              {/* Horizontal arm */}
              <rect 
                x="0" 
                y="19" 
                width="62" 
                height="24" 
                rx="10" 
                fill="#10E879" 
              />
              {/* Vertical arm */}
              <rect 
                x="19" 
                y="0" 
                width="24" 
                height="62" 
                rx="10" 
                fill="#10E879" 
              />
            </g>
          </svg>
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
