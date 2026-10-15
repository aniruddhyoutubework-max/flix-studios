import React, { useState } from 'react';
import { MotionPlayer } from '../motion/components/MotionPlayer';
import { ProcessRadarScene } from '../motion/scenes/ProcessRadarScene';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CheckCircle2, Terminal, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

import { ProcessStageItem } from '../types/database';

interface ProcessProps {
  onOpenHireUs: () => void;
  stages?: ProcessStageItem[];
}

export const Process: React.FC<ProcessProps> = ({ onOpenHireUs, stages }) => {
  const [activeStep, setActiveStep] = useState(0);
  const headerRef = useScrollReveal();

  const defaultSteps = [
    {
      num: '01',
      title: 'REQUIREMENTS',
      summary: 'Understand the server, goals, requirements, and edge cases.',
      desc: 'We review your gameplay mechanics, player concurrency targets, existing server plugins, and network topology. We map out technical requirements and edge cases before writing a line of code.',
      checklist: ['Gameplay mechanic scoping', 'Version compatibility targets', 'Edge-case boundary mapping'],
    },
    {
      num: '02',
      title: 'ARCHITECTURE',
      summary: 'Plan the plugin structure, configuration, APIs, storage, and permissions.',
      desc: 'Designing the data model (MySQL/H2), event listeners, Redis messaging contracts, and permission hierarchies. Clean architecture guarantees maintainability as your server scales.',
      checklist: ['Thread-safe storage schema', 'Redis pub/sub channel specs', 'Granular permission trees'],
    },
    {
      num: '03',
      title: 'DEVELOPMENT',
      summary: 'Implement readable, maintainable Java using modern APIs.',
      desc: 'Coding in clean, documented Java 21 / Paper API with strict separation of concerns. No monolithic god-classes or unprofiled main-thread operations.',
      checklist: ['Modern Paper/Purpur API', 'Asynchronous task scheduling', 'MiniMessage & Font glyph integration'],
    },
    {
      num: '04',
      title: 'TESTING',
      summary: 'Check functionality, edge cases, permissions, performance risks, and compatibility.',
      desc: 'Subjecting the plugin to high-load packet profiling using Spark, simulated latency variance, inventory desync attacks, and permission inheritance audits.',
      checklist: ['Spark tick & memory profiling', 'Packet-injection stress tests', 'Multi-version cross-verification'],
    },
    {
      num: '05',
      title: 'DELIVERY',
      summary: 'Provide the plugin build, installation instructions, configuration guidance, and agreed docs.',
      desc: 'Providing compiled, optimized JAR builds, annotated YAML configuration files, command cheat sheets, and installation runbooks for your sysadmin team.',
      checklist: ['Optimized production JAR', 'Annotated config.yml templates', 'Admin & permission guide'],
    },
    {
      num: '06',
      title: 'UPDATES',
      summary: 'Handle maintenance, fixes, and updates according to the specific agreement for each project.',
      desc: 'Post-delivery maintenance ensuring compatibility with new Paper/Minecraft releases, emergency hotfixes, and agreed SLA scope adjustments.',
      checklist: ['Agreed SLA hotfix window', 'Major Minecraft update audits', 'Production issue escalation'],
    },
  ];

  const steps = stages && stages.length > 0 ? stages : defaultSteps;

  return (
    <section id="process" className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div ref={headerRef} data-reveal className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-xs font-mono text-[#D7FF3F] mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>DISCIPLINED METHODOLOGY</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            ENGINEERING WORKFLOW
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-xl mt-3 leading-relaxed">
            From technical requirements to multi-server deployment, our six-stage lifecycle eliminates
            guesswork and delivers dependable server software.
          </p>
        </div>

        <button
          onClick={onOpenHireUs}
          className="btn-primary self-start md:self-auto text-xs px-6 py-3"
        >
          <span>Hire Us</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Radar Motion Video */}
        <div className="lg:col-span-5 space-y-4">
          <MotionPlayer scene={ProcessRadarScene} aspectRatio="1/1" />
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white/60 space-y-2">
            <div className="flex items-center gap-2 text-[#D7FF3F] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SLA & SCOPING CLARITY</span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/50">
              Projects are scoped individually with agreed milestones. We provide dependable, transparent
              agreements without false promises of indefinite free labor or lifetime rewrites.
            </p>
          </div>
        </div>

        {/* Right Column: 6-Stage Timeline Breakdown */}
        <div className="lg:col-span-7 space-y-3">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0E0F14] border-[#D7FF3F]/50 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                        isSelected ? 'bg-[#D7FF3F] text-black' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {step.num}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">{step.title}</h3>
                  </div>

                  <span className="text-xs font-mono text-white/50 text-left sm:text-right">
                    {step.summary}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in">
                    <p className="text-xs text-white/70 leading-relaxed">{step.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {step.checklist.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex items-center gap-1.5 text-[11px] font-mono text-white/80"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D7FF3F] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
