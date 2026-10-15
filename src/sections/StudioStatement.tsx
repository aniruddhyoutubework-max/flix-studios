import React from 'react';
import { SITE_CONFIG } from '../config/site';

export const StudioStatement: React.FC = () => {
  return (
    <section id="studio" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16 bg-[#08090B] flex items-center justify-center overflow-hidden">
      {/* Subtle Atmospheric Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#8B5CFF]/15 to-[#D7FF3F]/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#9FA2AD] tracking-[0.3em] uppercase mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>STUDIO CREED</span>
        </div>

        {/* Scaled Editorial Statement with layered contrast */}
        <blockquote className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-[-0.02em] uppercase text-[#F4F3EE]">
          <span className="block opacity-40 hover:opacity-100 transition-opacity duration-500">
            WE BELIEVE THE INTERNET
          </span>
          <span className="block my-2 text-gradient-lime">
            SHOULD BE FELT,
          </span>
          <span className="block opacity-40 hover:opacity-100 transition-opacity duration-500">
            NOT JUST VIEWED.
          </span>
        </blockquote>

        <p className="mt-12 max-w-xl mx-auto text-sm sm:text-base text-[#9FA2AD] font-normal leading-relaxed">
          Static screens belong to yesterday. Today’s most commanding brands exist as dynamic, dimensional worlds that elicit visceral physical reactions.
        </p>

        {/* Minimal geometric anchor */}
        <div className="mt-14 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-xs text-[#D7FF3F] tracking-widest uppercase">
            FLIX STUDIOS MANIFESTO
          </span>
          <span className="h-px w-12 bg-white/20" />
        </div>
      </div>
    </section>
  );
};
