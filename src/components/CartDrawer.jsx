import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  Truck 
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  settings
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const freeShippingThreshold = settings?.freeShippingThreshold || 799;
  const standardShippingFee = settings?.standardShippingFee || 70;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon === 'WELCOME100') {
    discount = Math.min(100, subtotal);
  } else if (appliedCoupon === 'FASHION10') {
    discount = Math.round(subtotal * 0.10);
  }

  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : standardShippingFee;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME100') {
      if (subtotal < 500) {
        setCouponError('WELCOME100 requires minimum order of ₹500');
        return;
      }
      setAppliedCoupon('WELCOME100');
    } else if (code === 'FASHION10') {
      setAppliedCoupon('FASHION10');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME100 or FASHION10');
    }
  };

  const handleWhatsAppCheckout = () => {
    const phone = settings?.whatsappInternal || settings?.whatsappNumber || '919636909224';
    const itemsList = cartItems.map((item, idx) => 
      `${idx + 1}. *${item.title}* | Size: ${item.selectedSize} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`
    ).join('\n');

    const msg = `Hello Dress Gallery! 🛍️ I would like to place this order:

*ITEMS IN MY CART:*
${itemsList}

-----------------------------------
💰 *Subtotal:* ₹${subtotal}
${discount > 0 ? `🎁 *Discount (${appliedCoupon}):* -₹${discount}\n` : ''}🚚 *Shipping:* ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
⭐ *TOTAL AMOUNT:* ₹${total}
-----------------------------------

Please confirm availability and share payment/delivery steps!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-pink/20 flex items-center justify-between bg-brand-cream/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-deep text-white shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-brand-dark">Your Shopping Bag</h2>
                <p className="text-xs text-brand-muted">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-brand-soft text-brand-dark transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="bg-brand-soft/40 px-5 py-3 border-b border-brand-pink/20">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-brand-deep">
                  <Truck className="w-3.5 h-3.5" />
                  {isFreeShipping ? 'You unlocked FREE Delivery!' : `Add ₹${amountNeededForFreeShipping} more for FREE Delivery`}
                </span>
                <span className="text-[11px] text-brand-muted">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-pink/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-deep rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center text-brand-pink border border-brand-pink/30">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-dark">Your bag is empty</h3>
                <p className="text-xs text-brand-muted max-w-xs">
                  Looks like you haven't added any dresses yet. Check out our latest Meesho finds and designer pieces!
                </p>
                <button
                  onClick={onClose}
                  className="bg-brand-deep text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-brand-deep/90 transition shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.selectedSize}-${idx}`}
                  className="flex gap-3.5 p-3 rounded-2xl bg-brand-cream/40 border border-brand-pink/20 hover:border-brand-pink/40 transition"
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80'}
                    alt={item.title}
                    className="w-20 h-24 object-cover object-top rounded-xl bg-brand-beige flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-xs font-bold text-brand-dark line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="text-brand-muted hover:text-rose-500 p-0.5 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-brand-muted font-medium">
                        <span className="bg-white px-2 py-0.5 rounded border border-brand-pink/20">
                          Size: {item.selectedSize}
                        </span>
                        {item.selectedColor && (
                          <span className="bg-white px-2 py-0.5 rounded border border-brand-pink/20">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-brand-pink/10">
                      <span className="font-serif font-bold text-sm text-brand-dark">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity stepper */}
                      <div className="inline-flex items-center border border-brand-pink/30 rounded-lg overflow-hidden bg-white text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-brand-soft text-brand-dark"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-brand-soft text-brand-dark"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-pink/20 bg-brand-cream/60 space-y-3.5">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. WELCOME100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-white border border-brand-pink/40 rounded-xl py-2 pl-8 pr-3 text-xs uppercase font-medium focus:outline-none focus:border-brand-deep"
                  />
                  <Tag className="w-3.5 h-3.5 text-brand-muted absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-deep text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Coupon '{appliedCoupon}' applied!
                  </span>
                  <button 
                    onClick={() => setAppliedCoupon(null)}
                    className="text-[11px] underline hover:text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium px-1">{couponError}</p>
              )}

              {/* Price Calculation Tally */}
              <div className="space-y-1.5 text-xs text-brand-muted pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-dark">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-brand-dark">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-brand-dark pt-2 border-t border-brand-pink/20">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-deep">₹{total}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onProceedToCheckout({ subtotal, discount, shippingFee, total, appliedCoupon })}
                  className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-semibold text-xs py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Delivery & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-md shadow-emerald-500/15 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order via WhatsApp directly</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
