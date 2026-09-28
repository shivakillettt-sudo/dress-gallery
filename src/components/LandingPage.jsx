import React from 'react';
import { ASLogo3D } from './ASLogo';
import { ArrowRight } from 'lucide-react';

/**
 * Premium 3D Fashion Store First-Entry Landing Page
 * Displays strictly:
 * 1. Large 3D AS Logo
 * 2. AS
 * 3. Dress Gallery
 * 4. Trendy Fashion • Quality • Comfort
 * 5. OPEN DRESS GALLERY
 */
export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-brand-dark text-white select-none">
      
      {/* Background Editorial Fashion Image with Luxury Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="Dress Gallery Background"
          className="w-full h-full object-cover object-center scale-105 opacity-35 filter blur-[0.5px]"
        />
        {/* Deep Vignette & Soft Pink + Gold Lighting Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 via-brand-dark/75 to-brand-dark/95" />
        <div className="absolute inset-0 bg-radial from-brand-gold/10 via-brand-deep/15 to-transparent" />
      </div>

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-pink/20 blur-3xl pointer-events-none" />

      {/* Main Centered 3D Luxury Showcase */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-10 flex flex-col items-center justify-center text-center">
        
        {/* Large Prominent 3D AS Logo (Main Visual Focus) */}
        <div className="mb-4 sm:mb-6 animate-fadeIn">
          <ASLogo3D size="hero" />
        </div>

        {/* Minimal Required Text Elements */}
        <div className="space-y-2 sm:space-y-3">
          
          {/* AS Designation */}
          <div className="text-xs sm:text-sm font-serif font-bold tracking-[0.45em] text-brand-gold uppercase">
            AS
          </div>

          {/* Dress Gallery */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
            Dress Gallery
          </h1>

          {/* Minimal Tagline */}
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-brand-soft font-normal tracking-wide drop-shadow-sm pt-1">
            Trendy Fashion • Quality • Comfort
          </p>

        </div>

        {/* Single Main Action Button */}
        <div className="mt-8 sm:mt-10 w-full sm:w-auto">
          <button
            onClick={onEnter}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-deep via-brand-pink to-brand-deep text-white font-bold text-sm sm:text-base px-10 py-4 rounded-full shadow-2xl shadow-brand-deep/50 hover:shadow-brand-deep/80 hover:scale-105 active:scale-95 transition-all duration-300 border border-brand-gold/50 hover:border-brand-gold"
          >
            <span className="tracking-widest uppercase text-xs sm:text-sm font-extrabold text-white">
              OPEN DRESS GALLERY
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
          </button>
        </div>

      </main>

    </div>
  );
}
