import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface SuccessBurstVFXProps {
  onComplete?: () => void;
}

export const SuccessBurstVFX: React.FC<SuccessBurstVFXProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 60);
    const t2 = setTimeout(() => setStage(2), 180);
    const t3 = setTimeout(() => setStage(3), 300);
    // Strict auto-destroy after 1.1s so clicks are never blocked
    const tEnd = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
    };
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-40 flex items-center justify-center overflow-hidden"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {/* Central Radiating Glow (Non-blocking) */}
      <div
        className="absolute w-44 h-44 bg-amber-300/30 rounded-full animate-ping pointer-events-none"
        style={{ animationDuration: '0.8s', pointerEvents: 'none' }}
      />

      {/* 3 Sequential Golden Stars with Bouncy Scale (Non-blocking) */}
      <div className="flex items-center gap-2 sm:gap-3 z-10 pointer-events-none">
        {[0, 1, 2].map((idx) => {
          const isPopped = stage > idx;
          return (
            <div
              key={idx}
              className={`transform transition-all duration-300 pointer-events-none ${
                isPopped
                  ? 'scale-110 opacity-100 rotate-12'
                  : 'scale-0 opacity-0 -rotate-45'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="relative p-2 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl shadow-xl border-2 border-white animate-pulse-gentle pointer-events-none">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-amber-300 stroke-amber-600 stroke-[2.5] pointer-events-none" />
                <span className="absolute -top-1 -right-1 text-xs pointer-events-none">✨</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bursting Shiny Gold Coins (Non-blocking) */}
      {stage >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[
            { angle: 0, dist: '80px', delay: '0ms' },
            { angle: 45, dist: '90px', delay: '40ms' },
            { angle: 90, dist: '85px', delay: '80ms' },
            { angle: 135, dist: '90px', delay: '120ms' },
            { angle: 180, dist: '80px', delay: '60ms' },
            { angle: 225, dist: '90px', delay: '100ms' },
            { angle: 270, dist: '85px', delay: '50ms' },
            { angle: 315, dist: '90px', delay: '90ms' },
          ].map((coin, i) => (
            <div
              key={i}
              className="absolute text-xl sm:text-2xl animate-ping pointer-events-none"
              style={{
                transform: `rotate(${coin.angle}deg) translate(${coin.dist})`,
                animationDuration: '0.7s',
                animationDelay: coin.delay,
                pointerEvents: 'none',
              }}
            >
              🪙
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
