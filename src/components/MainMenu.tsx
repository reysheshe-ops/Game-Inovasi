import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile, TEAM_OPTIONS } from '../types/game';
import { Play, BookOpen, Volume2, VolumeX, Sparkles, Edit3, Lock, ShieldCheck } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { PWAInstallButton } from './PWAInstallButton';
import { AnimatedChefMascot } from './AnimatedChefMascot';

interface MainMenuProps {
  profile: StudentProfile;
  onStartGame: () => void;
  onOpenRecipeBook: () => void;
  onOpenTeacherReport: () => void;
  onUpdateProfileName: (name: string) => void;
  onPromptLogin?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  onStartGame,
  onOpenRecipeBook,
  onOpenTeacherReport,
  onUpdateProfileName,
  onPromptLogin,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  // Secret 3-second hold for Teacher Lock (PRD Section 3.B)
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / 3000) * 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        holdIntervalRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        sound.playKaching();
        onOpenTeacherReport();
      }
    }, 50);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const totalStars = Object.values(profile.starsEarned).reduce((a, b) => a + b, 0);

  const teamMeta =
    TEAM_OPTIONS.find((t) => t.name === profile.teamName) || TEAM_OPTIONS[0];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#118AB2] via-sky-300 to-[#FFD166] flex flex-col justify-between p-2.5 sm:p-4 select-none relative overflow-hidden">
      {/* Background Ambience: Floating Restaurant treats */}
      <div className="absolute top-6 left-12 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍕</div>
      <div className="absolute top-10 right-20 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍩</div>
      <div className="absolute bottom-8 left-16 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍫</div>
      <div className="absolute bottom-10 right-16 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍮</div>

      {/* TOP BAR: Profile Card & Quick Settings */}
      <div className="flex items-center justify-between z-10 w-full shrink-0">
        {/* Student Chef Profile Tag with Team Badge */}
        <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 border-2 sm:border-3 border-amber-300 shadow-md flex items-center gap-2">
          <div
            onClick={onPromptLogin}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 hover:bg-amber-500 cursor-pointer flex items-center justify-center text-lg shadow-xs transition"
            title="Ubah Profil & Tim Belajar"
          >
            {profile.avatarEmoji || '👨‍🍳'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-amber-950">
                {profile.name}
              </span>
              {/* Team Pill Badge */}
              <span
                className={`text-[9px] font-black px-2 py-0.2 rounded-full border ${teamMeta.badgeColor}`}
              >
                {profile.teamName}
              </span>
              <button
                onClick={onPromptLogin}
                className="text-gray-400 hover:text-amber-700 p-0.5"
                title="Ganti Nama / Tim Siswa"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px] font-extrabold text-amber-800">
              <span>🪙 {profile.totalCoins} Koin</span>
              <span>•</span>
              <span>⭐ {totalStars}/12 Bintang</span>
            </div>
          </div>
        </div>

        {/* Top Right: Secret 3s-Hold Teacher Lock, Audio Mute & PWA Install Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Secret Teacher Lock Button (Hold for 3 seconds per PRD Section 3.B) */}
          <div className="relative">
            <button
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onClick={() => {
                // If clicked briefly, give teacher hint or open
                if (holdProgress < 90) {
                  sound.playBlop();
                }
              }}
              className="relative overflow-hidden flex items-center gap-1 px-2.5 py-1 bg-white/80 hover:bg-white text-slate-700 hover:text-sky-700 rounded-xl shadow-xs border border-sky-200 text-[10px] sm:text-xs font-bold transition active:scale-95 cursor-pointer"
              title="Akses Rahasia Guru (Tahan tombol ini selama 3 detik)"
            >
              {/* Fill progress background */}
              {isHolding && (
                <div
                  className="absolute inset-0 bg-sky-500/30 transition-all duration-75"
                  style={{ width: `${holdProgress}%` }}
                />
              )}
              <Lock className="w-3 h-3 text-sky-600 relative z-10" />
              <span className="hidden sm:inline relative z-10">
                {isHolding ? `Tahan (${Math.round((3000 - (holdProgress / 100) * 3000) / 1000)}s)...` : 'Area Guru'}
              </span>
            </button>

            {/* Floating tooltip hint on hover */}
            {isHolding && (
              <div className="absolute -bottom-7 right-0 whitespace-nowrap bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-md pointer-events-none animate-fadeIn z-50">
                Tahan 3 detik untuk membuka Dasbor Guru
              </div>
            )}
          </div>

          <PWAInstallButton variant="badge" />

          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-xl shadow border border-amber-200 text-amber-900 transition active:scale-95"
            title={isMuted ? 'Nyalakan Musik & Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* CENTER: WIDESCREEN 16:9 HORIZONTAL DASHBOARD SPLIT */}
      <div className="flex-1 w-full max-w-5xl mx-auto grid grid-cols-12 gap-2 sm:gap-6 items-center my-auto z-10 px-2 overflow-hidden">
        {/* LEFT COLUMN: Animated Chef Mascot & Kitchen Ambiance (col-span-5) */}
        <div className="col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <AnimatedChefMascot size="lg" />
            <div className="absolute -bottom-2 bg-white/90 px-3 py-0.5 rounded-full shadow-md border border-amber-300 text-[10px] sm:text-xs font-extrabold text-amber-900 flex items-center gap-1 animate-wobble">
              <span>👨‍🍳 Chef Ceria</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
          </div>
          <div className="mt-2 text-xs font-bold text-amber-950 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/80">
            Fase B SD Matematika (Kelas 3-4)
          </div>
        </div>

        {/* RIGHT COLUMN: Game Title & Primary Navigation Buttons (col-span-7) */}
        <div className="col-span-7 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
          {/* Main Title Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-sm mb-1 uppercase tracking-wider">
              <span>✨ Game Edukasi Pecahan SD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 drop-shadow-sm tracking-tight leading-none">
              Toko Pecahan Ceria
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-900 mt-0.5">
              Kelola restoran, layani pelanggan, dan kuasai konsep pecahan!
            </p>
          </div>

          {/* Child-friendly Big Navigation Buttons */}
          <div className="w-full max-w-md space-y-2">
            {/* 1. Mulai Memasak (Play) */}
            <button
              onClick={() => {
                sound.playClick();
                onStartGame();
              }}
              className="w-full py-2.5 sm:py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl text-sm sm:text-base shadow-lg border-2 border-emerald-300 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-sm sm:text-base leading-tight">Mulai Memasak!</span>
                  <span className="block text-[10px] text-emerald-100 font-semibold leading-tight">Jelajahi 4 level restoran &amp; kumpulkan bintang</span>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-200 group-hover:translate-x-1 transition-transform">
                Masuk ➔
              </span>
            </button>

            {/* 2. Buku Resep (Ensiklopedia Pecahan) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenRecipeBook();
              }}
              className="w-full py-2 sm:py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black rounded-2xl text-xs sm:text-sm shadow-md border-2 border-amber-300 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-950">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-xs sm:text-sm leading-tight">Buku Resep Pecahan</span>
                  <span className="block text-[10px] text-amber-900 font-semibold leading-tight">Ensiklopedia &amp; simulator potongan pecahan mandiri</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-900 group-hover:translate-x-1 transition-transform">
                Buka ➔
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: 4 Level Learning Objective Badges */}
      <div className="text-center text-[10px] sm:text-[11px] text-amber-950 font-bold z-10 flex flex-wrap justify-center items-center gap-3 bg-white/70 py-1 px-4 rounded-full max-w-xl mx-auto border border-amber-300/60 shadow-xs shrink-0">
        <span>🍕 1. Mengenali</span>
        <span>•</span>
        <span>🍫 2. Mengurutkan</span>
        <span>•</span>
        <span>🍩 3. Senilai</span>
        <span>•</span>
        <span>🍮 4. Membandingkan</span>
      </div>
    </div>
  );
};
