import React, { useState } from 'react';
import { CustomerOrder, PlatedItem, FractionValue } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { sound } from '../services/soundEffects';
import { Scissors, Plus, RotateCcw, Check, Sparkles, Utensils } from 'lucide-react';

interface KitchenStationProps {
  levelId: number;
  plated: PlatedItem;
  selectedCustomer: CustomerOrder | null;
  onUpdatePlated: (newPlated: PlatedItem) => void;
}

export const KitchenStation: React.FC<KitchenStationProps> = ({
  levelId,
  plated,
  selectedCustomer,
  onUpdatePlated,
}) => {
  // Level 1: Pizza cuts selector (default 4)
  const [pizzaCuts, setPizzaCuts] = useState<2 | 4 | 8>(4);
  // Level 4: Track slicing animation trigger
  const [lastCutOption, setLastCutOption] = useState<string | null>(null);

  // Level 1 actions: Pizza
  const handleAddPizzaSlice = (denom: number) => {
    sound.playBlop();
    const currentCount =
      plated.pizzaSlices?.fractionPerSlice.denominator === denom
        ? plated.pizzaSlices.count
        : 0;
    const newCount = Math.min(denom, currentCount + 1);

    onUpdatePlated({
      dishType: 'pizza',
      pizzaSlices: {
        fractionPerSlice: { numerator: 1, denominator: denom },
        count: newCount,
      },
    });
  };

  const handleResetPizza = () => {
    sound.playClick();
    onUpdatePlated({
      dishType: 'pizza',
      pizzaSlices: undefined,
    });
  };

  // Level 2 actions: Chocolate Ordering (push to next free slot 0, 1, 2)
  const handleAddChocolatePiece = (fraction: FractionValue) => {
    sound.playBlop();
    const currentSlots = plated.chocolateSlots ? [...plated.chocolateSlots] : [null, null, null];
    const firstEmptyIndex = currentSlots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      currentSlots[firstEmptyIndex] = fraction;
    } else {
      currentSlots[2] = fraction;
    }
    onUpdatePlated({
      dishType: 'chocolate',
      chocolateSlots: currentSlots,
    });
  };

  const handleResetChocolateSlots = () => {
    sound.playClick();
    onUpdatePlated({
      dishType: 'chocolate',
      chocolateSlots: [null, null, null],
    });
  };

  // Level 3 actions: Donut Box of 6 vs Box of 8
  const handleAddDonut = (boxType: 6 | 8) => {
    sound.playBlop();
    const currentBox = plated.donutBox?.boxType === boxType ? plated.donutBox.count : 0;
    const nextCount = Math.min(boxType, currentBox + 1);

    onUpdatePlated({
      dishType: 'donut',
      donutBox: {
        boxType,
        count: nextCount,
      },
    });
  };

  const handleResetDonutBox = () => {
    sound.playClick();
    onUpdatePlated({
      dishType: 'donut',
      donutBox: undefined,
    });
  };

  // Level 4 actions: Pudding comparison choice with natural 24fps slice animation
  const handleSelectPuddingChoice = (fraction: FractionValue, value: number, optKey: string) => {
    sound.playBlop();
    setLastCutOption(optKey);
    onUpdatePlated({
      dishType: 'pudding',
      puddingChoice: {
        fraction,
        value,
      },
    });
  };

  // Interactive Pizza Renderer
  const renderInteractivePizza = (slicesCount: 2 | 4 | 8) => {
    const radius = 52;
    const center = 58;
    const currentSelected =
      plated.pizzaSlices?.fractionPerSlice.denominator === slicesCount
        ? plated.pizzaSlices.count
        : 0;

    const sliceAngle = (2 * Math.PI) / slicesCount;

    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 116 116"
          className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md cursor-pointer select-none"
        >
          {/* Pan */}
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
                  className="transition-colors hover:fill-amber-400"
                />
                {/* Toppings (Pepperoni dots) */}
                <circle
                  cx={center + (radius - 20) * Math.cos(startAngle + sliceAngle / 2)}
                  cy={center + (radius - 20) * Math.sin(startAngle + sliceAngle / 2)}
                  r="3"
                  fill="#D62828"
                />
              </g>
            );
          })}
        </svg>

        {/* Slice count badge */}
        <span className="text-[10px] sm:text-xs font-black text-amber-900 mt-1">
          {currentSelected} / {slicesCount} Potong
        </span>
      </div>
    );
  };

  // Helper for Level 4 Cake/Pudding Wedge SVG
  const renderPuddingSliceSvg = (value: number, isSelected: boolean) => {
    const size = 80;
    const center = size / 2;
    const radius = 32;

    // Angle in radians (0 at top)
    const angle = value * 2 * Math.PI;
    const endX = center + radius * Math.sin(angle);
    const endY = center - radius * Math.cos(angle);
    const largeArc = value > 0.5 ? 1 : 0;

    const slicePath = `M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;

    return (
      <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-md overflow-visible">
          {/* Dessert Plate */}
          <circle cx={center} cy={center} r={radius + 6} fill="#F3E8FF" stroke="#D8B4FE" strokeWidth="2" />
          
          {/* Base Uncut Pudding Shadow / Outline */}
          <circle cx={center} cy={center} r={radius} fill="#E9D5FF" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Active Cut Slice Wedge with Smooth 24fps Transform */}
          <g
            className={`transition-all duration-300 ease-out origin-center cursor-pointer ${
              isSelected ? 'animate-slice-split filter drop-shadow-lg' : 'hover:scale-105'
            }`}
          >
            {/* Crust */}
            <path
              d={slicePath}
              fill={isSelected ? '#9333EA' : '#A855F7'}
              stroke="#6B21A8"
              strokeWidth="2"
            />
            {/* Inner Gloss / Fruit Layer */}
            <circle cx={center} cy={center} r="4" fill="#F472B6" />
            {/* Strawberry Garnish on the slice */}
            <circle
              cx={center + (radius * 0.6) * Math.sin(angle / 2)}
              cy={center - (radius * 0.6) * Math.cos(angle / 2)}
              r="3.5"
              fill="#E11D48"
            />
          </g>

          {/* Chef Knife Slice Visual Indicator if active */}
          {isSelected && (
            <g className="animate-cake-cut pointer-events-none origin-top-left">
              <line x1={center} y1={center - radius - 6} x2={center} y2={center + 6} stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
        </svg>

        {/* Floating strawberry badge */}
        <span className="absolute -bottom-1 -right-1 text-xs">🍓</span>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-visible select-none">
      {/* ========================================================= */}
      {/* LEVEL 1: UNISTRUCTURAL - DAPUR PIZZA (LOYANG 2, 4, 8) */}
      {/* ========================================================= */}
      {levelId === 1 && (
        <div className="w-full h-full grid grid-cols-3 gap-2 sm:gap-3">
          {[2, 4, 8].map((cuts) => {
            const isCutActive = pizzaCuts === cuts;
            return (
              <div
                key={cuts}
                className={`bg-white/95 rounded-2xl p-2 shadow-sm border-2 flex flex-col justify-between items-center transition ${
                  isCutActive
                    ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-300/60'
                    : 'border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between w-full border-b pb-1 border-amber-100">
                  <span className="font-black text-[11px] sm:text-xs text-amber-950 flex items-center gap-1">
                    <span>🍕</span>
                    <span>Loyang Potong {cuts}</span>
                  </span>
                  <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">
                    1/{cuts}
                  </span>
                </div>

                <div className="my-auto py-0.5">
                  {renderInteractivePizza(cuts as 2 | 4 | 8)}
                </div>

                <div className="w-full flex items-center gap-1 pt-1 border-t border-amber-100">
                  <button
                    onClick={() => {
                      setPizzaCuts(cuts as 2 | 4 | 8);
                      handleAddPizzaSlice(cuts);
                    }}
                    className="flex-1 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ambil 1/{cuts}</span>
                  </button>
                  {plated.pizzaSlices?.fractionPerSlice.denominator === cuts &&
                    plated.pizzaSlices.count > 0 && (
                      <button
                        onClick={handleResetPizza}
                        className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition"
                        title="Reset Loyang Ini"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* LEVEL 2: MULTISTRUCTURAL - KAFE COKELAT URUTAN (1/8, 1/4, 1/2) */}
      {/* ========================================================= */}
      {levelId === 2 && (
        <div className="w-full h-full grid grid-cols-3 gap-2 sm:gap-3">
          {[
            {
              fraction: { numerator: 1, denominator: 8 },
              bars: 1,
              title: 'Cokelat Mini',
              tag: 'Paling Kecil (1/8)',
              color: 'bg-[#582F0E]',
            },
            {
              fraction: { numerator: 1, denominator: 4 },
              bars: 2,
              title: 'Cokelat Sedang',
              tag: 'Sedang (1/4)',
              color: 'bg-[#7F4F24]',
            },
            {
              fraction: { numerator: 1, denominator: 2 },
              bars: 4,
              title: 'Cokelat Besar',
              tag: 'Paling Besar (1/2)',
              color: 'bg-[#936639]',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/95 rounded-2xl p-2 shadow-sm border-2 border-amber-300 flex flex-col justify-between items-center"
            >
              <div className="flex items-center justify-between w-full border-b pb-1 border-amber-100">
                <span className="font-black text-[11px] sm:text-xs text-amber-950 flex items-center gap-1">
                  <span>🍫</span>
                  <span>{item.title}</span>
                </span>
                <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">
                  1/{item.fraction.denominator}
                </span>
              </div>

              {/* Visual Chocolate Bar */}
              <div className="my-auto flex flex-col items-center py-1">
                <div className="w-24 sm:w-28 h-7 bg-amber-100 rounded-lg p-1 border-2 border-amber-400 flex items-center">
                  <div
                    className={`h-full ${item.color} rounded flex items-center justify-center text-white font-black text-[9px] shadow-xs transition-all`}
                    style={{ width: `${(item.bars / 4) * 100}%` }}
                  >
                    <FractionDisplay
                      numerator={item.fraction.numerator}
                      denominator={item.fraction.denominator}
                      size="xs"
                      textColor="text-white font-bold"
                      lineColor="bg-white"
                    />
                  </div>
                </div>
                <span className="text-[9px] text-amber-800 font-bold mt-1">
                  {item.tag}
                </span>
              </div>

              <button
                onClick={() => handleAddChocolatePiece(item.fraction)}
                className="w-full py-1 bg-[#7F4F24] hover:bg-[#603813] text-white font-black rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Letakkan di Slot</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* LEVEL 3: MULTISTRUCTURAL - DONAT SENILAI (KOTAK 6 & KOTAK 8) */}
      {/* ========================================================= */}
      {levelId === 3 && (
        <div className="w-full h-full grid grid-cols-2 gap-2 sm:gap-3">
          {/* Kotak A: Isi 6 */}
          <div className="bg-white/95 rounded-2xl p-2 shadow-sm border-2 border-pink-300 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b pb-1 border-pink-100">
              <span className="font-extrabold text-xs sm:text-sm text-pink-950 flex items-center gap-1">
                <span>🍩</span>
                <span>Kotak Donat A (Isi 6)</span>
              </span>
              <span className="text-[9px] font-black bg-pink-100 text-pink-900 px-1.5 py-0.2 rounded-md">
                Tiap donat = 1/6
              </span>
            </div>

            <div className="my-auto py-1">
              <div className="grid grid-cols-6 gap-1 bg-amber-100/90 rounded-xl p-1 border-2 border-amber-300 shadow-inner">
                {['🍩', '🍩', '🍩', '🍩', '🍩', '🍩'].map((donut, idx) => {
                  const isTaken =
                    plated.donutBox?.boxType === 6 && idx < plated.donutBox.count;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddDonut(6)}
                      className={`h-9 sm:h-11 rounded-lg flex items-center justify-center text-base sm:text-lg transition active:scale-90 ${
                        isTaken
                          ? 'bg-pink-300 shadow-sm ring-2 ring-pink-500 scale-105'
                          : 'bg-white/80 hover:bg-white shadow-xs'
                      }`}
                    >
                      {donut}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[9px] text-pink-900 font-bold mt-1 px-1">
                <span>2 donat = 1/3</span>
                <span>•</span>
                <span>3 donat = 1/2</span>
                <span>•</span>
                <span>4 donat = 2/3</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-pink-100">
              <button
                onClick={() => handleAddDonut(6)}
                className="flex-1 py-1 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ambil (+1/6)</span>
              </button>
              {plated.donutBox?.boxType === 6 && (
                <button
                  onClick={handleResetDonutBox}
                  className="p-1 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-xl transition"
                  title="Reset Kotak 6"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Kotak B: Isi 8 */}
          <div className="bg-white/95 rounded-2xl p-2 shadow-sm border-2 border-amber-300 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b pb-1 border-amber-100">
              <span className="font-extrabold text-xs sm:text-sm text-amber-950 flex items-center gap-1">
                <span>🍩</span>
                <span>Kotak Donat B (Isi 8)</span>
              </span>
              <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">
                Tiap donat = 1/8
              </span>
            </div>

            <div className="my-auto py-1">
              <div className="grid grid-cols-8 gap-0.5 sm:gap-1 bg-amber-100/90 rounded-xl p-1 border-2 border-amber-300 shadow-inner">
                {['🍩', '🍩', '🍩', '🍩', '🍩', '🍩', '🍩', '🍩'].map((donut, idx) => {
                  const isTaken =
                    plated.donutBox?.boxType === 8 && idx < plated.donutBox.count;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddDonut(8)}
                      className={`h-9 sm:h-11 rounded-lg flex items-center justify-center text-sm sm:text-base transition active:scale-90 ${
                        isTaken
                          ? 'bg-amber-300 shadow-sm ring-2 ring-amber-500 scale-105'
                          : 'bg-white/80 hover:bg-white shadow-xs'
                      }`}
                    >
                      {donut}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[9px] text-amber-900 font-bold mt-1 px-1">
                <span>2 donat = 1/4</span>
                <span>•</span>
                <span>4 donat = 1/2</span>
                <span>•</span>
                <span>6 donat = 3/4</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-amber-100">
              <button
                onClick={() => handleAddDonut(8)}
                className="flex-1 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ambil (+1/8)</span>
              </button>
              {plated.donutBox?.boxType === 8 && (
                <button
                  onClick={handleResetDonutBox}
                  className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition"
                  title="Reset Kotak 8"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEVEL 4: RELATIONAL - RESTORAN PUDING & KUE TAR (24fps SPLIT CUT) */}
      {/* ========================================================= */}
      {levelId === 4 && (
        <div className="w-full h-full bg-white/95 rounded-2xl p-2 sm:p-2.5 shadow-sm border-2 border-purple-300 flex flex-col justify-between overflow-visible">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b pb-1 border-purple-100">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🍮</span>
              <span className="font-extrabold text-xs sm:text-sm text-purple-950">
                Stasiun Puding &amp; Kue Tar (Iris &amp; Bandingkan Pecahan)
              </span>
            </div>
            {selectedCustomer?.comparisonDetails && (
              <span className="text-[10px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
                <span>Permintaan:</span>
                <span className="text-purple-700 underline uppercase font-black">
                  {selectedCustomer.comparisonDetails.requirement === 'larger'
                    ? 'Porsi Lebih Besar'
                    : 'Porsi Lebih Kecil'}
                </span>
              </span>
            )}
          </div>

          {/* Interactive Pudding Slicing Cards */}
          {selectedCustomer?.comparisonDetails ? (
            <div className="grid grid-cols-2 gap-3 my-auto py-1 overflow-visible">
              {[
                {
                  opt: selectedCustomer.comparisonDetails.optionA,
                  label: 'Pilihan A',
                  key: 'A',
                },
                {
                  opt: selectedCustomer.comparisonDetails.optionB,
                  label: 'Pilihan B',
                  key: 'B',
                },
              ].map(({ opt, label, key }) => {
                const isSelected =
                  plated.puddingChoice?.fraction.numerator === opt.fraction.numerator &&
                  plated.puddingChoice?.fraction.denominator === opt.fraction.denominator;

                return (
                  <div
                    key={key}
                    onClick={() => handleSelectPuddingChoice(opt.fraction, opt.value, key)}
                    className={`p-2 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between shadow-xs overflow-visible ${
                      isSelected
                        ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-400 scale-[1.02]'
                        : 'bg-purple-50/70 hover:bg-purple-100/90 border-purple-200'
                    }`}
                  >
                    {/* Visual Animated Slice Wedge */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {renderPuddingSliceSvg(opt.value, isSelected)}

                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-bold text-purple-800">
                          {label}
                        </span>
                        <FractionDisplay
                          numerator={opt.fraction.numerator}
                          denominator={opt.fraction.denominator}
                          size="md"
                          textColor="text-purple-950 font-black"
                          lineColor="bg-purple-950"
                        />
                        <span className="text-[9px] text-purple-700/80 font-medium mt-0.5">
                          {opt.fraction.numerator === 1
                            ? `Penyebut ${opt.fraction.denominator}`
                            : `Pembilang ${opt.fraction.numerator}`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPuddingChoice(opt.fraction, opt.value, key);
                      }}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-xs transition active:scale-95 shadow-xs flex items-center gap-1 ${
                        isSelected
                          ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                          : 'bg-white hover:bg-purple-200 text-purple-900 border border-purple-300'
                      }`}
                    >
                      <Scissors className="w-3 h-3" />
                      <span>{isSelected ? '✓ Terpilih' : 'Potong & Pilih'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-purple-800 font-bold text-xs bg-purple-50/50 rounded-xl border border-purple-200">
              👉 Klik salah satu pelanggan di antrean atas untuk melihat 2 pilihan puding yang perlu dibandingkan!
            </div>
          )}

          {/* Educational Chef Tip */}
          <div className="text-[10px] text-purple-900 font-semibold text-center border-t border-purple-100 pt-1">
            💡 <span className="font-bold">Tips Koki Cilik:</span> Jika pembilang sama-sama 1, semakin{' '}
            <span className="underline">kecil angka penyebutnya</span>, semakin{' '}
            <span className="text-purple-700 font-black">LEBIH BESAR</span> potongan kuenya!
          </div>
        </div>
      )}
    </div>
  );
};
