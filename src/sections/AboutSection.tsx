import React from 'react';
import { ShieldCheck, Cpu, Code2, Users2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';

import { AboutPillarItem } from '../types/database';

interface AboutSectionProps {
  onOpenHireUs: () => void;
  paragraphs?: string[];
  pillars?: AboutPillarItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenHireUs, paragraphs, pillars: propPillars }) => {
  const leftRef = useScrollReveal();
  const pillarsRef = useStaggerReveal(100);

  const defaultPillars = [
    {
      title: 'Sensible Architecture',
      desc: 'We write clean, modular Java 21 and modloader implementations with asynchronous data handling, clean separation of concerns, and hot-reloadable configurations.',
      icon: Code2,
    },
    {
      title: 'Rigorous Testing',
      desc: 'Every plugin and mod is audited against tick latency, memory leaks, and concurrent player entity loads before it ever reaches your production server.',
      icon: Cpu,
    },
    {
      title: 'Clear Communication',
      desc: 'We confirm project scopes, mod loaders, and Minecraft versions in writing before coding. You receive direct progress updates and agreed milestones.',
      icon: Users2,
    },
    {
      title: 'Agreed Delivery Scope',
      desc: 'No false promises of indefinite free rewrites. We establish transparent project briefs, dependable delivery schedules, and dedicated bugfix support.',
      icon: ShieldCheck,
    },
  ];

  const pillarIcons = [Code2, Cpu, Users2, ShieldCheck];

  const activePillars = propPillars && propPillars.length > 0
    ? propPillars.map((p, idx) => ({
        title: p.title,
        desc: p.desc,
        icon: pillarIcons[idx % pillarIcons.length],
      }))
    : defaultPillars;

  const defaultParagraphs = [
    'Flix Studios focuses on building Minecraft server plugins, custom client and server mods, and fully configured server experiences tailored strictly to customer requirements.',
    'Rather than assembling throwaway scripts or using fragile workarounds, we treat Minecraft server development as disciplined software engineering. Our plugins utilize modern Paper, Purpur, and Spigot APIs, asynchronous database pools, and clean event architectures designed to scale under heavy player concurrency.',
    'Whether you need an original tournament duel system, a custom modpack mechanic on Fabric or Forge, or an entire multi-server Velocity proxy setup, we prioritize sensible architecture, maintainable implementation, and transparent communication from initial scoping through delivery.',
  ];

  const activeParagraphs = paragraphs && paragraphs.length > 0 ? paragraphs : defaultParagraphs;

  return (
    <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Studio Explanation */}
        <div ref={leftRef} data-reveal className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-xs font-mono text-[#00D2FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
            <span>ABOUT FLIX STUDIOS</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] uppercase">
            ENGINEERING DEPENDABLE MINECRAFT EXPERIENCES
          </h2>

          <div className="space-y-4 text-sm md:text-base text-white/70 leading-relaxed font-normal">
            {activeParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenHireUs}
              className="btn-primary text-xs px-7 py-3.5 shadow-lg shadow-[#00D2FF]/20"
            >
              <span>Hire Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#process"
              className="btn-secondary text-xs px-6 py-3.5"
            >
              <span>Explore Our Workflow →</span>
            </a>
          </div>
        </div>

        {/* Right Column: Four Engineering Pillars Grid */}
        <div ref={pillarsRef} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activePillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                data-stagger
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{p.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}

          {/* Standards Summary Banner */}
          <div className="sm:col-span-2 p-5 rounded-3xl bg-[#0E0F14] border border-[#00D2FF]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00D2FF]">
              <CheckCircle2 className="w-4 h-4" />
              <span>THE FLIX STUDIOS STANDARD</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Clean Java 21 codebase • Annotated YAML configs • Thread-safe async storage • Zero unprofiled main-thread delays • Agreed SLA scope.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
