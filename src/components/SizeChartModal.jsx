import React from 'react';
import { X, Ruler } from 'lucide-react';

export default function SizeChartModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sizeData = [
    { size: 'S', bust: '34 - 36', waist: '28 - 30', hip: '36 - 38', length: '46 - 48' },
    { size: 'M', bust: '36 - 38', waist: '30 - 32', hip: '38 - 40', length: '46 - 48' },
    { size: 'L', bust: '38 - 40', waist: '32 - 34', hip: '40 - 42', length: '48 - 50' },
    { size: 'XL', bust: '40 - 42', waist: '34 - 36', hip: '42 - 44', length: '48 - 50' },
    { size: 'XXL', bust: '42 - 44', waist: '36 - 38', hip: '44 - 46', length: '50 - 52' },
    { size: 'Free Size', bust: '34 - 42 (Stretchable/Relaxed)', waist: '28 - 40', hip: 'Free', length: '50 - 54' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-brand-pink/30 overflow-hidden z-10 animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-pink/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-soft text-brand-deep">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-dark">Standard Dress Size Guide</h3>
              <p className="text-xs text-brand-muted">Measurements in Inches (Garment Dimensions)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-soft text-brand-muted hover:text-brand-dark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cream/80 text-brand-deep uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Size</th>
                <th className="py-2.5 px-3">Bust (in)</th>
                <th className="py-2.5 px-3">Waist (in)</th>
                <th className="py-2.5 px-3">Hip (in)</th>
                <th className="py-2.5 px-3 rounded-r-lg">Length (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-pink/15 font-medium">
              {sizeData.map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-soft/20 transition">
                  <td className="py-3 px-3 font-bold text-brand-dark">{row.size}</td>
                  <td className="py-3 px-3 text-brand-dark/80">{row.bust}</td>
                  <td className="py-3 px-3 text-brand-dark/80">{row.waist}</td>
                  <td className="py-3 px-3 text-brand-dark/80">{row.hip}</td>
                  <td className="py-3 px-3 text-brand-dark/80">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="mt-4 p-3 rounded-2xl bg-brand-cream border border-brand-pink/20 text-[11px] text-brand-muted space-y-1">
          <p className="font-semibold text-brand-dark">💡 Measuring Tips:</p>
          <p>• If you prefer a relaxed fit or are between two sizes, we recommend choosing one size up.</p>
          <p>• Nighties and kaftans are designed with loose, comfortable silhouettes.</p>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="bg-brand-deep text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-deep/90 transition shadow-sm"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
}
