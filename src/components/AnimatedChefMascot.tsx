import React from 'react';

interface AnimatedChefMascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedChefMascot: React.FC<AnimatedChefMascotProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#118AB2" />
            <stop offset="100%" stopColor="#073B4C" />
          </linearGradient>
          <linearGradient id="doughGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE8B6" />
            <stop offset="100%" stopColor="#F4A261" />
          </linearGradient>
          <linearGradient id="apronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Ambient Kitchen Glow behind */}
        <circle cx="100" cy="115" r="75" fill="#FFE5A3" opacity="0.35" />

        {/* Kid Chef Body & Apron */}
        <path d="M 60 145 C 55 110, 65 95, 100 95 C 135 95, 145 110, 140 145 Z" fill="#EF476F" />
        {/* White Apron */}
        <path d="M 72 110 L 128 110 L 132 150 L 68 150 Z" fill="url(#apronGrad)" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M 85 96 L 85 110 M 115 96 L 115 110" stroke="#CBD5E1" strokeWidth="3" />

        {/* Kid Chef Head */}
        <g className="animate-pulse-gentle" style={{ transformOrigin: '100px 75px' }}>
          {/* Head base */}
          <circle cx="100" cy="72" r="32" fill="#FFD1A9" />
          {/* Hair back & bangs */}
          <path d="M 68 62 C 68 40, 132 40, 132 62 C 120 48, 80 48, 68 62 Z" fill="#5C3D1E" />
          <path d="M 70 60 Q 85 68 95 62 Q 108 70 128 58 Q 115 50 100 52 Q 85 50 70 60" fill="#5C3D1E" />

          {/* Cheerful Smiling Eyes */}
          <path d="M 86 68 Q 92 61 98 68" stroke="#3D2612" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 102 68 Q 108 61 114 68" stroke="#3D2612" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Cute Pink Cheeks */}
          <circle cx="82" cy="76" r="6" fill="#FF70A6" opacity="0.65" />
          <circle cx="118" cy="76" r="6" fill="#FF70A6" opacity="0.65" />

          {/* Happy Open Smile */}
          <path d="M 94 77 Q 100 87 106 77 Z" fill="#EF476F" stroke="#3D2612" strokeWidth="1.5" />
          <path d="M 97 81 Q 100 84 103 81" fill="#FFFFFF" />

          {/* White Chef Hat with Puffy Cloud Folds */}
          <g transform="translate(62, 10)">
            <path
              d="M 14 36 C -4 14, 10 -4, 28 6 C 36 -12, 58 -8, 62 8 C 76 -2, 86 16, 74 36 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            {/* Hat Band with Red Ribbon Stripe */}
            <rect x="14" y="32" width="60" height="12" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="18" y="36" width="52" height="4" rx="2" fill="#EF476F" />
          </g>
        </g>

        {/* Mixing Bowl (Front) */}
        <g>
          {/* Bowl Exterior */}
          <path d="M 40 120 Q 40 180 100 180 Q 160 180 160 120 Z" fill="url(#bowlGrad)" stroke="#073B4C" strokeWidth="3.5" />
          {/* Bowl Rim */}
          <ellipse cx="100" cy="120" rx="60" ry="15" fill="#06D6A0" stroke="#073B4C" strokeWidth="3" />
          {/* Dough inside bowl */}
          <ellipse cx="100" cy="124" rx="50" ry="11" fill="url(#doughGrad)" />

          {/* Whisk / Wooden Spoon with Circular Stirring Motion */}
          <g className="animate-stir" style={{ transformOrigin: '100px 95px' }}>
            {/* Spoon Handle */}
            <rect x="96" y="55" width="8" height="75" rx="4" fill="#A4683C" stroke="#582F0E" strokeWidth="2" />
            {/* Spoon Bowl / Spoon Head */}
            <ellipse cx="100" cy="126" rx="14" ry="8" fill="#D4A373" stroke="#582F0E" strokeWidth="2" />
            {/* Dough ripples */}
            <circle cx="100" cy="126" r="16" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 4" />
          </g>

          {/* Little Kid Hands Holding the Bowl & Spoon */}
          <circle cx="56" cy="125" r="9" fill="#FFD1A9" stroke="#E29578" strokeWidth="1.5" />
          <circle cx="100" cy="98" r="9" fill="#FFD1A9" stroke="#E29578" strokeWidth="1.5" />
        </g>

        {/* Playful Floating Flour Dust Sparkles */}
        <g opacity="0.8">
          <circle cx="50" cy="100" r="2.5" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <circle cx="150" cy="105" r="3" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="100" cy="40" r="2" fill="#FFE5A3" />
        </g>
      </svg>
    </div>
  );
};
