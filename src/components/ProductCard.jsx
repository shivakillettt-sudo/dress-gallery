import React from 'react';
import { Heart, ShoppingBag, MessageCircle, Star, Eye } from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
  onQuickAddToCart,
  onOpenOrderModal
}) {
  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleOrderNowClick = (e) => {
    e.stopPropagation();
    if (onOpenOrderModal) {
      onOpenOrderModal(product);
    }
  };

  return (
    <div 
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-brand-pink/25 hover:border-brand-pink/60 shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start z-10">
          {product.badge && (
            <span className="bg-brand-deep text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-brand-gold text-brand-dark text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow-xs z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 fill-rose-500'
              : 'bg-white/80 text-brand-dark hover:bg-white hover:text-rose-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View overlay button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-brand-dark font-medium text-xs py-2 px-3 rounded-xl shadow-md backdrop-blur-sm flex items-center justify-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5 text-brand-deep" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star rating */}
          <div className="flex items-center justify-between text-[11px] text-brand-muted mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-sm font-semibold text-brand-dark line-clamp-1 group-hover:text-brand-deep transition">
            {product.title}
          </h3>

          {/* Sizes available */}
          <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
            <span className="text-[10px] text-brand-muted font-medium">Sizes:</span>
            {product.sizes?.map((sz, idx) => (
              <span 
                key={idx} 
                className="text-[10px] bg-brand-cream text-brand-dark font-medium px-1.5 py-0.5 rounded border border-brand-pink/20"
              >
                {sz}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3.5 pt-3 border-t border-brand-pink/15">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="font-serif text-lg font-bold text-brand-dark">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-brand-muted line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAddToCart(product);
              }}
              className="bg-brand-soft hover:bg-brand-pink text-brand-dark hover:text-white font-semibold text-xs py-2 px-2 rounded-xl transition flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              onClick={handleOrderNowClick}
              className="bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs py-2 px-2 rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
              title="Order Now"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
