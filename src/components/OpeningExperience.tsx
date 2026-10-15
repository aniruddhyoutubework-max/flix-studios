import React, { useEffect, useState } from 'react';

interface OpeningExperienceProps {
  onComplete: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete }) => {
  const [animStage, setAnimStage] = useState<'enter' | 'sweep' | 'exit'>('enter');

  useEffect(() => {
    // Check if user has prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    // Tasteful short sequence (~1.4s total, never a fake loading percentage)
    const t1 = setTimeout(() => setAnimStage('sweep'), 400);
    const t2 = setTimeout(() => setAnimStage('exit'), 1100);
    const t3 = setTimeout(() => onComplete(), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#08090B] transition-opacity duration-500 pointer-events-none select-none ${
        animStage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute w-48 h-48 rounded-full bg-[#D7FF3F]/20 blur-2xl animate-pulse" />

        {/* Logo Mark with Light Sweep & Scale Arrival */}
        <div
          className={`relative z-10 transition-all duration-700 ease-out transform ${
            animStage === 'enter'
              ? 'scale-90 opacity-0 translate-y-3'
              : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          <img
            src="/flixcore-logo-white.png"
            alt="Flix Studios"
            width={72}
            height={66}
            className="filter drop-shadow-[0_0_20px_rgba(215,255,63,0.4)]"
          />

          {/* Light sweep line */}
          {animStage === 'sweep' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-full animate-marquee-left" style={{ animationDuration: '0.6s' }} />
            </div>
          )}
        </div>

        {/* Wordmark Reveal */}
        <div
          className={`mt-6 text-center transition-all duration-500 delay-200 ${
            animStage === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="font-display font-extrabold text-lg tracking-[0.2em] text-[#F4F3EE]">
            FLIX STUDIOS
          </div>
          <div className="font-mono text-[9px] tracking-[0.3em] text-[#9FA2AD] uppercase mt-1">
            FORWARD MOTION
          </div>
        </div>
      </div>
    </div>
  );
};
