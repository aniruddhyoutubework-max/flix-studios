import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'wouter';
import {
  BookOpen,
  Terminal,
  Key,
  ShieldCheck,
  Layers,
  Swords,
  Users,
  Sparkles,
  Code,
  FileText,
  RefreshCw,
  Search,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Info,
  Flame,
  Shield,
  Zap,
  Award,
  ArrowUpRight,
  Menu,
  X,
  Compass,
  Settings,
  Volume2,
  Bookmark,
  CheckCircle2,
  Crosshair
} from 'lucide-react';
import { FlixCoreLogo } from '../components/FlixCoreLogo';

interface DocSection {
  id: string;
  title: string;
  category: 'Getting Started' | 'Core Systems' | 'Reference & Config';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const DOC_SECTIONS: DocSection[] = [
  // Getting Started
  { id: 'overview', title: 'Overview & Highlights', category: 'Getting Started', icon: Flame, description: 'Core feature highlights, performance guarantees, and architecture.' },
  { id: 'installation', title: 'Installation & License', category: 'Getting Started', icon: Key, description: 'Server requirements, dependencies, and license activation guide.' },
  
  // Core Systems
  { id: 'arenas', title: 'Arenas & Boundaries', category: 'Core Systems', icon: Shield, description: 'Arena creation, spawn points, corner boundaries, and fence borders.' },
  { id: 'kits', title: 'Kits & Layout Editor', category: 'Core Systems', icon: Layers, description: 'Inventory kit creation, rule flags, and player layout customization.' },
  { id: 'duels', title: 'Duels & Open Challenges', category: 'Core Systems', icon: Swords, description: 'Direct 1v1 challenges and server-wide broadcast open challenges.' },
  { id: 'queues', title: 'Matchmaking & Queues', category: 'Core Systems', icon: Compass, description: 'Ranked, unranked, 2v2 team queues, and surrender mechanics.' },
  { id: 'tiers', title: 'Tiers & Head Badges', category: 'Core Systems', icon: Award, description: '20-match placement system, LT5 to HT1 tiers, and floating nameplate badges.' },
  { id: 'parties-clans', title: 'Parties & Clan System', category: 'Core Systems', icon: Users, description: 'Party split fights, team duels, clan wars, alliances, and friendly fire.' },
  { id: 'cosmetics', title: 'Cosmetics & Settings', category: 'Core Systems', icon: Sparkles, description: 'Kill effects, kill sounds, death animations, arrow trails, and preferences.' },
  
  // Reference & Config
  { id: 'commands', title: 'Command Reference', category: 'Reference & Config', icon: Terminal, description: 'Comprehensive command list, aliases, parameters, and descriptions.' },
  { id: 'permissions', title: 'Permissions Guide', category: 'Reference & Config', icon: ShieldCheck, description: 'Staff, player defaults, and cosmetic permission nodes.' },
  { id: 'placeholders', title: 'PlaceholderAPI (PAPI)', category: 'Reference & Config', icon: Code, description: 'Scoreboard, tablist, and chat placeholder tags with live examples.' },
  { id: 'glyphs', title: 'Resource Pack Glyphs', category: 'Reference & Config', icon: FileText, description: 'Custom font glyph mappings and automatic unicode fallbacks.' },
  { id: 'updater', title: 'Auto-Updater & Maintenance', category: 'Reference & Config', icon: RefreshCw, description: 'Encrypted release verification and zero-downtime hot reloading.' },
];

export const DocsPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Extract section from URL (e.g. /docs/installation)
  const currentSectionId = useMemo(() => {
    const parts = location.split('/');
    if (parts[1] === 'docs' && parts[2]) {
      const match = DOC_SECTIONS.find((s) => s.id === parts[2]);
      if (match) return match.id;
    }
    return 'overview';
  }, [location]);

  const activeSection = DOC_SECTIONS.find((s) => s.id === currentSectionId) || DOC_SECTIONS[0];
  const activeIndex = DOC_SECTIONS.findIndex((s) => s.id === activeSection.id);
  const prevSection = activeIndex > 0 ? DOC_SECTIONS[activeIndex - 1] : null;
  const nextSection = activeIndex < DOC_SECTIONS.length - 1 ? DOC_SECTIONS[activeIndex + 1] : null;

