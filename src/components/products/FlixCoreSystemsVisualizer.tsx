import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  Swords,
  Layers,
  Shield,
  Zap,
  Server,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
} from 'lucide-react';

interface SystemModule {
  id: string;
  name: string;
  category: string;
  badge: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  description: string;
  technicalSpecs: { label: string; value: string }[];
  verifiedFeatures: string[];
  productLink: string;
}

const GENUINE_SYSTEM_MODULES: SystemModule[] = [
  {
    id: 'combat-kits',
    name: 'Custom Combat & Kit Engine',
    category: 'PRACTICE CORE',
    badge: '10+ KITS · UI PRESETS',
    accent: '#D7FF3F',
    icon: Swords,
    headline: '10+ Balanced Combat Kits & Armor Trim Customizer',
    description:
      'Provides customizable competitive duel ladders (Nodebuff, Crystal, Mace, Sumo, Spleef) with UI-driven kit editors, custom knockback profiles, and rank-gated Armor Trim cosmetic progression.',
    technicalSpecs: [
      { label: 'SUPPORTED MODES', value: '10 Game Modes (FFA, 1v1, Sumo, Bedwars)' },
      { label: 'KIT EDITOR', value: 'Interactive In-Game GUI + Preset YAML' },
      { label: 'KNOCKBACK', value: 'Per-Kit Mathematical Knockback Profiles' },
    ],
    verifiedFeatures: [
      '10+ pre-balanced combat kits ready out of the box',
      'Armor trim customizer linked to server permissions & ranks',
      'Independent custom kit storage per player profile',
    ],
    productLink: '/products/flixcore-plugin',
  },
  {
    id: 'matchmaking',
    name: 'Tier-Based Matchmaking',
    category: 'MATCHMAKING ENGINE',
    badge: 'HT5 TIERS · 5s EXPANSION',
    accent: '#8B5CFF',
    icon: Zap,
    headline: 'Skill-Based Elo Ladders & Expanding Queue Windows',
    description:
      'Non-blocking async queue algorithm matches players based on kit-specific skill tiers. Dynamically expands the search window every 5 seconds to eliminate queue stagnation while preserving fair matchmaking.',
    technicalSpecs: [
      { label: 'QUEUE ALGORITHM', value: 'Async 5-Second Window Expansion' },
      { label: 'TIER RANKS', value: 'Kit-Specific HT5 Competitive Ladders' },
      { label: 'MATCH HISTORY', value: 'Async Sub-Second Match Resolution' },
    ],
    verifiedFeatures: [
      'Auto GG & Auto Requeue player toggle settings',
      'Tier-first priority pairing with timeout fallback',
      'Action queue one-click join via inventory GUI',
    ],
    productLink: '/products/flixcore-plugin',
  },
  {
    id: 'arena-safety',
    name: 'Mathematical Arena Bounding',
    category: 'SECURITY & INTEGRITY',
    badge: 'ArenaSafetyHelper · ANTI-ESCAPE',
    accent: '#D7FF3F',
    icon: Shield,
    headline: 'Strict Vector Boundary Checking & In-Combat Lockdown',
    description:
      'Mathematical boundary enforcement powered by ArenaSafetyHelper. Restricts player movement to assigned duel bounding boxes, blocks unauthorized commands during active duels, and jails glitchers without false positives.',
    technicalSpecs: [
      { label: 'BOUNDING ENGINE', value: 'ArenaSafetyHelper Vector Clamping' },
      { label: 'COMMAND JAIL', value: 'Strict Whitelist During Active Combat' },
      { label: 'ESCAPE MITIGATION', value: 'Instant Velocity Cancel & Re-center' },
    ],
    verifiedFeatures: [
      'In-combat command lockdown to prevent escape exploits',
      'Zero-lag mathematical vector validation on player movement',
      'Automatic boundary adjustment for multi-arena world setups',
    ],
    productLink: '/products/flixcore-plugin',
  },
  {
    id: 'tournaments',
    name: 'Event & Tournament Sequencer',
    category: 'AUTOMATION ENGINE',
    badge: 'AUTO-BRACKETS · EVENTS',
    accent: '#8B5CFF',
    icon: Trophy,
    headline: 'Solo, Party & Clan Brackets with Cinematic Tension',
    description:
      'Automated tournament orchestrator with sliding cage doors, blind tension sequences, and countdown timers. Handles single and double elimination brackets for Sumo, Spleef, and custom duel modes.',
    technicalSpecs: [
      { label: 'BRACKET TYPES', value: 'Solo, Party (2v2-4v4) & Clan Tournaments' },
      { label: 'SEQUENCING', value: 'BlockDisplay Sliding Doors & Blindness' },
      { label: 'REPLAY / REWIND', value: 'Parabolic Round Rewind & Totem Pops' },
    ],
    verifiedFeatures: [
      'Automated tournament bracket progression with zero admin intervention',
      'BlockDisplay underground elevator platforms & visual gates',
      'Clan system points integration for tournament victories',
    ],
    productLink: '/products/flixcore-plugin',
  },
  {
    id: 'async-engine',
    name: '20.0 TPS Async Engine',
    category: 'PERFORMANCE CORE',
    badge: 'HikariCP · SUB-SECOND RESTORE',
    accent: '#D7FF3F',
    icon: Database,
    headline: 'High-Throughput HikariCP Storage & Chunk Preloading',
    description:
      'Engineered for sustained 20.0 TPS under intense duel loads. Offloads all database transactions to asynchronous HikariCP worker threads, with Chunky arena preloading to eliminate duel chunk-generation lag.',
    technicalSpecs: [
      { label: 'STORAGE ENGINE', value: 'HikariCP Async MySQL / H2 Pool' },
      { label: 'CHUNK LIFECYCLE', value: 'Chunky Pre-generation & Cache Lock' },
      { label: 'ROLLBACK SPEED', value: 'Sub-Second Block State Restoration' },
    ],
    verifiedFeatures: [
      'Zero main-thread blocking during player joins or match saves',
      'Sub-second arena reset for build-UHC and breakable blocks',
      'Low memory footprint with automatic idle arena unloading',
    ],
    productLink: '/products/flixcore-plugin',
  },
  {
    id: 'network-bridge',
    name: 'Velocity Network & Limbo Bridge',
    category: 'INFRASTRUCTURE',
    badge: 'VELOCITY · MULTI-PROXY',
    accent: '#8B5CFF',
    icon: Server,
    headline: 'Multi-Proxy Handshake Queues & Redis Sync',
    description:
      'Built-in support for Velocity proxy networks and Paper/Purpur/Folia backends. Holds connecting players in virtual limbo queues during lobby lag spikes and synchronizes player stats across multi-server installations.',
    technicalSpecs: [
      { label: 'PROXY COMPLIANCE', value: 'Velocity Proxy & BungeeCord' },
      { label: 'BACKEND COMPLIANCE', value: 'Paper, Purpur, Spigot, Folia 1.8-1.21' },
      { label: 'SYNC PROTOCOL', value: 'Redis Pub/Sub Heartbeat Monitoring' },
    ],
    verifiedFeatures: [
      'Velocity Limbo queue protects backend servers during peak rushes',
      'Cross-server player stats and clan tag synchronization',
      'Folia compatible event handling for modern multi-threaded servers',
    ],
    productLink: '/products/flixcore-plugin',
  },
];

