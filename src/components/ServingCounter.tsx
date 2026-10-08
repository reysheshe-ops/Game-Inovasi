import React from 'react';
import { CustomerOrder, PlatedItem } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { Trash2, CheckCircle2, Utensils } from 'lucide-react';

interface ServingCounterProps {
  plated: PlatedItem;
  selectedCustomer: CustomerOrder | null;
  onClearPlate: () => void;
  onServeDish: () => void;
}

export const ServingCounter: React.FC<ServingCounterProps> = ({
  plated,
  selectedCustomer,
  onClearPlate,
  onServeDish,
}) => {
  // Check if plate is empty
  const isPlateEmpty =
    (!plated.pizzaSlices || plated.pizzaSlices.count === 0) &&
    (!plated.chocolatePieces || plated.chocolatePieces === 0) &&
    (!plated.donutCount || plated.donutCount === 0) &&
    (!plated.juiceVolume || plated.juiceVolume === 0);

  // Compute what is on the plate - Strictly single horizontal row (no vertical wrapping, no clipping)
  const renderPlatedContent = () => {
    if (isPlateEmpty) {
      return (
        <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-[10px] sm:text-xs whitespace-nowrap select-none">
          <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700/80 shrink-0" />
          <span className="font-black text-amber-950">Piring Siap Saji</span>
          <span className="text-amber-800/80 font-semibold hidden md:inline">
            — Ambil porsi makanan atau tuang jus dari dapur di bawah
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden select-none">
        {/* Plated Pizza */}
        {plated.pizzaSlices && plated.pizzaSlices.count > 0 && (
          <div className="flex items-center gap-2 bg-white/95 px-2.5 py-1 rounded-xl border-2 border-amber-300 shadow-xs">
            <span className="text-base sm:text-lg">🍕</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded-md">
                {plated.pizzaSlices.count} Potong
              </span>
              <FractionDisplay
                numerator={plated.pizzaSlices.count * plated.pizzaSlices.fractionPerSlice.numerator}
                denominator={plated.pizzaSlices.fractionPerSlice.denominator}
                size="sm"
                textColor="text-amber-950 font-black"
                lineColor="bg-amber-950"
              />
            </div>
            {/* Equivalence Tip Badge */}
            {plated.pizzaSlices.fractionPerSlice.denominator === 8 && plated.pizzaSlices.count === 4 && (
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-300">
                = 1/2 Pizza
              </span>
            )}
            {plated.pizzaSlices.fractionPerSlice.denominator === 4 && plated.pizzaSlices.count === 2 && (
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-300">
                = 1/2 Pizza
              </span>
            )}
          </div>
        )}

        {/* Plated Chocolate */}
        {plated.chocolatePieces && plated.chocolatePieces > 0 && (
          <div className="flex items-center gap-2 bg-white/95 px-2.5 py-1 rounded-xl border-2 border-amber-300 shadow-xs">
            <span className="text-base sm:text-lg">🍫</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded-md">
                {plated.chocolatePieces} Potong Cokelat
              </span>
              <FractionDisplay
                numerator={plated.chocolatePieces}
                denominator={4}
                size="sm"
                textColor="text-amber-950 font-black"
                lineColor="bg-amber-950"
              />
            </div>
            {plated.chocolatePieces === 2 && (
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-300">
                = 1/2 Cokelat
              </span>
            )}
          </div>
        )}

        {/* Plated Donut */}
        {plated.donutCount && plated.donutCount > 0 && (
          <div className="flex items-center gap-2 bg-white/95 px-2.5 py-1 rounded-xl border-2 border-pink-300 shadow-xs">
            <span className="text-base sm:text-lg">🍩</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black text-pink-950 bg-pink-100 px-1.5 py-0.5 rounded-md">
                {plated.donutCount} Donat
              </span>
              <FractionDisplay
                numerator={plated.donutCount}
                denominator={6}
                size="sm"
                textColor="text-pink-950 font-black"
                lineColor="bg-pink-950"
              />
              {plated.donutCount === 2 && (
                <span className="text-[9px] sm:text-[10px] font-black bg-pink-100 text-pink-900 px-1.5 py-0.5 rounded-md border border-pink-200">
                  = 1/3 Kotak
                </span>
              )}
              {plated.donutCount === 3 && (
                <span className="text-[9px] sm:text-[10px] font-black bg-pink-100 text-pink-900 px-1.5 py-0.5 rounded-md border border-pink-200">
                  = 1/2 Kotak
                </span>
              )}
              {plated.donutCount === 4 && (
                <span className="text-[9px] sm:text-[10px] font-black bg-pink-100 text-pink-900 px-1.5 py-0.5 rounded-md border border-pink-200">
                  = 2/3 Kotak
                </span>
              )}
            </div>
          </div>
        )}

        {/* Plated Juice */}
        {plated.juiceVolume && plated.juiceVolume > 0 && (
          <div className="flex items-center gap-2 bg-white/95 px-2.5 py-1 rounded-xl border-2 border-cyan-300 shadow-xs">
            <span className="text-base sm:text-lg">🧃</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black text-cyan-950 bg-cyan-100 px-1.5 py-0.5 rounded-md">
                {Math.round(plated.juiceVolume * 100)}% ({plated.juiceVolume.toFixed(2)})
              </span>
              <span className="text-[10px] font-bold text-cyan-800">
                {plated.juiceVolume === 0.25
                  ? '• 1/4 Gelas'
                  : plated.juiceVolume === 0.5
                  ? '• 1/2 Gelas'
                  : plated.juiceVolume === 0.75
                  ? '• 3/4 Gelas'
                  : plated.juiceVolume === 1.0
                  ? '• 1 Gelas Penuh'
                  : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#FFD166] border-y-2 border-amber-400 px-2 sm:px-3 py-1 shadow-md flex items-center justify-between select-none relative z-15 overflow-hidden">
      {/* 1. Left side: Menu Penyajian Label & Clear Plate Button */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-xl shadow-xs">
          <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide whitespace-nowrap">
            Meja Saji
          </span>
        </div>

        <button
          onClick={onClearPlate}
          disabled={isPlateEmpty}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl font-bold text-[9px] sm:text-[10px] transition active:scale-95 whitespace-nowrap ${
            isPlateEmpty
              ? 'bg-amber-200/80 text-amber-800/50 cursor-not-allowed border border-amber-300/60'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs border border-rose-400 cursor-pointer'
          }`}
          title="Kosongkan Piring"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden sm:inline">Kosongkan</span>
        </button>
      </div>

      {/* 2. Center: The Serving Plate Content (Strictly fitted, never wrapped or clipped) */}
      <div className="flex-1 max-w-2xl mx-1.5 sm:mx-2 bg-amber-100/95 rounded-xl sm:rounded-2xl border-2 border-amber-300/90 px-2 sm:px-3 py-1 shadow-inner flex items-center justify-center min-h-[36px] max-h-[46px] overflow-hidden">
        {renderPlatedContent()}
      </div>

      {/* 3. Right side: Serve Button (Clear, prominent, never overlapped) */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onServeDish}
          disabled={isPlateEmpty || !selectedCustomer}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs shadow-md transition-all transform active:scale-95 whitespace-nowrap ${
            isPlateEmpty || !selectedCustomer
              ? 'bg-amber-300 text-amber-700/60 cursor-not-allowed border border-amber-400'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-300 shadow-emerald-600/30 animate-pulse-gentle hover:scale-102 cursor-pointer'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>
            {selectedCustomer
              ? `Sajikan ke ${selectedCustomer.customerName}`
              : 'Pilih Pelanggan'}
          </span>
        </button>
      </div>
    </div>
  );
};
