import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameLevel } from '../types/game';
import { Star, RotateCcw, ArrowRight, Award, Coins } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface LevelCompleteModalProps {
  level: GameLevel;
  score: number;
  coinsEarned: number;
  correctOrders: number;
  totalOrders: number;
  stars: number;
  onReplay: () => void;
  onNextLevel?: () => void;
  onBackToMap: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  score,
  coinsEarned,
  correctOrders,
  totalOrders,
  stars,
  onReplay,
  onNextLevel,
  onBackToMap,
}) => {
  useEffect(() => {
    // Fire festive celebration confetti!
    sound.playYay();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
        {/* Decorative banner */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 -mx-6 -mt-6 py-4 px-6 mb-4 border-b-2 border-amber-300">
          <span className="text-xs font-black uppercase tracking-widest text-amber-950">
            {level.areaName}
          </span>
          <h2 className="text-2xl font-black text-amber-950">
            Level Selesai! Hore! 🎉
          </h2>
        </div>

        {/* Stars Display (1-3 stars) */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl transition-transform duration-300 transform ${
                starIdx <= stars
                  ? 'bg-amber-100 text-amber-500 scale-110 rotate-6 shadow-md'
                  : 'bg-slate-100 text-slate-300 scale-95'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  starIdx <= stars ? 'fill-amber-400 stroke-amber-500' : 'fill-slate-200 stroke-slate-300'
                }`}
              />
            </div>
          ))}
        </div>

        <p className="text-sm font-bold text-slate-700 mb-4">
          {stars === 3
            ? 'Luar biasa! Kamu adalah Master Koki Pecahan!'
            : stars === 2
            ? 'Hebat sekali! Masakanmu sangat lezat dan tepat!'
            : 'Bagus! Terus berlatih agar semakin mahir!'}
        </p>

        {/* Results Metrics Box */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 grid grid-cols-3 gap-2 mb-6">
          <div className="text-center">
            <span className="text-[10px] text-amber-800 font-bold block">Pesanan Sukses</span>
            <span className="text-lg font-black text-amber-950">
              {correctOrders} / {totalOrders}
            </span>
          </div>

          <div className="text-center border-x border-amber-200">
            <span className="text-[10px] text-amber-800 font-bold block flex items-center justify-center gap-0.5">
              <Coins className="w-3 h-3 text-amber-600" /> Koin
            </span>
            <span className="text-lg font-black text-amber-600">
              +{coinsEarned}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-amber-800 font-bold block flex items-center justify-center gap-0.5">
              <Award className="w-3 h-3 text-amber-600" /> Skor
            </span>
            <span className="text-lg font-black text-amber-950">{score}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {onNextLevel && level.id < 3 && (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg transition transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>Lanjut ke Level Berikutnya</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Ulang</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition"
            >
              Peta Restoran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
