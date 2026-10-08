import React from 'react';

interface FractionDisplayProps {
  numerator: number;
  denominator: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  lineColor?: string;
  suffix?: string;
  showBarPreview?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  numerator,
  denominator,
  size = 'md',
  textColor = 'text-amber-950',
  lineColor = 'bg-amber-950',
  suffix,
  showBarPreview = false,
}) => {
  const sizeConfig = {
    sm: { num: 'text-sm', den: 'text-sm', line: 'h-0.5 min-w-[18px]', container: 'gap-0.5' },
    md: { num: 'text-base font-bold', den: 'text-base font-bold', line: 'h-0.5 min-w-[24px]', container: 'gap-0.5' },
    lg: { num: 'text-xl font-bold', den: 'text-xl font-bold', line: 'h-1 min-w-[32px]', container: 'gap-0.5' },
    xl: { num: 'text-3xl font-extrabold', den: 'text-3xl font-extrabold', line: 'h-1.5 min-w-[44px]', container: 'gap-1' },
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5 align-middle">
      <div className={`inline-flex flex-col items-center justify-center leading-none ${sizeConfig.container}`}>
        <span className={`${sizeConfig.num} ${textColor} tracking-tight select-none`}>
          {numerator}
        </span>
        <div className={`${sizeConfig.line} ${lineColor} rounded-full`} />
        <span className={`${sizeConfig.den} ${textColor} tracking-tight select-none`}>
          {denominator}
        </span>
      </div>
      {suffix && (
        <span className={`font-semibold ${sizeConfig.num} ${textColor} select-none`}>
          {suffix}
        </span>
      )}
      {showBarPreview && denominator > 0 && (
        <div className="w-12 h-3.5 bg-gray-200 rounded-md border border-gray-400 overflow-hidden flex">
          {Array.from({ length: denominator }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 border-r border-gray-400 last:border-r-0 ${
                i < numerator ? 'bg-amber-500' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
