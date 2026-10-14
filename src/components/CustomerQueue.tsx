import React from 'react';
import { CustomerOrder } from '../types/game';
import { CustomerAvatar } from './CustomerAvatars';
import { FractionDisplay } from './FractionDisplay';
import { Sparkles, MessageCircleQuestion, CheckCircle, ArrowRight } from 'lucide-react';

interface CustomerQueueProps {
  customers: CustomerOrder[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onOpenHelpForCustomer: (cust: CustomerOrder) => void;
}

export const CustomerQueue: React.FC<CustomerQueueProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onOpenHelpForCustomer,
}) => {
  return (
    <div className="w-full h-full flex gap-2 sm:gap-3 items-stretch overflow-x-auto overflow-y-visible py-1 px-1 z-30">
      {customers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-white/70 rounded-2xl border-2 border-dashed border-amber-300 text-amber-800 font-bold text-xs">
          <Sparkles className="w-4 h-4 mr-1 text-amber-500 animate-spin" />
          <span>Menunggu kedatangan pelanggan baru...</span>
        </div>
      ) : (
        customers.map((cust, idx) => {
          const isSelected = cust.id === selectedCustomerId;
          const patienceRatio = cust.patience / cust.maxPatience;

          let mood: 'happy' | 'neutral' | 'impatient' = 'happy';
          let patienceBarColor = 'bg-emerald-500';

          if (patienceRatio < 0.3) {
            mood = 'impatient';
            patienceBarColor = 'bg-rose-500 animate-pulse';
          } else if (patienceRatio < 0.65) {
            mood = 'neutral';
            patienceBarColor = 'bg-amber-400';
          }

          return (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer(cust.id)}
              className={`flex-1 min-w-[210px] sm:min-w-[240px] max-w-[340px] h-full rounded-2xl p-1.5 transition-all duration-200 cursor-pointer flex gap-2 items-center select-none shadow-sm relative ${
                isSelected
                  ? 'bg-amber-100/95 ring-3 ring-amber-400 border-2 border-amber-500 shadow-md scale-[1.01] z-40'
                  : 'bg-white/85 hover:bg-white border-2 border-amber-200/90 hover:border-amber-300 z-20'
              }`}
            >
              {/* Left Column: Customer Character Avatar + Name + Patience Bar */}
              <div className="flex flex-col items-center justify-between shrink-0 w-13 sm:w-15 h-full py-0.5">
                {/* Target Saji Status Badge */}
                {isSelected ? (
                  <div className="flex items-center gap-0.5 text-[8px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded-full shadow-xs whitespace-nowrap">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Target</span>
                  </div>
                ) : (
                  <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1 rounded-full whitespace-nowrap">
                    Antre #{idx + 1}
                  </span>
                )}

                {/* Animated Character Avatar */}
                <div className="my-auto">
                  <CustomerAvatar
                    avatarSeed={cust.avatarSeed}
                    mood={mood}
                    className="w-9 h-9 sm:w-11 sm:h-11"
                  />
                </div>

                {/* Customer Name */}
                <span className="text-[9px] font-black text-amber-950 truncate max-w-full text-center leading-none">
                  {cust.customerName}
                </span>

                {/* Patience Bar Indicator */}
                <div className="w-full mt-0.5 bg-slate-200 rounded-full h-1.5 p-0.2 border border-slate-300 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${patienceBarColor}`}
                    style={{ width: `${patienceRatio * 100}%` }}
                  />
                </div>
              </div>

              {/* Right Column: Comic-Style Order Bubble (Balon Pesanan) with high Z-index */}
              <div className="flex-1 min-w-0 h-full bg-white rounded-xl p-1.5 border-2 border-amber-300 shadow-sm flex flex-col justify-between items-center text-center relative z-30 overflow-visible">
                {/* Comic Speech Pointer Tail */}
                <div
                  className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-amber-300 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Order Dialogue Text (Clear & High Contrast) */}
                <div className="text-[9px] sm:text-[10px] text-slate-900 font-bold leading-tight line-clamp-2">
                  {cust.promptText}
                </div>

                {/* Center Fraction / Target Display */}
                <div className="my-auto flex flex-col items-center justify-center py-0.5">
                  {/* LEVEL 1 & 3: Standard Vertical Fraction */}
                  {cust.verticalFraction && !cust.targetSequence && !cust.comparisonDetails && (
                    <div className="px-2 py-0.5 bg-amber-50 rounded-lg border border-amber-200 shadow-xs flex items-center justify-center">
                      <FractionDisplay
                        numerator={cust.verticalFraction.numerator}
                        denominator={cust.verticalFraction.denominator}
                        size="sm"
                        textColor="text-amber-950 font-black"
                        lineColor="bg-amber-950"
                        suffix={
                          cust.dishType === 'pizza'
                            ? 'Pizza'
                            : cust.dishType === 'chocolate'
                            ? 'Cokelat'
                            : cust.dishType === 'donut'
                            ? 'Donat'
                            : 'Puding'
                        }
                      />
                    </div>
                  )}

                  {/* LEVEL 2: Target Sequence Display (1/8 -> 1/4 -> 1/2) */}
                  {cust.targetSequence && (
                    <div className="flex items-center gap-0.5 bg-amber-50 px-1 py-0.5 rounded-lg border border-amber-300">
                      {cust.targetSequence.map((seq, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-0.5">
                          <div className="px-1 py-0.2 bg-white rounded border border-amber-200">
                            <FractionDisplay
                              numerator={seq.numerator}
                              denominator={seq.denominator}
                              size="xs"
                              textColor="text-amber-950 font-bold"
                            />
                          </div>
                          {sIdx < cust.targetSequence!.length - 1 && (
                            <ArrowRight className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* LEVEL 4: Comparison Details Badge (Option A vs Option B) */}
                  {cust.comparisonDetails && (
                    <div className="flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded-lg border border-purple-300 shadow-xs z-[999]">
                      <span className="text-[8px] font-black text-purple-700 uppercase whitespace-nowrap">
                        {cust.comparisonDetails.requirement === 'larger' ? 'Pilih >' : 'Pilih <'}
                      </span>
                      <div className="px-1 bg-white rounded border border-purple-200">
                        <FractionDisplay
                          numerator={cust.comparisonDetails.optionA.fraction.numerator}
                          denominator={cust.comparisonDetails.optionA.fraction.denominator}
                          size="xs"
                        />
                      </div>
                      <span className="text-[8px] font-black text-purple-900">vs</span>
                      <div className="px-1 bg-white rounded border border-purple-200">
                        <FractionDisplay
                          numerator={cust.comparisonDetails.optionB.fraction.numerator}
                          denominator={cust.comparisonDetails.optionB.fraction.denominator}
                          size="xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Dish Type Badge */}
                <div className="text-[8px] font-extrabold text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded-full border border-amber-200/80 truncate max-w-full">
                  {cust.dishType === 'pizza'
                    ? '🍕 Pesanan Pizza'
                    : cust.dishType === 'chocolate'
                    ? '🍫 Urutkan Cokelat'
                    : cust.dishType === 'donut'
                    ? '🍩 Pecahan Senilai'
                    : '🍮 Bandingkan Puding'}
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
