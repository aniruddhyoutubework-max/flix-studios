import React from 'react';
import { HeroCanvas } from './HeroCanvas';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Star, MessageSquare } from 'lucide-react';

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
    <section id="hero" className="relative min-h-[70vh] flex flex-col items-center justify-center pt-28 pb-12 px-4 md:px-8 overflow-hidden bg-[#0A0D14]">
      {/* Minecraft Environment Banner Background with Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/products/flixcore/cover.png"
          alt="Minecraft World Background"
          className="w-full h-full object-cover opacity-20 filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14]/90 via-[#0A0D14]/80 to-[#0A0D14]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0A0D14]/60 to-[#0A0D14]" />
      </div>

      {/* High-Performance 2D Minecraft Pixel Canvas Background (Zero Lag) */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <HeroCanvas />
      </div>

      {/* Foreground Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
        {/* Top Studio Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121624]/90 border border-[#38BDF8]/40 shadow-md backdrop-blur-sm">
          <span className="w-2 h-2 rounded-sm bg-[#38BDF8] animate-pulse shrink-0" />
          <span className="text-[11px] font-minecraft tracking-wider text-slate-200 uppercase">
            FLIX STUDIOS · MINECRAFT STORE
          </span>
        </div>

        {/* Primary Headline */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.2] font-minecraft">
            {headlineOverride ? (
              <span>{headlineOverride}</span>
            ) : (
              <>
                HIGH QUALITY MINECRAFT
                <br />
                <span className="text-[#38BDF8]">PLUGINS, MODS &amp; SETUPS</span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed pt-1">
            {subheadlineOverride ||
              'Flix Studios develops high-performance Minecraft plugins, custom mods, and complete server networks. Built for 20.0 TPS with zero main-thread lag.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#products"
            className="px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#38BDF8] text-white hover:text-black font-minecraft text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#0284C7]/20 flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>EXPLORE STORE</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenHireUs}
            className="px-6 py-3 rounded-xl bg-[#121624] hover:bg-[#1A2033] border border-white/10 hover:border-[#38BDF8]/50 text-white font-minecraft text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#38BDF8]" />
            <span>{ctaPrimaryOverride || 'HIRE US'}</span>
          </button>

          <a
            href="https://discord.gg/flixcore"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-minecraft text-xs transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
            <span>DISCORD</span>
          </a>
        </div>

        {/* Clean, Single-Line Trust Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-minecraft text-slate-300">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>5.0 / 5.0 RATING</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-400" />
            <span className="text-emerald-400">20.0 TPS ASYNC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>14-DAY WARRANTY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOLIA &amp; PAPER</span>
          </div>
        </div>
      </div>
    </section>
  );
};
