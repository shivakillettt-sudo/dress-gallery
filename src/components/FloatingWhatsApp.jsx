import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp({ settings }) {
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const whatsappNumber = settings?.whatsappNumber || '919876543210';

  const defaultMsg = encodeURIComponent("Hello Dress Gallery! 🌸 I am browsing your website and need help with ordering a dress.");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Speech prompt popup */}
      {bubbleOpen && (
        <div className="relative bg-white text-brand-dark p-3 rounded-2xl shadow-xl border border-brand-pink/30 max-w-xs text-xs animate-scaleIn">
          <button
            onClick={() => setBubbleOpen(false)}
            className="absolute -top-1.5 -right-1.5 bg-brand-cream border border-brand-pink/30 rounded-full p-1 text-brand-muted hover:text-brand-dark"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-bold text-brand-deep flex items-center gap-1">
            🌸 Dress Gallery Support
          </p>
          <p className="text-brand-dark/80 text-[11px] mt-0.5">
            Looking for a specific dress or need help with sizing? Tap below to chat directly with us on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
