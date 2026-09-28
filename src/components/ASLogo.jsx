import React from 'react';

export default function ASLogo({ size = 'md', showText = true, variant = 'default', className = '' }) {
  // Dimension mappings
  const emblemSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    hero: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl'
  };

  const textSizes = {
    sm: { title: 'text-base', sub: 'text-[8px]' },
    md: { title: 'text-xl', sub: 'text-[10px]' },
    lg: { title: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { title: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm' },
    hero: { title: 'text-3xl sm:text-5xl', sub: 'text-xs sm:text-sm' }
  };

  const isLight = variant === 'light'; // For dark backgrounds like footer

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* AS Monogram Emblem */}
      <div className={`relative ${emblemSizes[size] || emblemSizes.md} rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105`}>
        {/* Outer decorative gradient border */}
        <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-tr from-brand-pink via-brand-gold to-brand-deep shadow-soft">
          <div className={`w-full h-full rounded-full ${isLight ? 'bg-brand-dark' : 'bg-brand-cream'} flex items-center justify-center`}>
            {/* Inner subtle glow */}
            <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-br from-brand-soft via-brand-cream to-brand-beige/80 border border-brand-gold/30 flex items-center justify-center shadow-inner relative overflow-hidden">
              {/* AS Monogram Text */}
              <div className="font-serif font-extrabold tracking-tighter flex items-center justify-center leading-none">
                <span className="text-brand-deep italic -mr-0.5 transform -translate-y-[1px]">A</span>
                <span className="text-brand-gold italic -ml-0.5 transform translate-y-[1px]">S</span>
              </div>
              {/* Subtle sparkle dot */}
              <span className="absolute top-1 right-2 w-1 h-1 rounded-full bg-brand-gold animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold tracking-tight leading-none ${
              isLight ? 'text-white' : 'text-brand-dark'
            } ${textSizes[size]?.title || 'text-xl'}`}>
              Dress Gallery
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-deep" />
          </div>
          <span className={`uppercase tracking-[0.25em] font-semibold mt-1 ${
            isLight ? 'text-brand-pink/90' : 'text-brand-muted'
          } ${textSizes[size]?.sub || 'text-[10px]'}`}>
            AS Monogram Fashion
          </span>
        </div>
      )}
    </div>
  );
}
