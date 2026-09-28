import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  Plus, 
  Minus,
  Sparkles,
  Loader2
} from 'lucide-react';
import { api } from '../utils/api';

export default function ProductOrderModal({
  product,
  isOpen,
  onClose,
  settings,
  defaultSize,
  defaultColor
}) {
  if (!isOpen || !product) return null;

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(defaultSize || product.sizes?.[0] || 'Free Size');
  const [color, setColor] = useState(defaultColor || product.colors?.[0] || '');
  const [notes, setNotes] = useState('');

  // Location states
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const businessPhone = settings?.whatsappNumber || '6369099224';
  const internalWhatsAppNumber = settings?.whatsappInternal || '919636909224';

  const handleUseMyLocation = () => {
    setLocationError('');
    setLocationSuccessMsg('');

    if (!navigator.geolocation) {
      setLocationError('Location access was not available. Please enter your address manually.');
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        setCoords({ lat, lon });
        setLocationSuccessMsg(`Location detected (${lat}, ${lon})`);
        setLocating(false);

        // Attempt reverse geocoding via public OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setAddress((prev) => prev ? `${prev}\n(GPS: ${data.display_name})` : data.display_name);
            }
          }
        } catch (err) {
          // If reverse geocoding fails, coordinates are still captured
          console.warn('Reverse geocoding error', err);
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        setLocating(false);
        setLocationError('Location access was not available. Please enter your address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !mobileNumber.trim() || !address.trim()) {
      setFormError('Please fill in Customer Name, Mobile Number, and Delivery Address.');
      return;
    }

    const cleanPhone = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const sku = product.sku || product.id || 'AS-DRESS';
    const totalPrice = product.price * quantity;

    // Build the formatted WhatsApp message according to the exact specification
    let msg = `Hello Dress Gallery! I would like to order:\n\n`;
    msg += `Product: ${product.title}\n`;
    msg += `Product Code: ${sku}\n`;
    msg += `Price: ₹${totalPrice}\n`;
    msg += `Quantity: ${quantity}\n`;
    if (size) msg += `Size: ${size}\n`;
    if (color) msg += `Color: ${color}\n`;
    msg += `\nCustomer Name: ${customerName.trim()}\n`;
    msg += `Mobile Number: ${mobileNumber.trim()}\n`;
    msg += `Delivery Address: ${address.trim()}\n`;

    if (coords) {
      msg += `\nLocation:\n`;
      msg += `Latitude: ${coords.lat}\n`;
      msg += `Longitude: ${coords.lon}\n`;
    }

    if (notes.trim()) {
      msg += `\nAdditional Notes: ${notes.trim()}\n`;
    }

    msg += `\nPlease confirm availability and order details.`;

    // Save order to backend so admin can view it in the dashboard
    try {
      await api.createOrder({
        customer: {
          name: customerName.trim(),
          phone: mobileNumber.trim(),
          address: address.trim(),
          city: '',
          pincode: ''
        },
        items: [
          {
            id: product.id,
            sku: sku,
            title: product.title,
            price: product.price,
            size: size,
            color: color,
            quantity: quantity,
            image: product.images?.[0]
          }
        ],
        subtotal: totalPrice,
        discount: 0,
        shippingFee: 0,
        total: totalPrice,
        paymentMethod: 'WhatsApp Direct Order',
        paymentStatus: 'Pending',
        source: 'Product Order Now Modal',
        location: coords ? `${coords.lat}, ${coords.lon}` : null,
        notes: notes.trim()
      });
    } catch (err) {
      console.warn('Could not record order to backend', err);
    }

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${internalWhatsAppNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    setOrderPlaced(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-pink/30 my-auto animate-scaleIn text-xs">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-pink/20 flex items-center justify-between bg-gradient-to-r from-brand-soft/70 via-brand-cream to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-deep text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
              AS
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-brand-dark">Complete Your Order</h3>
              <p className="text-[11px] text-brand-muted">Direct order to Dress Gallery (+91 {businessPhone})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-soft text-brand-dark transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderPlaced ? (
          /* Confirmation Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-xl text-brand-dark">Order Message Sent!</h4>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Your order details for <strong>{product.title}</strong> have been opened in WhatsApp. Please send the message to confirm your booking with our team.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="bg-brand-deep text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Product Summary Snippet */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-cream/60 border border-brand-pink/25">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-14 h-16 object-cover rounded-xl bg-brand-beige flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[10px] font-bold text-brand-deep bg-brand-soft/70 px-2 py-0.5 rounded">
                  {product.sku || 'AS-ITEM'}
                </span>
                <h4 className="font-serif font-bold text-brand-dark text-xs sm:text-sm truncate mt-0.5">
                  {product.title}
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-serif font-bold text-sm text-brand-dark">₹{product.price * quantity}</span>
                  {quantity > 1 && (
                    <span className="text-[10px] text-brand-muted">(₹{product.price} × {quantity})</span>
                  )}
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Customer Name (Required) */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
              />
            </div>

            {/* 2. Mobile Number (Required) */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit WhatsApp number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
              />
            </div>

            {/* 3. Delivery Location / Address (Required) + Use My Location Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-brand-dark">
                  Delivery Location / Address <span className="text-rose-500">*</span>
                </label>
                
                {/* REQUIRED 'USE MY LOCATION' BUTTON */}
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-deep bg-brand-soft/80 hover:bg-brand-pink hover:text-white px-2.5 py-1 rounded-lg border border-brand-pink/40 transition disabled:opacity-50"
                  title="Detect my current GPS location"
                >
                  {locating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3" />
                      <span>Use My Location</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                required
                rows="2"
                placeholder="House/Flat No, Street Name, Area, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
              />

              {/* Location Feedback */}
              {locationSuccessMsg && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{locationSuccessMsg}</span>
                </div>
              )}

              {locationError && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-800 font-medium bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* 4. Quantity Stepper */}
            <div className="flex items-center justify-between bg-brand-cream/40 p-2.5 rounded-xl border border-brand-pink/20">
              <span className="font-bold text-brand-dark">Quantity:</span>
              <div className="inline-flex items-center border border-brand-pink/40 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 px-2.5 hover:bg-brand-soft text-brand-dark"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 font-bold text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 px-2.5 hover:bg-brand-soft text-brand-dark"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 5. Optional Size & 6. Optional Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-brand-dark mb-1">
                  Size (Optional)
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2 text-xs font-semibold focus:bg-white focus:outline-none"
                >
                  {product.sizes?.map((sz, idx) => (
                    <option key={idx} value={sz}>{sz}</option>
                  )) || <option value="Free Size">Free Size</option>}
                </select>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">
                  Color (Optional)
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2 text-xs font-medium focus:bg-white focus:outline-none"
                >
                  {product.colors?.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  )) || <option value="Standard">Standard</option>}
                </select>
              </div>
            </div>

            {/* 7. Optional Notes */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Additional Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Any special requests, preferred delivery time, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Order on WhatsApp (₹{product.price * quantity})</span>
              </button>
              <p className="text-[10px] text-brand-muted text-center mt-2">
                Order will be sent to Dress Gallery business WhatsApp: <strong className="text-brand-dark">{businessPhone}</strong>
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
