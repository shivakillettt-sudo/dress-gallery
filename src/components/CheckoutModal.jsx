import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  orderPricing,
  onOrderSuccess,
  settings,
  onOpenTrack
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'Cash on Delivery'
  });

  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [validationError, setValidationError] = useState('');

  const upiId = settings?.upiId || 'dressgallery@okaxis';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      setValidationError('Please fill in all required fields (Name, Phone, Address, Pincode)');
      return;
    }

    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        subtotal: orderPricing.subtotal,
        discount: orderPricing.discount,
        shippingFee: orderPricing.shippingFee,
        total: orderPricing.total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid / Verified',
        source: 'Website Checkout'
      };

      const result = await onOrderSuccess(orderPayload);
      setPlacedOrder(result);

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setValidationError('Error placing order. Please try again or order on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppSendOrder = () => {
    if (!placedOrder) return;
    const phone = settings?.whatsappInternal || settings?.whatsappNumber || '919636909224';
    const itemsList = placedOrder.items.map((it, i) => 
      `${i + 1}. *${it.title}* (${it.size}) x${it.quantity} - ₹${it.price * it.quantity}`
    ).join('\n');

    const msg = `Hello Dress Gallery! 🌸 I just placed an order on your website:

📦 *ORDER ID:* ${placedOrder.id}
👤 *Name:* ${placedOrder.customer.name}
📞 *Phone:* ${placedOrder.customer.phone}
📍 *Address:* ${placedOrder.customer.address}, ${placedOrder.customer.city} - ${placedOrder.customer.pincode}

*ITEMS:*
${itemsList}

💰 *Total Amount:* ₹${placedOrder.total}
💳 *Payment:* ${placedOrder.paymentMethod}

Please confirm my order and share the dispatch tracking!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-pink/30 my-auto animate-scaleIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-brand-soft text-brand-dark transition"
        >
          <X className="w-5 h-5" />
        </button>

        {placedOrder ? (
          /* SUCCESS SCREEN */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-brand-soft text-brand-deep text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-2">
                Thank You, {placedOrder.customer.name}!
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                Your order has been recorded successfully. We are preparing it for dispatch!
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-brand-cream/80 p-4 rounded-2xl border border-brand-pink/20 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold text-brand-dark border-b border-brand-pink/15 pb-2">
                <span>Order ID: <span className="text-brand-deep font-mono">{placedOrder.id}</span></span>
                <span>Total: ₹{placedOrder.total}</span>
              </div>
              <p className="text-brand-dark font-medium">
                <strong>Delivery To:</strong> {placedOrder.customer.address}, {placedOrder.customer.city} ({placedOrder.customer.pincode})
              </p>
              <p className="text-brand-dark font-medium">
                <strong>Payment Mode:</strong> {placedOrder.paymentMethod}
              </p>
            </div>

            {/* WhatsApp Notify Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppSendOrder}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send Order Receipt to WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTrack(placedOrder.id);
                  }}
                  className="bg-brand-soft hover:bg-brand-pink text-brand-dark font-semibold text-xs py-2.5 px-3 rounded-xl transition"
                >
                  Track Live Status
                </button>
                <button
                  onClick={onClose}
                  className="bg-brand-dark hover:bg-brand-deep text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FORM SCREEN */
          <div className="p-5 sm:p-7 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-2.5 pb-4 border-b border-brand-pink/20">
              <div className="p-2 rounded-xl bg-brand-deep text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-brand-dark">Checkout & Delivery Details</h2>
                <p className="text-xs text-brand-muted">Total payable: <strong className="text-brand-deep font-serif">₹{orderPricing.total}</strong> ({cartItems.length} items)</p>
              </div>
            </div>

            {validationError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 9812345678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="For invoice and order tracking"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold text-brand-dark mb-1">Complete Delivery Address *</label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  placeholder="House/Flat No, Apartment Name, Street, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">City / Town *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength="6"
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block font-bold text-brand-dark mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-deep bg-brand-soft/40 shadow-xs'
                      : 'border-brand-pink/30 hover:border-brand-deep'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Truck className="w-5 h-5 text-brand-deep" />
                    <span className="font-bold text-brand-dark">Cash on Delivery</span>
                    <span className="text-[10px] text-brand-muted">Pay at doorstep</span>
                  </label>

                  <label className={`cursor-pointer p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                    formData.paymentMethod === 'UPI / QR Code'
                      ? 'border-brand-deep bg-brand-soft/40 shadow-xs'
                      : 'border-brand-pink/30 hover:border-brand-deep'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI / QR Code"
                      checked={formData.paymentMethod === 'UPI / QR Code'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <QrCode className="w-5 h-5 text-brand-deep" />
                    <span className="font-bold text-brand-dark">Instant UPI</span>
                    <span className="text-[10px] text-brand-muted">GPay, PhonePe, Paytm</span>
                  </label>
                </div>
              </div>

              {/* UPI QR Display when selected */}
              {formData.paymentMethod === 'UPI / QR Code' && (
                <div className="p-4 rounded-2xl bg-brand-cream border border-brand-pink/30 text-center space-y-3">
                  <p className="font-bold text-brand-dark text-xs">Scan & Pay via any UPI App</p>
                  
                  {/* Simulated QR Code box */}
                  <div className="w-36 h-36 bg-white p-2 mx-auto rounded-xl shadow-xs border border-brand-pink/30 flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiId}&pn=DressGallery&am=${orderPricing.total}`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-deep bg-white px-2.5 py-1 rounded-lg border border-brand-pink/30">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 rounded-lg bg-white border border-brand-pink/30 text-brand-dark hover:bg-brand-soft transition"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-brand-muted">
                    Pay ₹{orderPricing.total} and tap Place Order below. We verify transactions swiftly!
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                >
                  {submitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                      <span>Confirm & Place Order (₹{orderPricing.total})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-brand-muted text-center pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Safe Checkout
                </span>
                <span>•</span>
                <span>Fast Dispatch Within 24 Hours</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
