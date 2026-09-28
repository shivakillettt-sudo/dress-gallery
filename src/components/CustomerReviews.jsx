import React from 'react';
import { Star, ShieldCheck, Sparkles, Heart, CheckCircle2, RotateCcw, Truck, MessageCircle } from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    {
      name: "Sneha Reddy",
      city: "Hyderabad",
      rating: 5,
      date: "2 days ago",
      dress: "Rose Bloom Tiered Floral Maxi Dress",
      comment: "Absolutely in love with the fabric! The print looks exactly like the photos, and the lining is so soft. Ordered via WhatsApp and got delivery in 3 days. Definitely my new go-to boutique!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Meera Patel",
      city: "Ahmedabad",
      rating: 5,
      date: "1 week ago",
      dress: "Featherlight Cotton Floral Daily Nighty",
      comment: "Purchased 3 cotton nighties in the combo offer. Fabric is pure breathable cotton, doesn't shrink after multiple washes, and the front buttons are so handy. Such genuine pricing!",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Roshni Sen",
      city: "Kolkata",
      rating: 5,
      date: "2 weeks ago",
      dress: "Soft Rayon Embroidered A-Line Kurti",
      comment: "Better quality than most Meesho finds at this price point! The embroidery finishing is neat with no loose threads. Dress Gallery team was super sweet on WhatsApp helping me pick the size.",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-white via-brand-cream/50 to-brand-soft/20 border-t border-brand-pink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-brand-dark">4.9 / 5.0</span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 border border-brand-pink/25 shadow-xs hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-brand-muted">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Purchased product tag */}
                <div className="mt-4 inline-block bg-brand-cream text-brand-deep font-semibold text-[10px] px-2.5 py-1 rounded-lg border border-brand-pink/20">
                  👗 {rev.dress}
                </div>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-pink/15">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-pink/30 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-brand-dark">{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Buyer" />
                  </div>
                  <p className="text-[10px] text-brand-muted">{rev.city}, India</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Value Badges Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-brand-pink/20">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-pink/20">
            <div className="p-2.5 rounded-xl bg-brand-soft text-brand-deep">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark">Premium Quality</p>
              <p className="text-[11px] text-brand-muted">Inspected before dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-pink/20">
            <div className="p-2.5 rounded-xl bg-brand-soft text-brand-deep">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark">7-Day Easy Exchange</p>
              <p className="text-[11px] text-brand-muted">Hassle-free size change</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-pink/20">
            <div className="p-2.5 rounded-xl bg-brand-soft text-brand-deep">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark">Fast Express Shipping</p>
              <p className="text-[11px] text-brand-muted">Across all Indian pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-pink/20">
            <div className="p-2.5 rounded-xl bg-brand-soft text-brand-deep">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark">Direct WhatsApp Care</p>
              <p className="text-[11px] text-brand-muted">Quick help & sizing guide</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
