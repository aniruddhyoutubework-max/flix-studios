import React from 'react';
import { HeroCanvas } from './HeroCanvas';
import { ArrowRight, Terminal, Star, Sparkles, Shield, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onOpenHireUs: () => void;
  headlineOverride?: string;
  subheadlineOverride?: string;
  ctaPrimaryOverride?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenHireUs,
  headlineOverride,
  subheadlineOverride,
  ctaPrimaryOverride,
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 md:px-8 overflow-hidden">
      {/* Interactive 3D WebGL Showstopper Centerpiece in Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <HeroCanvas />
      </div>

      {/* Atmospheric Depth Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090B]/60 via-transparent to-[#08090B] pointer-events-none z-1" />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Availability / Services Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl animate-fade-in shadow-xl max-w-full">
          <span className="w-2 h-2 rounded-full bg-[#D7FF3F] animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-white/90 truncate">
            MINECRAFT PLUGINS · CUSTOM MODS · SERVER SETUPS
          </span>
        </div>

        {/* Primary Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
            {headlineOverride ? (
              <span>{headlineOverride}</span>
            ) : (
              <>
                WE DON'T JUST CREATE.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F4F3EE] to-white/70">
                  WE MOVE WORLDS.
                </span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-white/70 font-normal leading-relaxed pt-1 sm:pt-2">
            {subheadlineOverride ||
              'Flix Studios designs and engineers custom Minecraft server plugins, bespoke client/server mods, and complete server setups. Built for stability, performance, and maintainable architecture.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenHireUs}
            className="btn-primary text-xs px-7 py-3.5 shadow-xl shadow-[#D7FF3F]/25"
          >
            <span>{ctaPrimaryOverride || 'HIRE US'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="/products"
            className="btn-secondary text-xs px-6 py-3.5 border border-white/20 hover:border-[#D7FF3F]/40 shadow-xl"
          >
            <span>EXPLORE PRODUCTS</span>
            <ArrowRight className="w-4 h-4 text-[#D7FF3F]" />
          </a>

          <a
            href="#pricing"
            className="btn-secondary text-xs px-5 py-3.5"
          >
            <span>VIEW PRICING</span>
          </a>
        </div>

        {/* Three Core Services Badges */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono text-[#D7FF3F] block uppercase">CUSTOM PLUGINS</span>
            <span className="text-xs font-bold text-white">Paper, Purpur & Spigot</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono text-[#8B5CFF] block uppercase">CUSTOM MODS</span>
            <span className="text-xs font-bold text-white">Fabric, NeoForge, Forge</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono text-[#D7FF3F] block uppercase">SERVER SETUPS</span>
            <span className="text-xs font-bold text-white">Permissions, JVM & Tuning</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono text-white/50 block uppercase">TRANSPARENT PRICING</span>
            <span className="text-xs font-bold text-white">Fair & Agreed Scope</span>
          </div>
        </div>
      </div>
    </section>
  );
};
