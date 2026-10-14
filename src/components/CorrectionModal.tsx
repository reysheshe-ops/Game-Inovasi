import React from 'react';
import { CustomerOrder } from '../types/game';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none animate-fadeIn">
      {/* 2D Cartoon Chef Mascot Popping Up Holding Green Chalkboard */}
      <div className="w-full max-w-lg bg-amber-50 rounded-3xl p-3.5 sm:p-5 shadow-2xl border-4 border-amber-400 relative overflow-hidden transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          {/* Chef Mascot Holding Chalkboard */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="52" r="28" fill="#FFD1A9" />
              <path d="M 36 58 Q 50 64 50 56 Q 50 64 64 58 Q 50 70 36 58" fill="#4A3000" />
              <path d="M 38 46 Q 44 40 50 46" stroke="#4A3000" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 50 46 Q 56 40 62 46" stroke="#4A3000" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="34" cy="52" r="4" fill="#FF85A1" opacity="0.6" />
              <circle cx="66" cy="52" r="4" fill="#FF85A1" opacity="0.6" />
              <path d="M 24 35 C 10 15, 25 -5, 45 5 C 55 -15, 75 0, 75 15 C 90 20, 85 35, 76 35 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
              <rect x="25" y="32" width="50" height="10" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="30" y="35" width="40" height="4" rx="2" fill="#E63946" />
              <circle cx="20" cy="80" r="7" fill="#FFD1A9" stroke="#E29578" strokeWidth="1.5" />
              <circle cx="80" cy="80" r="7" fill="#FFD1A9" stroke="#E29578" strokeWidth="1.5" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow animate-spin">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full inline-block mb-0.5">
              💡 Petunjuk Koki Master
            </span>
            <h3 className="text-sm sm:text-base font-black text-amber-950 leading-tight">
              Ayo, Koki Cilik Pasti Bisa!
            </h3>
            <p className="text-[10px] sm:text-[11px] text-amber-800 font-semibold leading-tight line-clamp-1">
              Pesanan {customer.customerName}: &ldquo;{customer.promptText}&rdquo;
            </p>
          </div>
        </div>

        {/* The Green Chalkboard Held by Chef */}
        <div className="bg-[#1B4332] text-white rounded-2xl p-3 sm:p-4 border-4 border-[#8B5E3C] shadow-inner mb-3 relative font-sans">
          <div className="absolute top-1 left-2 text-[8px] sm:text-[9px] text-emerald-300 font-mono opacity-80">
            [ PAPAN REKAP RESEP PECAHAN ]
          </div>

          {/* Chalkboard content */}
          <div className="mt-3 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            <p className="text-white font-bold mb-2 flex items-start gap-1.5 text-xs sm:text-sm">
              <span className="text-sm">✏️</span>
              <span>{customer.hintText}</span>
            </p>

            {/* Visual chalk illustration LEVEL 1: Pizza */}
            {customer.dishType === 'pizza' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-amber-200">
                <div className="flex flex-col items-center">
                  <span>1/4 Bagian</span>
                  <span className="text-lg my-0.5">🍕</span>
                  <span className="text-[9px] text-emerald-300">1 dari 4 potong</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col items-center">
                  <span>1/2 Bagian</span>
                  <span className="text-lg my-0.5">🍕🍕</span>
                  <span className="text-[9px] text-emerald-300">2 dari 4 potong (atau 1 dari 2)</span>
                </div>
              </div>
            )}

            {/* Visual chalk illustration LEVEL 2: Chocolate ordering */}
            {customer.dishType === 'chocolate' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-amber-200">
                <div className="flex flex-col items-center">
                  <span>Slot 1</span>
                  <span className="text-sm px-1.5 py-0.5 bg-amber-900 rounded my-1 text-white">1/8</span>
                  <span className="text-[9px] text-emerald-300">Terkecil</span>
                </div>
                <span className="text-emerald-400 font-black">&lt;</span>
                <div className="flex flex-col items-center">
                  <span>Slot 2</span>
                  <span className="text-sm px-1.5 py-0.5 bg-amber-800 rounded my-1 text-white">1/4</span>
                  <span className="text-[9px] text-emerald-300">Sedang</span>
                </div>
                <span className="text-emerald-400 font-black">&lt;</span>
                <div className="flex flex-col items-center">
                  <span>Slot 3</span>
                  <span className="text-sm px-1.5 py-0.5 bg-amber-700 rounded my-1 text-white">1/2</span>
                  <span className="text-[9px] text-emerald-300">Terbesar</span>
                </div>
              </div>
            )}

            {/* Visual chalk illustration LEVEL 3: Donut Equivalence */}
            {customer.dishType === 'donut' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-pink-200">
                <div className="flex flex-col items-center">
                  <span>Kotak 6 Donat</span>
                  <span className="text-base my-0.5">🍩🍩🍩</span>
                  <span className="text-[9px] text-emerald-300">3 donat = 3/6 = 1/2</span>
                </div>
                <span className="text-emerald-400 font-black text-sm">=</span>
                <div className="flex flex-col items-center">
                  <span>Kotak 8 Donat</span>
                  <span className="text-base my-0.5">🍩🍩🍩🍩</span>
                  <span className="text-[9px] text-emerald-300">4 donat = 4/8 = 1/2</span>
                </div>
              </div>
            )}

            {/* Visual chalk illustration LEVEL 4: Pudding comparison */}
            {customer.dishType === 'pudding' && (
              <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-600/50 flex items-center justify-around text-xs font-bold text-purple-200">
                <div className="flex flex-col items-center">
                  <span>1/3 Puding</span>
                  <span className="text-base my-0.5">🍮 (Porsi Besar)</span>
                  <span className="text-[9px] text-emerald-300">Dibagi 3 orang</span>
                </div>
                <span className="text-emerald-400 font-black text-sm">&gt;</span>
                <div className="flex flex-col items-center">
                  <span>1/4 Puding</span>
                  <span className="text-base my-0.5">🍮 (Porsi Lebih Kecil)</span>
                  <span className="text-[9px] text-emerald-300">Dibagi 4 orang</span>
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
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-md transition transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Saya Mengerti, Ayo Lanjutkan Memasak!</span>
        </button>
      </div>
    </div>
  );
};
