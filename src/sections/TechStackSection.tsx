import React from 'react';
import { Cpu, Zap, ShieldCheck, Database, Layers, CheckCircle2, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const TechStackSection: React.FC = () => {
  const containerRef = useScrollReveal();

  const metrics = [
    { label: 'SERVER TICK RATE', val: '20.0 TPS', desc: 'Zero main-thread blocking', color: 'text-emerald-400' },
    { label: 'CONCURRENCY THREADS', val: 'Java 21', desc: 'Virtual & async thread pools', color: 'text-[#38BDF8]' },
    { label: 'DATA PERSISTENCE', val: 'HikariCP', desc: 'MySQL, SQLite & H2 pooling', color: 'text-amber-400' },
    { label: 'WARRANTY INCLUDED', val: '14 Days', desc: 'Guaranteed post-launch hotfixes', color: 'text-purple-400' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Zero Main-Thread Lag',
      desc: 'All heavy calculations, database queries, and chunk lookups execute on asynchronous worker threads with CompletableFuture pipelines.',
    },
    {
      icon: Cpu,
      title: 'Folia & Paper 1.21 Native',
      desc: 'Architected for Folia regionized concurrency and modern Paper/Purpur builds (1.8.8 – 1.21.4) with clean separation of concerns.',
    },
    {
      icon: Database,
      title: 'High-Throughput Storage',
      desc: 'Production-tested HikariCP connection pooling supporting high-frequency player stat updates without SQLite database locking.',
    },
    {
      icon: Layers,
      title: 'Adventure & MiniMessage',
      desc: 'Native modern text formatting with RGB hex gradients, custom font glyphs, and seamless PlaceholderAPI integration.',
    },
  ];

  return (
    <section id="tech-stack" className="py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div ref={containerRef} data-reveal className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-xs font-mono text-[#38BDF8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MINECRAFT PERFORMANCE ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-minecraft">
            ENGINEERED FOR <span className="text-[#38BDF8]">20.0 TPS</span> STABILITY
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Standard plugins trigger tick drops, desyncs, and micro-stutters during high-intensity fights. Flix Studios software is benchmarked under simulated 100+ player concurrency before shipping.
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#11141E] border border-white/10 hover:border-[#38BDF8]/40 transition-all text-center space-y-1 group"
            >
              <span className="text-[10px] font-minecraft text-slate-400 uppercase tracking-wider block">
                {m.label}
              </span>
              <div className={`text-2xl sm:text-3xl font-black font-minecraft ${m.color}`}>
                {m.val}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#11141E]/90 border border-white/10 hover:border-white/20 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-minecraft mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
