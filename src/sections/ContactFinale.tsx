import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, Mail, MessageSquare, Terminal, Shield } from 'lucide-react';

interface ContactFinaleProps {
  onOpenHireUs: () => void;
  onOpenAccount: () => void;
  companyEmail: string;
}

export const ContactFinale: React.FC<ContactFinaleProps> = ({
  onOpenHireUs,
  onOpenAccount,
  companyEmail,
}) => {
  const containerRef = useScrollReveal();

  return (
    <section id="contact" className="py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div
        ref={containerRef}
        data-reveal
        className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#12151E] via-[#0A0C10] to-[#07080B] p-8 md:p-16 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)] mc-panel mc-panel-lime"
      >
        {/* Subtle Voxel Grid in Background */}
        <div className="absolute inset-0 mc-voxel-grid pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-xs font-mono text-[#00D2FF] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />
            <span>COMMISSION DESK · IMMEDIATE DISPATCH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase font-display leading-[1.08]">
            READY TO POWER YOUR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] via-white to-[#8B5CFF]">
              MINECRAFT WORLD?
            </span>
          </h2>

          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Whether you need a custom core system, Velocity Limbo architecture, or technical consultation
            for high-concurrency player events, our engineering team is ready.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenHireUs}
              className="btn-primary text-xs px-8 py-3.5 shadow-xl shadow-[#00D2FF]/25"
            >
              <span>HIRE US</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAccount}
              className="btn-secondary text-xs px-7 py-3.5"
            >
              <MessageSquare className="w-4 h-4 text-[#8B5CFF]" />
              <span>OPEN SUPPORT TICKET</span>
            </button>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white/50">
            <a
              href={`mailto:${companyEmail}`}
              className="hover:text-[#00D2FF] transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#00D2FF]" />
              <span>Direct Dispatch: {companyEmail}</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <span>Response Time: Typically under 24 business hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};
