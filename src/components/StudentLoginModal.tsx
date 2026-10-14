import React, { useState } from 'react';
import { ChefHat, Sparkles, User, ArrowRight } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface StudentLoginModalProps {
  currentName: string;
  onSaveName: (name: string) => void;
  onClose?: () => void;
  isFirstLogin?: boolean;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  currentName,
  onSaveName,
  onClose,
  isFirstLogin = false,
}) => {
  const [name, setName] = useState(
    currentName === 'Koki Budi' || !currentName ? '' : currentName
  );
  const [selectedEmoji, setSelectedEmoji] = useState('👨‍🍳');

  const avatarOptions = ['👨‍🍳', '👩‍🍳', '🐱', '⭐', '🦁', '🦊'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Koki Cilik';
    sound.playKaching();
    onSaveName(finalName);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-amber-100/90 rounded-3xl shadow-2xl border-4 border-amber-400 p-4 sm:p-6 relative overflow-hidden flex flex-col items-center text-center">
        {/* Floating sparkles background */}
        <div className="absolute top-3 left-4 text-2xl opacity-40 animate-pulse pointer-events-none">✨</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-40 animate-pulse pointer-events-none">🍕</div>

        {/* Animated Chef Mascot Icon */}
        <div className="relative my-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl border-3 border-white shadow-lg flex items-center justify-center text-3xl sm:text-4xl animate-bounce">
            {selectedEmoji}
          </div>
          <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-amber-950 mt-2">
          Selamat Datang, Koki Cilik!
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1 max-w-xs">
          Siapa namamu, Koki Hebat? Namamu akan tercatat di Rapor Koki &amp; Piagam Penghargaan!
        </p>

        {/* Avatar picker */}
        <div className="flex items-center gap-2 mt-3">
          {avatarOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedEmoji(emoji);
              }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform ${
                selectedEmoji === emoji
                  ? 'bg-amber-400 border-2 border-amber-600 scale-110 shadow-sm'
                  : 'bg-white/80 hover:bg-white border border-amber-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Name Form */}
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik namamu di sini (misal: Budi)..."
              maxLength={20}
              autoFocus
              className="w-full py-2.5 px-4 pl-10 text-sm sm:text-base font-black text-amber-950 bg-white border-2 border-amber-300 rounded-2xl shadow-inner focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-center placeholder:font-medium placeholder:text-gray-400"
            />
            <User className="w-5 h-5 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl text-sm sm:text-base shadow-lg border-2 border-emerald-300 transition transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mulai Memasak!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {!isFirstLogin && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 text-xs font-bold text-amber-700/80 hover:text-amber-900 underline"
          >
            Lanjutkan nanti
          </button>
        )}
      </div>
    </div>
  );
};
