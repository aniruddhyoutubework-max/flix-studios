import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { db, INITIAL_PRODUCTS } from '../lib/db';
import { Product } from '../types/database';
import { FlixCoreLogo } from '../components/FlixCoreLogo';
import { useStaggerReveal, useScrollReveal } from '../hooks/useScrollReveal';
import { FlixCoreSystemsVisualizer } from '../components/products/FlixCoreSystemsVisualizer';
import { PurchaseButton } from '../components/products/PurchaseButton';
import {
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Terminal,
  Star,
  Package,
  ChevronLeft,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Server,
  Sparkles,
  X,
} from 'lucide-react';

export const ProductsPage: React.FC<{
  onOpenHireUs: (category?: string) => void;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
  isAdmin: boolean;
}> = ({ onOpenHireUs, onOpenAdmin, onOpenAccount, isAdmin }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSystemsVisualizer, setShowSystemsVisualizer] = useState<boolean>(true);

  const heroRef = useScrollReveal();
  const gridRef = useStaggerReveal(100);

  useEffect(() => {
    const loadProds = () => {
      db.getProducts().then((prods) => {
        if (Array.isArray(prods) && prods.length > 0) {
          const published = prods.filter((p) => p.status === 'published');
          // Always display published products; fallback to all if no filter matches
          setProducts(published.length > 0 ? published : prods);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
        setIsLoading(false);
      });
    };

    loadProds();
    window.addEventListener('flix_product_updated', loadProds);
    return () => window.removeEventListener('flix_product_updated', loadProds);
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Flagship product (always FlixCore Plugin)
  const flagship =
    products.find(
      (p) =>
        p.slug === 'flixcore-plugin' ||
        p.slug === 'flixcore-practice' ||
        p.id === 'prod-flixcore-core' ||
        p.id === 'prod-flixcore-practice'
    ) || products[0] || INITIAL_PRODUCTS[0];

  const isFlagshipMatching = filteredProducts.some((p) => p.id === flagship.id);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F3EE]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090B]/90 backdrop-blur-xl px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <ChevronLeft className="w-4 h-4 text-white/40 group-hover:text-[#D7FF3F] transition-colors" />
            <FlixCoreLogo size="md" showWordmark />
          </Link>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-xl bg-[#8B5CFF]/10 border border-[#8B5CFF]/30 text-[#8B5CFF] font-mono text-xs hover:bg-[#8B5CFF]/20 transition-colors"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => onOpenHireUs('Custom Plugin Development')}
              className="btn-primary text-xs px-5 py-2.5"
            >
              <span>Hire Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 1. CATALOGUE HEADING & INTRODUCTION                                       */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} data-reveal className="pt-12 pb-6 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-xs font-mono text-[#D7FF3F]">
              <Package className="w-3.5 h-3.5" />
              <span>FLIX STUDIOS · PRODUCTION SOFTWARE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight font-display">
              MINECRAFT CORES &
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF3F] via-white to-[#8B5CFF]">
                PRODUCTION PLUGINS
              </span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/65 max-w-2xl leading-relaxed">
              Maintained, documented, and production-tested Minecraft plugins, network modules, and tools.
              Every purchase includes complete documentation, updates, and direct support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white/50 max-w-xs space-y-1 self-start lg:self-auto">
            <span className="text-white font-bold block">VERIFIED SOURCE OF TRUTH</span>
            All prices and specifications are synced with verified releases. Custom commissions quoted separately.
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 2. TOP CATALOGUE TOOLBAR: SEARCH & CATEGORY FILTERS (BEFORE LISTINGS)     */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-8">
        <div className="p-4 rounded-2xl bg-[#0E0F14] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#D7FF3F] text-black shadow-md shadow-[#D7FF3F]/20'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          {/* Search Field & Counter */}
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plugins & tools..."
                className="w-full bg-[#08090B] border border-white/10 rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F] transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-[11px] font-mono text-white/40 whitespace-nowrap hidden sm:inline">
              {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 3. FEATURED PRODUCT & PRODUCT LISTINGS                                    */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {isFlagshipMatching && (
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-12">
          <div className="relative rounded-3xl border border-[#D7FF3F]/30 bg-gradient-to-b from-[#12131A] via-[#0E0F14] to-[#0A0B0E] p-6 md:p-10 shadow-2xl overflow-hidden group">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D7FF3F]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B5CFF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual Exhibition Column (Left) */}
              <div className="lg:col-span-5 space-y-3">
                <Link
                  href={`/products/${flagship.slug}`}
                  className="block relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-xl group/img cursor-pointer"
                >
                  <img
                    src={flagship.cover_image || '/products/flixcore/cover.png'}
                    alt={flagship.name}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover/img:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-[#D7FF3F] text-black text-[10px] font-mono font-black uppercase tracking-wider">
                      FLAGSHIP RELEASE
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white">
                      v{flagship.version}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 text-right">
                    <span className="text-base font-black text-[#D7FF3F] font-mono block leading-none">
                      {flagship.price || '$49.99'}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 block">
                      {flagship.pricing_label || 'Lifetime License'}
                    </span>
                  </div>
                </Link>

                {/* Quick Image Filmstrip Preview */}
                {flagship.gallery_images && flagship.gallery_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {flagship.gallery_images.slice(0, 4).map((img, i) => (
                      <Link
                        key={i}
                        href={`/products/${flagship.slug}`}
                        className="aspect-[16/9] rounded-lg overflow-hidden border border-white/10 opacity-70 hover:opacity-100 hover:border-[#D7FF3F] transition-all"
                      >
                        <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details & Actions Column (Right) */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[#D7FF3F] uppercase tracking-widest font-bold">
                      {flagship.category}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">PUBLISHED & VERIFIED</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                    {flagship.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    {flagship.description}
                  </p>
                </div>

                {/* Verified Capabilities Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {flagship.features?.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0 mt-0.5" />
                      <span className="truncate">{feat.title}</span>
                    </div>
                  ))}
                </div>

                {/* Specifications Strip */}
                <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/90">
                    MC {flagship.supported_mc_versions}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/90">
                    {flagship.server_software.split(',').slice(0, 3).join(', ')}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#8B5CFF]/15 border border-[#8B5CFF]/30 text-[#8B5CFF] font-bold">
                    20.0 TPS ASYNC
                  </span>
                </div>

                {/* Dual Action CTAs */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/products/${flagship.slug}`}
                    className="btn-primary text-xs px-6 py-3.5 shadow-xl shadow-[#D7FF3F]/20"
                  >
                    <span>View Full Plugin Specifications & Media</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <PurchaseButton
                    purchaseUrl={flagship.purchase_url}
                    productName={flagship.name}
                    isAdmin={isAdmin}
                    onOpenAdmin={onOpenAdmin}
                    onOpenHireUs={() => onOpenHireUs('Custom Plugin Development')}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Additional Product Listings (If multiple products published) */}
      {filteredProducts.length > 1 && (
        <section className="pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight font-mono">
            All Catalogue Products
          </h3>
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProducts
              .filter((p) => p.id !== flagship.id)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenHireUs={onOpenHireUs}
                />
              ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <section className="py-24 px-4 text-center text-white/40 font-mono text-sm space-y-3">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No products match your search or category filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs text-[#D7FF3F] underline underline-offset-4"
          >
            Reset filters to view all products
          </button>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 4. REMAINING CATALOGUE CONTENT: ARCHITECTURE & SYSTEMS VISUALIZER         */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D7FF3F]" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              FlixCore Architecture & System Engine
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowSystemsVisualizer((prev) => !prev)}
            className="text-xs font-mono text-white/50 hover:text-white underline underline-offset-4"
          >
            {showSystemsVisualizer ? 'Collapse Visualizer' : 'Expand Visualizer'}
          </button>
        </div>

        {showSystemsVisualizer && <FlixCoreSystemsVisualizer className="w-full" />}
      </section>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 5. BESPOKE MINECRAFT COMMISSIONS CTA                                      */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 border-t border-white/10 bg-[#0C0D11]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D7FF3F]">
            <Terminal className="w-3.5 h-3.5" />
            <span>BESPOKE MINECRAFT COMMISSIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            NEED A BESPOKE PLUGIN OR MOD?
          </h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
            Don't see what fits your game mode? We engineer bespoke Minecraft plugins, mods, and complete
            server setups scoped strictly to your server's vision.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onOpenHireUs('Custom Plugin Development')}
              className="btn-primary text-xs px-7 py-3.5 shadow-xl shadow-[#D7FF3F]/20"
            >
              <span>Commission Custom Plugin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a href="/#pricing" className="btn-secondary text-xs px-6 py-3.5">
              <span>View Commission Rates</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Substantial Product Card ──────────────────────────────────────────────────
const ProductCard: React.FC<{
  product: Product;
  onOpenHireUs: (category?: string) => void;
}> = ({ product }) => {
  return (
    <article
      data-stagger
      className="group relative rounded-3xl border border-white/10 bg-[#0E0F14] overflow-hidden hover:border-[#D7FF3F]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between"
    >
      <div>
        {/* Cover image / visual header */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-[#14151B] to-[#0A0B0E] overflow-hidden flex items-center justify-center p-4 border-b border-white/5">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.name}
              className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-16 h-16 opacity-20 text-white">
              <Package className="w-full h-full" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF3F]/15 border border-[#D7FF3F]/30 text-[10px] font-mono text-[#D7FF3F] uppercase font-bold">
              v{product.version}
            </span>
            {product.is_featured && (
              <span className="px-2 py-0.5 rounded-full bg-[#8B5CFF]/20 border border-[#8B5CFF]/30 text-[10px] font-mono text-[#8B5CFF] uppercase font-bold">
                Featured
              </span>
            )}
          </div>

          {/* Price Tag */}
          {product.price && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-right">
              <span className="text-sm font-extrabold text-[#D7FF3F] font-mono block leading-none">
                {product.price}
              </span>
              <span className="text-[9px] font-mono text-white/50 block">
                {product.currency || 'USD'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[10px] font-mono text-[#D7FF3F] uppercase tracking-widest mb-1">
              {product.category}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#D7FF3F] transition-colors tracking-tight">
              {product.name}
            </h3>
            <p className="text-xs text-white/60 mt-1.5 leading-relaxed line-clamp-2">
              {product.tagline || product.description}
            </p>
          </div>

          {/* Software & Version Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
              MC {product.supported_mc_versions.split(' ')[0]}
            </span>
            {product.server_software
              .split(',')
              .slice(0, 2)
              .map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/50"
                >
                  {s.trim()}
                </span>
              ))}
          </div>

          {/* Features preview */}
          {product.features && product.features.length > 0 && (
            <ul className="space-y-1.5 pt-2 border-t border-white/5">
              {product.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3F] mt-1.5 shrink-0" />
                  <span className="truncate">{f.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 btn-primary text-xs py-3 justify-center"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {product.purchase_url && (
          <a
            href={product.purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Purchase on marketplace"
          >
            <ShoppingBag className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
};
