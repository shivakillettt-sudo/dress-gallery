import React from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';

import ASLogo from './ASLogo';

export default function Footer({
  settings,
  onSelectCategory,
  onOpenTrack,
  onOpenReseller,
  onOpenSizeChart,
  onOpenAdmin
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white border-t border-brand-pink/20 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <ASLogo size="md" variant="light" />
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Dress Gallery offers stylish, comfortable, and affordable dresses for everyday wear and special occasions.
            </p>

            <div className="pt-1">
              <p className="font-serif italic text-xs text-brand-pink">
                “Trendy Fashion • Quality • Comfort”
              </p>
            </div>

            {/* WhatsApp Contact badge */}
            <div className="pt-2">
              <a
                href="https://api.whatsapp.com/send?phone=919636909224"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366] text-white border border-[#25D366]/40 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm tracking-wider text-brand-gold uppercase">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => onSelectCategory('Trendy & Designer')} className="hover:text-brand-pink transition">
                  Trendy & Designer Dresses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Casual & Everyday')} className="hover:text-brand-pink transition">
                  Casual & Everyday Wear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Nighties & Lounge')} className="hover:text-brand-pink transition">
                  Cotton Nighties & Loungewear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Under 499')} className="hover:text-brand-pink transition">
                  Meesho Budget Finds (Under ₹499)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('All')} className="hover:text-brand-pink transition">
                  View All Outfits
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm tracking-wider text-brand-gold uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={onOpenTrack} className="hover:text-brand-pink transition flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={onOpenSizeChart} className="hover:text-brand-pink transition">
                  Size Guide & Measurements
                </button>
              </li>
              <li>
                <button onClick={onOpenReseller} className="hover:text-brand-pink transition text-brand-pink font-semibold">
                  Reseller & Bulk Enquiries
                </button>
              </li>
              <li>
                <span className="text-white/50 cursor-default">7-Day Return / Exchange Policy</span>
              </li>
              <li>
                <span className="text-white/50 cursor-default">Shipping & Delivery Info</span>
              </li>
            </ul>
          </div>

          {/* Boutique Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm tracking-wider text-brand-gold uppercase">
              Boutique Info
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-pink flex-shrink-0 mt-0.5" />
                <span>{settings?.address || "Dress Gallery Boutique, Fashion Street, Sector 12"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-pink flex-shrink-0" />
                <span>{settings?.supportEmail || "contact@dressgallery.in"}</span>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-brand-pink flex-shrink-0" />
                <span>{settings?.instagramHandle || "@dressgallery_fashion"}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} Dress Gallery. All rights reserved. Handcrafted for modern women.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-white/40 hover:text-white/80 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
