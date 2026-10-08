import React from 'react';
import { CustomerOrder } from '../types/game';
import { CustomerAvatar } from './CustomerAvatars';
import { FractionDisplay } from './FractionDisplay';
import { Sparkles, MessageCircleQuestion, CheckCircle } from 'lucide-react';

interface CustomerQueueProps {
  customers: CustomerOrder[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onOpenHelpForCustomer: (customer: CustomerOrder) => void;
}

export const CustomerQueue: React.FC<CustomerQueueProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onOpenHelpForCustomer,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 sm:gap-3.5 px-1 sm:px-3 select-none overflow-hidden relative z-20 pb-1">
      {customers.length === 0 ? (
        <div className="flex items-center gap-2 py-2 px-5 bg-white/90 backdrop-blur-xs rounded-2xl border-2 border-dashed border-amber-300 text-amber-900 font-extrabold text-xs sm:text-sm shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>Pelanggan berikutnya sedang berdatangan...</span>
        </div>
      ) : (
        customers.map((cust, idx) => {
          const isSelected =
            cust.id === selectedCustomerId ||
            (customers.length > 0 && selectedCustomerId === null && idx === 0);
          const patienceRatio = Math.max(0, Math.min(1, cust.patience / cust.maxPatience));

          // Color bar according to patience
          let patienceBarColor = 'bg-emerald-500';
          let mood: 'happy' | 'neutral' | 'impatient' = 'happy';
          if (patienceRatio < 0.3) {
            patienceBarColor = 'bg-rose-500 animate-pulse';
            mood = 'impatient';
          } else if (patienceRatio < 0.6) {
            patienceBarColor = 'bg-amber-400';
            mood = 'neutral';
          }

          return (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer(cust.id)}
              className={`relative flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl cursor-pointer transition-all duration-200 border-2 sm:border-3 ${
                isSelected
                  ? 'bg-amber-50/98 border-amber-400 ring-3 ring-amber-300/80 shadow-lg scale-102 z-30'
                  : 'bg-white/92 border-sky-200 hover:border-amber-300 hover:bg-white shadow-xs z-20'
              }`}
              style={{
                width: '32%',
                maxWidth: '340px',
                height: '92%',
                maxHeight: '100%',
              }}
            >
              {/* Left Column: Customer Character Avatar + Name + Patience Bar */}
              <div className="flex flex-col items-center justify-between shrink-0 w-14 sm:w-16 h-full py-0.5">
                {/* Target Saji Status Badge */}
                {isSelected ? (
                  <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full shadow-xs animate-pulse whitespace-nowrap">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Target</span>
                  </div>
                ) : (
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 bg-slate-100 px-1 rounded-full whitespace-nowrap">
                    Antre #{idx + 1}
                  </span>
                )}

                {/* Animated Character Avatar */}
                <div className="my-auto">
                  <CustomerAvatar
                    avatarSeed={cust.avatarSeed}
                    mood={mood}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13"
                  />
                </div>

                {/* Customer Name */}
                <span className="text-[9px] sm:text-[10px] font-black text-amber-950 truncate max-w-full text-center leading-none">
                  {cust.customerName}
                </span>

                {/* Patience Bar Indicator (Hijau -> Kuning -> Merah) */}
                <div className="w-full mt-1 bg-slate-200 rounded-full h-1.5 p-0.2 border border-slate-300 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${patienceBarColor}`}
                    style={{ width: `${patienceRatio * 100}%` }}
                  />
                </div>
              </div>

              {/* Right Column: Comic-Style Order Bubble (Balon Pesanan) */}
              {/* Highest Z-Index in upper zone to guarantee 100% readability */}
              <div className="flex-1 min-w-0 h-full bg-white rounded-xl p-1.5 sm:p-2 border-2 border-amber-300 shadow-sm flex flex-col justify-between items-center text-center relative z-30 overflow-hidden">
                {/* Comic Speech Pointer Tail (pointing towards avatar on the left) */}
                <div
                  className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-amber-300"
                  aria-hidden="true"
                />

                {/* Order Dialogue Text (Clear & High Contrast) */}
                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-900 font-bold leading-tight line-clamp-2">
                  {cust.promptText}
                </div>

                {/* Fraction / Measurement Centerpiece Display */}
                <div className="my-auto flex flex-col items-center justify-center">
                  {/* Vertical Fraction Display */}
                  {cust.verticalFraction && (
                    <div className="px-2 py-0.5 bg-amber-50 rounded-lg border border-amber-200 shadow-xs flex items-center justify-center">
                      <FractionDisplay
                        numerator={cust.verticalFraction.numerator}
                        denominator={cust.verticalFraction.denominator}
                        size="md"
                        textColor="text-amber-950 font-black"
                        lineColor="bg-amber-950"
                        suffix={
                          cust.dishType === 'pizza'
                            ? 'Pizza'
                            : cust.dishType === 'chocolate'
                            ? 'Cokelat'
                            : cust.dishType === 'donut'
                            ? 'Donat'
                            : 'Gelas'
                        }
                      />
                    </div>
                  )}

                  {/* Decimal Order */}
                  {cust.decimalValue !== undefined && (
                    <div className="px-2 py-1 bg-sky-50 rounded-lg border border-sky-300 text-sky-950 font-black text-[11px] sm:text-xs shadow-xs">
                      {cust.decimalValue} Gelas Jus
                    </div>
                  )}

                  {/* Percent Order */}
                  {cust.percentValue !== undefined && (
                    <div className="px-2 py-1 bg-violet-50 rounded-lg border border-violet-300 text-violet-950 font-black text-[11px] sm:text-xs shadow-xs">
                      {cust.percentValue}% {cust.dishType === 'pizza' ? 'Pizza' : 'Jus'}
                    </div>
                  )}

                  {/* Comparison Question Options */}
                  {cust.isComparisonQuestion && cust.comparisonOptions && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {cust.comparisonOptions.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-[9px] font-black text-emerald-900 shadow-xs"
                        >
                          <FractionDisplay
                            numerator={opt.fraction.numerator}
                            denominator={opt.fraction.denominator}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dish Type Icon Badge */}
                <div className="text-[9px] sm:text-[10px] font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.2 rounded-full border border-amber-200/80 truncate max-w-full">
                  {cust.dishType === 'pizza'
                    ? '🍕 Pesanan Pizza'
                    : cust.dishType === 'chocolate'
                    ? '🍫 Pesanan Cokelat'
                    : cust.dishType === 'donut'
                    ? '🍩 Pesanan Donat'
                    : '🧃 Pesanan Jus'}
                </div>

                {/* Help Button if customer had prior mistake */}
                {cust.failedAttempts > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHelpForCustomer(cust);
                    }}
                    className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition animate-bounce z-40"
                    title="Bantuan Koki Master"
                  >
                    <MessageCircleQuestion className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
