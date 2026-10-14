import React, { useState } from 'react';
import { Sparkles, User, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { TEAM_OPTIONS } from '../types/game';

interface StudentLoginModalProps {
  currentName: string;
  currentTeam?: string;
  currentAvatar?: string;
  onSaveProfile: (data: { name: string; teamName: string; avatarEmoji: string }) => void;
  onClose?: () => void;
  isFirstLogin?: boolean;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  currentName,
  currentTeam = 'Tim Merah',
  currentAvatar = '👨‍🍳',
  onSaveProfile,
  onClose,
  isFirstLogin = false,
}) => {
  const [name, setName] = useState(
    currentName === 'Koki Cilik' || currentName === 'Koki Budi' || !currentName ? '' : currentName
  );
  const [selectedTeam, setSelectedTeam] = useState(currentTeam);
  const [selectedEmoji, setSelectedEmoji] = useState(currentAvatar);
  const [errorMessage, setErrorMessage] = useState('');

  const avatarOptions = ['👨‍🍳', '👩‍🍳', '🐱', '⭐', '🦁', '🦊', '🦉', '🐼'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMessage('Tolong masukkan namamu ya, Koki Cilik!');
      sound.playBoing();
      return;
    }

    sound.playKaching();
    onSaveProfile({
      name: trimmed,
      teamName: selectedTeam,
      avatarEmoji: selectedEmoji,
    });
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-amber-100/90 rounded-3xl shadow-2xl border-4 border-amber-400 p-4 sm:p-5 relative overflow-hidden flex flex-col items-center text-center">
        {/* Floating sparkles background */}
        <div className="absolute top-3 left-4 text-2xl opacity-40 animate-pulse pointer-events-none">✨</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-40 animate-pulse pointer-events-none">🍕</div>

        {/* Animated Avatar Mascot */}
        <div className="relative my-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl border-3 border-white shadow-lg flex items-center justify-center text-3xl sm:text-4xl animate-bounce">
            {selectedEmoji}
          </div>
          <div className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full p-1 shadow-md">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-black text-amber-950 mt-1">
          Pendaftaran Koki Cilik
        </h2>
        <p className="text-[11px] sm:text-xs font-bold text-amber-800 mt-0.5 max-w-xs">
          Masukkan nama &amp; tim belajarmu untuk dicatat di Dasbor Guru!
        </p>

        {/* Avatar picker */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {avatarOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedEmoji(emoji);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-base sm:text-lg transition-transform ${
                selectedEmoji === emoji
                  ? 'bg-amber-400 border-2 border-amber-600 scale-110 shadow-sm'
                  : 'bg-white/80 hover:bg-white border border-amber-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full mt-3 space-y-2.5 text-left">
          {/* Input 1: Student Name */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-amber-950 uppercase tracking-wide block mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>1. Siapa namamu, Koki Cilik?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ketik namamu di sini (misal: Budi, Siti)..."
                maxLength={20}
                autoFocus
                className="w-full py-2 px-3 text-xs sm:text-sm font-black text-amber-950 bg-white border-2 border-amber-300 rounded-xl shadow-inner focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 placeholder:font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Input 2: Team Selection */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-amber-950 uppercase tracking-wide block mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Pilih Tim / Kelompok Belajarmu!</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TEAM_OPTIONS.map((team) => {
                const isSelected = selectedTeam === team.name;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedTeam(team.name);
                    }}
                    className={`py-1.5 px-2 rounded-xl border-2 text-[10px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? `${team.color} text-white border-white shadow-md scale-102 ring-2 ring-amber-400`
                        : 'bg-white/90 hover:bg-white text-slate-800 border-amber-200'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : team.color}`} />
                    <span className="truncate">{team.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="text-[10px] font-bold text-rose-600 text-center animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md border-2 border-emerald-300 transition transform hover:scale-101 active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <span>Mulai Memasak!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {!isFirstLogin && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 text-[11px] font-bold text-amber-800 hover:underline"
          >
            Batal
          </button>
        )}
      </div>
    </div>
  );
};
