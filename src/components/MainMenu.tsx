import React, { useState } from 'react';
import { StudentProfile } from '../types/game';
import { Play, BookOpen, Award, Volume2, VolumeX, Sparkles, Edit3 } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { PWAInstallButton } from './PWAInstallButton';
import { AnimatedChefMascot } from './AnimatedChefMascot';
import { FractionDisplay } from './FractionDisplay';

interface MainMenuProps {
  profile: StudentProfile;
  onStartGame: () => void;
  onOpenRecipeBook: () => void;
  onOpenTeacherReport: () => void;
  onUpdateProfileName: (name: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  onStartGame,
  onOpenRecipeBook,
  onOpenTeacherReport,
  onUpdateProfileName,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfileName(nameInput.trim());
      setIsEditingName(false);
      sound.playClick();
    }
  };

  const totalStars = Object.values(profile.starsEarned).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#118AB2] via-sky-300 to-[#FFD166] flex flex-col justify-between p-3 sm:p-5 select-none relative overflow-hidden">
      {/* Background Ambience: Floating Restaurant treats */}
      <div className="absolute top-6 left-12 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍕</div>
      <div className="absolute top-10 right-20 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍩</div>
      <div className="absolute bottom-8 left-16 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🍫</div>
      <div className="absolute bottom-10 right-16 text-3xl sm:text-4xl opacity-30 animate-steam pointer-events-none">🧃</div>

      {/* TOP BAR: Profile Card & Quick Settings */}
      <div className="flex items-center justify-between z-10 w-full shrink-0">
        {/* Student Chef Profile Tag */}
        <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 border-2 sm:border-3 border-amber-300 shadow-md flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 flex items-center justify-center text-lg shadow-xs">
            👨‍🍳
          </div>
          <div>
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-1.5 py-0.5 text-xs font-bold border rounded-md max-w-[110px]"
                  maxLength={15}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-bold"
                >
                  OK
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-black text-amber-950">
                  {profile.name}
                </span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-amber-700 p-0.5"
                  title="Ganti Nama Siswa"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px] font-extrabold text-amber-800">
              <span>🪙 {profile.totalCoins} Koin</span>
              <span>•</span>
              <span>⭐ {totalStars}/9 Bintang</span>
            </div>
          </div>
        </div>

        {/* Audio Mute & PWA Install Button */}
        <div className="flex items-center gap-2">
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
        {/* LEFT COLUMN: Animated Chef Mascot & Kitchen Bakery Vignette (5 cols) */}
        <div className="col-span-5 flex flex-col items-center justify-center relative">
          {/* Animated Mascot Chef Stirring Batter Bowl */}
          <div className="relative">
            <AnimatedChefMascot size="lg" className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 drop-shadow-2xl" />

            {/* Speech Bubble from Chef Mascot */}
            <div className="absolute -top-3 -right-2 bg-white/95 rounded-2xl px-2 py-1 sm:px-2.5 sm:py-1.5 border-2 border-amber-300 shadow-lg max-w-[150px] sm:max-w-[170px] text-center animate-pulse-gentle">
              <span className="text-[9px] sm:text-[11px] font-black text-amber-950 leading-tight block">
                &ldquo;Ayo masak dengan porsi pecahan yang pas!&rdquo;
              </span>
              <div className="absolute -bottom-1.5 left-6 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white" />
            </div>

            {/* Floating fraction demo badges */}
            <div className="absolute -bottom-1 -left-2 bg-amber-100/95 border-2 border-amber-300 rounded-xl px-1.5 py-0.5 shadow-md flex items-center gap-1 text-[9px] font-bold text-amber-900 animate-bounce">
              <span>🍕</span>
              <FractionDisplay numerator={1} denominator={2} size="sm" textColor="text-amber-950" />
            </div>
            <div className="absolute bottom-2 -right-2 bg-pink-100/95 border-2 border-pink-300 rounded-xl px-1.5 py-0.5 shadow-md flex items-center gap-1 text-[9px] font-bold text-pink-900 animate-bounce" style={{ animationDelay: '0.4s' }}>
              <span>🍩</span>
              <FractionDisplay numerator={1} denominator={3} size="sm" textColor="text-pink-950" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Brand Identity & Prominent Action Buttons (7 cols) */}
        <div className="col-span-7 flex flex-col justify-center space-y-1.5 sm:space-y-2.5">
          {/* Main Title Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧑‍🍳</span>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                Game Edukasi Fase B SD
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 drop-shadow-sm tracking-tight leading-tight mt-1">
              Toko Pecahan Ceria
            </h1>
            <p className="text-[11px] sm:text-xs font-extrabold text-amber-900">
              Pelajari pecahan dasar, pecahan senilai, desimal, dan persen lewat simulasi restoran interaktif!
            </p>
          </div>

          {/* 3 Prominent Horizontal Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* 1. Mulai Masak (Bermain) */}
            <button
              onClick={() => {
                sound.playClick();
                onStartGame();
              }}
              className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl text-sm sm:text-base shadow-lg border-2 sm:border-3 border-emerald-300 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Play className="w-5 h-5 fill-white stroke-none" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-sm sm:text-base leading-tight">Mulai Masak!</span>
                  <span className="block text-[10px] text-emerald-100 font-semibold leading-tight">Pilih kedai pizza, kafe donat, &amp; restoran jus</span>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-xl font-bold group-hover:translate-x-1 transition-transform">
                Masuk ➔
              </span>
            </button>

            {/* 2. Buku Resep (Ensiklopedia Pecahan) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenRecipeBook();
              }}
              className="w-full py-2 sm:py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black rounded-2xl text-xs sm:text-sm shadow-md border-2 border-amber-300 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-between group"
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

            {/* 3. Rapor Koki (Dasbor Guru) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenTeacherReport();
              }}
              className="w-full py-2 sm:py-2.5 px-4 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md border-2 border-sky-300 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-xs sm:text-sm leading-tight">Rapor Koki (Dasbor Guru)</span>
                  <span className="block text-[10px] text-sky-100 font-semibold leading-tight">Pantau akurasi per topik &amp; rekomendasi pembelajaran</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-sky-100 group-hover:translate-x-1 transition-transform">
                Lihat ➔
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: Topic badges in 1 single horizontal line */}
      <div className="text-center text-[10px] sm:text-[11px] text-amber-950 font-bold z-10 flex flex-wrap justify-center items-center gap-4 bg-white/60 py-1 px-4 rounded-full max-w-lg mx-auto border border-amber-300/60 shadow-xs shrink-0">
        <span>🍕 Pecahan Dasar</span>
        <span>•</span>
        <span>🍩 Pecahan Senilai</span>
        <span>•</span>
        <span>🧃 Desimal &amp; Persen</span>
      </div>
    </div>
  );
};
