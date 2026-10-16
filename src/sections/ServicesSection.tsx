import React from 'react';
import {
  Cpu,
  Layers,
  Server,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { ServiceContentItem } from '../types/database';

interface ServicesSectionProps {
  onOpenHireUsWithCategory: (category: string) => void;
  servicesContent?: ServiceContentItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenHireUsWithCategory,
  servicesContent,
}) => {
  const headerRef = useScrollReveal();
  const gridRef = useStaggerReveal(100);

  const defaultServices = [
    {
      id: 'plugins',
      categoryParam: 'Custom Minecraft Plugin Development',
      badge: 'SERVER SOFTWARE',
      badgeColor: 'text-[#00D2FF] bg-[#00D2FF]/10 border-[#00D2FF]/25',
      accentBorder: 'hover:border-[#00D2FF]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]',
      title: 'Custom Minecraft Plugin Development',
      subtitle: 'Paper, Purpur, Folia & Spigot APIs (1.8.8 – 1.21.4)',
      description:
        'We engineer maintainable, high-concurrency plugins built strictly to your server specifications. Every plugin utilizes asynchronous thread pools, event architectures, and clean separation of concerns with zero main-thread blocking.',
      icon: Cpu,
      highlights: [
        'Custom gameplay mechanics, combat systems & duel rules',
        'Server systems: lobbies, queues, rank management & arenas',
        'Fully configurable config.yml & customizable language files',
        'Asynchronous storage engines (MySQL / H2) with HikariCP',
        'Integrations: Discord webhooks, Tebex, Vault & PlaceholderAPI',
      ],
      scopeNote: 'Engineered in modern Java 21 with clean architecture and zero main-thread lag.',
      buttonLabel: 'Hire Us for SERVER',
    },
    {
      id: 'mods',
      categoryParam: 'Custom Minecraft Mod Development',
      badge: 'CLIENT & SERVER MODS',
      badgeColor: 'text-[#8B5CFF] bg-[#8B5CFF]/10 border-[#8B5CFF]/25',
      accentBorder: 'hover:border-[#8B5CFF]/50 hover:shadow-[0_0_30px_rgba(139,92,255,0.15)]',
      title: 'Custom Minecraft Mod Development',
      subtitle: 'Fabric, NeoForge, and Forge (1.16.5 – 1.21.1)',
      description:
        'We develop custom mods from concept to deliverable build. We verify loader compatibility, implement clean registry logic, custom rendering layers, and synchronize client-server states with packet-level precision.',
      icon: Layers,
      highlights: [
        'Custom items, blocks, weapons, armor & specialized tools',
        'Custom entity AI, animated bosses & procedural behaviors',
        'Bi-directional network packet handling & client/server sync',
        'Custom client HUDs, graphical interfaces & screen overlays',
        'Performance-optimized modpack integrations & configs',
      ],
      scopeNote: 'Supported mod loader (Fabric/NeoForge/Forge) and version confirmed prior to development.',
      buttonLabel: 'Hire Us for CLIENT',
    },
    {
      id: 'setup',
      categoryParam: 'Minecraft Server Setup & Configuration',
      badge: 'INFRASTRUCTURE & CONFIG',
      badgeColor: 'text-[#00D2FF] bg-[#00D2FF]/10 border-[#00D2FF]/25',
      accentBorder: 'hover:border-[#00D2FF]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]',
      title: 'Minecraft Server Setup & Configuration',
      subtitle: 'Single-Instance to Multi-Server Velocity Proxy Networks',
      description:
        'We help customers architect and configure turnkey Minecraft servers. From high-speed Velocity proxies and LuckPerms rank hierarchies to Aikar JVM garbage collection tuning and automated backup routines.',
      icon: Server,
      highlights: [
        'Server core installation & optimized Aikar JVM tuning flags',
        'Plugin/mod installation, dependency resolution & audits',
        'Granular, secure permission hierarchies configured via LuckPerms',
        'Cross-server network linking: Velocity, BungeeCord, Redis pub/sub',
        'Automated local/cloud backup routines & security vulnerability checks',
      ],
      scopeNote: 'Turnkey deployment for new servers or full modernization for existing networks.',
      buttonLabel: 'Hire Us for INFRASTRUCTURE',
    },
  ];

  const services = defaultServices.map((def) => {
    const override = servicesContent?.find((s) => s.id === def.id || s.categoryParam === def.categoryParam);
    if (!override) return def;
    return {
      ...def,
      title: override.title || def.title,
      subtitle: override.subtitle || def.subtitle,
      description: override.description || def.description,
      highlights: override.highlights?.length ? override.highlights : def.highlights,
    };
  });

  return (
    <section id="services" className="py-16 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div ref={headerRef} data-reveal className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-xs font-mono text-[#38BDF8] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE STUDIO DISCIPLINES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-minecraft">
            WHAT WE BUILD &amp; DELIVER
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed font-sans">
            Flix Studios focuses on three dedicated disciplines. We engineer maintainable,
            high-performance Minecraft software tailored strictly to your server's vision.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-300 border border-white/10 rounded-xl p-3.5 bg-[#11141E] max-w-sm self-start md:self-auto">
          <div className="flex items-center gap-2 text-white font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-minecraft text-[10px]">CONFIRMED SPECIFICATION GUARANTEE</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-400 font-sans">
            All commissions include confirmed specifications, clean code delivery, and post-delivery bugfix warranty.
          </p>
        </div>
      </div>

      {/* Services Clean 3-Column Grid (No code blocks or bloated boxes) */}
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((srv) => {
          const Icon = srv.icon;

          return (
            <div
              key={srv.id}
              data-stagger
              className={`rounded-2xl bg-[#11141E] border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl hover:border-[#38BDF8]/50`}
            >
              <div className="space-y-4 text-left">
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-minecraft tracking-wider font-bold border ${srv.badgeColor}`}
                  >
                    {srv.id === 'plugins' && '⚔️ '}
                    {srv.id === 'mods' && '🔮 '}
                    {srv.id === 'setup' && '🌐 '}
                    {srv.badge}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/40 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Service Title & Subtitle */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug font-minecraft">
                    {srv.title}
                  </h3>
                  <p className="text-xs font-mono text-[#38BDF8] mt-1">{srv.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {srv.description}
                </p>

                {/* Inclusions List */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    Key Inclusions &amp; Scope:
                  </span>
                  <ul className="space-y-1.5">
                    {srv.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Footer with Direct CTA Button */}
              <div className="pt-5 mt-5 border-t border-white/10 space-y-3 text-left">
                <p className="text-[10px] font-mono text-slate-400 leading-relaxed italic">
                  {srv.scopeNote}
                </p>

                <button
                  type="button"
                  onClick={() => onOpenHireUsWithCategory(srv.categoryParam)}
                  className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#38BDF8] text-white hover:text-black font-minecraft font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>{srv.buttonLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
