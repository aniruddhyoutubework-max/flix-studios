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
  const gridRef = useStaggerReveal(120);

  const defaultServices = [
    {
      id: 'plugins',
      categoryParam: 'Custom Minecraft Plugin Development',
      badge: 'SERVER SOFTWARE',
      badgeColor: 'text-[#D7FF3F] bg-[#D7FF3F]/10 border-[#D7FF3F]/25',
      accentColor: '#D7FF3F',
      accentBorder: 'hover:border-[#D7FF3F]/50 hover:shadow-[0_0_35px_rgba(215,255,63,0.12)]',
      title: 'Custom Minecraft Plugin Development',
      subtitle: 'Paper, Purpur, Folia & Spigot APIs (1.8.8 – 1.21.4)',
      description:
        'We engineer maintainable, high-concurrency plugins built strictly to your server specifications. Every plugin utilizes asynchronous thread pools, event architectures, and clean separation of concerns with zero main-thread blocking.',
      icon: Cpu,
      highlights: [
        'Custom gameplay mechanics, combat systems & duel rules',
        'Server systems: lobbies, queues, rank management & arenas',
        'Intuitive custom commands, permissions & tab completion',
        'Fully configurable config.yml and customizable language files',
        'Asynchronous storage engines (MySQL / H2) with HikariCP pooling',
        'Third-party integrations: Discord webhooks, Tebex, Vault, PlaceholderAPI',
      ],
      scopeNote: 'Engineered in modern Java 21 with clean architecture and zero main-thread lag.',
    },
    {
      id: 'mods',
      categoryParam: 'Custom Minecraft Mod Development',
      badge: 'CLIENT & SERVER MODS',
      badgeColor: 'text-[#8B5CFF] bg-[#8B5CFF]/10 border-[#8B5CFF]/25',
      accentColor: '#8B5CFF',
      accentBorder: 'hover:border-[#8B5CFF]/50 hover:shadow-[0_0_35px_rgba(139,92,255,0.12)]',
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
        'Performance-optimized modpack integrations & server-side logic',
        'Dedicated configuration systems for singleplayer & multiplayer servers',
      ],
      scopeNote: 'Supported mod loader (Fabric/NeoForge/Forge) and version confirmed prior to development.',
    },
    {
      id: 'setup',
      categoryParam: 'Minecraft Server Setup & Configuration',
      badge: 'INFRASTRUCTURE & CONFIG',
      badgeColor: 'text-[#D7FF3F] bg-[#D7FF3F]/10 border-[#D7FF3F]/25',
      accentColor: '#D7FF3F',
      accentBorder: 'hover:border-[#D7FF3F]/50 hover:shadow-[0_0_35px_rgba(215,255,63,0.12)]',
      title: 'Minecraft Server Setup & Configuration',
      subtitle: 'Single-Instance to Multi-Server Velocity Proxy Networks',
      description:
        'We help customers architect and configure turnkey Minecraft servers. From high-speed Velocity proxies and LuckPerms rank hierarchies to Aikar JVM garbage collection tuning and automated backup routines.',
      icon: Server,
      highlights: [
        'Server core installation & optimized Aikar JVM tuning flags',
        'Plugin/mod installation, dependency resolution & compatibility audits',
        'Granular, secure permission hierarchies configured via LuckPerms',
        'Scoreboard, tablist, chat formatting & spawn protection setup',
        'Cross-server network linking: Velocity, BungeeCord, Redis pub/sub',
        'Automated local/cloud backup routines & security vulnerability checks',
      ],
      scopeNote: 'Turnkey deployment for new servers or full modernization for existing networks.',
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
      highlights: override.highlights && override.highlights.length > 0 ? override.highlights : def.highlights,
      scopeNote: override.scopeNote || def.scopeNote,
    };
  });

  return (
    <section id="services" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div ref={headerRef} data-reveal className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CFF]/10 border border-[#8B5CFF]/20 text-xs font-mono text-[#8B5CFF] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE STUDIO DISCIPLINES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            WHAT WE BUILD & DELIVER
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-2xl mt-2.5 leading-relaxed">
            Flix Studios focuses on three dedicated disciplines. We engineer maintainable,
            high-performance Minecraft software tailored strictly to your server's vision.
          </p>
        </div>

        <div className="text-xs font-mono text-white/50 border border-white/10 rounded-2xl p-4 bg-white/[0.03] max-w-sm self-start md:self-auto backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-bold mb-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D7FF3F]" />
            <span>CONFIRMED SPECIFICATION GUARANTEE</span>
          </div>
          <p className="leading-relaxed">
            All commissions include confirmed specifications, clean code delivery, and post-delivery bugfix warranty.
          </p>
        </div>
      </div>

      {/* Services Editorial 3-Column Grid */}
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((srv) => {
          const Icon = srv.icon;

          return (
            <div
              key={srv.id}
              data-stagger
              className={`rounded-3xl bg-[#0E0F14] border border-white/10 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group ${srv.accentBorder}`}
            >
              <div className="space-y-6">
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-bold border ${srv.badgeColor}`}
                  >
                    {srv.badge}
                  </span>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 group-hover:text-[#D7FF3F] group-hover:border-[#D7FF3F]/30 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Service Title & Subtitle */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#D7FF3F] transition-colors tracking-tight">
                    {srv.title}
                  </h3>
                  <p className="text-xs font-mono text-white/40 mt-1">{srv.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  {srv.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
                    Key Inclusions & Scope:
                  </span>
                  <ul className="space-y-2">
                    {srv.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/80 leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Footer with CTA */}
              <div className="pt-8 mt-8 border-t border-white/10 space-y-4">
                <p className="text-[11px] font-mono text-white/40 leading-relaxed italic">
                  {srv.scopeNote}
                </p>

                <button
                  type="button"
                  onClick={() => onOpenHireUsWithCategory(srv.categoryParam)}
                  className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-[#D7FF3F] hover:text-black border border-white/10 hover:border-[#D7FF3F] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all group-hover:bg-[#D7FF3F] group-hover:text-black group-hover:border-[#D7FF3F] cursor-pointer"
                >
                  <span>Hire Us for {srv.badge.split(' ')[0]}</span>
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
