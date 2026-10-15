import React, { useState } from 'react';
import { Cpu, Server, Database, ShieldAlert, Terminal, Layers } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number | null>(0);

  const capabilities = [
    {
      num: '01',
      title: 'Bespoke Minecraft Plugin Development',
      summary: 'Tailor-made plugins designed around specific server game-modes, economy rules, and combat dynamics.',
      details:
        'Engineered in modern Java (Java 17 / 21) using Paper and Purpur APIs. We avoid monolithic, unmaintainable classes in favor of modular listeners, decoupled event managers, and hot-reloadable YAML/HOCON configuration structures.',
      tags: ['Paper API', 'Purpur', 'Java 21', 'Custom Commands', 'Config Engines'],
      icon: Cpu,
    },
    {
      num: '02',
      title: 'Velocity Proxy & Cross-Server Architecture',
      summary: 'High-concurrency Redis pub/sub messaging and Limbo instance staging for frictionless player transfer.',
      details:
        'Connect multiple lobby, arena, and event instances into a unified server network. Includes automated heartbeat monitoring, failover routing, and synchronized global tab lists and chat channels.',
      tags: ['Velocity', 'Redis Pub/Sub', 'Limbo Staging', 'Cross-Server Party', 'Heartbeats'],
      icon: Server,
    },
    {
      num: '03',
      title: 'Non-Blocking Asynchronous Storage Engines',
      summary: 'Zero main-thread tick lag for database reads, player stats, Elo rankings, and match histories.',
      details:
        'All SQL operations are dispatched via connection-pooled HikariCP instances with automatic H2 local fallback. High-frequency statistics are cached in fast in-memory structures and flushed asynchronously in batches.',
      tags: ['HikariCP', 'MySQL / MariaDB', 'H2 Local', 'Async Batching', 'Elo Algorithms'],
      icon: Database,
    },
    {
      num: '04',
      title: 'Anti-Exploit, Packet Profiling & Tick Auditing',
      summary: 'Defensive architecture against packet exploits, inventory desyncs, and memory leaks.',
      details:
        'Rigorous stress-testing under simulated high latency and concurrent entity loads. Custom packet listener validation via ProtocolLib prevents illegal NBT injections and client crash exploits.',
      tags: ['ProtocolLib', 'Packet Interception', 'Spark Profiling', 'Tick Optimization'],
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="custom-dev" className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CFF]/10 border border-[#8B5CFF]/20 text-xs font-mono text-[#8B5CFF] mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>TECHNICAL DISCIPLINES</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          ENGINEERING CAPABILITIES
        </h2>
        <p className="text-sm md:text-base text-white/60 max-w-2xl mt-3 leading-relaxed">
          We operate at the convergence of game server mechanics, packet-level network protocols, and
          high-throughput database architecture.
        </p>
      </div>

      <div className="space-y-4">
        {capabilities.map((cap, idx) => {
          const isOpen = activeItem === idx;
          const Icon = cap.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-[#0E0F14] border-[#D7FF3F]/40 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setActiveItem(isOpen ? null : idx)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left gap-4"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="text-sm md:text-base font-mono font-bold text-[#D7FF3F]">
                    {cap.num}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hidden sm:block">
                    <Icon className="w-5 h-5 text-[#D7FF3F]" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-white tracking-tight">
                      {cap.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/50 mt-1">{cap.summary}</p>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full border border-white/15 flex items-center justify-center font-mono text-xs transition-transform ${
                    isOpen ? 'rotate-45 bg-[#D7FF3F] text-black border-[#D7FF3F]' : 'text-white/60'
                  }`}
                >
                  +
                </div>
              </button>

              {isOpen && (
                <div className="px-6 md:px-8 pb-8 pt-2 border-t border-white/5 space-y-4 animate-fade-in">
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed max-w-4xl">
                    {cap.details}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {cap.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
