import React from 'react';
import { CustomerOrder } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface CorrectionModalProps {
  customer: CustomerOrder;
  onClose: () => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  customer,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none animate-fadeIn">
      {/* 2D Cartoon Chef Mascot Popping Up Holding Green Chalkboard */}
      <div className="w-full max-w-lg bg-amber-50 rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-amber-400 relative overflow-hidden transform transition-all duration-300 animate-slideUp">
        {/* Decorative Top Chef Popping Up Graphic */}
        <div className="flex items-center gap-3 mb-2">
          {/* Chef Mascot Holding Chalkboard */}
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="52" r="28" fill="#FFD1A9" />
              {/* Mustache */}
              <path d="M 36 58 Q 50 64 50 56 Q 50 64 64 58 Q 50 70 36 58" fill="#4A3000" />
              {/* Eyes smiling */}
              <path d="M 38 46 Q 44 40 50 46" stroke="#4A3000" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 50 46 Q 56 40 62 46" stroke="#4A3000" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Cheeks */}
              <circle cx="34" cy="52" r="4" fill="#FF85A1" opacity="0.6" />
              <circle cx="66" cy="52" r="4" fill="#FF85A1" opacity="0.6" />
              {/* Chef Tall Hat */}
              <path d="M 24 35 C 10 15, 25 -5, 45 5 C 55 -15, 75 0, 75 15 C 90 20, 85 35, 76 35 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
              <rect x="25" y="32" width="50" height="10" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="30" y="35" width="40" height="4" rx="2" fill="#E63946" />
              {/* Hands holding board edges */}
              <circle cx="20" cy="80" r="7" fill="#FFD1A9" stroke="#E29578" strokeWidth="1.5" />
              <circle cx="80" cy="80" r="7" fill="#FFD1A9" stroke="#E29578" strokeWidth="1.5" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow animate-spin">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full inline-block mb-0.5">
              💡 Petunjuk Koki Master
            </span>
            <h3 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
              Ayo, Koki Cilik Pasti Bisa!
            </h3>
            <p className="text-[11px] text-amber-800 font-semibold">
              Pesanan {customer.customerName}: &ldquo;{customer.promptText}&rdquo;
            </p>
          </div>
        </div>

        {/* The Green Chalkboard Held by Chef */}
        <div className="bg-[#1B4332] text-white rounded-2xl p-3 sm:p-4 border-4 border-[#8B5E3C] shadow-inner mb-3 relative font-sans">
          {/* Chalk texture frame corners */}
          <div className="absolute top-1 left-2 text-[9px] text-emerald-300 font-mono opacity-80">
            [ PAPAN REKAP RESEP ]
          </div>

          {/* Chalkboard content */}
          <div className="mt-3 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            <p className="text-white font-bold mb-2 flex items-center gap-1.5">
              <span>✏️</span>
              <span>{customer.hintText}</span>
            </p>

            {/* Visual chalk illustration */}
            {customer.dishType === 'pizza' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-amber-200">
                <div className="flex flex-col items-center">
                  <span>1/2 Pizza</span>
                  <span className="text-xl my-0.5">🍕🍕</span>
                  <span className="text-[10px] text-emerald-300">2 dari 4 potong</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col items-center">
                  <span>Pecahan Senilai</span>
                  <span className="text-xl my-0.5">🍕🍕🍕🍕</span>
                  <span className="text-[10px] text-emerald-300">4 dari 8 potong (4/8 = 1/2)</span>
                </div>
              </div>
            )}

            {customer.dishType === 'donut' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-pink-200">
                <div className="flex flex-col items-center">
                  <span>1/3 Kotak Donat</span>
                  <span className="text-xl my-0.5">🍩🍩</span>
                  <span className="text-[10px] text-emerald-300">Ambil 2 donat dari 6 (2/6 = 1/3)</span>
                </div>
              </div>
            )}

            {customer.dishType === 'juice' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-cyan-200">
                <div className="flex flex-col items-center">
                  <span>Takaran 0.50</span>
                  <span className="text-xs text-emerald-300 mt-1">Tarik tuas ke garis tengah (50% / 1/2 gelas)!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-md transition transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Saya Mengerti, Ayo Lanjutkan Memasak!</span>
        </button>
      </div>
    </div>
  );
};
