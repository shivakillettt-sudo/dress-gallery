import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';

export default function TrackOrderModal({ isOpen, onClose, initialQuery, settings }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchTerm) => {
    const q = (searchTerm || query).trim();
    if (!q) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const orders = await api.trackOrder(q);
      setResults(orders);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 1;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const steps = [
    { label: 'Order Confirmed', desc: 'Received & verified' },
    { label: 'Quality Packed', desc: 'Dispatched from boutique' },
    { label: 'Shipped', desc: 'In transit with courier' },
    { label: 'Delivered', desc: 'Delivered to your door' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-pink/30 my-auto animate-scaleIn">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-brand-pink/20 flex items-center justify-between bg-brand-cream/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-deep text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-brand-dark">Track Your Order</h2>
              <p className="text-xs text-brand-muted">Enter your Order ID (e.g. DG-9041) or Mobile Number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-soft text-brand-dark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. DG-9041 or 9823456789"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-brand-cream/70 border border-brand-pink/40 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-dark font-medium focus:bg-white focus:outline-none focus:border-brand-deep"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-deep hover:bg-brand-deep/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Results Display */}
          {hasSearched && (
            <div>
              {results.length === 0 ? (
                <div className="p-6 text-center space-y-3 bg-brand-cream/40 rounded-2xl border border-brand-pink/20">
                  <AlertCircle className="w-10 h-10 text-brand-muted mx-auto" />
                  <p className="text-xs font-semibold text-brand-dark">No order found matching "{query}"</p>
                  <p className="text-[11px] text-brand-muted max-w-xs mx-auto">
                    Please ensure the Order ID is correct or contact us on WhatsApp with your name and payment screenshot.
                  </p>
                  <a
                    href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(`Hello, I want to check my order status for: ${query}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 mt-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Help me find my order on WhatsApp
                  </a>
                </div>
              ) : (
                results.map((order) => {
                  const stepIndex = getStepIndex(order.orderStatus);
                  const isCancelled = order.orderStatus?.toLowerCase() === 'cancelled';

                  return (
                    <div 
                      key={order.id}
                      className="border border-brand-pink/30 rounded-2xl p-4 bg-white shadow-xs space-y-4 mb-4"
                    >
                      {/* Top Order Card Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-pink/15 pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-brand-deep bg-brand-soft/70 px-2 py-0.5 rounded-md">
                            {order.id}
                          </span>
                          <p className="text-[11px] text-brand-muted mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {order.orderStatus || 'Confirmed'}
                          </span>
                          <p className="text-xs font-bold text-brand-dark mt-0.5">
                            ₹{order.total} ({order.paymentMethod})
                          </p>
                        </div>
                      </div>

                      {/* Timeline Stepper */}
                      {!isCancelled && (
                        <div className="py-2">
                          <div className="grid grid-cols-4 gap-2 relative">
                            {steps.map((st, i) => {
                              const stepNum = i + 1;
                              const isCompleted = stepNum <= stepIndex;
                              const isCurrent = stepNum === stepIndex;

                              return (
                                <div key={i} className="flex flex-col items-center text-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition ${
                                    isCompleted 
                                      ? 'bg-brand-deep text-white shadow-xs' 
                                      : 'bg-brand-cream text-brand-muted border border-brand-pink/30'
                                  }`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                                  </div>
                                  <span className={`text-[10px] font-bold leading-tight ${isCurrent ? 'text-brand-deep' : 'text-brand-dark'}`}>
                                    {st.label}
                                  </span>
                                  <span className="text-[9px] text-brand-muted hidden sm:inline leading-tight mt-0.5">
                                    {st.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Items in this order */}
                      <div className="border-t border-brand-pink/15 pt-3 space-y-2">
                        <p className="text-[11px] font-bold text-brand-dark uppercase tracking-wider">Ordered Items:</p>
                        <div className="space-y-2">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs bg-brand-cream/40 p-2 rounded-xl">
                              {it.image && (
                                <img src={it.image} alt="" className="w-10 h-12 object-cover rounded-lg" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-brand-dark">{it.title}</p>
                                <p className="text-[10px] text-brand-muted">Size: {it.size || 'Free Size'} | Qty: {it.quantity}</p>
                              </div>
                              <span className="font-bold text-brand-dark">₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-[11px] text-brand-muted bg-brand-cream/60 p-2.5 rounded-xl border border-brand-pink/15">
                        <MapPin className="w-4 h-4 text-brand-deep flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-brand-dark">{order.customer?.name}</strong> • {order.customer?.phone}
                          <p>{order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}</p>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
