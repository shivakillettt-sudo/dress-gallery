import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Percent, 
  ChevronRight 
} from 'lucide-react';

export default function Hero({ settings, onExplore, onSelectCategory, activeCategory }) {

  const storyCategories = [
    { 
      name: 'All Outfits', 
      cat: 'All', 
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80',
      badge: 'All'
    },
    { 
      name: 'Party Glam', 
      cat: 'Trendy & Designer', 
      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80',
      badge: 'New'
    },
    { 
      name: 'Daily Casuals', 
      cat: 'Casual & Everyday', 
      img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80',
      badge: 'Hot'
    },
    { 
      name: 'Nighties & Sets', 
      cat: 'Nighties & Lounge', 
      img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80',
      badge: 'Cotton'
    },
    { 
      name: 'Under ₹499', 
      cat: 'Under 499', 
      img: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=300&q=80',
      badge: 'Budget'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-soft/40 via-brand-cream to-white pt-6 pb-12">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-brand-pink/40 shadow-xs px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-deep">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{settings?.heroBadge || `${settings?.subtitle || settings?.logoSubtitle || 'Shiva Fashion'} Collection`}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark leading-[1.15]">
              {settings?.heroHeadline ? (
                <span>{settings.heroHeadline}</span>
              ) : (
                <>
                  Trendy Fashion, <br />
                  <span className="italic font-normal text-brand-deep">Exceptional Comfort</span>, <br />
                  Affordable Prices.
                </>
              )}
            </h1>

            {/* Subtitle / Brand Statement */}
            <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings?.heroSubtitle || settings?.tagline || 'Curated women’s dresses and everyday outfits, crafted for comfort, style, and quality.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-deep hover:bg-brand-deep/90 text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-brand-deep/25 hover:shadow-brand-deep/40 transition transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop New Arrivals</span>
              </button>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-brand-pink/20 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif font-bold text-lg sm:text-xl text-brand-dark">₹399+</span>
                <span className="text-[11px] text-brand-muted font-medium">Budget Friendly</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif font-bold text-lg sm:text-xl text-brand-dark">100%</span>
                <span className="text-[11px] text-brand-muted font-medium">Quality Checked</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif font-bold text-lg sm:text-xl text-brand-dark">Direct</span>
                <span className="text-[11px] text-brand-muted font-medium">Easy Ordering</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Editorial Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Main Fashion Feature Card */}
              <div className="overflow-hidden rounded-3xl shadow-float bg-white border border-brand-pink/30 p-2 transform rotate-1 hover:rotate-0 transition duration-500">
                <div className="relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-brand-beige">
                  <img
                    src={settings?.heroImage || "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"}
                    alt={settings?.storeName || "Dress Gallery Elegance"}
                    className="w-full h-full object-cover object-top hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                  
                  {/* Bottom overlay text */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block bg-brand-gold text-brand-dark font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                      Featured
                    </span>
                    <h3 className="font-serif text-xl font-bold">{settings?.heroCardTitle || "The Blossom Edit"}</h3>
                    <p className="text-xs text-white/80">{settings?.heroCardSubtitle || "Breathable silhouettes for everyday comfort"}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stories / Circular Category Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-brand-pink/20">
          <div className="text-center mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Browse Popular Categories
            </span>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-4 no-scrollbar px-2">
            {storyCategories.map((item, idx) => {
              const isSelected = activeCategory === item.cat;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectCategory(item.cat)}
                  className="flex flex-col items-center gap-2 group flex-shrink-0 transition-transform active:scale-95"
                >
                  <div className={`relative p-1 rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'ring-3 ring-brand-deep scale-105' 
                      : 'ring-2 ring-brand-pink/40 group-hover:ring-brand-deep'
                  }`}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-brand-beige">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    {item.badge && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand-deep text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold tracking-tight transition ${
                    isSelected ? 'text-brand-deep font-bold' : 'text-brand-dark group-hover:text-brand-deep'
                  }`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
