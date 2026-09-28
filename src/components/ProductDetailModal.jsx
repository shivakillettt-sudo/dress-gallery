import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  Ruler, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  whatsappNumber,
  onOpenSizeChart,
  onOpenOrderForm
}) {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const discountAmount = product.mrp > product.price ? product.mrp - product.price : 0;
  const discountPercent = product.mrp > product.price 
    ? Math.round((discountAmount / product.mrp) * 100) 
    : 0;

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleOrderNow = () => {
    if (onOpenOrderForm) {
      onOpenOrderForm(product, selectedSize, selectedColor, quantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-pink/30 my-auto animate-scaleIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-brand-dark hover:text-brand-deep shadow-md transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="p-4 sm:p-6 bg-brand-cream/50 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-brand-beige shadow-inner">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover object-top"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-brand-deep text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImage === idx ? 'border-brand-deep ring-2 ring-brand-pink' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category, Rating & Wishlist */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-deep bg-brand-soft/70 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating || 4.8}</span>
                    <span className="text-brand-muted font-normal text-[11px]">({product.reviewsCount || 24})</span>
                  </div>
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2 rounded-full border transition ${
                      isWishlisted 
                        ? 'bg-rose-50 border-rose-300 text-rose-500 fill-rose-500' 
                        : 'border-brand-pink/30 text-brand-muted hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark leading-snug">
                {product.title}
              </h2>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-brand-cream/80 border border-brand-pink/20">
                <span className="font-serif text-3xl font-bold text-brand-dark">
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-brand-muted line-through">
                      ₹{product.mrp}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {discountPercent}% OFF (Save ₹{discountAmount})
                    </span>
                  </>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-700 font-semibold">
                  In Stock & Ready to Dispatch
                </span>
                <span className="text-brand-muted">•</span>
                <span className="text-brand-muted">COD & WhatsApp Available</span>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                    Select Size: <span className="text-brand-deep font-semibold">{selectedSize}</span>
                  </span>
                  <button
                    onClick={onOpenSizeChart}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-10 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedSize === size
                          ? 'bg-brand-deep text-white border-brand-deep shadow-xs'
                          : 'border-brand-pink/30 hover:border-brand-deep bg-white text-brand-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors (if present) */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-2">
                    Color: <span className="text-brand-deep font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selectedColor === color
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'border-brand-pink/30 hover:border-brand-dark bg-white text-brand-dark'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Quantity:</span>
                <div className="inline-flex items-center border border-brand-pink/40 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-brand-soft text-brand-dark transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-brand-dark">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-brand-soft text-brand-dark transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description & Fabric */}
              <div className="text-xs text-brand-muted space-y-2 pt-2 border-t border-brand-pink/15">
                <p className="leading-relaxed">{product.description}</p>
                {product.fabric && (
                  <p className="font-medium text-brand-dark">
                    <strong className="text-brand-deep">Fabric:</strong> {product.fabric}
                  </p>
                )}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-brand-pink/20">
              
              {addedToast && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Added to your shopping bag!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className="w-full bg-brand-dark hover:bg-brand-deep text-white font-semibold text-sm py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleOrderNow}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order Now (WhatsApp)</span>
                </button>
              </div>

              {/* Mini Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-brand-muted text-center pt-2">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-brand-deep" />
                  <span>Fast 3-5 Day Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-brand-deep" />
                  <span>7-Day Easy Exchange</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-deep" />
                  <span>100% Genuine Quality</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
