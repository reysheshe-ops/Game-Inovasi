import React from 'react';
import { CustomerOrder, PlatedItem } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { Trash2, CheckCircle2, Utensils, ArrowRight } from 'lucide-react';

interface ServingCounterProps {
  levelId: number;
  plated: PlatedItem;
  selectedCustomer: CustomerOrder | null;
  onClearPlate: () => void;
  onServeDish: () => void;
  onRemoveChocolateSlot?: (index: number) => void;
}

export const ServingCounter: React.FC<ServingCounterProps> = ({
  levelId,
  plated,
  selectedCustomer,
  onClearPlate,
  onServeDish,
  onRemoveChocolateSlot,
}) => {
  // Check if plate is empty
  const isPlateEmpty =
    (!plated.pizzaSlices || plated.pizzaSlices.count === 0) &&
    (!plated.chocolateSlots || plated.chocolateSlots.every((s) => s === null)) &&
    (!plated.donutBox || plated.donutBox.count === 0) &&
    !plated.puddingChoice;

  // Render the plated content cleanly in a single horizontal row with zero clipping
  const renderPlatedContent = () => {
    if (isPlateEmpty) {
      return (
        <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-[10px] sm:text-xs whitespace-nowrap select-none px-2">
          <Utensils className="w-3.5 h-3.5 text-amber-700/80 shrink-0" />
          <span className="font-black text-amber-950">Piring Siap Saji:</span>
          <span className="text-amber-800/90 font-medium">
            {levelId === 1 && 'Ambil potongan pizza dari loyang di bawah'}
            {levelId === 2 && 'Susun cokelat berurutan (terkecil ➔ terbesar)'}
            {levelId === 3 && 'Ambil donat dari Kotak Isi 6 atau Kotak Isi 8'}
            {levelId === 4 && 'Pilih potongan puding yang diminta (lebih besar / kecil)'}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 whitespace-nowrap select-none overflow-x-auto scrollbar-none py-0.5 px-1">
        {/* LEVEL 1: Plated Pizza */}
        {plated.pizzaSlices && plated.pizzaSlices.count > 0 && (
          <div className="flex items-center gap-1.5 bg-white/95 px-2 py-0.5 rounded-xl border border-amber-300 shadow-xs">
            <span className="text-sm sm:text-base">🍕</span>
            <span className="text-[10px] sm:text-[11px] font-black text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded-md">
              {plated.pizzaSlices.count} Potong
            </span>
            <FractionDisplay
              numerator={plated.pizzaSlices.count * plated.pizzaSlices.fractionPerSlice.numerator}
              denominator={plated.pizzaSlices.fractionPerSlice.denominator}
              size="xs"
              textColor="text-amber-950 font-black"
              lineColor="bg-amber-950"
            />
            {/* Equivalence Tip Badge */}
            {plated.pizzaSlices.fractionPerSlice.denominator === 8 && plated.pizzaSlices.count === 4 && (
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-300">
                = 1/2 Pizza
              </span>
            )}
            {plated.pizzaSlices.fractionPerSlice.denominator === 4 && plated.pizzaSlices.count === 2 && (
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-300">
                = 1/2 Pizza
              </span>
            )}
          </div>
        )}

        {/* LEVEL 2: Plated Chocolate Slots (Ascending: 1/8 -> 1/4 -> 1/2) */}
        {plated.chocolateSlots && plated.chocolateSlots.some((s) => s !== null) && (
          <div className="flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-xl border border-amber-400 shadow-xs">
            <span className="text-[10px] font-black text-amber-950 mr-0.5">🍫 Urutan:</span>
            {[0, 1, 2].map((slotIdx) => {
              const item = plated.chocolateSlots ? plated.chocolateSlots[slotIdx] : null;
              return (
                <div key={slotIdx} className="flex items-center gap-0.5">
                  <div
                    onClick={() => onRemoveChocolateSlot && onRemoveChocolateSlot(slotIdx)}
                    className={`px-1.5 py-0.5 rounded-lg border flex items-center justify-center min-w-[38px] transition cursor-pointer ${
                      item
                        ? 'bg-[#7F4F24] text-white border-[#582F0E] shadow-inner hover:bg-[#603813]'
                        : 'bg-amber-50 text-amber-700/60 border-dashed border-amber-300'
                    }`}
                    title={item ? 'Klik untuk hapus slot ini' : `Slot ${slotIdx + 1}`}
                  >
                    {item ? (
                      <FractionDisplay
                        numerator={item.numerator}
                        denominator={item.denominator}
                        size="xs"
                        textColor="text-white font-bold"
                        lineColor="bg-white"
                      />
                    ) : (
                      <span className="text-[8px] font-bold">Slot {slotIdx + 1}</span>
                    )}
                  </div>
                  {slotIdx < 2 && <ArrowRight className="w-2.5 h-2.5 text-amber-700 shrink-0" />}
                </div>
              );
            })}
          </div>
        )}

        {/* LEVEL 3: Plated Donut Box */}
        {plated.donutBox && plated.donutBox.count > 0 && (
          <div className="flex items-center gap-1.5 bg-white/95 px-2 py-0.5 rounded-xl border border-pink-300 shadow-xs">
            <span className="text-sm sm:text-base">🍩</span>
            <span className="text-[10px] sm:text-[11px] font-black text-pink-950 bg-pink-100 px-1.5 py-0.5 rounded-md">
              {plated.donutBox.count} dari Kotak {plated.donutBox.boxType}
            </span>
            <FractionDisplay
              numerator={plated.donutBox.count}
              denominator={plated.donutBox.boxType}
              size="xs"
              textColor="text-pink-950 font-black"
              lineColor="bg-pink-950"
            />
            {/* Equivalence highlight */}
            {plated.donutBox.boxType === 6 && plated.donutBox.count === 3 && (
              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded border border-emerald-300">
                = 1/2 Kotak!
              </span>
            )}
            {plated.donutBox.boxType === 8 && plated.donutBox.count === 4 && (
              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded border border-emerald-300">
                = 1/2 Kotak!
              </span>
            )}
            {plated.donutBox.boxType === 8 && plated.donutBox.count === 2 && (
              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded border border-emerald-300">
                = 1/4 Kotak!
              </span>
            )}
            {plated.donutBox.boxType === 6 && plated.donutBox.count === 2 && (
              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded border border-emerald-300">
                = 1/3 Kotak!
              </span>
            )}
          </div>
        )}

        {/* LEVEL 4: Plated Pudding / Cake Comparison Choice */}
        {plated.puddingChoice && (
          <div className="flex items-center gap-2 bg-white/95 px-2.5 py-0.5 rounded-xl border border-purple-300 shadow-xs animate-pulse-gentle">
            <span className="text-sm sm:text-base">🍮</span>
            <span className="text-[10px] sm:text-[11px] font-black text-purple-950 bg-purple-100 px-1.5 py-0.5 rounded-md">
              Potongan Terpilih:
            </span>
            <FractionDisplay
              numerator={plated.puddingChoice.fraction.numerator}
              denominator={plated.puddingChoice.fraction.denominator}
              size="xs"
              textColor="text-purple-950 font-black"
              lineColor="bg-purple-950"
            />
            <span className="text-[9px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              {selectedCustomer?.comparisonDetails?.requirement === 'larger'
                ? 'Porsi Lebih Besar'
                : 'Porsi Lebih Kecil'}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#FFD166] border-y-2 border-amber-400 px-2 sm:px-3 py-1 shadow-md flex items-center justify-between select-none relative z-15 overflow-hidden">
      {/* 1. Left side: Menu Penyajian Label & Clear Plate Button */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <div className="flex items-center gap-1 bg-amber-600 text-white px-2 py-0.5 rounded-lg shadow-xs">
          <Utensils className="w-3 h-3 text-amber-200" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide whitespace-nowrap">
            Meja Saji
          </span>
        </div>

        <button
          onClick={onClearPlate}
          disabled={isPlateEmpty}
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg font-bold text-[9px] sm:text-[10px] transition active:scale-95 whitespace-nowrap ${
            isPlateEmpty
              ? 'bg-amber-200/70 text-amber-800/40 cursor-not-allowed border border-amber-300/40'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs border border-rose-400 cursor-pointer'
          }`}
          title="Kosongkan Piring"
        >
          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="hidden sm:inline">Kosongkan</span>
        </button>
      </div>

      {/* 2. Center: The Serving Plate Content (Strictly horizontal, no vertical wrapping, never clipped) */}
      <div className="flex-1 max-w-2xl mx-1.5 sm:mx-2 bg-amber-100/95 rounded-xl border border-amber-300/90 px-2 py-0.5 shadow-inner flex items-center justify-center min-h-[34px] max-h-[42px] overflow-hidden">
        {renderPlatedContent()}
      </div>

      {/* 3. Right side: Serve Button (Clear, prominent, never overlapped) */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onServeDish}
          disabled={isPlateEmpty || !selectedCustomer}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-xl font-black text-[10px] sm:text-xs shadow-md transition-all transform active:scale-95 whitespace-nowrap ${
            isPlateEmpty || !selectedCustomer
              ? 'bg-amber-300 text-amber-700/60 cursor-not-allowed border border-amber-400'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-300 shadow-emerald-600/30 animate-pulse-gentle hover:scale-102 cursor-pointer'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>
            {selectedCustomer
              ? `Sajikan (${selectedCustomer.customerName})`
              : 'Pilih Pelanggan'}
          </span>
        </button>
      </div>
    </div>
  );
};
