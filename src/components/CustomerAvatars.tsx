import React from 'react';

interface CustomerAvatarProps {
  avatarSeed: number;
  mood?: 'happy' | 'neutral' | 'impatient';
  className?: string;
  isJumpingSuccess?: boolean;
}

export const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
  avatarSeed,
  mood = 'happy',
  className = 'w-16 h-16',
  isJumpingSuccess = false,
}) => {
  const type = avatarSeed % 4;
  const isHappy = mood === 'happy';
  const isImpatient = mood === 'impatient';

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-transform ${
        isJumpingSuccess ? 'animate-bounce' : isImpatient ? 'animate-wobble' : ''
      } ${className}`}
    >
      {/* Floating Sweat Drop when Impatient */}
      {isImpatient && (
        <div className="absolute -top-1 -right-1 z-20">
          <svg viewBox="0 0 20 20" className="w-4 h-4 animate-bounce">
            <path d="M 10 2 C 10 2, 4 10, 4 14 C 4 17.3, 6.7 20, 10 20 C 13.3 20, 16 17.3, 16 14 C 16 10, 10 2, 10 2 Z" fill="#00B4D8" />
            <circle cx="8" cy="14" r="1.5" fill="#FFFFFF" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* Confetti & Joyful Sparkles when Happy */}
      {isHappy && (
        <div className="absolute -inset-1.5 pointer-events-none z-20 opacity-80">
          <span className="absolute -top-1 -left-1 text-xs">✨</span>
          <span className="absolute -top-1.5 -right-1 text-xs">🎉</span>
        </div>
      )}

      {type === 0 && (
        // Budi - cheerful boy with red cap
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Cap */}
          <path d="M 25 35 Q 50 15 75 35 Q 50 30 25 35" fill="#EF476F" />
          <path d="M 65 32 Q 90 28 92 34 Q 85 40 68 36" fill="#EF476F" stroke="#B02A37" strokeWidth="2" />
          {/* Head */}
          <circle cx="50" cy="55" r="28" fill="#FFD1A9" />
          {/* Hair bangs */}
          <path d="M 27 40 Q 38 46 45 42 Q 55 46 73 40" fill="#4A3000" />

          {/* Eyes */}
          {isHappy ? (
            <>
              {/* Joyful arched eyes with sparkles */}
              <path d="M 36 51 Q 43 43 50 51" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 54 51 Q 61 43 68 51" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="43" cy="46" r="1" fill="#FFD166" />
              <circle cx="61" cy="46" r="1" fill="#FFD166" />
            </>
          ) : isImpatient ? (
            <>
              <circle cx="43" cy="52" r="3" fill="#2B2D42" />
              <circle cx="61" cy="52" r="3" fill="#2B2D42" />
              <line x1="37" y1="45" x2="48" y2="49" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="67" y1="45" x2="56" y2="49" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="43" cy="52" r="3.5" fill="#2B2D42" />
              <circle cx="61" cy="52" r="3.5" fill="#2B2D42" />
            </>
          )}

          {/* Cheeks */}
          <circle cx="35" cy="58" r="4.5" fill="#FF85A1" opacity="0.7" />
          <circle cx="69" cy="58" r="4.5" fill="#FF85A1" opacity="0.7" />

          {/* Mouth */}
          {isHappy ? (
            <path d="M 44 60 Q 52 70 60 60 Z" fill="#EF476F" stroke="#2B2D42" strokeWidth="1.5" />
          ) : isImpatient ? (
            <path d="M 45 66 Q 52 61 59 66" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M 47 62 Q 52 66 57 62" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Shirt */}
          <path d="M 25 82 Q 50 78 75 82 L 78 95 L 22 95 Z" fill="#118AB2" />
        </svg>
      )}

      {type === 1 && (
        // Siti - girl with yellow ribbon
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Hair back */}
          <circle cx="50" cy="55" r="32" fill="#5A3A1A" />
          {/* Ribbon */}
          <path d="M 68 28 L 82 22 L 78 35 Z" fill="#FFD166" />
          <path d="M 72 32 L 86 38 L 76 42 Z" fill="#FFD166" />
          <circle cx="72" cy="32" r="5" fill="#F4A261" />
          {/* Face */}
          <circle cx="50" cy="55" r="26" fill="#FFE0BD" />
          {/* Bangs */}
          <path d="M 26 46 Q 38 35 50 38 Q 62 35 74 46 Q 50 36 26 46" fill="#5A3A1A" />

          {/* Eyes */}
          {isHappy ? (
            <>
              <path d="M 38 51 Q 44 44 50 51" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 54 51 Q 60 44 66 51" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : isImpatient ? (
            <>
              <circle cx="43" cy="52" r="3" fill="#2B2D42" />
              <circle cx="61" cy="52" r="3" fill="#2B2D42" />
              <line x1="39" y1="46" x2="47" y2="49" stroke="#2B2D42" strokeWidth="2.5" />
              <line x1="65" y1="46" x2="57" y2="49" stroke="#2B2D42" strokeWidth="2.5" />
            </>
          ) : (
            <>
              <circle cx="43" cy="52" r="3.5" fill="#2B2D42" />
              <circle cx="61" cy="52" r="3.5" fill="#2B2D42" />
            </>
          )}

          {/* Cheeks */}
          <circle cx="36" cy="58" r="4.5" fill="#FF85A1" opacity="0.7" />
          <circle cx="68" cy="58" r="4.5" fill="#FF85A1" opacity="0.7" />

          {/* Mouth */}
          <path
            d={isHappy ? 'M 45 61 Q 52 70 59 61 Z' : isImpatient ? 'M 46 66 Q 52 61 58 66' : 'M 46 62 Q 52 67 58 62'}
            stroke="#2B2D42"
            strokeWidth="2"
            strokeLinecap="round"
            fill={isHappy ? '#EF476F' : 'none'}
          />

          {/* Dress */}
          <path d="M 28 81 Q 50 76 72 81 L 76 95 L 24 95 Z" fill="#FFD166" />
        </svg>
      )}

      {type === 2 && (
        // Doni - Cute Little Bear
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Ears */}
          <circle cx="28" cy="30" r="14" fill="#A4683C" />
          <circle cx="28" cy="30" r="8" fill="#F8CBA6" />
          <circle cx="72" cy="30" r="14" fill="#A4683C" />
          <circle cx="72" cy="30" r="8" fill="#F8CBA6" />
          {/* Head */}
          <circle cx="50" cy="56" r="30" fill="#B87D4B" />
          {/* Snout */}
          <ellipse cx="50" cy="62" rx="15" ry="11" fill="#F8CBA6" />
          <polygon points="46,57 54,57 50,62" fill="#3D2612" />

          {/* Eyes */}
          {isHappy ? (
            <>
              <path d="M 36 48 Q 42 42 48 48" stroke="#3D2612" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 56 48 Q 62 42 68 48" stroke="#3D2612" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="41" cy="49" r="3.5" fill="#3D2612" />
              <circle cx="63" cy="49" r="3.5" fill="#3D2612" />
            </>
          )}

          {/* Mouth */}
          <path d="M 46 65 Q 50 68 54 65" stroke="#3D2612" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="32" cy="58" r="4.5" fill="#FF85A1" opacity="0.6" />
          <circle cx="70" cy="58" r="4.5" fill="#FF85A1" opacity="0.6" />
          {/* Green Bandana */}
          <path d="M 32 82 Q 50 94 68 82 L 72 95 L 28 95 Z" fill="#06D6A0" />
        </svg>
      )}

      {type === 3 && (
        // Kiki - Clever Bunny with chef tie
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Ears */}
          <ellipse cx="36" cy="24" rx="8" ry="22" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <ellipse cx="36" cy="24" rx="4" ry="16" fill="#FFB4C2" />
          <ellipse cx="64" cy="24" rx="8" ry="22" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <ellipse cx="64" cy="24" rx="4" ry="16" fill="#FFB4C2" />
          {/* Head */}
          <circle cx="50" cy="58" r="28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* Eyes */}
          {isHappy ? (
            <>
              <path d="M 37 51 Q 43 45 49 51" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 53 51 Q 59 45 65 51" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="43" cy="52" r="3.5" fill="#2B2D42" />
              <circle cx="61" cy="52" r="3.5" fill="#2B2D42" />
            </>
          )}

          <polygon points="48,59 54,59 51,62" fill="#FF70A6" />
          <path d="M 51 62 L 51 66" stroke="#2B2D42" strokeWidth="2" />
          <path d="M 46 66 Q 51 69 56 66" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Whiskers */}
          <line x1="28" y1="58" x2="38" y2="60" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="28" y1="64" x2="38" y2="64" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="64" y1="60" x2="74" y2="58" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="64" y1="64" x2="74" y2="64" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Cheeks */}
          <circle cx="34" cy="62" r="4" fill="#FF85A1" opacity="0.6" />
          <circle cx="68" cy="62" r="4" fill="#FF85A1" opacity="0.6" />
          {/* Shirt */}
          <path d="M 28 84 Q 50 80 72 84 L 75 95 L 25 95 Z" fill="#9B5DE5" />
        </svg>
      )}
    </div>
  );
};
