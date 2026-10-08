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
    <div className="w-full h-full bg-[#118AB2]/20 flex flex-col justify-between p-2 sm:p-3.5 relative overflow-hidden select-none">
      {/* Background Decor: playful cartoon road & grassy town background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-100 -z-10" />

      {/* Decorative clouds and restaurant town elements */}
      <div className="absolute top-6 left-10 text-white/70 text-3xl pointer-events-none">☁️</div>
      <div className="absolute top-8 right-20 text-white/70 text-4xl pointer-events-none">☁️</div>
      <div className="absolute bottom-2 left-1/4 text-emerald-600/30 text-5xl pointer-events-none">🌳</div>
      <div className="absolute bottom-4 right-1/4 text-emerald-600/30 text-5xl pointer-events-none">🏡</div>

      {/* Header Bar */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 hover:bg-white text-amber-950 font-bold rounded-xl shadow transition active:scale-95 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Menu Utama</span>
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-xl font-black text-amber-950 drop-shadow-xs">
            Peta Restoran Kota Pecahan
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-900 font-bold">
            Pilih restoran yang ingin kamu layani hari ini!
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenRecipeBook();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl shadow transition active:scale-95 text-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buku Resep</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherReport();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow transition active:scale-95 text-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rapor Koki</span>
          </button>
        </div>
      </div>

      {/* The 3 Level Restaurant Stations Grid (Always 3 columns, fully fits in 1 screen) */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-3 gap-2 sm:gap-4 my-auto z-10 py-1">
        {levels.map((lvl) => {
          const stars = profile.starsEarned[lvl.id] || 0;
          const highScore = profile.highScores[lvl.id] || 0;
          const isUnlocked = lvl.unlockedByDefault || (profile.starsEarned[lvl.id - 1] ?? 0) > 0 || lvl.id === 1;

          return (
            <div
              key={lvl.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playClick();
                  onSelectLevel(lvl.id);
                }
              }}
              className={`relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border-2 sm:border-3 transition-all duration-200 flex flex-col justify-between shadow-lg ${
                isUnlocked
                  ? 'bg-white hover:border-amber-400 hover:-translate-y-1 cursor-pointer border-amber-300'
                  : 'bg-slate-100/90 border-slate-300 opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Restaurant Icon Badge */}
              <div className="flex justify-between items-start mb-1.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner bg-amber-100 border border-amber-300">
                  {lvl.id === 1 ? '🍕' : lvl.id === 2 ? '🍩' : '🧃'}
                </div>

                {/* Stars earned for this level */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                        s <= stars ? 'fill-amber-400 stroke-amber-500' : 'fill-slate-200 stroke-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                  Level {lvl.id}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-amber-950 mb-0.5 leading-tight line-clamp-1">
                  {lvl.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-600 mb-2 leading-tight line-clamp-2">
                  {lvl.description}
                </p>
              </div>

              {/* High score & play button */}
              <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold block">Skor:</span>
                  <span className="text-xs font-black text-amber-900">{highScore} Poin</span>
                </div>

                {isUnlocked ? (
                  <button className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] sm:text-xs shadow-xs transition">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Mulai</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                    <Lock className="w-3 h-3" />
                    <span>Terkunci</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="text-center text-[10px] sm:text-xs text-amber-900/80 font-semibold z-10">
        💡 Siswa dapat melatih kemampuan pecahan bertahap dari Level 1 (Dasar) hingga Level 3 (Desimal &amp; Persen).
      </div>
    </div>
  );
};
