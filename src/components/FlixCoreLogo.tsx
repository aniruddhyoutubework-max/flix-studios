import React from 'react';

interface FlixCoreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  className?: string;
  glow?: boolean;
}

export const FlixCoreLogo: React.FC<FlixCoreLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  glow = false
}) => {
  // Proportions of the mark: 181 width x 165 height (~1.097 aspect ratio)
  const sizeMap = {
    sm: { imgW: 24, imgH: 22, text: 'text-sm', subText: 'text-[9px]' },
    md: { imgW: 32, imgH: 29, text: 'text-base', subText: 'text-[10px]' },
    lg: { imgW: 44, imgH: 40, text: 'text-xl', subText: 'text-xs' },
    xl: { imgW: 64, imgH: 58, text: 'text-2xl', subText: 'text-sm' },
    hero: { imgW: 96, imgH: 88, text: 'text-4xl', subText: 'text-base' }
  };

  const { imgW, imgH, text, subText } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${glow ? 'relative group' : ''}`}>
        {glow && (
          <div className="absolute inset-0 bg-[#D7FF3F]/20 blur-xl rounded-full scale-125 opacity-70 transition-opacity group-hover:opacity-100" />
        )}
        <img
          src="/flixcore-logo-white.png"
          alt="Flix Studios Mark"
          width={imgW}
          height={imgH}
          className="relative z-10 transition-transform duration-300 ease-out hover:scale-105 object-contain"
          style={{ width: `${imgW}px`, height: `${imgH}px` }}
          loading="eager"
        />
      </div>

      {/* Typographic Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none tracking-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-bold tracking-wider text-[#F4F3EE] ${text}`}>
              FLIX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3F] inline-block animate-pulse-subtle" />
          </div>
          <span className={`hidden xs:block sm:block font-mono font-medium tracking-[0.25em] text-[#9FA2AD] uppercase ${subText} mt-0.5`}>
            STUDIOS
          </span>
        </div>
      )}
    </div>
  );
};
