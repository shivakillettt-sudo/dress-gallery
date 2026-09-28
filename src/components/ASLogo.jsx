import React from 'react';

/**
 * High-impact, luxury 3D AS Monogram Medallion
 * Crafted with multi-stage gold/rose bevels, extruded 3D letterforms, 
 * ambient occlusion, and polished crystal lighting.
 */
export function ASLogo3D({ className = '', size = 'hero' }) {
  const sizeClasses = {
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    hero: 'w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68',
    xl: 'w-60 h-60 sm:w-72 sm:h-72'
  };

  return (
    <div className={`relative inline-block select-none ${sizeClasses[size] || sizeClasses.hero} ${className}`}>
      {/* Ambient 3D Backing Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-pink/30 via-brand-gold/35 to-brand-deep/25 blur-2xl transform scale-110 pointer-events-none" />

      {/* 3D Floating & Beveled Medallion Container */}
      <div className="relative w-full h-full transform transition-all duration-700 hover:scale-105 active:scale-98">
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] drop-shadow-[0_8px_16px_rgba(201,164,92,0.4)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Beveled Gold Rim Gradient */}
            <linearGradient id="goldBevelRim" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#fffdf0" />
              <stop offset="15%" stopColor="#ecd599" />
              <stop offset="35%" stopColor="#c9a45c" />
              <stop offset="55%" stopColor="#966d1f" />
              <stop offset="75%" stopColor="#dfbe72" />
              <stop offset="90%" stopColor="#fdf3d1" />
              <stop offset="100%" stopColor="#67470c" />
            </linearGradient>

            {/* Inner Rose-Gold Enamel Ring Gradient */}
            <linearGradient id="roseEnamelRing" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c293e" />
              <stop offset="30%" stopColor="#c85c7a" />
              <stop offset="65%" stopColor="#e8a0b5" />
              <stop offset="100%" stopColor="#fae7ee" />
            </linearGradient>

            {/* Cream Champagne Dial Radial Gradient with 3D Depth */}
            <radialGradient id="champagneDial" cx="42%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fffaf5" />
              <stop offset="80%" stopColor="#f3e8dc" />
              <stop offset="96%" stopColor="#e3d1be" />
              <stop offset="100%" stopColor="#bfa791" />
            </radialGradient>

            {/* Extrusion / 3D Thickness Gradients for Letters */}
            <linearGradient id="extrudeA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#872942" />
              <stop offset="50%" stopColor="#531424" />
              <stop offset="100%" stopColor="#2e0812" />
            </linearGradient>

            <linearGradient id="extrudeS" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#997022" />
              <stop offset="50%" stopColor="#5b400d" />
              <stop offset="100%" stopColor="#301f04" />
            </linearGradient>

            {/* 3D Face of Letter A (Rose Gold & Deep Pink) */}
            <linearGradient id="faceLetterA" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fce7ee" />
              <stop offset="60%" stopColor="#e8a0b5" />
              <stop offset="90%" stopColor="#c85c7a" />
              <stop offset="100%" stopColor="#a33a56" />
            </linearGradient>

            {/* 3D Face of Letter S (Imperial Polished Gold) */}
            <linearGradient id="faceLetterS" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fff2cb" />
              <stop offset="55%" stopColor="#e2c16f" />
              <stop offset="85%" stopColor="#c9a45c" />
              <stop offset="100%" stopColor="#9e7724" />
            </linearGradient>

            {/* Glass Curved Highlight */}
            <linearGradient id="crystalHighlight" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            {/* Outer Drop Shadow Filter */}
            <filter id="medallionShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#000000" floodOpacity="0.45" />
            </filter>

            {/* Internal 3D Letter Shadow Filter */}
            <filter id="letterCastShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="6" stdDeviation="4" floodColor="#252126" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Group with Medallion Shadow */}
          <g filter="url(#medallionShadow)">
            {/* 1. Base Outer Gold Rim (Solid 3D Bevel) */}
            <circle cx="160" cy="160" r="148" fill="url(#goldBevelRim)" />

            {/* 2. Outer Chamfer Groove Shadow */}
            <circle cx="160" cy="160" r="142" fill="#5c410c" opacity="0.6" />

            {/* 3. Middle Enamel Ring (Rose Gold / Blush Pink) */}
            <circle cx="160" cy="160" r="139" fill="url(#roseEnamelRing)" />

            {/* 4. Fine Beaded Filigree Accents (Concentric ring) */}
            <circle cx="160" cy="160" r="137" fill="none" stroke="#fffdf5" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />
            <circle cx="160" cy="160" r="118" fill="none" stroke="#5c192b" strokeWidth="1.2" opacity="0.6" />

            {/* 5. Inner Gold Inset Rim */}
            <circle cx="160" cy="160" r="117" fill="url(#goldBevelRim)" />
            <circle cx="160" cy="160" r="112" fill="#3d2a06" opacity="0.4" />

            {/* 6. Main Champagne / Cream Medallion Face with Depth */}
            <circle cx="160" cy="160" r="110" fill="url(#champagneDial)" />

            {/* Subtle Circular Texture Grooves */}
            <circle cx="160" cy="160" r="102" fill="none" stroke="#c9a45c" strokeWidth="0.5" opacity="0.3" />
            <circle cx="160" cy="160" r="92" fill="none" stroke="#c85c7a" strokeWidth="0.5" opacity="0.25" />
            <circle cx="160" cy="160" r="82" fill="none" stroke="#c9a45c" strokeWidth="0.5" opacity="0.2" />

            {/* ======================================================= */}
            {/* 7. 3D EXTRUDED MONOGRAM "A" & "S"                     */}
            {/* ======================================================= */}

            {/* Ambient Shadow Layer on Dial */}
            <g filter="url(#letterCastShadow)" opacity="0.5">
              <text
                x="122"
                y="198"
                fontFamily="'Playfair Display', 'Didot', 'Bodoni MT', Georgia, serif"
                fontSize="122"
                fontWeight="900"
                fontStyle="italic"
                textAnchor="middle"
                fill="#1f181c"
              >
                A
              </text>
              <text
                x="196"
                y="204"
                fontFamily="'Playfair Display', 'Didot', 'Bodoni MT', Georgia, serif"
                fontSize="122"
                fontWeight="900"
                fontStyle="italic"
                textAnchor="middle"
                fill="#1f181c"
              >
                S
              </text>
            </g>

            {/* 3D Extrusion Side Walls for "A" (Stacked layers creating physical 3D depth) */}
            <g fill="url(#extrudeA)">
              <text x="122" y="196" fontFamily="'Playfair Display', 'Didot', Georgia, serif" fontSize="122" fontWeight="900" fontStyle="italic" textAnchor="middle">A</text>
              <text x="122" y="194" fontFamily="'Playfair Display', 'Didot', Georgia, serif" fontSize="122" fontWeight="900" fontStyle="italic" textAnchor="middle">A</text>
              <text x="122" y="192" fontFamily="'Playfair Display', 'Didot', Georgia, serif" fontSize="122" fontWeight="900" fontStyle="italic" textAnchor="middle">A</text>
            </g>

            {/* 3D Extrusion Side Walls for "S" */}
            <g fill="url(#extrudeS)">
              <text x="196" y="202" fontFamily="'Playfair Display', 'Didot', Georgia, serif" fontSize="122" fontWeight="900" fontStyle="italic" textAnchor="middle">S</text>
              <text x="196" y="200" fontFamily="'Playfair Display', 'Didot', Georgia, serif" fontSize="122" fontWeight="900" fontStyle="italic" textAnchor="middle">S</text>
              <text x="196" y="198" fontFamily="'Playfair Display', 'Didot', Georgia, serif" fontSize="122" fontWeight="900" fontStyle="italic" textAnchor="middle">S</text>
            </g>

            {/* Front Metallic Face for Letter "A" (Rose Gold) */}
            <text
              x="122"
              y="190"
              fontFamily="'Playfair Display', 'Didot', Georgia, serif"
              fontSize="122"
              fontWeight="900"
              fontStyle="italic"
              textAnchor="middle"
              fill="url(#faceLetterA)"
              stroke="#fff5f8"
              strokeWidth="1"
              strokeOpacity="0.75"
            >
              A
            </text>

            {/* Front Metallic Face for Letter "S" (Imperial Gold) */}
            <text
              x="196"
              y="196"
              fontFamily="'Playfair Display', 'Didot', Georgia, serif"
              fontSize="122"
              fontWeight="900"
              fontStyle="italic"
              textAnchor="middle"
              fill="url(#faceLetterS)"
              stroke="#fffdf0"
              strokeWidth="1"
              strokeOpacity="0.75"
            >
              S
            </text>

            {/* Polished Glass Crystal Curve (Top reflection arch) */}
            <path
              d="M 68,140 A 110,110 0 0,1 252,140 Q 160,185 68,140 Z"
              fill="url(#crystalHighlight)"
              pointerEvents="none"
            />

            {/* 4-Point Diamond Sparkle Star Accent */}
            <g transform="translate(230, 85) scale(0.9)">
              <path
                d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14 Z"
                fill="#ffffff"
              />
              <path
                d="M 0,-10 Q 0,0 10,0 Q 0,0 0,10 Q 0,0 -10,0 Q 0,0 0,-10 Z"
                fill="#fde047"
              />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * Standard responsive AS Logo for Header, Footer, Admin, and Cards.
 */
export default function ASLogo({ size = 'md', showText = true, variant = 'default', className = '' }) {
  if (size === '3d' || size === '3d-hero') {
    return <ASLogo3D size="hero" className={className} />;
  }

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
