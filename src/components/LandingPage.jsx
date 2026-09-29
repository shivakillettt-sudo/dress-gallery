import React, { useState, useEffect } from 'react';
import { ASLogo3D } from './ASLogo';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

/**
 * 3D Beveled Love Heart SVG Element with specular highlights & drop shadows
 */
function LoveHeart3D({ className = '', style = {}, size = 32, delay = '0s', duration = '6s' }) {
  return (
    <div 
      className={`absolute pointer-events-none select-none transition-transform ${className}`}
      style={{
        animation: `floatHeart3D ${duration} ease-in-out infinite alternate`,
        animationDelay: delay,
        ...style
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="filter drop-shadow-[0_12px_24px_rgba(200,92,122,0.65)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform"
      >
        <defs>
          <linearGradient id={`heartGrad-${size}-${delay}`} x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#fff5f7" />
            <stop offset="25%" stopColor="#f8a5bc" />
            <stop offset="55%" stopColor="#c85c7a" />
            <stop offset="85%" stopColor="#962846" />
            <stop offset="100%" stopColor="#4a0f1e" />
          </linearGradient>
          <linearGradient id={`heartBevel-${size}-${delay}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f8dfe7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5c1527" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id={`heartGlow-${size}-${delay}`} cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f8a5bc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 3D Extrusion Shadow Path */}
        <path
          d="M50,88 C20,62 5,45 5,28 C5,14 16,5 30,5 C39,5 46,10 50,17 C54,10 61,5 70,5 C84,5 95,14 95,28 C95,45 80,62 50,88 Z"
          fill="none"
          stroke="#420b17"
          strokeWidth="6"
          transform="translate(2, 4)"
          opacity="0.8"
        />

        {/* Main 3D Heart Body */}
        <path
          d="M50,85 C20,60 5,43 5,26 C5,13 16,4 30,4 C39,4 46,9 50,16 C54,9 61,4 70,4 C84,4 95,13 95,26 C95,43 80,60 50,85 Z"
          fill={`url(#heartGrad-${size}-${delay})`}
          stroke={`url(#heartBevel-${size}-${delay})`}
          strokeWidth="3"
        />

        {/* Specular 3D Highlight Curvature */}
        <ellipse cx="32" cy="22" rx="14" ry="9" fill={`url(#heartGlow-${size}-${delay})`} transform="rotate(-30 32 22)" />
        <ellipse cx="68" cy="22" rx="10" ry="7" fill={`url(#heartGlow-${size}-${delay})`} transform="rotate(30 68 22)" opacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * Premium 3D Love Theme First-Entry Landing Page
 */
export default function LandingPage({ onEnter, settings }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Mouse tilt tracking for realistic 3D depth
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 16;
    const y = ((clientY - top) / height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const storeName = settings?.landingHeadline || settings?.storeName || 'Dress Gallery';
  const tagline = settings?.landingTagline || settings?.tagline || 'Trendy Fashion • Quality • Comfort • Affordable Prices';
  const buttonText = settings?.landingButtonText || 'OPEN DRESS GALLERY';

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#150a10] text-white select-none perspective-[1400px]"
    >
      <style>{`
        @keyframes floatHeart3D {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-22px) rotate(6deg) scale(1.06); }
          100% { transform: translateY(-44px) rotate(-5deg) scale(0.96); }
        }
        @keyframes pulseGlowLove {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.14); }
        }
        @keyframes shimmer3D {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Romantic Editorial Background Image with 3D Depth */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings?.landingBgImage || "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1920&q=85"}
          alt="Dress Gallery 3D Love Theme"
          className="w-full h-full object-cover object-center scale-105 opacity-30 filter blur-[1px]"
        />
        {/* Velvety Romantic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#180913]/95 via-[#1d0a17]/80 to-[#12050e]/98" />
        <div className="absolute inset-0 bg-radial from-rose-900/25 via-pink-950/35 to-transparent" />
      </div>

      {/* Ambient 3D Love Light Orbs */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-rose-600/20 via-pink-500/25 to-amber-500/15 blur-[120px] pointer-events-none"
        style={{ animation: 'pulseGlowLove 8s ease-in-out infinite' }}
      />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-pink-700/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />

      {/* Floating 3D Love Hearts Layer */}
      {settings?.enable3DHearts !== false && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <LoveHeart3D size={56} style={{ top: '12%', left: '8%' }} delay="0s" duration="7s" />
          <LoveHeart3D size={44} style={{ top: '22%', right: '12%' }} delay="1.5s" duration="6s" />
          <LoveHeart3D size={64} style={{ bottom: '18%', left: '12%' }} delay="2.2s" duration="8s" />
          <LoveHeart3D size={48} style={{ bottom: '26%', right: '9%' }} delay="0.8s" duration="7.5s" />
          <LoveHeart3D size={32} style={{ top: '48%', left: '4%' }} delay="3.1s" duration="5.5s" />
          <LoveHeart3D size={36} style={{ top: '65%', right: '6%' }} delay="2.6s" duration="6.2s" />
        </div>
      )}

      {/* Central 3D Showcase Card with Perspective Depth */}
      <main 
        className="relative z-10 w-full max-w-lg mx-auto px-6 py-10 transition-transform duration-300 ease-out flex flex-col items-center justify-center text-center"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 3D Glassmorphism Showcase Plaque */}
        <div 
          className="w-full relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-rose-950/[0.3] backdrop-blur-xl border border-rose-300/30 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_15px_35px_rgba(200,92,122,0.35)] flex flex-col items-center overflow-hidden"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Subtle 3D Top Glass Highlight Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300/70 to-transparent" />

          {/* 3D Love Badge at Top */}
          <div 
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/25 via-pink-400/20 to-amber-400/20 border border-rose-300/40 text-[11px] font-bold tracking-widest text-rose-200 uppercase mb-4 shadow-sm"
            style={{ transform: 'translateZ(20px)' }}
          >
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Romantic Luxury Collection</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>

          {/* Large Prominent 3D AS Logo Medallion with 3D Depth */}
          <div 
            className="mb-5 sm:mb-6 transform transition-transform duration-500 hover:scale-105"
            style={{ transform: 'translateZ(45px)' }}
          >
            <ASLogo3D size="hero" />
          </div>

          {/* Brand Designation & Headline */}
          <div className="space-y-2 sm:space-y-3" style={{ transform: 'translateZ(35px)' }}>
            
            {/* AS Monogram Designation */}
            <div className="text-xs sm:text-sm font-serif font-bold tracking-[0.5em] text-brand-gold uppercase drop-shadow-md">
              AS • SHIVA FASHION
            </div>

            {/* Store Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] leading-tight">
              {storeName}
            </h1>

            {/* Tagline */}
            <p className="font-serif italic text-sm sm:text-base md:text-lg text-rose-200/90 font-normal tracking-wide drop-shadow-md max-w-sm mx-auto leading-relaxed pt-1">
              {tagline}
            </p>
          </div>

          {/* 3D Main Action Button with Love Heart Glow */}
          <div className="mt-8 sm:mt-10 w-full" style={{ transform: 'translateZ(50px)' }}>
            <button
              onClick={onEnter}
              className="group relative w-full sm:w-auto mx-auto inline-flex items-center justify-center gap-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base px-10 py-4 rounded-full shadow-[0_15px_35px_rgba(200,92,122,0.6),0_5px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_rgba(200,92,122,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/60 hover:border-amber-200 cursor-pointer overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
              
              <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform shrink-0" />
              <span className="tracking-[0.2em] uppercase text-xs sm:text-sm font-black text-white drop-shadow-sm">
                {buttonText}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-white shrink-0" />
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
