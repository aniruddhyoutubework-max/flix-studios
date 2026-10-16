import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CheckCircle2, ArrowRight, ShieldCheck, Cpu, Code2, Terminal, Sparkles, Check } from 'lucide-react';
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
      title: 'SPECIFICATION & SCOPE',
      summary: 'Confirm gameplay mechanics, Minecraft versions & network topology.',
      desc: 'We review your gameplay rules, concurrency targets, target API (Paper, Purpur, Folia, Fabric), and network topology. All requirements and edge cases are confirmed in writing before coding begins.',
      checklist: ['Gameplay mechanic scoping', 'Version compatibility targets', 'Edge-case boundary mapping'],
    },
    {
      num: '02',
      title: 'ARCHITECTURE & DATA DESIGN',
      summary: 'Thread-safe persistence, Redis channels, and permission hierarchies.',
      desc: 'Designing asynchronous storage schemas (MySQL/H2 with HikariCP), Redis pub/sub messaging channels, and LuckPerms permission trees. Clean separation of concerns ensures zero main-thread tick lag.',
      checklist: ['HikariCP connection pool', 'Redis pub/sub channels', 'Granular permission trees'],
    },
    {
      num: '03',
      title: 'JAVA 21 & API DEVELOPMENT',
      summary: 'Clean, asynchronous implementation with modern Minecraft APIs.',
      desc: 'Engineered strictly in clean, documented Java 21 using Paper/Purpur/Folia or Fabric APIs. Asynchronous event dispatching, thread-safe memory models, and MiniMessage text formatting.',
      checklist: ['Modern Paper & Folia APIs', 'Asynchronous thread pools', 'MiniMessage & custom fonts'],
    },
    {
      num: '04',
      title: 'CONCURRENCY & SPARK TESTING',
      summary: 'Profile tick latency, memory stability, and packet stress tests.',
      desc: 'Subjecting the software to high-concurrency simulation, Spark tick profiling, memory leak detection, inventory desync audits, and multi-version cross verification (1.8.8 through 1.21.4).',
      checklist: ['Spark tick & memory profiling', 'Packet stress testing', 'Multi-version compatibility audits'],
    },
    {
      num: '05',
      title: 'PRODUCTION DELIVERY & DOCS',
      summary: 'Compiled JAR build, annotated config.yml, and admin guide.',
      desc: 'Delivery of optimized production JAR builds, fully annotated configuration templates, permission node references, and setup documentation for your staff.',
      checklist: ['Optimized production JAR', 'Annotated config.yml files', 'Staff commands & permissions guide'],
    },
    {
      num: '06',
      title: 'POST-DELIVERY BUGFIX WARRANTY',
      summary: '14-day warranty and active Minecraft update support.',
      desc: '14-day post-delivery bugfix warranty ensuring seamless operation in your production environment, quick hotfixes, and update compatibility support.',
      checklist: ['14-day bugfix warranty', 'Production hotfix support', 'Paper update compatibility audits'],
    },
  ];

  const steps = stages && stages.length > 0 ? stages : defaultSteps;

  return (
    <section id="process" className="py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div ref={headerRef} data-reveal className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-xs font-mono text-[#38BDF8] mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>MINECRAFT ENGINEERING METHODOLOGY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-minecraft">
            HOW WE BUILD YOUR SOFTWARE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed font-sans">
            From technical requirement scoping to production deployment, our disciplined workflow guarantees 20.0 TPS stability and maintainable code.
          </p>
        </div>

        <button
          onClick={onOpenHireUs}
          className="px-5 py-3 rounded-xl bg-[#0284C7] hover:bg-[#38BDF8] text-white hover:text-black font-minecraft font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <span>Commission a Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Clean 2-Column Process Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Step Deep Dive Card */}
        <div className="lg:col-span-5 rounded-2xl bg-[#11141E] border border-white/10 p-6 space-y-5 text-left shadow-xl sticky top-24">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
              STAGE {steps[activeStep].num} OF {String(steps.length).padStart(2, '0')}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
              Standard SLA
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-minecraft">
              {steps[activeStep].title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {steps[activeStep].desc}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              Verified Deliverables:
            </span>
            <div className="space-y-2">
              {steps[activeStep].checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 font-mono">
                  <div className="w-4 h-4 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00D2FF] shrink-0" />
            <span>Includes 14-day warranty &amp; post-delivery bugfix guarantee</span>
          </div>
        </div>

        {/* Right Column: Step Selection List */}
        <div className="lg:col-span-7 space-y-3 text-left">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#00D2FF] bg-[#121624] shadow-lg shadow-[#00D2FF]/10'
                    : 'bg-[#0E121E] border-white/10 hover:border-white/20 hover:bg-[#121624]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                        isSelected ? 'bg-[#00D2FF] text-[#08090B]' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {step.num}
                    </span>
                    <h4 className={`text-sm sm:text-base font-bold ${isSelected ? 'text-[#00D2FF]' : 'text-white'}`}>
                      {step.title}
                    </h4>
                  </div>

                  <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                    Click to view
                  </span>
                </div>

                <p className="text-xs text-slate-400 pt-2 line-clamp-1 font-sans pl-11">
                  {step.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
