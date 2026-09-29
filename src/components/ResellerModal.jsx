import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Package, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { api } from '../utils/api';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function ResellerModal({ isOpen, onClose, settings }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    businessType: 'WhatsApp / Instagram Reseller',
    monthlyVolume: '25 - 50 pieces',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const msg = `Hello Dress Gallery! 🛍️ I want to join as a Reseller / Bulk Buyer.
👤 *Name:* ${formData.name || 'Interested Reseller'}
📍 *City:* ${formData.city || 'India'}
💼 *Type:* ${formData.businessType}
📦 *Volume:* ${formData.monthlyVolume}

Please share your wholesale catalog, dealer prices, and broadcast group link!`;

    const whatsappUrl = buildWhatsAppUrl(settings, msg);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-pink/30 my-auto animate-scaleIn">
        
        {/* Header */}
        <div className="p-5 border-b border-brand-pink/20 flex items-center justify-between bg-gradient-to-r from-brand-soft to-brand-cream">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-deep text-white shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-brand-dark">Reseller & Bulk Orders</h2>
              <p className="text-xs text-brand-muted">Wholesale pricing & direct supply for fashion sellers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-brand-dark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-brand-dark">Inquiry Received!</h3>
              <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                Thank you, {formData.name}. Our wholesale team will reach out to you on WhatsApp with the bulk product catalog and margins.
              </p>
            </div>

            <div className="p-3 bg-brand-cream rounded-2xl border border-brand-pink/20 text-xs text-brand-dark">
              💡 For instant response, message us directly with your catalog request:
            </div>

            <button
              onClick={handleWhatsAppDirect}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Connect on Reseller WhatsApp Group</span>
            </button>

            <button
              onClick={onClose}
              className="text-xs font-semibold text-brand-muted hover:text-brand-dark underline"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            
            {/* Value props */}
            <div className="grid grid-cols-3 gap-2 bg-brand-cream/60 p-3 rounded-2xl border border-brand-pink/20 text-center">
              <div>
                <p className="font-bold text-brand-deep">35-50%</p>
                <p className="text-[10px] text-brand-muted">Reseller Margin</p>
              </div>
              <div>
                <p className="font-bold text-brand-deep">No MOQ</p>
                <p className="text-[10px] text-brand-muted">Flexible Lots</p>
              </div>
              <div>
                <p className="font-bold text-brand-deep">Daily Drops</p>
                <p className="text-[10px] text-brand-muted">Fresh Designs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-brand-dark mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Deepa Nair"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-dark mb-1">WhatsApp Number *</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-brand-dark mb-1">Your City / State *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Hyderabad, Telangana"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-dark mb-1">Business Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
                >
                  <option>WhatsApp / Instagram Reseller</option>
                  <option>Boutique / Retail Store Owner</option>
                  <option>Meesho / Amazon Fashion Seller</option>
                  <option>Looking to Start New Fashion Business</option>
                  <option>Bulk Personal / Family Orders</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-brand-dark mb-1">Estimated Monthly Volume</label>
              <select
                name="monthlyVolume"
                value={formData.monthlyVolume}
                onChange={handleChange}
                className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
              >
                <option>10 - 25 pieces / month</option>
                <option>25 - 50 pieces / month</option>
                <option>50 - 100 pieces / month</option>
                <option>100+ pieces / month (Super Wholesale)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-dark mb-1">Message / Category Interested In</label>
              <textarea
                name="message"
                rows="2"
                placeholder="e.g. Looking for pure cotton nighties and Meesho kurti dresses under ₹499."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark focus:bg-white focus:outline-none focus:border-brand-deep"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Wholesale Inquiry'}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="w-full bg-[#25D366]/10 hover:bg-[#25D366] text-emerald-800 hover:text-white border border-[#25D366]/30 font-semibold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Or Chat with Wholesale Manager Now</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