export const FlixCoreSystemsVisualizer: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('combat-kits');

  const activeModule =
    GENUINE_SYSTEM_MODULES.find((m) => m.id === activeModuleId) || GENUINE_SYSTEM_MODULES[0];
  const IconComponent = activeModule.icon;

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#0B0C0F] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D7FF3F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-[11px] font-mono text-[#D7FF3F] mb-2 font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>FLIXCORE PLUGIN ARCHITECTURE & SYSTEMS</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Genuine Product Systems & Architecture Flow
          </h3>
          <p className="text-xs font-mono text-white/50 mt-1">
            Explore verified components powering FlixCore Plugin in live production server installations.
          </p>
        </div>

        <Link
          href="/products/flixcore-plugin"
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-bold text-white inline-flex items-center gap-2 transition-all group"
        >
          <span>View Full FlixCore Specification</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D7FF3F] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Main Grid: Interactive Module Tabs (Left) + Detailed Deep-Dive Panel (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 6 System Module Selectors */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {GENUINE_SYSTEM_MODULES.map((mod) => {
            const isSelected = mod.id === activeModule.id;
            const ModIcon = mod.icon;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModuleId(mod.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-[#15161D] border-[#D7FF3F] shadow-[0_0_20px_rgba(215,255,63,0.15)] ring-1 ring-[#D7FF3F]/50'
                    : 'bg-[#0E0F14] border-white/10 hover:border-white/20 hover:bg-[#121318]'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#D7FF3F] text-black font-bold'
                      : 'bg-white/5 text-white/70 border border-white/10'
                  }`}
                >
                  <ModIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block truncate">
                      {mod.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#D7FF3F]/20 text-[#D7FF3F] font-bold'
                          : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {mod.badge.split('·')[0].trim()}
                    </span>
                  </div>
                  <h4
                    className={`text-xs font-bold truncate mt-0.5 ${
                      isSelected ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {mod.name}
                  </h4>
                </div>

                {isSelected && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D7FF3F] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Active System Deep Dive */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#121319] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{
                  backgroundColor: `${activeModule.accent}20`,
                  color: activeModule.accent,
                  border: `1px solid ${activeModule.accent}40`,
                }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                  {activeModule.category}
                </span>
                <h4 className="text-base font-extrabold text-white">{activeModule.name}</h4>
              </div>
            </div>

            <span
              className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold"
              style={{
                backgroundColor: `${activeModule.accent}15`,
                color: activeModule.accent,
                border: `1px solid ${activeModule.accent}30`,
              }}
            >
              {activeModule.badge}
            </span>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white mb-2">{activeModule.headline}</h5>
            <p className="text-xs text-white/70 leading-relaxed">{activeModule.description}</p>
          </div>

          {/* Verified Technical Specs Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
              VERIFIED TECHNICAL RUNTIME SPECIFICATION
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {activeModule.technicalSpecs.map((spec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#0A0B0E] border border-white/5 space-y-1"
                >
                  <span className="text-[9px] font-mono text-white/40 block">{spec.label}</span>
                  <span className="text-[11px] font-bold text-white block leading-snug">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Capabilities Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
              CONFIRMED PRODUCTION CAPABILITIES
            </span>
            <ul className="space-y-1.5">
              {activeModule.verifiedFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: activeModule.accent }}
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
            <span className="text-[11px] font-mono text-white/40">
              Verified in FlixCore Plugin v2.4.0 Production Build
            </span>
            <Link
              href={activeModule.productLink}
              className="px-4 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf430] text-black text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore in Product Detail</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
