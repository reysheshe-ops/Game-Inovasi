import React, { useEffect, useState } from 'react';
import { Sparkles, Utensils } from 'lucide-react';
import { AnimatedChefMascot } from './AnimatedChefMascot';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Compute thermometer oven temperature (e.g. 20°C up to 180°C)
  const currentTemp = Math.round(20 + (progress / 100) * 160);

  return (
    <div className="w-full h-full bg-[#FFD166] flex flex-col items-center justify-center p-4 select-none overflow-hidden relative">
      {/* Decorative floating bubbles & steam */}
      <div className="absolute top-1/4 left-1/5 text-amber-600/20 text-4xl animate-steam">🍕</div>
      <div className="absolute bottom-1/4 right-1/5 text-amber-600/20 text-4xl animate-steam">🍩</div>

      <div className="max-w-sm w-full flex flex-col items-center text-center z-10 my-auto">
        {/* Animated Mascot Chef Stirring Bowl */}
        <AnimatedChefMascot size="md" className="mb-2" />

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-amber-950 mb-0.5 drop-shadow-xs">
          Toko Pecahan Ceria
        </h1>
        <p className="text-xs font-extrabold text-amber-900 mb-3 flex items-center gap-1 justify-center">
          <Utensils className="w-3.5 h-3.5 text-amber-800" />
          <span>Koki sedang mengaduk adonan resep matematika...</span>
        </p>

        {/* Oven Thermometer Progress Bar */}
        <div className="w-full bg-white/90 p-3 rounded-2xl border-2 sm:border-3 border-amber-400 shadow-md">
          <div className="flex justify-between items-center mb-1.5 text-xs font-black text-amber-950">
            <span className="flex items-center gap-1">
              <span>🌡️ Termometer Oven:</span>
              <span className="text-rose-600 font-extrabold">{currentTemp}°C</span>
            </span>
            <span className="text-amber-700">{progress}%</span>
          </div>

          {/* Thermometer Glass Tube */}
          <div className="relative w-full h-5 bg-slate-200 rounded-full border border-slate-400 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>

            {/* Temperature markings along the bar */}
            <div className="absolute inset-0 flex justify-between px-3 pointer-events-none items-center">
              <span className="w-0.5 h-2 bg-slate-400" />
              <span className="w-0.5 h-2 bg-slate-400" />
              <span className="w-0.5 h-2 bg-slate-400" />
              <span className="w-0.5 h-2 bg-slate-400" />
            </div>
          </div>

          <div className="mt-1.5 text-[10px] text-amber-800 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>
              {progress < 40
                ? 'Menimbang tepung pembilang dan penyebut...'
                : progress < 80
                ? 'Memotong pizza menjadi bagian sama besar...'
                : 'Oven sudah panas! Toko siap buka!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