  const handleSelectSection = (id: string) => {
    setLocation(`/docs/${id}`);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered list based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DOC_SECTIONS;
    const q = searchQuery.toLowerCase();
    return DOC_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const categories = ['Getting Started', 'Core Systems', 'Reference & Config'] as const;

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E2E8F0] selection:bg-[#00D2FF] selection:text-[#07090E]">
      {/* Top Docs Header */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3">
              <FlixCoreLogo size="sm" showWordmark={true} />
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                DOCS
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                v1.0.4
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation, commands, permissions..."
              className="w-full bg-[#11141E] border border-white/10 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#38BDF8] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              ← Studio Home
            </Link>
            <Link
              href="/products"
              className="hidden sm:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              Marketplace
            </Link>
            <a
              href="https://discord.gg/flixcore"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#5865F2]/20"
            >
              <span>Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://builtbybit.com/resources/flixcore"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#00D2FF] hover:bg-[#38BDF8] text-[#07090E] text-xs font-bold transition-all shadow-md shadow-[#00D2FF]/20 flex items-center gap-1.5"
            >
              <span>Buy FlixCore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto flex">
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:sticky top-[61px] left-0 h-[calc(100vh-61px)] w-72 bg-[#090C13] border-r border-white/10 z-30 overflow-y-auto p-4 transition-transform duration-300 ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Mobile search */}
          <div className="relative mb-4 md:hidden">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs..."
              className="w-full bg-[#11141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400"
            />
          </div>

          {/* Plugin Metadata Card */}
          <div className="p-3 rounded-xl bg-[#11141E] border border-white/10 mb-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF]">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white font-minecraft">FlixCore</h3>
                <p className="text-[10px] text-slate-400">Competitive Practice Engine</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5">
              <span>Paper / Purpur 1.21.x</span>
              <span className="text-[#38BDF8] font-mono">v1.0.4</span>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-6">
            {categories.map((category) => {
              const items = filteredSections.filter((s) => s.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 font-mono">
                    {category}
                  </p>
                  <ul className="space-y-1">
                    {items.map((section) => {
                      const Icon = section.icon;
                      const isActive = section.id === activeSection.id;
                      return (
                        <li key={section.id}>
                          <button
                            onClick={() => handleSelectSection(section.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                              isActive
                                ? 'bg-[#00D2FF]/15 text-[#38BDF8] border border-[#00D2FF]/30 shadow-sm shadow-[#00D2FF]/10 font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                              <span className="truncate">{section.title}</span>
                            </div>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>

          {/* Quick Links Footer in Sidebar */}
          <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400 space-y-2">
            <a
              href="https://discord.gg/flixcore"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between hover:text-[#5865F2] transition-colors"
            >
              <span>Need 1-on-1 Support?</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://builtbybit.com/resources/flixcore"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between hover:text-[#00D2FF] transition-colors"
            >
              <span>View on BuiltByBit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <Link href="/" className="hover:text-white transition-colors">
              Docs
            </Link>
            <span>/</span>
            <span className="text-[#38BDF8]">FlixCore</span>
            <span>/</span>
            <span className="text-white font-medium">{activeSection.title}</span>
          </div>

          {/* Section Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#11141E] to-[#151926] border border-white/10 mb-8 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#00D2FF]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] shrink-0">
                <activeSection.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#38BDF8] border border-white/10 uppercase tracking-wider">
                    {activeSection.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Version 1.0.4 · Paper/Purpur 1.21.x
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-minecraft tracking-tight">
                  {activeSection.title}
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  {activeSection.description}
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Section Content */}
          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            {/* 1. OVERVIEW */}
            {activeSection.id === 'overview' && (
              <>
                <div className="p-4 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-white flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#00D2FF] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#E0F2FE]">Official Buyer's Usage Manual</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      FlixCore is an enterprise-grade competitive practice and duels core engineered specifically for high-concurrency 1.21+ Minecraft networks (Paper, Purpur, Folia compatible).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-2 font-minecraft text-xs">
                      <Swords className="w-4 h-4 text-[#38BDF8]" /> Multi-Mode Practice Engine
                    </h3>
                    <p className="text-xs text-slate-400">
                      Supports Nodebuff, Gapple, UHC, SMP, Netherite Pot, Crystal PvP (CPvP), Axe/Shield, Spear/Mace, plus full support for unlimited custom kits.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-2 font-minecraft text-xs">
                      <Award className="w-4 h-4 text-[#38BDF8]" /> Competitive Tier System
                    </h3>
                    <p className="text-xs text-slate-400">
                      20-match placement phase, dynamic Elo rating calculations with K-factor scaling, LT5 to HT1 tiers, and live percentage progress bars.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-2 font-minecraft text-xs">
                      <ShieldCheck className="w-4 h-4 text-[#38BDF8]" /> Above-Head Floating Badges
                    </h3>
                    <p className="text-xs text-slate-400">
                      Displays player tier and kit icon floating directly above their player nameplate using custom resource pack glyphs or unicode symbols.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-2 font-minecraft text-xs">
                      <Compass className="w-4 h-4 text-[#38BDF8]" /> Smart Matchmaking
                    </h3>
                    <p className="text-xs text-slate-400">
                      Queue expansion algorithm prioritizes equal-tier opponents first, expanding search ranges dynamically to prevent dead queues.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-2 font-minecraft text-xs">
                      <Users className="w-4 h-4 text-[#38BDF8]" /> Party & Clan Ecosystem
                    </h3>
                    <p className="text-xs text-slate-400">
                      2v2 & 3v3 team duels, party splits, party FFA, clan wars, alliances, rivalries, and togglable friendly fire.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-2 font-minecraft text-xs">
                      <RefreshCw className="w-4 h-4 text-[#38BDF8]" /> Built-in Auto-Updater
                    </h3>
                    <p className="text-xs text-slate-400">
                      Background update checks, instant notifications, and one-command encrypted download & safe restart swap via <code className="text-[#38BDF8]">/fc update</code>.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                  <h3 className="text-sm font-bold text-white mb-2">Technical Specifications</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">PLATFORM</span>
                      <span className="text-white font-bold">Paper / Purpur</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">MINECRAFT</span>
                      <span className="text-white font-bold">1.21.1 – 1.21.4</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">JAVA RUNTIME</span>
                      <span className="text-white font-bold">Java 21 LTS</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">DATABASE</span>
                      <span className="text-white font-bold">HikariCP / SQLite / MySQL</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 2. INSTALLATION */}
            {activeSection.id === 'installation' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white mb-3">1. Server Requirements & Dependencies</h2>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-white font-bold block text-sm">Paper or Purpur 1.21.1+</span>
                        <span className="text-xs text-slate-400">Compiled with Java 21 LTS. Folia regionized threading supported.</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        Required
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-white font-bold block text-sm">PacketEvents (v2.13.0+)</span>
                        <span className="text-xs text-slate-400">Essential packet-level layer for scoreboard rendering and fast packet events.</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        Required
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-white font-bold block text-sm">PlaceholderAPI</span>
                        <span className="text-xs text-slate-400">Allows tablist, scoreboard, and chat placeholders via %flixcore_*%.</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        Required
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-white font-bold block text-sm">Vault & LuckPerms</span>
                        <span className="text-xs text-slate-400">Permission handling and optional economy integration.</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
                        Recommended
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-white font-bold block text-sm">FastAsyncWorldEdit (FAWE)</span>
                        <span className="text-xs text-slate-400">Enables high-speed schematic arena pasting and rollbacks.</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/10 text-xs">
                        Optional
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white mb-3">2. Step-by-Step Installation</h2>
                  <ol className="space-y-4">
                    <li className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">Download FlixCore</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Download <code className="text-[#38BDF8]">FlixCore.jar</code> from your BuiltByBit buyer dashboard or customer account portal. Drop it into your server's <code className="text-[#38BDF8]">plugins/</code> directory.
                        </p>
                      </div>
                    </li>

                    <li className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">Initial Launch</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Start your server once to generate default configuration directories and files, then safely stop it.
                        </p>
                      </div>
                    </li>

                    <li className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">Add License Key</h4>
                        <p className="text-xs text-slate-400 mt-1 mb-2">
                          Open <code className="text-[#38BDF8]">plugins/FlixCore/config.yml</code> and enter your unique license key:
                        </p>
                        <div className="relative group">
                          <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto">
                            license-key: "FLIX-XXXX-XXXX-XXXX"
                          </pre>
                          <button
                            onClick={() => handleCopy('license-key: "FLIX-XXXX-XXXX-XXXX"', 'cfg-lic')}
                            className="absolute right-2 top-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedKey === 'cfg-lic' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === 'cfg-lic' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </li>

                    <li className="p-4 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs flex items-center justify-center shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">Boot & Verification</h4>
                        <p className="text-xs text-slate-400 mt-1 mb-2">
                          Start your server. FlixCore will authenticate and verify the license in milliseconds:
                        </p>
                        <pre className="p-3 rounded-lg bg-black/80 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                          <span className="text-slate-400">[12:00:00 INFO]</span> [FlixCore] Authenticating product license with Supabase...{'\n'}
                          <span className="text-slate-400">[12:00:01 INFO]</span> <span className="text-emerald-400">[FlixCore] License verified successfully. Status: ACTIVE.</span>{'\n'}
                          <span className="text-slate-400">[12:00:01 INFO]</span> [FlixCore] Initializing HikariCP connection pool...{'\n'}
                          <span className="text-slate-400">[12:00:01 INFO]</span> <span className="text-[#38BDF8]">[FlixCore] FlixCore v1.0.4 has been enabled!</span>
                        </pre>
                      </div>
                    </li>
                  </ol>
                </div>
              </>
            )}

            {/* 3. ARENAS */}
            {activeSection.id === 'arenas' && (
              <>
                <p>
                  Arenas house match spawn positions, bounding boxes, spectator locations, and animated safety boundaries.
                </p>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-300">Arena Safety Guard</h4>
                    <p className="text-xs text-amber-200/90 mt-0.5">
                      Always set <code className="text-amber-100 font-mono">corner1</code> and <code className="text-amber-100 font-mono">corner2</code>! FlixCore includes an automated boundary listener that prevents players from clipping, glitching with pearls, or being knocked outside the arena play zone.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base">Arena Setup Commands</h3>
                  <div className="space-y-2">
                    {[
                      { cmd: '/arena create <name>', desc: 'Creates a new empty arena in the current world.' },
                      { cmd: '/arena pos1 <name>', desc: 'Sets Player 1 duel spawn coordinate and pitch/yaw.' },
                      { cmd: '/arena pos2 <name>', desc: 'Sets Player 2 duel spawn coordinate and pitch/yaw.' },
                      { cmd: '/arena centre <name>', desc: 'Sets the center point (used for spectator spawn & party fights).' },
                      { cmd: '/arena corner1 <name>', desc: 'Sets boundary Corner 1 (lower minimum XYZ limit).' },
                      { cmd: '/arena corner2 <name>', desc: 'Sets boundary Corner 2 (upper maximum XYZ limit).' },
                      { cmd: '/fwand <name>', desc: 'Configures FenceV2 animated holographic boundary blocks.' },
                      { cmd: '/setlobby', desc: 'Sets the global server lobby spawn point for players after matches.' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#11141E] border border-white/10 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <code className="text-xs font-mono text-[#38BDF8] font-bold block">{item.cmd}</code>
                          <span className="text-xs text-slate-400">{item.desc}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(item.cmd, `arena-${idx}`)}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === `arena-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 4. KITS */}
            {activeSection.id === 'kits' && (
              <>
                <p>
                  Kits dictate inventory contents, armor loadouts, offhand items, potion effects, and rule flags (buildable, combo, boxing, hunger, regen).
                </p>

                <div className="space-y-4">
                  <h3 className="font-bold text-white text-base">Creating a New Kit</h3>
                  <ol className="space-y-3 list-decimal list-inside text-xs text-slate-300 pl-2">
                    <li className="leading-relaxed">
                      Equip the exact armor, inventory slots, hotbar order, and offhand item you want the kit to provide.
                    </li>
                    <li className="leading-relaxed">
                      Type <code className="text-[#38BDF8] font-mono">/kit create &lt;kitname&gt;</code> to snapshot your inventory.
                    </li>
                    <li className="leading-relaxed">
                      Open <code className="text-[#38BDF8] font-mono">/kit edit &lt;kitname&gt;</code> or configure <code className="text-[#38BDF8] font-mono">kits.yml</code> to toggle specific gameplay flags.
                    </li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Available Kit Rule Flags</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-black/40 border border-white/5 flex justify-between">
                      <span className="text-white font-mono">combo</span>
                      <span className="text-slate-400">Zero hit-delay combat mechanics</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border border-white/5 flex justify-between">
                      <span className="text-white font-mono">boxing</span>
                      <span className="text-slate-400">100-hit count race, no health damage</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border border-white/5 flex justify-between">
                      <span className="text-white font-mono">buildable</span>
                      <span className="text-slate-400">Allows block placing/breaking in match</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border border-white/5 flex justify-between">
                      <span className="text-white font-mono">ranked</span>
                      <span className="text-slate-400">Enables competitive tier Elo queue</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30">
                  <h4 className="text-xs font-bold text-[#E0F2FE] mb-1">Player Kit Custom Layout Editor</h4>
                  <p className="text-xs text-slate-300">
                    Players can re-arrange items to match their personal hotbar preferences using <code className="text-[#38BDF8]">/kit editor</code> or by interacting with the kit NPC in the lobby. Layouts are saved asynchronously into SQLite/MySQL.
                  </p>
                </div>
              </>
            )}

            {/* 5. DUELS & OPEN CHALLENGES (STRICTLY NO BOT) */}
            {activeSection.id === 'duels' && (
              <>
                <p>
                  FlixCore offers seamless direct matchmaking and server-wide open broadcast challenges with zero delay.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center mb-3">
                      <Swords className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Direct 1v1 Duels</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Challenge any player directly. Opens a clean GUI with custom kit selection, arena voting, and rounds option (BO1, BO3, BO5).
                    </p>
                    <code className="text-xs font-mono text-[#38BDF8] bg-black/50 px-2 py-1 rounded block">
                      /duel &lt;player&gt;
                    </code>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Server-Wide Open Challenges</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Broadcast an open challenge to all active players. Anyone in chat can click the interactive JSON component to instantly accept.
                    </p>
                    <code className="text-xs font-mono text-emerald-400 bg-black/50 px-2 py-1 rounded block">
                      /openchallenge &lt;kitname&gt;
                    </code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Spectator Mode</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Spectators can watch live matches in real time without interfering with hitboxes or arrow trajectories:
                  </p>
                  <code className="text-xs font-mono text-[#38BDF8] bg-black/50 px-2 py-1 rounded inline-block">
                    /spectate [player]  (Alias: /spec)
                  </code>
                </div>
              </>
            )}

            {/* 6. QUEUES */}
            {activeSection.id === 'queues' && (
              <>
                <p>
                  FlixCore includes three dedicated matchmaking queues: Unranked, Ranked (Competitive), and 2v2 Team Queues.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">Unranked Queue</h4>
                      <code className="text-xs font-mono text-[#38BDF8]">/unranked (Alias: /ur)</code>
                    </div>
                    <p className="text-xs text-slate-400">
                      Casual matches with instant pairing. Does not affect tier rank or placement progress. Right-click the Unranked Compass spawn item to open the queue selector GUI.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">Ranked Queue</h4>
                      <code className="text-xs font-mono text-amber-400">/ranked</code>
                    </div>
                    <p className="text-xs text-slate-400">
                      Competitive matches that count toward the 20-match placement phase and tier Elo ratings. Utilizes smart queue expansion to find matched players within your skill bracket.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">Team Queue</h4>
                      <code className="text-xs font-mono text-emerald-400">/teamqueue (Alias: /tq)</code>
                    </div>
                    <p className="text-xs text-slate-400">
                      Allows parties of 2 or duo pairs to queue against other teams across all competitive team-compatible kits.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">Surrender & Forfeit</h4>
                      <code className="text-xs font-mono text-red-400">/surrender (Alias: /ff, /leave)</code>
                    </div>
                    <p className="text-xs text-slate-400">
                      Allows a player or team to forfeit an ongoing match cleanly without having to disconnect or crash their client.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* 7. TIERS & FLOATING BADGES */}
            {activeSection.id === 'tiers' && (
              <>
                <p>
                  FlixCore incorporates a tier progression system modeled after top competitive Minecraft practice networks.
                </p>

                {/* Placement rules */}
                <div className="p-5 rounded-xl bg-[#11141E] border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white">Tier Progression Architecture</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[#38BDF8] font-bold block mb-1">1. Placement Phase</span>
                      <span className="text-slate-400">20 valid ranked matches required per kit mode before an initial tier is awarded.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-amber-400 font-bold block mb-1">2. Initial Cap: HT3</span>
                      <span className="text-slate-400">Placement results cannot exceed High Tier 3 (HT3), protecting top ranks from lucky win-streaks.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-emerald-400 font-bold block mb-1">3. Dynamic Elo</span>
                      <span className="text-slate-400">Subsequent matches dynamically scale Elo based on opponent rating disparity and K-factors.</span>
                    </div>
                  </div>
                </div>

                {/* Visual Tier Ladder */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Available Tier Ladder</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300">
                      LT5 (Novice)
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300">
                      LT4
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300">
                      LT3
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300">
                      LT2
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300">
                      LT1
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      HT5
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      HT4
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      HT3 (Cap)
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      HT2
                    </div>
                    <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 font-bold">
                      HT1 (Master)
                    </div>
                  </div>
                </div>

                {/* Above-Head Badge Showcase */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#11141E] to-[#181C2A] border border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Above-Head Floating Badges</h4>
                  <p className="text-xs text-slate-400 mb-3">
                    FlixCore renders the player's active kit icon and tier directly above their player model tag in real time:
                  </p>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block px-3 py-1 rounded bg-black/80 border border-white/20 text-xs font-mono text-white mb-1 shadow-lg">
                        <span className="text-[#38BDF8]">🗡</span> <span className="text-amber-400 font-bold">&c&lHT1</span> <span className="text-white">PlayerOne</span>
                      </div>
                      <div className="w-8 h-12 bg-slate-700/40 rounded-t mx-auto border-t border-x border-white/10" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 8. PARTIES & CLANS */}
            {activeSection.id === 'parties-clans' && (
              <>
                <p>
                  FlixCore offers a team ecosystem with zero external dependencies required for parties and clans.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#38BDF8]" /> Party Management
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li><code className="text-[#38BDF8] font-mono">/party create</code> — Form a new party.</li>
                      <li><code className="text-[#38BDF8] font-mono">/party invite &lt;player&gt;</code> — Invite a member.</li>
                      <li><code className="text-[#38BDF8] font-mono">/openparty</code> — Browse and join public parties.</li>
                      <li><span className="text-white font-medium">Party Split & FFA</span>: Leaders can split party members into 2 even teams or initiate a Free-For-All arena match.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" /> Clan Ecosystem
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li><code className="text-emerald-400 font-mono">/clan create &lt;name&gt;</code> — Register a clan.</li>
                      <li><code className="text-emerald-400 font-mono">/clan ally &lt;clan&gt;</code> — Form friendly alliances.</li>
                      <li><code className="text-emerald-400 font-mono">/clan rival &lt;clan&gt;</code> — Declare rivalries.</li>
                      <li><code className="text-emerald-400 font-mono">/clan ff</code> — Toggle clan friendly fire on or off.</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* 9. COSMETICS */}
            {activeSection.id === 'cosmetics' && (
              <>
                <p>
                  Built-in cosmetic rewards give your players progression goals without causing client FPS lag or TPS drops.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <code className="text-xs font-mono text-[#38BDF8] font-bold block mb-1">/killeffect (/ke)</code>
                    <p className="text-xs text-slate-400">
                      Particle effects triggered upon eliminating an opponent (Blood explosion, Lightning strike, Slime splash, Flame burst).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <code className="text-xs font-mono text-[#38BDF8] font-bold block mb-1">/killsound (/ks)</code>
                    <p className="text-xs text-slate-400">
                      Plays custom sound effects to the winner upon match conclusion (Ding, Level Up, Dragon Roar, Anvil fall).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <code className="text-xs font-mono text-[#38BDF8] font-bold block mb-1">/deathanimation</code>
                    <p className="text-xs text-slate-400">
                      Custom animations triggered on player death (Tombstone spawn, Smoke dissipate, Ghost float).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                    <code className="text-xs font-mono text-[#38BDF8] font-bold block mb-1">/traileffect (/trail)</code>
                    <p className="text-xs text-slate-400">
                      Particle trails attached to projectiles, arrows, and thrown pearls with zero performance cost.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#11141E] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white text-sm">Player Preferences GUI</h4>
                    <code className="text-xs font-mono text-[#38BDF8]">/settings</code>
                  </div>
                  <p className="text-xs text-slate-400">
                    Allows players to toggle scoreboards, duel invite requests, automatic "GG" chat messages, player visibility in the hub, and custom client time/weather (<code className="text-[#38BDF8]">/day</code>, <code className="text-[#38BDF8]">/night</code>, <code className="text-[#38BDF8]">/sunset</code>).
                  </p>
                </div>
              </>
            )}

            {/* 10. COMMAND REFERENCE (STRICTLY NO BOT) */}
            {activeSection.id === 'commands' && (
              <>
                <p>
                  All commands implemented in FlixCore v1.0.4 with their aliases and required permission nodes.
                </p>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#11141E]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-mono">
                      <tr>
                        <th className="p-3">Command</th>
                        <th className="p-3">Aliases</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Permission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {[
                        { cmd: '/flixcore reload', alias: '/fc reload', desc: 'Reloads all configurations & messages', perm: 'flixcore.admin' },
                        { cmd: '/flixcore update', alias: '/fc update', desc: 'Checks & installs latest verified release', perm: 'flixcore.admin' },
                        { cmd: '/setlobby', alias: '—', desc: 'Sets global lobby spawn location', perm: 'flixcore.admin' },
                        { cmd: '/kit', alias: '/kits', desc: 'Manage practice kits (create/delete/give)', perm: 'flixcore.kit.create' },
                        { cmd: '/arena', alias: '—', desc: 'Manage duel arenas (create/bounds/pos)', perm: 'flixcore.arena' },
                        { cmd: '/fwand <arena>', alias: '—', desc: 'Setup animated fence borders', perm: 'flixcore.fence.setup' },
                        { cmd: '/duel <player>', alias: '/1v1', desc: 'Challenge a player to a duel', perm: 'flixcore.duel' },
                        { cmd: '/openchallenge <kit>', alias: '/oc', desc: 'Broadcast open duel challenge', perm: 'flixcore.openchallenge' },
                        { cmd: '/queue <kit>', alias: '/q', desc: 'Join queue for a specific kit', perm: 'flixcore.queue.use' },
                        { cmd: '/leavequeue', alias: '/lq', desc: 'Leave current matchmaking queue', perm: 'flixcore.queue.use' },
                        { cmd: '/ranked', alias: '—', desc: 'Ranked queue & stats menu', perm: 'flixcore.queue.use' },
                        { cmd: '/unranked', alias: '/ur', desc: 'Unranked queue menu', perm: 'flixcore.queue.use' },
                        { cmd: '/teamqueue', alias: '/tq', desc: '2v2 team queue menu', perm: 'flixcore.queue.use' },
                        { cmd: '/surrender', alias: '/ff, /leave', desc: 'Forfeit current ongoing duel', perm: 'None (Players)' },
                        { cmd: '/spectate [p]', alias: '/spec', desc: 'Spectate an active match', perm: 'None (Players)' },
                        { cmd: '/party', alias: '/p', desc: 'Party management commands', perm: 'None (Players)' },
                        { cmd: '/openparty', alias: '/findparty', desc: 'Browse public parties', perm: 'None (Players)' },
                        { cmd: '/clan', alias: '—', desc: 'Clan creation, wars & management', perm: 'None (Players)' },
                        { cmd: '/tier [mode]', alias: '/tierprogress', desc: 'View your tier progression & stats', perm: 'None (Players)' },
                        { cmd: '/matchhistory [p]', alias: '/mh', desc: 'View past match records', perm: 'None (Players)' },
                        { cmd: '/killeffect', alias: '/ke', desc: 'Open kill effects menu', perm: 'None (Players)' },
                        { cmd: '/killsound', alias: '/ks', desc: 'Open kill sounds menu', perm: 'None (Players)' },
                        { cmd: '/traileffect', alias: '/trail', desc: 'Open projectile trails menu', perm: 'None (Players)' },
                        { cmd: '/settings', alias: '—', desc: 'Player preferences GUI', perm: 'None (Players)' },
                        { cmd: '/day /night', alias: '/sunset', desc: 'Set personal client weather/time', perm: 'None (Players)' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-[#38BDF8] font-bold">{row.cmd}</td>
                          <td className="p-3 text-slate-400">{row.alias}</td>
                          <td className="p-3 text-slate-300 font-sans">{row.desc}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${
                              row.perm.startsWith('flixcore.admin')
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                : row.perm.startsWith('None')
                                ? 'bg-white/5 text-slate-400 border border-white/10'
                                : 'bg-[#00D2FF]/10 text-[#38BDF8] border border-[#00D2FF]/30'
                            }`}>
                              {row.perm}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* 11. PERMISSIONS GUIDE (STRICTLY NO flixcore.bot) */}
            {activeSection.id === 'permissions' && (
              <>
                <p>
                  Permissions are strictly separated into administrative nodes, default gameplay nodes, and cosmetics.
                </p>

                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white text-sm mb-2 text-red-400 font-mono">Administrator & Staff Nodes</h3>
                    <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto">
                      flixcore.admin               # Full administrative access (/fc, /kit, /setlobby, /migrate){'\n'}
                      flixcore.arena               # Arena creation and configuration (/arena){'\n'}
                      flixcore.fence.setup         # Fence border configuration (/fwand){'\n'}
                      flixcore.chickenhunt.admin   # Optional ChickenHunt event setup{'\n'}
                      flixcore.clan.admin          # Force-disband and manage any clan
                    </pre>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white text-sm mb-2 text-[#38BDF8] font-mono">Player & Gameplay Defaults</h3>
                    <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto">
                      flixcore.queue.use           # Allows joining queues (default: true){'\n'}
                      flixcore.duel                # Allows sending /duel requests (default: true){'\n'}
                      flixcore.kit.edit            # Allows editing personal kit layouts (default: true){'\n'}
                      flixcore.openchallenge       # Allows broadcasting open challenges{'\n'}
                      flixcore.ranked.stats.others # Allows viewing other players' ranked statistics
                    </pre>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                    <h3 className="font-bold text-white text-sm mb-2 text-purple-400 font-mono">Cosmetic Nodes</h3>
                    <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto">
                      flixcore.killeffect.&lt;id&gt;     # Access to specific kill effect (e.g. flixcore.killeffect.slime){'\n'}
                      flixcore.trail.&lt;id&gt;          # Access to specific arrow trail (e.g. flixcore.trail.slime){'\n'}
                      flixcore.killsound.&lt;id&gt;      # Access to specific kill sound
                    </pre>
                  </div>
                </div>
              </>
            )}

            {/* 12. PLACEHOLDERAPI (PAPI) */}
            {activeSection.id === 'placeholders' && (
              <>
                <p>
                  FlixCore registers the <code className="text-[#38BDF8] font-mono">%flixcore_%</code> identifier for seamless integration with scoreboard plugins (FeatherBoard, TAB, TitleManager) and tablists.
                </p>

                <div className="space-y-4">
                  <h3 className="font-bold text-white text-base">Tier & Matchmaking Placeholders</h3>
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#11141E]">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                          <th className="p-3">Placeholder</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Example Output</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { tag: '%flixcore_tier%', desc: "Player's overall best tier display", out: '&c&lHT1' },
                          { tag: '%flixcore_tier_<mode>%', desc: "Player's tier in a specific kit mode", out: '&6&lHT3' },
                          { tag: '%flixcore_tier_status_<mode>%', desc: 'Mode status: Placed tier or remaining matches', out: '14/20 Placement' },
                          { tag: '%flixcore_tier_progress_<mode>%', desc: 'Progress percentage to the next tier', out: '68%' },
                          { tag: '%flixcore_tier_progressbar_<mode>%', desc: 'Formatted visual tier progress bar', out: '[■■■■■■□□□□]' },
                          { tag: '%flixcore_tier_icon_<mode>%', desc: 'Custom kit icon glyph / symbol', out: '\\uE001 or 🗡' },
                          { tag: '%flixcore_tier_head%', desc: 'Formatted above-head badge text', out: '\\uE001 &6&lHT3' },
                          { tag: '%flixcore_tier_elo_<mode>%', desc: 'Current Elo rating in mode', out: '1420' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 text-[#38BDF8] font-bold">
                              <button
                                onClick={() => handleCopy(row.tag, `papi-${idx}`)}
                                className="inline-flex items-center gap-1.5 hover:underline"
                              >
                                <span>{row.tag}</span>
                                {copiedKey === `papi-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                              </button>
                            </td>
                            <td className="p-3 text-slate-300 font-sans">{row.desc}</td>
                            <td className="p-3 text-emerald-400">{row.out}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-white text-base pt-2">Statistics & Queue Placeholders</h3>
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#11141E]">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                          <th className="p-3">Placeholder</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Example Output</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { tag: '%flixcore_in_queue_count_<kit>%', desc: 'Number of players queuing for kit', out: '4' },
                          { tag: '%flixcore_in_fight_count_<kit>%', desc: 'Number of players fighting in kit', out: '12' },
                          { tag: '%flixcore_clan_name%', desc: "Player's clan name", out: 'FlixWarriors' },
                          { tag: '%flixcore_clan_tag%', desc: "Player's formatted clan tag", out: '[FW]' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 text-[#38BDF8] font-bold">
                              <button
                                onClick={() => handleCopy(row.tag, `papi2-${idx}`)}
                                className="inline-flex items-center gap-1.5 hover:underline"
                              >
                                <span>{row.tag}</span>
                                {copiedKey === `papi2-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                              </button>
                            </td>
                            <td className="p-3 text-slate-300 font-sans">{row.desc}</td>
                            <td className="p-3 text-emerald-400">{row.out}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* 13. RESOURCE PACK GLYPHS */}
            {activeSection.id === 'glyphs' && (
              <>
                <p>
                  FlixCore includes native support for custom resource pack font glyphs (<code className="text-[#38BDF8] font-mono">\uE001</code> – <code className="text-[#38BDF8] font-mono">\uE008</code>) to render weapon and armor icons above players' heads.
                </p>

                <div className="p-5 rounded-xl bg-[#11141E] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">plugins/FlixCore/config.yml</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          `head-tier:\n  enabled: true\n  use-resourcepack-font: true   # Set to true for custom glyphs, false for unicode emojis\n  format: "%icon% %tier%"\n  font-icons:\n    smpkit: "\\uE008"       # Ender Pearl\n    nethpot: "\\uE003"      # Potion\n    diapot: "\\uE001"       # Diamond Sword\n    tank: "\\uE002"         # Netherite Helmet\n    cpvpflat: "\\uE004"     # End Crystal\n    spearmace: "\\uE005"    # Mace\n    axepvp: "\\uE006"       # Diamond Axe\n    uhc: "\\uE007"          # Heart`,
                          'yaml-glyphs'
                        )
                      }
                      className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'yaml-glyphs' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy Config Block
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                    <span className="text-amber-400">head-tier</span>:{'\n'}
                    {'  '}<span className="text-blue-400">enabled</span>: <span className="text-emerald-400">true</span>{'\n'}
                    {'  '}<span className="text-blue-400">use-resourcepack-font</span>: <span className="text-emerald-400">true</span>   <span className="text-slate-400"># Set to true for custom glyphs, false for unicode</span>{'\n'}
                    {'  '}<span className="text-blue-400">format</span>: <span className="text-yellow-300">"%icon% %tier%"</span>{'\n'}
                    {'  '}<span className="text-blue-400">font-icons</span>:{'\n'}
                    {'    '}<span className="text-slate-300">smpkit</span>: <span className="text-yellow-300">"\uE008"</span>       <span className="text-slate-400"># Ender Pearl</span>{'\n'}
                    {'    '}<span className="text-slate-300">nethpot</span>: <span className="text-yellow-300">"\uE003"</span>      <span className="text-slate-400"># Potion</span>{'\n'}
                    {'    '}<span className="text-slate-300">diapot</span>: <span className="text-yellow-300">"\uE001"</span>       <span className="text-slate-400"># Diamond Sword</span>{'\n'}
                    {'    '}<span className="text-slate-300">tank</span>: <span className="text-yellow-300">"\uE002"</span>         <span className="text-slate-400"># Netherite Helmet</span>{'\n'}
                    {'    '}<span className="text-slate-300">cpvpflat</span>: <span className="text-yellow-300">"\uE004"</span>     <span className="text-slate-400"># End Crystal</span>{'\n'}
                    {'    '}<span className="text-slate-300">spearmace</span>: <span className="text-yellow-300">"\uE005"</span>    <span className="text-slate-400"># Mace</span>{'\n'}
                    {'    '}<span className="text-slate-300">axepvp</span>: <span className="text-yellow-300">"\uE006"</span>       <span className="text-slate-400"># Diamond Axe</span>{'\n'}
                    {'    '}<span className="text-slate-300">uhc</span>: <span className="text-yellow-300">"\uE007"</span>          <span className="text-slate-400"># Heart</span>
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-bold text-white mb-1">Automatic Unicode Fallback</h4>
                  <p className="text-xs text-slate-400">
                    If <code className="text-[#38BDF8]">use-resourcepack-font: false</code>, FlixCore automatically switches to clean unicode symbols (<span className="text-white">🗡, 🪓, 🔮, 🧪, ❤</span>) so that custom texture packs are never strictly mandatory for your players.
                  </p>
                </div>
              </>
            )}

            {/* 14. AUTO-UPDATER & MAINTENANCE */}
            {activeSection.id === 'updater' && (
              <>
                <p>
                  FlixCore features an encrypted auto-updater compliant with BuiltByBit standards for zero server disruption.
                </p>

                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Automatic Background Check</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Runs an asynchronous lightweight ping every 30 minutes without blocking the main server thread.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Operator Notifications</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Server operators with <code className="text-[#38BDF8]">flixcore.admin</code> receive a discreet chat message and sound notification when a new security patch or feature release is published.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">One-Command Update</h4>
                      <p className="text-xs text-slate-400 mt-1 mb-2">
                        Execute the update command directly from the in-game console or as an operator:
                      </p>
                      <code className="text-xs font-mono text-[#38BDF8] bg-black/60 px-3 py-1.5 rounded block">
                        /flixcore update
                      </code>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#11141E] border border-white/10 flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Safe Swap Mechanism</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        The release package downloads and decrypts safely into <code className="text-[#38BDF8]">plugins/update/FlixCore.jar</code>. The server gracefully swaps the binary upon your next scheduled restart, completely avoiding in-game duel interruptions or corrupted game state.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Previous / Next Section Footer Navigation */}
          <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            {prevSection ? (
              <button
                onClick={() => handleSelectSection(prevSection.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#11141E] hover:bg-white/5 border border-white/10 text-left transition-all group"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Previous</span>
                  <span className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {prevSection.title}
                  </span>
                </div>
              </button>
            ) : <div />}

            {nextSection ? (
              <button
                onClick={() => handleSelectSection(nextSection.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#11141E] hover:bg-white/5 border border-white/10 text-right transition-all group ml-auto"
              >
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Next</span>
                  <span className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {nextSection.title}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
