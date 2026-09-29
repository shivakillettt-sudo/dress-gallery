import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Lock, 
  Sparkles, 
  Truck, 
  PhoneCall, 
  Tag,
  ArrowRight
} from 'lucide-react';
import ASLogo from './ASLogo';

export default function Navbar({
  settings,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrack,
  onOpenReseller,
  onOpenAdmin,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const categories = [
    { label: 'All Dresses', val: 'All' },
    { label: 'Trendy & Designer', val: 'Trendy & Designer' },
    { label: 'Casual & Everyday', val: 'Casual & Everyday' },
    { label: 'Nighties & Lounge', val: 'Nighties & Lounge' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-pink/20 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-deep via-brand-pink to-brand-gold text-white text-xs py-2 px-4 font-medium text-center relative overflow-hidden tracking-wide">
        <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse hidden sm:inline" />
          <span>{settings?.announcement || "🌸 Festive Offer: Flat 10% OFF with code WELCOME100 • Free Delivery above ₹799 🌸"}</span>
          <button 
            onClick={onOpenReseller}
            className="hidden md:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ml-2 backdrop-blur-sm"
          >
            Reselling & Bulk <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* Left Cluster: Mobile Menu Button + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* Mobile Menu Button (Fixed 40x40px, shrink-0, perfectly centered 3 lines) */}
            <div className="lg:hidden shrink-0 flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-brand-dark hover:bg-brand-soft/70 active:bg-brand-soft transition focus:outline-none border border-brand-pink/20 bg-white shadow-2xs"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 shrink-0 text-brand-dark" strokeWidth={2.2} />
                ) : (
                  <Menu className="w-6 h-6 shrink-0 text-brand-dark" strokeWidth={2.2} />
                )}
              </button>
            </div>

            {/* Logo & Brand */}
            <div className="flex items-center cursor-pointer group shrink-0" onClick={() => onSelectCategory('All')}>
              <ASLogo 
                size="md" 
                title={settings?.storeName} 
                subtitle={settings?.subtitle || settings?.logoSubtitle} 
                logoImage={settings?.customLogoUrl}
                monogram={settings?.monogramInitials}
              />
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search party wear, floral maxi, cotton nighty, Meesho finds..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-brand-cream/80 border border-brand-pink/30 focus:border-brand-deep focus:bg-white rounded-full py-2.5 pl-11 pr-4 text-sm text-brand-dark placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition shadow-inner"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-2.5 text-xs text-brand-muted hover:text-brand-dark bg-brand-soft px-1.5 py-0.5 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="lg:hidden p-2 rounded-full text-brand-dark hover:bg-brand-soft/50 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Track Order Button */}
            <button
              onClick={onOpenTrack}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-dark hover:text-brand-deep px-3 py-2 rounded-full hover:bg-brand-soft/60 transition"
              title="Track Order"
            >
              <Truck className="w-4 h-4 text-brand-deep" />
              <span>Track Order</span>
            </button>

            {/* Reseller Button */}
            <button
              onClick={onOpenReseller}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-brand-deep bg-brand-soft/80 hover:bg-brand-pink hover:text-white px-3.5 py-2 rounded-full border border-brand-pink/40 transition shadow-xs"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Reselling / Bulk</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-brand-dark hover:text-brand-deep hover:bg-brand-soft/60 transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-deep text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-brand-dark hover:bg-brand-deep text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-md transition-all group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-brand-pink text-brand-dark font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-wide hidden sm:inline">
                ₹{cartTotal}
              </span>
            </button>

            {/* Admin Login Link */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full text-brand-muted hover:text-brand-dark hover:bg-brand-beige/50 transition text-xs font-medium flex items-center gap-1"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4 text-brand-muted" />
            </button>
          </div>
        </div>

        {/* Mobile Search input dropdown */}
        {showSearchMobile && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search dresses, nighties, Meesho finds..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-brand-cream border border-brand-pink focus:border-brand-deep rounded-full py-2.5 pl-10 pr-4 text-sm text-brand-dark focus:outline-none"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
            </div>
          </div>
        )}

        {/* Category Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-brand-pink/15 py-2.5">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.val}
                onClick={() => onSelectCategory(cat.val)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition ${
                  activeCategory === cat.val
                    ? 'bg-brand-deep text-white shadow-sm'
                    : 'text-brand-dark/80 hover:text-brand-deep hover:bg-brand-soft/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs text-brand-muted font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live WhatsApp Orders
            </span>
            <span className="text-brand-pink">•</span>
            <span>Easy 7-Day Exchange</span>
            <span className="text-brand-pink">•</span>
            <span>Cash on Delivery</span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-brand-cream h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-pink/20">
                <div className="flex items-center">
                  <ASLogo size="sm" />
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-brand-dark hover:bg-brand-soft"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted px-2">Collections</p>
                {categories.map((cat) => (
                  <button
                    key={cat.val}
                    onClick={() => {
                      onSelectCategory(cat.val);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                      activeCategory === cat.val
                        ? 'bg-brand-deep text-white font-semibold'
                        : 'text-brand-dark hover:bg-brand-soft'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-brand-pink/20 flex flex-col gap-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted px-2">Customer Services</p>
                <button
                  onClick={() => {
                    onOpenTrack();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-soft text-left"
                >
                  <Truck className="w-4 h-4 text-brand-deep" />
                  Track Your Order
                </button>
                <button
                  onClick={() => {
                    onOpenReseller();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-brand-deep bg-brand-soft/70 hover:bg-brand-soft text-left"
                >
                  <Tag className="w-4 h-4" />
                  Reseller & Bulk Orders
                </button>
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-brand-muted hover:bg-brand-soft text-left"
                >
                  <Lock className="w-4 h-4" />
                  Admin Dashboard
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-pink/20 text-xs text-brand-muted">
              <p className="font-semibold text-brand-dark">Dress Gallery Boutique</p>
              <p className="mt-1">“Trendy Fashion • Quality • Comfort”</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
