import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showTagline?: boolean;
}

/**
 * High-fidelity vector SVG reproduction of the official FAVY CRAVY FITS 2.0 logo:
 * - Stylized luxury serif "F" interlocking with a sweeping crescent "C" monogram
 * - Tracking display logotype "FAVY CRAVY"
 * - Horizontal rule accent with "F I T S"
 * - Edition marker "2.0"
 */
export function FCMonogram({
  size = 40,
  color = 'currentColor',
  className = ''
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="FC Monogram"
    >
      {/* 
        Stylized Monogram:
        1. Vertical Serif F with bold stem, top bracketed serif, top horizontal arm, and mid crossbar
        2. Dramatic sweeping geometric Crescent C curving around and through the F stem
      */}
      <g fill={color}>
        {/* F Vertical Stem with Top Serif & Base */}
        <path
          d="M68 28 H124 C124 28 124 38 121 44 C117 50 110 50 102 50 H90 V76 H114 C114 76 114 84 110 88 H90 V135 C84 135 76 130 76 120 V50 H68 Z"
        />
        
        {/* Top Upper Bar of F with Luxury Serif Flare */}
        <path
          d="M68 28 C74 28 80 26 82 20 H126 C126 32 122 42 120 45 C116 45 112 40 106 38 H88 V28 Z"
        />

        {/* The Crescent 'C' Embracing the Monogram */}
        <path
          d="M136 60 C136 60 128 54 118 54 C88 54 72 78 72 110 C72 144 92 162 122 162 C134 162 144 154 144 154 C140 168 118 174 102 174 C60 174 44 140 44 104 C44 66 68 38 116 38 C132 38 140 46 140 46 L136 60 Z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export function BrandLogo({
  variant = 'horizontal',
  size = 'md',
  theme = 'dark',
  className = '',
  showTagline = true
}: BrandLogoProps) {
  // Theme color definitions
  const isLight = theme === 'light';
  const textColor = isLight ? 'text-neutral-950' : 'text-white';
  const subColor = isLight ? 'text-neutral-600' : 'text-neutral-400';
  const ruleColor = isLight ? 'bg-neutral-900' : 'bg-neutral-400';
  const svgColor = isLight ? '#0a0a0a' : '#ffffff';

  // Size mapping
  const iconSizes = {
    xs: 24,
    sm: 32,
    md: 42,
    lg: 56,
    xl: 76
  };

  const currentIconSize = iconSizes[size];

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <FCMonogram size={currentIconSize} color={svgColor} />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isLight ? 'bg-neutral-100 border border-neutral-200' : 'bg-neutral-900 border border-neutral-800'} ${className}`}>
        <FCMonogram size={currentIconSize} color={svgColor} />
        <span className={`text-[9px] font-mono tracking-[0.25em] font-bold uppercase mt-1 ${textColor}`}>
          FC 2.0
        </span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Monogram Emblem */}
        <div className="mb-2">
          <FCMonogram size={currentIconSize} color={svgColor} />
        </div>

        {/* FAVY CRAVY */}
        <h2 className={`font-serif tracking-[0.28em] font-extrabold uppercase leading-none ${
          size === 'xl' ? 'text-2xl sm:text-3xl' : size === 'lg' ? 'text-xl sm:text-2xl' : size === 'sm' ? 'text-sm' : 'text-base sm:text-lg'
        } ${textColor}`}>
          FAVY CRAVY
        </h2>

        {/* — F I T S — */}
        <div className="flex items-center justify-center gap-2 w-full my-1.5 max-w-[170px]">
          <span className={`h-[1px] flex-1 ${ruleColor} opacity-70`} />
          <span className={`text-[10px] sm:text-xs font-mono font-bold tracking-[0.35em] uppercase ${subColor}`}>
            F I T S
          </span>
          <span className={`h-[1px] flex-1 ${ruleColor} opacity-70`} />
        </div>

        {/* 2.0 */}
        <span className={`font-mono text-[11px] sm:text-xs font-bold tracking-[0.3em] ${textColor}`}>
          2.0
        </span>

        {showTagline && (
          <p className={`text-[9px] font-mono tracking-[0.22em] uppercase mt-2 ${subColor}`}>
            MODERN • MINIMAL • MAGNETIC
          </p>
        )}
      </div>
    );
  }

  // Default: Horizontal Lockup (ideal for Navbar & compact headers)
  return (
    <div className={`inline-flex items-center gap-3 select-none text-left ${className}`}>
      {/* Emblem */}
      <div className="shrink-0">
        <FCMonogram size={currentIconSize} color={svgColor} />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-serif tracking-[0.22em] font-black uppercase leading-tight ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          } ${textColor}`}>
            FAVY CRAVY
          </span>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400">
            2.0
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 -mt-0.5">
          <span className={`h-[1px] w-3 ${ruleColor} opacity-60 hidden sm:inline-block`} />
          <span className={`text-[9px] font-mono tracking-[0.28em] font-semibold uppercase ${subColor}`}>
            F I T S
          </span>
          <span className={`h-[1px] w-3 ${ruleColor} opacity-60 hidden sm:inline-block`} />
          <span className={`text-[8px] font-mono tracking-wider ${subColor} opacity-70 hidden md:inline`}>
            • DHAKA
          </span>
        </div>
      </div>
    </div>
  );
}
