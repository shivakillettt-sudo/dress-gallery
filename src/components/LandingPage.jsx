import React from 'react';
import ASLogo from './ASLogo';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between bg-brand-dark text-white select-none">
      
      {/* Background Editorial Fashion Image with Multi-layer Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="Dress Gallery Background"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms] opacity-40 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/30 via-transparent to-brand-gold/20 mix-blend-overlay" />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-brand-pink/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />

      {/* Top Bar Branding */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-gold">
            Elegance • Collection 2026
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Boutique Open Online</span>
        </div>
      </header>

      {/* Central Hero Presentation Card */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8 flex flex-col items-center text-center my-auto">
        
        {/* Large Elegant AS Logo */}
        <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
          <ASLogo size="hero" showText={false} />
        </div>

        {/* Brand Name */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-pink text-xs font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>AS MONOGRAM COLLECTION</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Dress Gallery
          </h1>

          {/* Required Short Tagline */}
          <p className="font-serif italic text-base sm:text-xl text-brand-soft font-normal tracking-wide">
            “Trendy Fashion • Quality • Comfort • Affordable Prices”
          </p>

          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed pt-1">
            Discover handpicked women’s dresses, trendy floral maxis, pure cotton nighties, and daily comfort outfits crafted with love.
          </p>
        </div>

        {/* ONE MAIN REQUIRED BUTTON */}
        <div className="mt-8 sm:mt-10 w-full sm:w-auto">
          <button
            onClick={onEnter}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-deep via-brand-pink to-brand-deep text-white font-bold text-sm sm:text-base px-10 py-4 rounded-full shadow-2xl shadow-brand-deep/50 hover:shadow-brand-deep/80 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30"
          >
            <span className="tracking-widest uppercase text-xs sm:text-sm font-extrabold">
              OPEN DRESS GALLERY
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
          </button>
        </div>

        {/* Micro highlights */}
        <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10 mt-10 w-full max-w-md text-center">
          <div>
            <p className="font-serif font-bold text-base text-brand-gold">₹399+</p>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">Budget Friendly</p>
          </div>
          <div>
            <p className="font-serif font-bold text-base text-brand-gold">100%</p>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">Quality Checked</p>
          </div>
          <div>
            <p className="font-serif font-bold text-base text-brand-gold">Fast COD</p>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">All India Delivery</p>
          </div>
        </div>

      </main>

      {/* Footer info on landing page */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-white/40 border-t border-white/5">
        <p>© 2026 Dress Gallery • AS Monogram • Empowering Women's Fashion</p>
      </footer>

    </div>
  );
}
