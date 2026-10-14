import React from 'react';
import { GameLevel, StudentProfile } from '../types/game';
import { Star, ArrowLeft, BookOpen, Award, Play, Lock } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface LevelSelectMapProps {
  levels: GameLevel[];
  profile: StudentProfile;
  onSelectLevel: (levelId: number) => void;
  onOpenRecipeBook: () => void;
  onOpenTeacherReport: () => void;
  onBackToMenu: () => void;
}

export const LevelSelectMap: React.FC<LevelSelectMapProps> = ({
  levels,
  profile,
  onSelectLevel,
  onOpenRecipeBook,
  onOpenTeacherReport,
  onBackToMenu,
}) => {
  return (
    <div className="w-full h-full bg-[#118AB2]/20 flex flex-col justify-between p-2 sm:p-3 relative overflow-hidden select-none">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-100 -z-10" />

      {/* Decorative town elements */}
      <div className="absolute top-4 left-8 text-white/70 text-3xl pointer-events-none">☁️</div>
      <div className="absolute top-6 right-16 text-white/70 text-3xl pointer-events-none">☁️</div>
      <div className="absolute bottom-2 left-1/4 text-emerald-600/30 text-4xl pointer-events-none">🌳</div>
      <div className="absolute bottom-3 right-1/4 text-emerald-600/30 text-4xl pointer-events-none">🏡</div>

      {/* Header Bar */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 hover:bg-white text-amber-950 font-black rounded-xl shadow-xs transition active:scale-95 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Menu Utama</span>
        </button>

        <div className="text-center">
          <h1 className="text-sm sm:text-lg font-black text-amber-950 drop-shadow-xs">
            Peta Restoran Kota Pecahan (4 Level Belajar)
          </h1>
          <p className="text-[9px] sm:text-[11px] text-amber-900 font-bold">
            Dari Mengenali Pecahan (Unistructural) hingga Membandingkan (Relational)
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenRecipeBook();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl shadow-xs transition active:scale-95 text-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buku Resep</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherReport();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs transition active:scale-95 text-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rapor Koki</span>
          </button>
        </div>
      </div>

      {/* The 4 Level Restaurant Stations Grid (Always 4 columns across width) */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-4 gap-2 sm:gap-2.5 my-auto z-10 py-1">
        {levels.map((lvl) => {
          const stars = profile.starsEarned[lvl.id] || 0;
          const highScore = profile.highScores[lvl.id] || 0;
          const isUnlocked =
            lvl.unlockedByDefault || (profile.starsEarned[lvl.id - 1] ?? 0) > 0 || lvl.id === 1;

          return (
            <div
              key={lvl.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playClick();
                  onSelectLevel(lvl.id);
                }
              }}
              className={`relative rounded-2xl p-2 sm:p-2.5 border-2 transition-all duration-200 flex flex-col justify-between shadow-md ${
                isUnlocked
                  ? 'bg-white hover:border-amber-400 hover:-translate-y-1 cursor-pointer border-amber-300'
                  : 'bg-slate-100/90 border-slate-300 opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Restaurant Icon Badge & Stars */}
              <div className="flex justify-between items-start mb-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-inner bg-amber-100 border border-amber-300">
                  {lvl.id === 1 ? '🍕' : lvl.id === 2 ? '🍫' : lvl.id === 3 ? '🍩' : '🍮'}
                </div>

                {/* Stars earned */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-1 py-0.5 rounded-lg border border-amber-200">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= stars ? 'fill-amber-400 stroke-amber-500' : 'fill-slate-200 stroke-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-amber-600 block">
                    Level {lvl.id}
                  </span>
                  <span className="text-[7.5px] font-black bg-sky-100 text-sky-800 px-1 rounded">
                    {lvl.cognitiveFocus}
                  </span>
                </div>
                <h3 className="text-[11px] sm:text-xs font-black text-amber-950 mb-0.5 leading-tight line-clamp-1">
                  {lvl.title}
                </h3>
                <p className="text-[9px] sm:text-[9.5px] text-slate-600 mb-1 leading-tight line-clamp-2">
                  {lvl.description}
                </p>
              </div>

              {/* High score & play button */}
              <div className="border-t border-slate-100 pt-1 flex items-center justify-between">
                <div>
                  <span className="text-[7.5px] text-slate-500 font-bold block">Skor:</span>
                  <span className="text-[10px] sm:text-xs font-black text-amber-900">{highScore}</span>
                </div>

                {isUnlocked ? (
                  <button className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[9px] sm:text-[10px] shadow-xs transition">
                    <Play className="w-2.5 h-2.5 fill-white" />
                    <span>Mulai</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-slate-400 text-[9px] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Kunci</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="text-center text-[9px] sm:text-[10px] text-amber-900/80 font-bold z-10 shrink-0">
        💡 Koki Cilik belajar bertahap: 1. Mengenali Pecahan ➔ 2. Mengurutkan Pecahan ➔ 3. Pecahan Senilai ➔ 4. Membandingkan Pecahan.
      </div>
    </div>
  );
};
