import React, { useState } from 'react';
import { PlatedItem } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { sound } from '../services/soundEffects';
import { Scissors, Plus, RotateCcw } from 'lucide-react';

interface KitchenStationProps {
  levelId: number;
  plated: PlatedItem;
  onUpdatePlated: (newPlated: PlatedItem) => void;
}

export const KitchenStation: React.FC<KitchenStationProps> = ({
  levelId,
  plated,
  onUpdatePlated,
}) => {
  // Pizza cutting division: 2, 4, or 8 slices
  const [pizzaCuts, setPizzaCuts] = useState<2 | 4 | 8>(levelId === 2 ? 8 : 4);

  // 1. Pizza actions
  const handleAddPizzaSlice = (denom: number) => {
    sound.playBlop();
    const currentCount =
      plated.pizzaSlices?.fractionPerSlice.denominator === denom
        ? plated.pizzaSlices.count
        : 0;
    const newCount = Math.min(denom, currentCount + 1);

    onUpdatePlated({
      ...plated,
      pizzaSlices: {
        fractionPerSlice: { numerator: 1, denominator: denom },
        count: newCount,
      },
    });
  };

  const handleResetPizza = () => {
    sound.playClick();
    onUpdatePlated({
      ...plated,
      pizzaSlices: undefined,
    });
  };

  // 2. Chocolate action
  const handleAddChocolatePiece = () => {
    sound.playBlop();
    const current = plated.chocolatePieces || 0;
    const next = Math.min(4, current + 1);
    onUpdatePlated({
      ...plated,
      chocolatePieces: next,
    });
  };

  const handleResetChocolate = () => {
    sound.playClick();
    onUpdatePlated({
      ...plated,
      chocolatePieces: undefined,
    });
  };

  // 3. Donut action
  const handleAddDonut = () => {
    sound.playBlop();
    const current = plated.donutCount || 0;
    const next = Math.min(6, current + 1);
    onUpdatePlated({
      ...plated,
      donutCount: next,
    });
  };

  const handleResetDonut = () => {
    sound.playClick();
    onUpdatePlated({
      ...plated,
      donutCount: undefined,
    });
  };

  // 4. Juice dispenser action
  const handleFillJuice = (volume: number) => {
    sound.playGlug();
    onUpdatePlated({
      ...plated,
      juiceVolume: volume,
    });
  };

  // Generate interactive pizza slice SVG paths
  const renderInteractivePizza = (slicesCount: 2 | 4 | 8) => {
    const radius = 54;
    const center = 60;
    const currentSelected =
      plated.pizzaSlices?.fractionPerSlice.denominator === slicesCount
        ? plated.pizzaSlices.count
        : 0;

    const sliceAngle = (2 * Math.PI) / slicesCount;

    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 drop-shadow-md cursor-pointer select-none"
        >
          {/* Pizza Pan */}
          <circle cx={center} cy={center} r={radius + 4} fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
          {/* Crust */}
          <circle cx={center} cy={center} r={radius} fill="#E76F51" />
          {/* Cheese */}
          <circle cx={center} cy={center} r={radius - 6} fill="#FFC83B" />

          {/* Slices */}
          {Array.from({ length: slicesCount }).map((_, i) => {
            const startAngle = i * sliceAngle - Math.PI / 2;
            const endAngle = (i + 1) * sliceAngle - Math.PI / 2;
            const x1 = center + (radius - 6) * Math.cos(startAngle);
            const y1 = center + (radius - 6) * Math.sin(startAngle);
            const x2 = center + (radius - 6) * Math.cos(endAngle);
            const y2 = center + (radius - 6) * Math.sin(endAngle);

            const isSelected = i < currentSelected;

            const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius - 6} ${radius - 6} 0 0 1 ${x2} ${y2} Z`;

            return (
              <g key={i} onClick={() => handleAddPizzaSlice(slicesCount)}>
                <path
                  d={pathD}
                  fill={isSelected ? '#F77F00' : '#FFD166'}
                  stroke="#D97706"
                  strokeWidth="1.5"
                  className="transition-colors hover:fill-[#FCBF49]"
                />
                {/* Toppings (Pepperoni dots) */}
                <circle
                  cx={center + (radius * 0.5) * Math.cos(startAngle + sliceAngle / 2)}
                  cy={center + (radius * 0.5) * Math.sin(startAngle + sliceAngle / 2)}
                  r="3.5"
                  fill="#9D0208"
                />
              </g>
            );
          })}

          {/* Slicing Lines */}
          {Array.from({ length: slicesCount }).map((_, i) => {
            const angle = i * sliceAngle - Math.PI / 2;
            const x = center + (radius - 2) * Math.cos(angle);
            const y = center + (radius - 2) * Math.sin(angle);
            return (
              <line
                key={`line-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#B45309"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            );
          })}
        </svg>

        <span className="text-[9px] sm:text-[10px] font-black text-amber-950 mt-0.5">
          {currentSelected}/{slicesCount} Bagian Diambil
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#118AB2]/10 p-1 sm:p-2 grid grid-cols-3 gap-1.5 sm:gap-2.5 overflow-hidden select-none">
      {/* 1. STASIUN PIZZA */}
      <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 shadow-md border-2 border-amber-300 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-1 border-amber-100">
          <div className="flex items-center gap-1">
            <span className="text-sm sm:text-base">🍕</span>
            <span className="font-extrabold text-[10px] sm:text-xs text-amber-950">
              Kedai Pizza
            </span>
          </div>

          {/* Cuts Selector */}
          <div className="flex items-center gap-0.5 bg-amber-50 rounded-lg p-0.5 border border-amber-200">
            <Scissors className="w-2.5 h-2.5 text-amber-700 mr-0.5" />
            {([2, 4, 8] as const).map((cut) => (
              <button
                key={cut}
                onClick={() => {
                  sound.playClick();
                  setPizzaCuts(cut);
                }}
                className={`px-1 sm:px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-black transition ${
                  pizzaCuts === cut
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                /{cut}
              </button>
            ))}
          </div>
        </div>

        {/* Center Pizza Graphic */}
        <div className="flex justify-center items-center my-auto py-0.5">
          {renderInteractivePizza(pizzaCuts)}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 pt-1 border-t border-amber-100">
          <button
            onClick={() => handleAddPizzaSlice(pizzaCuts)}
            className="flex-1 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-lg text-[9px] sm:text-[10px] flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>
              Ambil 1/{pizzaCuts}
            </span>
          </button>
          {plated.pizzaSlices && (
            <button
              onClick={handleResetPizza}
              className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition"
              title="Reset Pizza"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. STASIUN COKELAT & DONAT */}
      <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 shadow-md border-2 border-pink-300 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-1 border-pink-100">
          <div className="flex items-center gap-1">
            <span className="text-sm sm:text-base">🍩</span>
            <span className="font-extrabold text-[10px] sm:text-xs text-pink-950">
              Cokelat &amp; Donat
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-pink-700 bg-pink-50 px-1 py-0.2 rounded">
            Pecahan Senilai
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5 my-auto">
          {/* Chocolate Bar Section */}
          <div className="bg-amber-50/90 rounded-xl p-1 sm:p-1.5 border border-amber-200">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-900 flex items-center gap-1">
                <span>🍫 Batang Cokelat (/4)</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-amber-800">
                {plated.chocolatePieces || 0}/4
              </span>
            </div>
            {/* 4 Breakaway chocolate squares */}
            <div className="grid grid-cols-4 gap-1 h-6 sm:h-7">
              {Array.from({ length: 4 }).map((_, i) => {
                const isSelected = i < (plated.chocolatePieces || 0);
                return (
                  <button
                    key={i}
                    onClick={handleAddChocolatePiece}
                    className={`rounded border flex items-center justify-center font-black text-[8px] sm:text-[9px] transition active:scale-90 ${
                      isSelected
                        ? 'bg-[#7F4F24] border-[#582F0E] text-white shadow-inner'
                        : 'bg-[#B08968] hover:bg-[#936639] border-[#7F4F24] text-white/90'
                    }`}
                  >
                    1/4
                  </button>
                );
              })}
            </div>
          </div>

          {/* Donut Box Section (Kotak Isi 6) */}
          <div className="bg-pink-50/90 rounded-xl p-1 sm:p-1.5 border border-pink-200">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-bold text-pink-900 flex items-center gap-1">
                <span>🍩 Kotak Donat (/6)</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-pink-800">
                {plated.donutCount || 0}/6
              </span>
            </div>
            {/* 6 Donuts in bakery box */}
            <div className="grid grid-cols-6 gap-0.5 h-6 sm:h-7 bg-amber-100/90 rounded-lg p-0.5 border border-amber-300">
              {['🍩', '🍩', '🍩', '🍩', '🍩', '🍩'].map((donut, idx) => {
                const isSelected = idx < (plated.donutCount || 0);
                return (
                  <button
                    key={idx}
                    onClick={handleAddDonut}
                    className={`rounded flex items-center justify-center text-xs sm:text-sm transition active:scale-90 ${
                      isSelected
                        ? 'bg-pink-300 shadow-xs ring-1 ring-pink-500 scale-105'
                        : 'hover:bg-amber-200/80'
                    }`}
                  >
                    {donut}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 pt-1 border-t border-pink-100 text-[9px] sm:text-[10px]">
          <button
            onClick={handleAddChocolatePiece}
            className="flex-1 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black rounded-lg text-center transition active:scale-95"
          >
            +1 Cokelat (1/4)
          </button>
          <button
            onClick={handleAddDonut}
            className="flex-1 py-1 bg-pink-200 hover:bg-pink-300 text-pink-950 font-black rounded-lg text-center transition active:scale-95"
          >
            +1 Donat (1/6)
          </button>
        </div>
      </div>

      {/* 3. MESIN JUS & TUAS PENGUKUR DESIMAL / PERSEN */}
      <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 shadow-md border-2 border-cyan-300 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-1 border-cyan-100">
          <div className="flex items-center gap-1">
            <span className="text-sm sm:text-base">🧃</span>
            <span className="font-extrabold text-[10px] sm:text-xs text-cyan-950">
              Mesin Jus
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold bg-cyan-100 text-cyan-800 px-1 py-0.2 rounded">
            Desimal &amp; Persen
          </span>
        </div>

        {/* Center: Interactive Glass and Presets */}
        <div className="flex items-center justify-around py-0.5 my-auto">
          {/* Graduated Glass Cup */}
          <div className="relative w-12 sm:w-14 h-16 sm:h-20 bg-slate-100 rounded-b-xl rounded-t-xs border-2 border-slate-400 overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Liquid with bubbles */}
            <div
              className="w-full bg-gradient-to-t from-orange-500 to-amber-400 transition-all duration-300 relative"
              style={{ height: `${(plated.juiceVolume ?? 0) * 100}%` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 animate-pulse" />
            </div>

            {/* Scale markings */}
            <div className="absolute inset-0 flex flex-col justify-between px-1 py-1 pointer-events-none text-[7px] sm:text-[8px] font-bold text-slate-600">
              <span className="border-b border-slate-300 w-full text-right leading-none">1.0 (100%)</span>
              <span className="border-b border-slate-300 w-full text-right leading-none">0.75 (75%)</span>
              <span className="border-b border-slate-300 w-full text-right leading-none">0.50 (50%)</span>
              <span className="border-b border-slate-300 w-full text-right leading-none">0.25 (25%)</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-col gap-1 w-28 sm:w-32">
            {[
              { val: 1.0, label: '1.0 (100% Penuh)' },
              { val: 0.75, label: '0.75 (75% • 3/4)' },
              { val: 0.5, label: '0.50 (50% • 1/2)' },
              { val: 0.25, label: '0.25 (25% • 1/4)' },
              { val: 0.0, label: 'Kosongkan (0)' },
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => handleFillJuice(btn.val)}
                className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black text-left transition ${
                  (plated.juiceVolume ?? 0) === btn.val
                    ? 'bg-cyan-600 text-white shadow-xs scale-102'
                    : 'bg-cyan-50 text-cyan-900 hover:bg-cyan-100 border border-cyan-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom helper tip */}
        <div className="text-[8px] sm:text-[9px] text-cyan-700 font-extrabold text-center border-t border-cyan-100 pt-0.5 truncate">
          💡 0.5 = 50% = 1/2 • 0.25 = 25% = 1/4
        </div>
      </div>
    </div>
  );
};
