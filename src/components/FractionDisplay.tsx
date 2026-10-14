import React from 'react';

interface FractionDisplayProps {
  numerator: number;
  denominator: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
    xs: {
      num: 'text-[10px] font-black leading-none',
      den: 'text-[10px] font-black leading-none',
      line: 'h-[1.5px] min-w-[14px]',
      container: 'gap-[1px] py-[1px]',
    },
    sm: {
      num: 'text-xs font-black leading-none',
      den: 'text-xs font-black leading-none',
      line: 'h-[1.5px] min-w-[16px]',
      container: 'gap-[1px] py-[1px]',
    },
    md: {
      num: 'text-sm font-black leading-none',
      den: 'text-sm font-black leading-none',
      line: 'h-[2px] min-w-[20px]',
      container: 'gap-[1.5px] py-[1px]',
    },
    lg: {
      num: 'text-lg font-black leading-none',
      den: 'text-lg font-black leading-none',
      line: 'h-[2.5px] min-w-[28px]',
      container: 'gap-0.5 py-0.5',
    },
    xl: {
      num: 'text-2xl font-black leading-none',
      den: 'text-2xl font-black leading-none',
      line: 'h-[3px] min-w-[36px]',
      container: 'gap-1 py-0.5',
    },
  }[size];

  return (
    <div className="inline-flex items-center gap-1 align-middle shrink-0">
      <div className={`inline-flex flex-col items-center justify-center ${sizeConfig.container}`}>
        <span className={`${sizeConfig.num} ${textColor} tracking-tight select-none`}>
          {numerator}
        </span>
        <div className={`${sizeConfig.line} ${lineColor} rounded-full`} />
        <span className={`${sizeConfig.den} ${textColor} tracking-tight select-none`}>
          {denominator}
        </span>
      </div>
      {suffix && (
        <span className={`font-bold ${sizeConfig.num} ${textColor} select-none ml-0.5`}>
          {suffix}
        </span>
      )}
      {showBarPreview && denominator > 0 && (
        <div className="w-10 h-3 bg-gray-200 rounded-md border border-gray-400 overflow-hidden flex ml-1">
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
