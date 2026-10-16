import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Search,
  Plus,
} from 'lucide-react';
import { Product } from '../../types/database';
import { INITIAL_PRODUCTS } from '../../lib/db';

interface MinecraftMarketplaceProps {
  onOpenHireUs: (category?: string) => void;
  products?: Product[];
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const MinecraftMarketplace: React.FC<MinecraftMarketplaceProps> = ({
  onOpenHireUs,
  products = INITIAL_PRODUCTS,
  onOpenAdmin,
  isAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Filter only published products from database / admin additions
  const activeProducts = (products && products.length > 0 ? products : INITIAL_PRODUCTS).filter(
    (p) => p.status === 'published' || !p.status
  );

  // Dynamically extract unique categories
  const categories = [
    'All products',
    ...Array.from(new Set(activeProducts.map((p) => p.category || 'Plugins'))),
  ];

  // Filter items based on active category & search query
  const filteredProducts = activeProducts.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All products' ||
      (item.category || 'Plugins') === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const flixcoreSlides = [
    {
      img: '/products/flixcore/cover.png',
      tag: 'PRODUCTION COVER',
      title: 'Flagship Practice & Event Core',
      desc: 'Official release build tested for high-traffic Minecraft networks (MC 1.8.8 – 1.21.4).',
    },
    {
      img: '/products/flixcore/1.png',
      tag: 'SLIDE 01',
      title: '10+ Custom Combat Kits & Armor Trims',
      desc: 'UI-driven kit presets, rank requirements, and complete in-game kit editing.',
    },
    {
      img: '/products/flixcore/2.png',
      tag: 'SLIDE 02',
      title: 'Standalone Clan Systems & Progression',
      desc: 'Autonomous async clan database, points, and independent clan economy.',
    },
    {
      img: '/products/flixcore/3.png',
      tag: 'SLIDE 03',
      title: 'Ten Built-In Game Modes',
      desc: 'TNT Tag, Flower Crown, TNT Sumo, Bedwars, Skywars, and custom Minigames.',
    },
    {
      img: '/products/flixcore/4.png',
      tag: 'SLIDE 04',
      title: 'Match Start Elevator & Cinematics',
      desc: 'BlockDisplay underground elevator rising from depth 5, parabolic round rewinds.',
    },
    {
      img: '/products/flixcore/5.png',
      tag: 'SLIDE 05',
      title: 'Ranked Tier Game Modes & Action Queues',
      desc: 'Kit-specific tier modes (HT5), placement matches, and one-click action queues.',
    },
    {
      img: '/products/flixcore/6.png',
      tag: 'SLIDE 06',
      title: 'Mathematical Arena Bounding & Anti-Escape',
      desc: 'ArenaSafetyHelper 3D boundary containment, in-combat command jail, and ghost protection.',
    },
    {
      img: '/products/flixcore/7.png',
      tag: 'SLIDE 07',
      title: 'Asynchronous 20.0 TPS Engine & Preloading',
      desc: 'Chunky 54+ arena preloading, async FAWE rollbacks, and HikariCP connection pooling.',
    },
    {
      img: '/products/flixcore/8.png',
      tag: 'SLIDE 08',
      title: 'In-Built Tournament & Event System',
      desc: 'Solo, Party, and Clan automated brackets with Sumo, Spleef, and Gulag events.',
    },
    {
      img: '/products/flixcore/9.png',
      tag: 'SLIDE 09',
      title: 'Skill-Based Dynamic Tier Matchmaking',
      desc: 'Strict tier-first pairing (HT5 -> HT5) with asynchronous non-blocking queries.',
    },
  ];

  return (
    <section id="products" className="py-8 md:py-12 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 space-y-16">
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 1. STORE CONTROLS (SEARCH & CATEGORY FILTER TABS MATCHING HXSTUDIOS.IN)    */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-minecraft transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/25'
                    : 'bg-[#12151F] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Admin Add Product Shortcut */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-[#38BDF8] hover:text-black border border-dashed border-white/20 text-slate-300 text-xs font-minecraft transition-all flex items-center gap-1 cursor-pointer"
                title="Open Admin Dashboard to add or edit products"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}
          </div>

          {/* Search Input Bar (hxstudios.in style) */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plugins, setups, mods..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151F] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#38BDF8] transition-colors font-sans"
            />
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* 2. DYNAMIC PRODUCT CARDS (LOADED FROM DATABASE / ADMIN PAGE)               */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#11141E] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1 group"
            >
              <div>
                {/* 16:9 Thumbnail Banner with Pixelated Red Ribbon & Gold Stars */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/70">
                  <img
                    src={item.cover_image || '/products/flixcore/cover.png'}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Red Pixel Price Ribbon (Exact hxstudios.in style on top-right) */}
                  <div className="absolute top-2.5 right-2.5 z-20 px-3 py-1 bg-[#EF4444] text-white font-minecraft text-xs shadow-lg rounded-sm flex items-center gap-1">
                    <span>{item.price}</span>
                  </div>

                  {/* Gold Rating Stars (hxstudios.in style) */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-0.5 text-amber-400 text-xs px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2.5 text-left">
                  <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="text-sm font-bold text-[#38BDF8] font-minecraft">
                    {item.price}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-sans">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-white/5 mt-2">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                </Link>

                <a
                  href={item.purchase_url || 'https://builtbybit.com/resources/flixcore'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#38BDF8] hover:text-black border border-white/10 hover:border-[#38BDF8] text-white text-[11px] font-minecraft transition-all"
                >
                  {item.purchase_button_label || 'Buy Now'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 3. FLIXCORE FEATURE & MEDIA DECK (10 SLIDES VIEWER)                        */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-[#11141E] p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[10px] font-minecraft text-[#38BDF8] uppercase">
              FLIXCORE MEDIA DECK
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-minecraft">
              FlixCore Feature Deck ({activeSlide + 1} of {flixcoreSlides.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore in-game UI layouts, kits, and asynchronous architecture captured directly from production deployments.
            </p>
          </div>

          <a
            href="https://builtbybit.com/resources/flixcore"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#38BDF8] text-white font-minecraft text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start md:self-auto shadow-md shadow-[#0284C7]/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy FlixCore · $49.99</span>
          </a>
        </div>

        {/* Big Preview Display */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/90 shadow-2xl group">
            <img
              src={flixcoreSlides[activeSlide].img}
              alt={flixcoreSlides[activeSlide].title}
              className="w-full h-full object-contain"
            />

            {/* Slide Tag */}
            <div className="absolute top-3 left-3 z-20">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-minecraft uppercase tracking-wider">
                {flixcoreSlides[activeSlide].tag}
              </span>
            </div>

            {/* Price Badge on Top Right */}
            <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-[#EF4444] text-white font-minecraft text-xs shadow-lg rounded-sm">
              $49.99
            </div>

            {/* Prev / Next Click Arrows */}
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? flixcoreSlides.length - 1 : prev - 1))}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 hover:bg-[#38BDF8] hover:text-black text-white transition-all border border-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % flixcoreSlides.length)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 hover:bg-[#38BDF8] hover:text-black text-white transition-all border border-white/10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-black via-black/85 to-transparent text-left">
              <h4 className="text-base sm:text-lg font-bold text-white leading-tight font-minecraft">
                {flixcoreSlides[activeSlide].title}
              </h4>
              <p className="text-xs text-slate-300 font-sans pt-0.5">
                {flixcoreSlides[activeSlide].desc}
              </p>
            </div>
          </div>

          {/* Thumbnail Hotbar */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
            {flixcoreSlides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`aspect-[16/9] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  idx === activeSlide
                    ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/40 scale-105'
                    : 'border-white/10 opacity-50 hover:opacity-100'
                }`}
              >
                <img src={slide.img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 4. CUSTOM COMMISSIONS BANNER (MATCHING HXSTUDIOS HIRE US)                  */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#0369A1]/30 via-[#0B0E17] to-[#0284C7]/20 border border-white/10 p-8 md:p-12 text-center space-y-4 shadow-xl">
        <span className="inline-block px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-xs font-minecraft text-[#38BDF8] uppercase">
          CUSTOM COMMISSIONS
        </span>
        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-minecraft">
          Need a Custom Minecraft Plugin, Mod, or Server Setup?
        </h3>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We engineer bespoke Spigot/Paper/Folia plugins, custom Fabric/Forge mods, and turnkey Velocity proxy networks built strictly to your server's vision. Clean code delivery and 14-day warranty included.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenHireUs('Custom Minecraft Plugin Development')}
            className="px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#38BDF8] text-white hover:text-black font-minecraft text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#0284C7]/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Commission Custom Work</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
