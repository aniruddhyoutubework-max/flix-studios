import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Product, Review } from '../../types/database';
import { FlixCoreLogo } from '../FlixCoreLogo';
import { PurchaseButton } from './PurchaseButton';
import {
  Swords,
  Shield,
  Zap,
  Trophy,
  Database,
  Server,
  Terminal,
  KeyRound,
  History,
  Star,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Package,
  Sparkles,
  BookOpen,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  LifeBuoy,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';

interface ProductShowcaseProps {
  product: Product;
  reviews: Review[];
  onOpenHireUs: (category?: string) => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  product,
  reviews,
  onOpenHireUs,
  isAdmin = false,
  onOpenAdmin,
}) => {
  // Real advertising images from product data (guaranteed to contain cover.png, 1.png - 9.png)
  const productImages = React.useMemo(() => {
    const list: string[] = [];
    if (product.cover_image && product.cover_image.trim()) {
      list.push(product.cover_image.trim());
    }
    if (Array.isArray(product.gallery_images)) {
      product.gallery_images.forEach((img) => {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list.length > 0
      ? list
      : [
          '/products/flixcore/cover.png',
          '/products/flixcore/1.png',
          '/products/flixcore/2.png',
          '/products/flixcore/3.png',
          '/products/flixcore/4.png',
          '/products/flixcore/5.png',
        ];
  }, [product.cover_image, product.gallery_images]);

  // Active showcase slide for genuine advertising graphics
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Auto-advance slideshow every 1 second
  useEffect(() => {
    if (productImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [productImages.length]);

  // Expandable technical deep-dive tabs
  const [activeTechnicalTab, setActiveTechnicalTab] = useState<
    'commands' | 'changelog' | 'reviews' | 'support' | null
  >(null);

  const approvedReviews = reviews.filter(
    (r) => r.product_id === product.id && (r.status === 'approved' || r.status === 'featured')
  );

  const slideCaptions: Record<string, { title: string; category: string; description: string }> = {
    'cover.png': {
      title: 'Flagship Practice & Event Core',
      category: 'PRODUCTION COVER',
      description: 'Official release build tested for high-traffic Minecraft networks (MC 1.8.8 – 1.21.4).',
    },
    '1.png': {
      title: '10+ Custom Combat Kits & Armor Trims',
      category: 'KITS & COSMETICS',
      description: '10+ balanced duel kits, interactive GUI editor, per-kit knockback, and rank-gated armor progression.',
    },
    '2.png': {
      title: 'Standalone Clan Systems & 10 Game Modes',
      category: 'CLANS & MODES',
      description: 'Async clan backend with points economy, tag prefixes, and 10 modes including Bedwars, Skywars & TNT Tag.',
    },
    '3.png': {
      title: 'Elevator Platforms & Visual Gates',
      category: 'CINEMATIC IMMERSION',
      description: 'BlockDisplay underground elevator platforms, Totem pop animations, and parabolic round rewinds.',
    },
    '4.png': {
      title: 'Ranked Tier Game Modes (HT5)',
      category: 'TIER MATCHMAKING',
      description: 'Competitive placement matches calculate raw tiers and prevent entry spam with one-click action queues.',
    },
    '5.png': {
      title: 'Arena Bounding & 20.0 TPS Engine',
      category: 'SECURITY & 20.0 TPS',
      description: 'ArenaSafetyHelper 3D vector clamping, in-combat command jail, chunky preloading, and async HikariCP.',
    },
    '6.png': {
      title: 'Tournament & Event Orchestrator',
      category: 'TOURNAMENTS',
      description: 'Solo, Party (2v2-4v4), and Clan brackets with automated progression and sliding cage doors.',
    },
    '7.png': {
      title: 'Skill-Based Dynamic Tier Matchmaking',
      category: 'DYNAMIC QUEUE',
      description: 'Tier-first pairing with 5s expanding search window and asynchronous non-blocking queries.',
    },
    '8.png': {
      title: 'Ranked Kit Ladders & Personal Settings',
      category: 'PLAYER SETTINGS',
      description: 'Dedicated tiered queues (Crystal, Nodebuff, Mace) and player toggles for Auto GG and scoreboards.',
    },
    '9.png': {
      title: 'Match Sequencer & Arena Gates',
      category: 'MATCH SEQUENCER',
      description: 'Arena cage doors opening, blindness cinematic tension, and live countdown timer before teleportation.',
    },
  };

  const currentImage = productImages[activeSlideIndex] || productImages[0];
  const currentFilename = currentImage.split('/').pop() || '';
  const currentMeta = slideCaptions[currentFilename] || {
    title: `${product.name} Production Graphic ${activeSlideIndex + 1}`,
    category: 'PRODUCTION MEDIA',
    description: 'Genuine advertising asset and gameplay preview from Flix Studios.',
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
  };

  const verifiedCapabilities = [
    {
      id: 'combat-kits',
      icon: Swords,
      category: 'PRACTICE CORE',
      accent: '#D7FF3F',
      title: '10+ Custom Combat Kits & Armor Trims',
      tag: '10+ KITS · UI PRESETS',
      description:
        'Empower players with 10+ uniquely balanced combat kits (Nodebuff, Crystal, Mace, Sumo, Spleef), interactive GUI kit customizer, per-kit knockback profiles, and rank-gated cosmetic Armor Trims.',
      specs: '10 Game Modes · UI Preset YAML · Custom KB Profiles',
    },
    {
      id: 'tier-matchmaking',
      icon: Zap,
      category: 'MATCHMAKING ENGINE',
      accent: '#8B5CFF',
      title: 'Dynamic Tier Matchmaking (HT5)',
      tag: 'HT5 TIERS · 5s EXPANSION',
      description:
        'Skill-based Elo ladders with placement matches and non-blocking asynchronous queue algorithms. Dynamically expands the search window every 5 seconds to eliminate queue deadlock while preserving fair pairing.',
      specs: 'Kit-Specific HT5 · 5s Expansion · Sub-Second Resolution',
    },
    {
      id: 'arena-bounding',
      icon: Shield,
      category: 'SECURITY & INTEGRITY',
      accent: '#D7FF3F',
      title: 'Mathematical Arena Bounding & Anti-Escape',
      tag: 'ArenaSafetyHelper · ANTI-ESCAPE',
      description:
        'Powered by ArenaSafetyHelper. Strict 3D vector clamping restricts player movement to active duel bounding boxes, with in-combat command lock jail and anti-interruption spectator isolation.',
      specs: '3D Vector Clamping · Command Lockdown · Zero Leak',
    },
    {
      id: 'tournaments',
      icon: Trophy,
      category: 'AUTOMATION ENGINE',
      accent: '#8B5CFF',
      title: 'Automated Tournament & Event Sequencer',
      tag: 'AUTO-BRACKETS · EVENTS',
      description:
        'Automated Solo, Party (2v2-4v4), and Clan tournament brackets. Features BlockDisplay sliding cage doors, blind tension sequences, live countdown timers, and parabolic round rewinds.',
      specs: 'Solo / Party / Clan · BlockDisplay Gates · Rewind FX',
    },
    {
      id: 'async-engine',
      icon: Database,
      category: 'PERFORMANCE CORE',
      accent: '#D7FF3F',
      title: '20.0 TPS Async Engine & HikariCP',
      tag: 'HikariCP · 54+ ARENAS',
      description:
        'Sustains locked 20.0 TPS under intense duel spikes. Chunky arena preloading across 54+ arenas, sub-second FAWE block state restoration for breakable blocks, and asynchronous HikariCP database transactions.',
      specs: '54+ Preloaded Arenas · Sub-Second FAWE · HikariCP Pool',
    },
    {
      id: 'network-bridge',
      icon: Server,
      category: 'INFRASTRUCTURE',
      accent: '#8B5CFF',
      title: 'Velocity Limbo & Network Bridge',
      tag: 'VELOCITY · MULTI-PROXY',
      description:
        'Multi-proxy handshake queue protects backend servers during peak player rushes. Includes cross-server player stats synchronization, Redis cluster heartbeats, and Folia thread compliance.',
      specs: 'Velocity Limbo Queue · Cross-Server Sync · Folia Compliant',
    },
  ];

  return (
    <section
      id="products"
      className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 relative space-y-16"
    >
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D7FF3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[#8B5CFF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 1. PURPOSEFUL FEATURED PRODUCT SHOWCASE — FLIXCORE PLUGIN                 */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0F1117] via-[#0A0B0E] to-[#08090B] p-6 md:p-10 space-y-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden mc-panel">
        {/* Minecraft Server Live HUD Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-black/70 border border-[#D7FF3F]/25 text-xs font-mono shadow-inner">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TPS: 20.00 LOCKED</span>
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-[#D7FF3F] font-bold hidden sm:inline">FOLIA MULTITHREADED</span>
            <span className="text-white/30 hidden md:inline">|</span>
            <span className="text-cyan-400 font-bold hidden md:inline">0ms TICK SPIKE</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-bold">MC 1.8.8 – 1.21.4</span>
            <span className="px-2 py-0.5 rounded bg-[#8B5CFF]/20 text-[#8B5CFF] font-bold border border-[#8B5CFF]/30">BUILTBYBIT VERIFIED</span>
          </div>
        </div>

        {/* Top Product Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/30 text-xs font-mono text-[#D7FF3F]">
              <span className="w-2 h-2 rounded-full bg-[#D7FF3F] animate-pulse" />
              <span className="font-bold tracking-wider uppercase">FEATURED FLAGSHIP PLUGIN</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none font-display">
              FLIXCORE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF3F] via-white to-[#8B5CFF]">
                PLUGIN
              </span>
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans font-normal pt-1">
              {product.description}
            </p>

            {/* Quick Spec Matrix */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white/90">
                🎮 MC {product.supported_mc_versions}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white/90">
                ⚡ {product.server_software.split(',').slice(0, 3).join(', ')}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#D7FF3F]/15 border border-[#D7FF3F]/30 text-[#D7FF3F] font-bold">
                ⚔️ 20.0 TPS ASYNC CORE
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#8B5CFF]/15 border border-[#8B5CFF]/30 text-[#8B5CFF] font-bold">
                🔮 v{product.version} PRODUCTION
              </span>
            </div>
          </div>

          {/* Direct CTA Command Cluster */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 self-start lg:self-auto w-full sm:w-auto lg:min-w-[260px]">
            <PurchaseButton
              purchaseUrl={product.purchase_url}
              productName={product.name}
              isAdmin={isAdmin}
              onOpenAdmin={onOpenAdmin}
              onOpenHireUs={() => onOpenHireUs('Custom Plugin Development')}
              variant="primary"
              className="w-full justify-center py-3.5 shadow-xl shadow-[#D7FF3F]/20 text-sm"
            />

            <Link
              href={`/products/${product.slug}`}
              className="w-full px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all group"
            >
              <span>View Full Plugin Specifications & Media</span>
              <ArrowRight className="w-4 h-4 text-[#D7FF3F] group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-white/50">
              <span>{product.price || '$49.99'} · Lifetime License</span>
              <span className="text-[#D7FF3F] font-bold">Instant Delivery</span>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* 2. REAL ADVERTISING IMAGERY — VISUAL PRODUCT FOCUS                        */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-white/60 px-1">
            <span className="text-[#D7FF3F] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL PRODUCT MEDIA & GAMEPLAY DECK</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D7FF3F] animate-ping" />
              <span className="text-white/80 font-bold">1.0s AUTO-CYCLE</span>
              <span className="text-white/40">·</span>
              <span>
                Slide {activeSlideIndex + 1} of {productImages.length}
              </span>
            </div>
          </div>

          {/* Main 16:9 Real Advertising Image Display with Gaming Monitor Frame */}
          <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-3xl overflow-hidden border-2 border-[#232730] bg-[#050608] shadow-[0_25px_70px_rgba(0,0,0,0.95)] group flex items-center justify-center mc-panel-lime">
            {/* 1-Second Auto-Cycle Progress Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white/10 z-30 overflow-hidden">
              <div
                key={activeSlideIndex}
                className="h-full bg-gradient-to-r from-[#D7FF3F] via-cyan-400 to-[#8B5CFF] w-full transition-all duration-1000 ease-linear"
              />
            </div>

            {/* Ambient Background Flare */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10" />

            <img
              src={currentImage}
              alt={currentMeta.title}
              className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.01]"
              loading="eager"
            />

            {/* Category Tag Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D7FF3F]/30 text-[10px] md:text-xs font-mono font-bold text-[#D7FF3F] uppercase tracking-wider shadow-lg">
                ⚔️ {currentMeta.category}
              </span>
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:border-[#D7FF3F] hover:scale-105 transition-all"
              title="View full screen"
            >
              <Maximize2 className="w-4 h-4 text-[#D7FF3F]" />
            </button>

            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:text-[#D7FF3F] hover:border-[#D7FF3F] hover:bg-black transition-all shadow-xl"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:text-[#D7FF3F] hover:border-[#D7FF3F] hover:bg-black transition-all shadow-xl"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-[2px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D7FF3F]/20 text-[#D7FF3F] font-bold">
                  SLIDE {String(activeSlideIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-mono text-white/50">Production Asset</span>
              </div>
              <h4 className="text-base md:text-xl font-bold text-white tracking-tight">
                {currentMeta.title}
              </h4>
              <p className="text-xs md:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
                {currentMeta.description}
              </p>
            </div>
          </div>

          {/* Minecraft Hotbar Style Slide Selector Thumbnails */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
            {productImages.map((img, idx) => {
              const isSelected = idx === activeSlideIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`relative aspect-[16/9] rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'mc-slot-active scale-[1.05]'
                      : 'mc-slot opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={`View slide ${idx + 1}`}
                >
                  <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className={`absolute bottom-1 right-1 text-[8px] font-mono font-bold px-1 rounded ${
                    isSelected ? 'bg-[#D7FF3F] text-black' : 'bg-black/90 text-white/80'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live In-Game Command Simulator Bar */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2 text-white/90">
              <span className="text-[#D7FF3F] font-bold">&gt;</span>
              <span className="text-[#D7FF3F]">/flixcore</span>
              <span className="text-white">duel create</span>
              <span className="text-cyan-400">Ranked_Nodebuff</span>
              <span className="text-white/40 hidden sm:inline">--arena=Vault_04</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                ARENA #14 CLAIMED
              </span>
              <span className="text-white/30">|</span>
              <span className="text-[#8B5CFF] font-bold">20.00 TPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 3. CONFIRMED CAPABILITIES MATRIX (6 CORE SYSTEMS)                         */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CFF]/10 border border-[#8B5CFF]/25 text-xs font-mono text-[#8B5CFF] mb-2 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>VERIFIED PRODUCTION CAPABILITIES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              Engineered For High-Traffic Networks
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl font-mono">
              Every capability is confirmed by production deployments. Zero fabricated claims.
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white inline-flex items-center gap-2 transition-colors"
          >
            <span>View Full Plugin Wiki</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D7FF3F]" />
          </Link>
        </div>

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedCapabilities.map((cap) => {
            const IconComponent = cap.icon;
            return (
              <div
                key={cap.id}
                className="group relative p-6 rounded-3xl bg-gradient-to-b from-[#111319] to-[#0A0B0E] border border-white/10 hover:border-[#D7FF3F]/50 transition-all duration-300 space-y-4 hover:shadow-[0_15px_40px_rgba(215,255,63,0.12)] flex flex-col justify-between mc-panel hover:-translate-y-1"
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 shadow-md"
                      style={{
                        backgroundColor: `${cap.accent}15`,
                        color: cap.accent,
                        border: `1px solid ${cap.accent}40`,
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider"
                      style={{
                        backgroundColor: `${cap.accent}15`,
                        color: cap.accent,
                        border: `1px solid ${cap.accent}30`,
                      }}
                    >
                      {cap.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-bold text-white group-hover:text-[#D7FF3F] transition-colors tracking-tight font-display">
                    {cap.title}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {cap.description}
                  </p>
                </div>

                {/* Specs pill */}
                <div className="pt-3 border-t border-white/10">
                  <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3F]" />
                    <span>RUNTIME SPECIFICATION</span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#D7FF3F] block">
                    {cap.specs}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 4. COMPACT VERIFIED COMPATIBILITY & SYSTEM MATRIX                         */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 p-6 md:p-8 rounded-3xl bg-[#0E0F14] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono text-[#D7FF3F] uppercase tracking-widest block font-bold">
              VERIFIED INTEGRATION ENVIRONMENT
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              Production Compatibility & Requirements
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-bold">
              PASSED AUTOMATED SUITE (v{product.version})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#08090B] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase">
              <Server className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>SERVER PLATFORMS</span>
            </div>
            <div className="text-xs font-bold text-white">{product.server_software}</div>
            <div className="text-[10px] font-mono text-white/40">Native multi-threading</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#08090B] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase">
              <Layers className="w-3.5 h-3.5 text-[#8B5CFF]" />
              <span>MINECRAFT VERSIONS</span>
            </div>
            <div className="text-xs font-bold text-white">{product.supported_mc_versions}</div>
            <div className="text-[10px] font-mono text-white/40">1.8 combat + 1.21 items</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#08090B] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase">
              <Cpu className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>JAVA RUNTIME</span>
            </div>
            <div className="text-xs font-bold text-white">Java 17 – Java 21 LTS</div>
            <div className="text-[10px] font-mono text-white/40">Optimized for Aikar flags</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#08090B] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase">
              <Database className="w-3.5 h-3.5 text-[#8B5CFF]" />
              <span>STORAGE & DEPS</span>
            </div>
            <div className="text-xs font-bold text-white">HikariCP MySQL / H2 / Redis</div>
            <div className="text-[10px] font-mono text-white/40">Zero main-thread blocking</div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 5. INTERACTIVE TECHNICAL DRAWER (COMMANDS, CHANGELOG, REVIEWS, SUPPORT)   */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-white">Technical Reference & Purchaser Verification</h4>
            <p className="text-xs font-mono text-white/50">
              Explore in-game command syntax, changelog highlights, and verified customer testimonials.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-2">
            {[
              { id: 'commands', label: 'Commands & Permissions', icon: Terminal },
              { id: 'changelog', label: `Changelog v${product.version}`, icon: History },
              { id: 'reviews', label: `Reviews (${approvedReviews.length})`, icon: Star },
              { id: 'support', label: 'Support & Docs', icon: LifeBuoy },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTechnicalTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTechnicalTab((prev) => (prev === tab.id ? null : (tab.id as any)))
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                    isActive
                      ? 'bg-white/15 border-[#D7FF3F] text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 text-[#D7FF3F]" />
                  <span>{tab.label}</span>
                  {isActive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Tab Content Pane */}
        {activeTechnicalTab && (
          <div className="p-6 rounded-3xl bg-[#0E0F14] border border-white/10 animate-in fade-in duration-200">
            {/* Commands & Permissions */}
            {activeTechnicalTab === 'commands' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D7FF3F] font-mono">
                    <Terminal className="w-4 h-4" />
                    <span>VERIFIED PRODUCTION COMMANDS</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40">Tab-Completion Enabled</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {product.commands?.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#08090B] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-[#D7FF3F] font-bold block">{cmd.command}</span>
                        <span className="text-[11px] text-white/60 font-sans">{cmd.description}</span>
                      </div>
                      <span className="text-[10px] text-[#8B5CFF] bg-[#8B5CFF]/10 px-2 py-0.5 rounded self-start sm:self-auto">
                        {cmd.permission}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Changelog Highlights */}
            {activeTechnicalTab === 'changelog' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D7FF3F] font-mono">
                    <History className="w-4 h-4" />
                    <span>PRODUCTION RELEASE HISTORY</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40">Verified SemVer</span>
                </div>

                <div className="space-y-4">
                  {product.changelog?.map((entry, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#08090B] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D7FF3F] font-mono">
                          v{entry.version}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">{entry.date}</span>
                      </div>
                      <ul className="space-y-1 text-xs text-white/70">
                        {entry.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <span className="text-[#D7FF3F]">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Reviews */}
            {activeTechnicalTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D7FF3F] font-mono">
                    <Star className="w-4 h-4 fill-current" />
                    <span>VERIFIED PURCHASER TESTIMONIALS</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40">
                    {approvedReviews.length} Verified Review{approvedReviews.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {approvedReviews.length === 0 ? (
                  <div className="text-center py-8 text-white/40 font-mono text-xs space-y-1">
                    <Shield className="w-6 h-6 mx-auto opacity-30" />
                    <p>No verified customer reviews published for this release yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {approvedReviews.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl bg-[#08090B] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-400">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[9px] font-mono text-[#D7FF3F] bg-[#D7FF3F]/10 px-2 py-0.5 rounded">
                            VERIFIED PURCHASER
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white">{r.title}</h5>
                        <p className="text-xs text-white/70 leading-relaxed">{r.content}</p>
                        <div className="text-[10px] font-mono text-white/40 pt-1 border-t border-white/5">
                          {r.customer_name} {r.usage_context && `· ${r.usage_context}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support & Runbook */}
            {activeTechnicalTab === 'support' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D7FF3F] font-mono">
                    <LifeBuoy className="w-4 h-4" />
                    <span>TECHNICAL SUPPORT & RUNBOOKS</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40">Direct Engineering Help</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#08090B] border border-white/5 space-y-2">
                    <span className="font-bold text-white block">BuiltByBit License</span>
                    <p className="text-white/60 leading-relaxed text-[11px]">
                      Instant JAR download, auto-updates, and verified customer license via BuiltByBit.
                    </p>
                    <PurchaseButton
                      purchaseUrl={product.purchase_url}
                      productName={product.name}
                      isAdmin={isAdmin}
                      onOpenAdmin={onOpenAdmin}
                      onOpenHireUs={() => onOpenHireUs('Custom Plugin Development')}
                      variant="card"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#08090B] border border-white/5 space-y-2">
                    <span className="font-bold text-white block">Online Documentation</span>
                    <p className="text-white/60 leading-relaxed text-[11px]">
                      Complete installation runbooks, configuration templates, and API hooks.
                    </p>
                    {product.documentation_url && (
                      <a
                        href={product.documentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#D7FF3F]" />
                        <span>Open Docs</span>
                      </a>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#08090B] border border-white/5 space-y-2">
                    <span className="font-bold text-white block">Custom Modification</span>
                    <p className="text-white/60 leading-relaxed text-[11px]">
                      Need custom arena algorithms, unique duel physics, or proxy network tailoring?
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenHireUs('Custom Plugin Development')}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Hire Flix Studios</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 6. REQUIREMENT 3: PREMIUM HOMEPAGE CTA TO CATALOGUE                        */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-4 pb-2 flex flex-col items-center justify-center text-center space-y-3">
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-3.5 px-8 py-4 rounded-2xl bg-[#D7FF3F] hover:bg-[#cbf430] text-black font-mono font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(215,255,63,0.3)] hover:shadow-[0_0_55px_rgba(215,255,63,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
        >
          <span>EXPLORE OUR PLUGINS</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
        </Link>
        <p className="text-xs font-mono text-white/55 tracking-wide">
          Discover the tools built by Flix Studios.
        </p>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            title="Close viewer (Escape)"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={currentMeta.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />

            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2 md:left-4 p-3 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white transition-all"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2 md:right-4 p-3 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white transition-all"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center space-y-1">
            <span className="text-xs font-mono text-[#D7FF3F] uppercase tracking-wider block font-bold">
              {currentMeta.category} · {activeSlideIndex + 1} / {productImages.length}
            </span>
            <h4 className="text-base font-bold text-white">{currentMeta.title}</h4>
            <p className="text-xs text-white/60 max-w-xl mx-auto">{currentMeta.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};
