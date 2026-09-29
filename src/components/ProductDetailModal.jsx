import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Send,
  User,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeChart,
  onOpenOrderForm,
  settings
}) {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLinkToast, setCopiedLinkToast] = useState(false);

  // Review & Rating State
  const storageKey = `dg_reviews_${product.id}`;
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial demo reviews
    return [
      {
        id: 'rev-1',
        name: 'Priya Sundaram',
        rating: 5,
        date: '2 days ago',
        comment: 'Fabric is extremely soft and comfortable! The fit and color match the photo perfectly. Super fast WhatsApp ordering.',
        verified: true
      },
      {
        id: 'rev-2',
        name: 'Kavitha R.',
        rating: 5,
        date: '1 week ago',
        comment: 'Worth every rupee. The stitching and material quality exceeded my expectations. Received in 3 days!',
        verified: true
      }
    ];
  });

  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Save reviews when updated
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviewsList));
    } catch (e) {}
  }, [reviewsList, storageKey]);

  // Pricing calculations
  const discountAmount = product.mrp > product.price ? product.mrp - product.price : 0;
  const discountPercent = product.mrp > product.price 
    ? Math.round((discountAmount / product.mrp) * 100) 
    : 0;

  // Calculate live average rating
  const avgRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : (product.rating || 4.9);

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

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: `${product.title} - Dress Gallery`,
          text: `Check out this gorgeous ${product.title} on Dress Gallery!`,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLinkToast(true);
        setTimeout(() => setCopiedLinkToast(false), 2000);
      }
    } catch (e) {}
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewError('');

    if (!reviewerName.trim() || !reviewComment.trim()) {
      setReviewError('Please enter your name and write a short review.');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      rating: userRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      verified: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewerName('');
    setReviewComment('');
    setReviewSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}

    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fffaf5] overflow-y-auto animate-fadeIn flex flex-col">
      
      {/* Sticky Top Bar for Full Page Product View */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-brand-pink/20 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-deep bg-brand-soft/70 hover:bg-brand-soft px-3 py-2 rounded-xl transition shadow-2xs shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Collection</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-brand-muted truncate">
            <span>Home</span>
            <span>/</span>
            <span className="font-semibold text-brand-deep">{product.category}</span>
            <span>/</span>
            <span className="truncate text-brand-dark font-medium">{product.title}</span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-brand-muted hover:text-brand-dark hover:bg-brand-soft transition cursor-pointer"
            title="Share dress link"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-full border transition cursor-pointer ${
              isWishlisted 
                ? 'bg-rose-50 border-rose-300 text-rose-500 fill-rose-500' 
                : 'border-brand-pink/30 text-brand-muted hover:text-rose-500 bg-white'
            }`}
            title="Add to Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-brand-soft hover:bg-brand-pink text-brand-dark hover:text-white transition cursor-pointer"
            aria-label="Close page"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Copied toast */}
      {copiedLinkToast && (
        <div className="fixed top-16 right-4 z-50 bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg animate-scaleIn">
          ✓ Link copied to clipboard!
        </div>
      )}

      {/* Main Full Page Product Detail Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        
        {/* Top Two-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Multi-Image Showcase Gallery */}
          <div className="space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-brand-beige shadow-lg border border-brand-pink/20">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-brand-deep text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery Strip */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      selectedImage === idx 
                        ? 'border-brand-deep ring-2 ring-brand-pink shadow-md' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Full Product Specs, Pricing & Order CTAs */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Category, SKU & Verified Rating Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-widest font-extrabold text-brand-deep bg-brand-soft/80 px-3 py-1.5 rounded-full">
                  {product.category}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-700 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{avgRating}</span>
                    <span className="text-brand-muted font-normal text-[11px]">({reviewsList.length} reviews)</span>
                  </div>
                  <span className="text-xs font-mono text-brand-muted bg-white px-2 py-1 rounded-md border border-brand-pink/20">
                    SKU: {product.sku || product.id}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">
                {product.title}
              </h1>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-white border border-brand-pink/30 shadow-xs flex flex-wrap items-baseline gap-3 sm:gap-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-base text-brand-muted line-through">
                      MRP: ₹{product.mrp}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {discountPercent}% OFF (Save ₹{discountAmount})
                    </span>
                  </>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-xs bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-emerald-800 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock & Ready for Immediate Dispatch</span>
                <span className="text-brand-muted">•</span>
                <span className="text-brand-dark font-semibold">Free Delivery Above ₹799</span>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                    Select Size: <span className="text-brand-deep font-semibold">{selectedSize}</span>
                  </span>
                  <button
                    onClick={onOpenSizeChart}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide & Chart</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {(product.sizes || ['Free Size']).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-11 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedSize === size
                          ? 'bg-brand-deep text-white border-brand-deep shadow-xs'
                          : 'border-brand-pink/40 hover:border-brand-dark bg-white text-brand-dark'
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
                    Available Color: <span className="text-brand-deep font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          selectedColor === color
                            ? 'bg-brand-dark text-white border-brand-dark font-bold'
                            : 'border-brand-pink/30 hover:border-brand-dark bg-white text-brand-dark'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Quantity:</span>
                <div className="inline-flex items-center border border-brand-pink/40 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-brand-soft text-brand-dark transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-brand-dark">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-brand-soft text-brand-dark transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fabric & Product Specifications */}
              <div className="bg-white p-4 rounded-2xl border border-brand-pink/20 space-y-2 text-xs text-brand-muted">
                <p className="leading-relaxed text-brand-dark/90">{product.description}</p>
                {product.fabric && (
                  <p className="font-medium text-brand-dark pt-1">
                    <strong className="text-brand-deep">Fabric:</strong> {product.fabric}
                  </p>
                )}
              </div>

            </div>

            {/* Order Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-brand-pink/20">
              
              {addedToast && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3.5 py-2.5 rounded-xl text-center flex items-center justify-center gap-2 animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Added to your shopping bag!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Add to Bag */}
                <button
                  onClick={handleAdd}
                  className="w-full bg-brand-dark hover:bg-brand-deep text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md transition flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* 2. Instant Order Now on WhatsApp */}
                <button
                  onClick={handleOrderNow}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order Now (WhatsApp)</span>
                </button>
              </div>

              {/* Mini Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-brand-muted text-center pt-2">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-brand-deep" />
                  <span className="font-semibold text-brand-dark">Fast Delivery</span>
                  <span className="text-[10px]">3-5 Business Days</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-brand-deep" />
                  <span className="font-semibold text-brand-dark">Easy Exchange</span>
                  <span className="text-[10px]">7-Day Policy</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-brand-deep" />
                  <span className="font-semibold text-brand-dark">100% Genuine</span>
                  <span className="text-[10px]">Quality Verified</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* --- CUSTOMER RATINGS & REVIEWS SECTION --- */}
        <section className="pt-8 border-t border-brand-pink/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark flex items-center gap-2">
                <span>Customer Ratings & Reviews</span>
                <span className="text-sm font-sans font-semibold text-brand-deep bg-brand-soft/70 px-2.5 py-0.5 rounded-full">
                  {reviewsList.length}
                </span>
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Real feedback from verified Dress Gallery shoppers
              </p>
            </div>

            {/* Overall Star Badge */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-brand-pink/30 shadow-2xs self-start">
              <div className="text-3xl font-extrabold text-brand-dark font-serif">
                {avgRating}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-[10px] text-brand-muted mt-0.5">Based on {reviewsList.length} verified ratings</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 1-Column: Write a Review Form */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-pink/30 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-deep" />
                <h4 className="font-serif font-bold text-base text-brand-dark">Rate this Product</h4>
              </div>

              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-1 text-center animate-scaleIn">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold">Thank you for your review!</p>
                  <p className="text-[11px] text-emerald-700">Your rating and feedback have been published.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                  
                  {/* Star Rating Selector */}
                  <div>
                    <label className="block font-bold text-brand-dark mb-1">Your Rating *</label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || userRating) >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 ml-2">
                        {userRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block font-bold text-brand-dark mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shalini"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block font-bold text-brand-dark mb-1">Your Review & Feedback *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="How was the fabric, fitting, and comfort of this dress?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep leading-relaxed"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right 2-Columns: Reviews Feed */}
            <div className="lg:col-span-2 space-y-3">
              {reviewsList.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-pink/20 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-soft text-brand-deep flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-brand-dark">{rev.name}</span>
                          {rev.verified && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-brand-muted">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-brand-dark/90 leading-relaxed pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
