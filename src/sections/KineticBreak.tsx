import React from 'react';

const MARQUEE_ITEMS_1 = [
  '⚔️ CUSTOM MINECRAFT PLUGINS',
  '⚡ 20.0 TPS LOCKED ARCHITECTURE',
  '🔮 BESPOKE CLIENT & SERVER MODS',
  '🛡️ FOLIA & PURPUR MULTITHREADED',
  '🌐 VELOCITY PROXY & REDIS CLUSTER',
  '💎 ZERO MAIN-THREAD BLOCKING',
];

const MARQUEE_ITEMS_2 = [
  '✦ TESTED UNDER 500+ PLAYER CONCURRENCY',
  '⚔️ CUSTOM KNOCKBACK & DUEL ENGINES',
  '📦 JAVA 21 & HIKARICP POOLING',
  '✦ AIKAR JVM FLAGS & LATENCY TUNING',
  '🛡️ 14-DAY POST-DEPLOYMENT WARRANTY',
  '💎 CLEAN CODE & FULL CONFIG.YML',
];

export const KineticBreak: React.FC = () => {
  return (
    <section
      className="relative py-12 sm:py-16 md:py-20 bg-[#0C0D11] border-y border-white/10 overflow-hidden select-none w-full max-w-[100vw]"
      aria-hidden="true"
    >
      {/* Subtle depth lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-24 -translate-y-1/2 w-80 h-32 bg-[#D7FF3F]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-80 h-32 bg-[#8B5CFF]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full overflow-hidden space-y-4 sm:space-y-5">
        {/* Row 1 — Moving Left (Filled Text) */}
        <div className="flex whitespace-nowrap overflow-hidden w-full">
          <div
            className="flex shrink-0 items-center animate-marquee-left font-mono font-bold uppercase tracking-wider text-white/80"
            style={{
              fontSize: 'clamp(12px, 1.25vw, 17px)',
              willChange: 'transform',
            }}
          >
            {/* Half 1 */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
              {MARQUEE_ITEMS_1.map((item, i) => (
                <React.Fragment key={`r1-a-${i}`}>
                  <span className="hover:text-[#D7FF3F] transition-colors duration-200 shrink-0">
                    {item}
                  </span>
                  <span className="text-[#D7FF3F] shrink-0 text-xs opacity-70">⚡</span>
                </React.Fragment>
              ))}
            </div>
            {/* Half 2 — Exact duplicate for seamless -50% loop */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
              {MARQUEE_ITEMS_1.map((item, i) => (
                <React.Fragment key={`r1-b-${i}`}>
                  <span className="hover:text-[#D7FF3F] transition-colors duration-200 shrink-0">
                    {item}
                  </span>
                  <span className="text-[#D7FF3F] shrink-0 text-xs opacity-70">⚡</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 — Moving Right (Outlined Text) */}
        <div className="flex whitespace-nowrap overflow-hidden w-full">
          <div
            className="flex shrink-0 items-center animate-marquee-right font-mono font-semibold uppercase tracking-widest"
            style={{
              fontSize: 'clamp(11px, 1.1vw, 15px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.28)',
              willChange: 'transform',
            }}
          >
            {/* Half 1 */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
              {MARQUEE_ITEMS_2.map((item, i) => (
                <React.Fragment key={`r2-a-${i}`}>
                  <span className="shrink-0">{item}</span>
                  <span
                    className="shrink-0 text-xs"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(139, 92, 255, 0.5)',
                    }}
                  >
                    ✦
                  </span>
                </React.Fragment>
              ))}
            </div>
            {/* Half 2 — Exact duplicate */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
              {MARQUEE_ITEMS_2.map((item, i) => (
                <React.Fragment key={`r2-b-${i}`}>
                  <span className="shrink-0">{item}</span>
                  <span
                    className="shrink-0 text-xs"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(139, 92, 255, 0.5)',
                    }}
                  >
                    ✦
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Balanced Supporting Label */}
      <div className="mt-8 sm:mt-10 flex justify-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15171D] border border-white/10 text-[10px] sm:text-[11px] font-mono tracking-widest text-white/50 uppercase shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3F] animate-pulse shrink-0" />
          <span>PRODUCTION-READY MINECRAFT ENGINEERING</span>
        </div>
      </div>
    </section>
  );
};


