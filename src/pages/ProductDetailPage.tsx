import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'wouter';
import { db } from '../lib/db';
import { Product, Review } from '../types/database';
import { FlixCoreLogo } from '../components/FlixCoreLogo';
import { MotionPlayer } from '../motion/components/MotionPlayer';
import { FlixCoreIntroScene } from '../motion/scenes/FlixCoreIntroScene';
import { FlixCoreFeatureStoryScene } from '../motion/scenes/FlixCoreFeatureStoryScene';
import { FlixCoreCompatibilityScene } from '../motion/scenes/FlixCoreCompatibilityScene';
import { FlixCorePurchaseFinaleScene } from '../motion/scenes/FlixCorePurchaseFinaleScene';
import { CinematicProductGallery } from '../components/products/CinematicProductGallery';
import { PurchaseButton } from '../components/products/PurchaseButton';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft,
  ExternalLink,
  Shield,
  Zap,
  Server,
  Star,
  CheckCircle2,
  Layers,
  Sparkles,
  Book,
  LifeBuoy,
  MessageSquare,
  AlertCircle,
  Sliders,
  Cpu,
  Clock,
  Award,
  Activity,
  ArrowRight,
  Check,
  X,
  Lock,
  Send,
} from 'lucide-react';

interface ProductDetailPageProps {
  onOpenHireUs: (category?: string) => void;
  onOpenAccount: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onOpenHireUs,
  onOpenAccount: _onOpenAccount,
  isAdmin,
  onOpenAdmin,
}) => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { user, openAuthModal } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Verified review state
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewContent, setReviewContent] = useState<string>('');
  const [reviewContext, setReviewContext] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewFeedback, setReviewFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadProductData = useCallback(async () => {
    try {
      const [prod, allReviews] = await Promise.all([
        db.getProductBySlug(slug),
        db.getReviews(),
      ]);

      if (!prod) {
        setNotFound(true);
      } else {
        setProduct(prod);
        // Only display genuinely approved or featured reviews
        const prodReviews = allReviews.filter(
          (r) =>
            (r.product_id === prod.id ||
              (prod.id === 'prod-flixcore-core' &&
                (r.product_id === 'prod-flixcore-core' || r.product_id === 'prod-flixcore-practice'))) &&
            (r.status === 'approved' || r.status === 'featured')
        );
        setReviews(prodReviews);
      }
    } catch (err) {
      console.error('[ProductDetailPage] Load error:', err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    loadProductData();

    // Listen for realtime product updates from admin panel
    const handleSync = () => loadProductData();
    window.addEventListener('flix_product_updated', handleSync);
    return () => window.removeEventListener('flix_product_updated', handleSync);
  }, [slug, loadProductData]);

  // Strict backend review eligibility check
  useEffect(() => {
    if (user?.email && product?.id) {
      setIsCheckingEligibility(true);
      db.checkReviewEligibility(user.email, product.id)
        .then((eligible) => setIsEligible(eligible))
        .catch(() => setIsEligible(false))
        .finally(() => setIsCheckingEligibility(false));
    } else {
      setIsEligible(false);
    }
  }, [user?.email, product?.id]);

  // Handle active section highlight on scroll
  useEffect(() => {
    const sectionIds = [
      'hero',
      'overview',
      'features',
      'gallery',
      'compatibility',
      'reviews',
      'purchase',
      'support',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [product]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    setIsSubmittingReview(true);
    setReviewFeedback(null);

    try {
      const result = await db.submitReview({
        product_id: product.id,
        product_name: product.name,
        customer_id: user.id,
        customer_name: user.full_name || user.email.split('@')[0],
        customer_email: user.email,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        usage_context: reviewContext || 'Verified Customer',
      });

      if (result.success) {
        setReviewFeedback({
          type: 'success',
          message:
            'Thank you! Your verified review has been submitted for moderation and will appear once approved by our team.',
        });
        setReviewTitle('');
        setReviewContent('');
        setReviewContext('');
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewFeedback(null);
        }, 3000);
      } else {
        setReviewFeedback({
          type: 'error',
          message: result.error || 'Failed to submit review.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred submitting your review.';
      setReviewFeedback({ type: 'error', message: msg });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-2 border-[#D7FF3F]/20 border-t-[#D7FF3F] rounded-full animate-spin" />
        <span className="font-mono text-xs text-white/50 tracking-wider">LOADING FLIXCORE SUITE...</span>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Product Not Found</h1>
        <p className="text-white/50 text-sm max-w-sm">
          The requested product <span className="font-mono text-[#D7FF3F]">"{slug}"</span> could not be located in our production store.
        </p>
        <Link href="/products" className="btn-secondary text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const priceFormatted = product.price || '$49.99';
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F3EE] selection:bg-[#D7FF3F] selection:text-[#08090B] relative">
      {/* ──────────────────────────────────────────────────────────────────────────
          STICKY HEADER & NAVIGATION
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090B]/90 backdrop-blur-xl px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand & Back */}
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
              title="Return to products catalogue"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <FlixCoreLogo size="sm" />
              <div className="hidden sm:block border-l border-white/15 pl-3">
                <span className="font-['Space_Grotesk'] font-bold text-sm text-white tracking-tight">
                  {product.name}
                </span>
                <span className="ml-2 font-mono text-[10px] bg-[#D7FF3F]/10 text-[#D7FF3F] border border-[#D7FF3F]/20 px-1.5 py-0.5 rounded">
                  v{product.version}
                </span>
              </div>
            </div>
          </div>

          {/* Center: In-Page Section Anchor Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {[
              { id: 'hero', label: 'Top' },
              { id: 'overview', label: 'Overview' },
              { id: 'features', label: 'Features' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'compatibility', label: 'Compatibility' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
              { id: 'purchase', label: 'Buy' },
              { id: 'support', label: 'Support & Docs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSection === tab.id
                    ? 'bg-[#D7FF3F] text-[#08090B] font-bold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: Quick Purchase CTA & Admin */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-['Space_Grotesk'] font-bold text-sm text-[#D7FF3F] leading-none">
                {priceFormatted} USD
              </span>
              <span className="font-mono text-[9px] text-white/40 uppercase">Instant Key</span>
            </div>

            <PurchaseButton
              purchaseUrl={product.purchase_url}
              productName={product.name}
              isAdmin={isAdmin}
              onOpenAdmin={onOpenAdmin}
              onOpenHireUs={() => onOpenHireUs('plugins')}
              variant="compact"
              label={product.purchase_button_label || 'Purchase on BuiltByBit'}
            />
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION A: CINEMATIC PRODUCT HERO
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 md:px-8 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#8B5CFF]/10 blur-[130px] rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-[#D7FF3F]/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/25 text-[#D7FF3F] font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL FLAGSHIP RELEASE</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs">
              <Shield className="w-3.5 h-3.5 text-[#8B5CFF]" />
              <span>BUILTBYBIT VERIFIED</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {averageRating ? (
                <span>{averageRating} ★ ({reviews.length} VERIFIED REVIEWS)</span>
              ) : (
                <span>VERIFIED PURCHASERS ONLY</span>
              )}
            </div>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Product Information & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] tracking-tight text-white leading-[1.08]">
                {product.name}
              </h1>

              <p className="text-lg sm:text-xl text-white/70 leading-relaxed font-['Plus_Jakarta_Sans'] font-normal">
                {product.tagline ||
                  'Enterprise Practice & Competitive Duel Engine for Minecraft. Built for networks demanding 20.0 TPS stability, automated tournaments, and instant arena reset.'}
              </p>

              {/* Confirmed Technical Highlights Pill Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                  <div>
                    <span className="block text-white font-bold">20.00 TPS Locked</span>
                    <span className="text-[10px] text-white/50">Zero memory leaks</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#8B5CFF] shrink-0" />
                  <div>
                    <span className="block text-white font-bold">&lt; 5s Matchmaking</span>
                    <span className="text-[10px] text-white/50">HT5 dynamic brackets</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <div>
                    <span className="block text-white font-bold">Paper / Purpur / Folia</span>
                    <span className="text-[10px] text-white/50">1.8.8 – 1.21.4 (26.40+)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-[#F43F5E] shrink-0" />
                  <div>
                    <span className="block text-white font-bold">10+ Duel Ladders</span>
                    <span className="text-[10px] text-white/50">Custom knockback UI</span>
                  </div>
                </div>
              </div>

              {/* Primary Call-to-Action Group */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <PurchaseButton
                  purchaseUrl={product.purchase_url}
                  productName={product.name}
                  isAdmin={isAdmin}
                  onOpenAdmin={onOpenAdmin}
                  onOpenHireUs={() => onOpenHireUs('plugins')}
                  variant="primary"
                  className="text-sm px-7 py-4 rounded-xl shadow-xl shadow-[#D7FF3F]/20 font-bold"
                  label={product.purchase_button_label || `Purchase on BuiltByBit — ${priceFormatted} USD`}
                />

                <button
                  type="button"
                  onClick={() => scrollTo('features')}
                  className="px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <Layers className="w-4 h-4 text-[#D7FF3F]" />
                  <span>Explore Features</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('support')}
                  className="px-4 py-4 rounded-xl bg-transparent hover:bg-white/5 text-white/60 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Book className="w-4 h-4 text-[#8B5CFF]" />
                  <span>Documentation</span>
                </button>
              </div>

              {/* Live Escrow & Key Assurance */}
              <div className="flex items-center gap-4 text-xs font-mono text-white/40 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
                  Instant Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
                  Free Lifetime Updates
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
                  VIP Discord Role
                </span>
              </div>
            </div>

            {/* Right Column: Hero Motion Reveal */}
            <div className="lg:col-span-6 relative">
              {(product.show_hero_motion ?? true) ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0C0E14] shadow-2xl shadow-black/80 group">
                  <MotionPlayer
                    scene={FlixCoreIntroScene}
                    aspectRatio="16/9"
                    className="w-full"
                  />

                  {/* Clean Non-Technical Overlay Badge */}
                  <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[#08090B]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[11px] text-white">
                    <span className="w-2 h-2 rounded-full bg-[#D7FF3F] animate-ping" />
                    <span>OFFICIAL FLIXCORE PREVIEW</span>
                  </div>

                  <div className="absolute bottom-4 right-4 z-20">
                    <button
                      onClick={() => scrollTo('gallery')}
                      className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>View 10+ Advertising Stills</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0C0E14] shadow-2xl shadow-black/80 group">
                  <img
                    src={product.cover_image || '/products/flixcore/cover.png'}
                    alt={product.name}
                    className="w-full aspect-[16/9] object-contain bg-black/60"
                  />
                  <div className="absolute bottom-4 right-4 z-20">
                    <button
                      onClick={() => scrollTo('gallery')}
                      className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>View 10+ Advertising Stills</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION B: OVERVIEW
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="overview" className="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0A0B0E]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#8B5CFF] uppercase tracking-wider font-semibold">
              <Award className="w-4 h-4" />
              <span>Section 02 // Architectural Foundation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {product.overview_title || 'Why Premier Minecraft Networks Rely on FlixCore'}
            </h2>
            <p className="text-white/60 max-w-3xl text-base leading-relaxed font-['Plus_Jakarta_Sans']">
              {product.overview_description ||
                'Standard practice plugins suffer from severe performance bottlenecks: lag spikes during simultaneous arena resets, slow and clunky match queues, and ghost blocks during high-frequency duel exchanges. FlixCore eliminates these points of failure with an asynchronous architecture crafted for sustained concurrency.'}
            </p>
          </div>

          {/* Three Structural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-[#D7FF3F] flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Zero-Tick Arena Resets
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Utilizing non-blocking FastAsyncWorldEdit (FAWE) pipelines and Chunky preloading across 54+ arenas, duels regenerate instantaneously without freezing the server main thread.
              </p>
              <div className="pt-2 font-mono text-xs text-[#D7FF3F]">
                ✦ Instantaneous Chunk Rollback
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CFF]/10 border border-[#8B5CFF]/20 text-[#8B5CFF] flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                HT5 Dynamic Matchmaker
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Skill-based placement queues prevent entry spam by calculating strict tier rankings. Expanding 5-second search windows pair players quickly without compromising skill balance.
              </p>
              <div className="pt-2 font-mono text-xs text-[#8B5CFF]">
                ✦ Sub-5s Search Window Expansion
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                ArenaSafetyHelper Boundary
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Mathematical 3D boundary containment creates airtight arena chambers. In-combat command locking and anti-interference zones stop combat escapes and ghost spectator glitches.
              </p>
              <div className="pt-2 font-mono text-xs text-[#38BDF8]">
                ✦ 100% Boundary Isolation
              </div>
            </div>
          </div>

          {/* Editorial Visual Spotlight */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#0D0F15] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs text-[#D7FF3F] uppercase tracking-wider font-semibold">
                CORE SYSTEM CAPABILITIES
              </span>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Clean Editorial Overview &amp; Real In-Game UI
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                FlixCore ships with custom BlockDisplay elevator platforms rising from depth 5, interactive kit customizers with armor trim progression, and an autonomous tournament engine supporting Sumo, Spleef, and Clan ladders.
              </p>
              <ul className="space-y-2 text-xs font-mono text-white/70">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D7FF3F]" />
                  <span>BlockDisplay underground elevators &amp; sliding doors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D7FF3F]" />
                  <span>Standalone Clan system with async points economy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D7FF3F]" />
                  <span>Ten game modes: TNT Tag, Bedwars, Skywars, Sumo &amp; FFA</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/40 group">
                <img
                  src="/products/flixcore/cover.png"
                  alt="FlixCore Plugin Editorial Overview"
                  className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-[#08090B]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-[11px] font-mono text-white/80">
                  FlixCore v{product.version} High-Resolution Artwork
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION C: FEATURES
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 md:px-8 border-b border-white/5 bg-[#08090B]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7FF3F] uppercase tracking-wider font-semibold">
                <Layers className="w-4 h-4" />
                <span>Section 03 // Confirmed Core Subsystems</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                {product.features_title || 'Comprehensive Competitive Feature Matrix'}
              </h2>
              <p className="text-white/60 max-w-2xl text-base leading-relaxed">
                {product.features_description ||
                  'Built on genuine configuration parameters verified from production FlixCore server environments.'}
              </p>
            </div>

            <div className="hidden md:block">
              <span className="font-mono text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                5 Confirmed Engine Modules
              </span>
            </div>
          </div>

          {/* Embedded Motion Player: Feature Storytelling */}
          {(product.show_features_motion ?? true) && (
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0A0C11] shadow-xl">
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                  <Cpu className="w-4 h-4 text-[#8B5CFF]" />
                  <span>{product.features_title || 'Feature Subsystems & Architecture'}</span>
                </div>
                <span className="font-mono text-[10px] text-[#D7FF3F] bg-[#D7FF3F]/10 px-2 py-0.5 rounded">
                  Verified Engine Specs
                </span>
              </div>
              <MotionPlayer
                scene={FlixCoreFeatureStoryScene}
                aspectRatio="21/9"
                className="w-full"
              />
            </div>
          )}

          {/* Feature Cards with Confirmed Product Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 01 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D7FF3F]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#D7FF3F] font-bold">MODULE 01</span>
                <span className="p-2 rounded-xl bg-[#D7FF3F]/10 text-[#D7FF3F]">
                  <Sliders className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                10+ Balanced Kits &amp; Armor Trims
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                Includes Nodebuff, Debuff, Gapple, Combo, BuildUHC, Crystal, Sumo, Archer, Soup, and Bedfight. Players can customize armor trim patterns unlocked through competitive wins.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/70 space-y-1">
                <div className="text-white/40">// Kit Config Sample</div>
                <div className="text-[#D7FF3F]">ladder: NODEBUFF_POTION</div>
                <div>knockback_profile: "ranked_strict_v2"</div>
                <div>armor_trim_req: TIER_IV_DIAMOND</div>
              </div>
            </div>

            {/* Feature 02 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#8B5CFF]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#8B5CFF] font-bold">MODULE 02</span>
                <span className="p-2 rounded-xl bg-[#8B5CFF]/10 text-[#8B5CFF]">
                  <Activity className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                HT5 Dynamic Tier Matchmaking
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                Placement matches calculate raw tiers and prevent entry spam. Dynamic queue windows expand by 50 Elo points every 5 seconds, pairing combatants with zero deadlocks.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/70 space-y-1">
                <div className="text-white/40">// Matchmaker Telemetry</div>
                <div className="text-[#8B5CFF]">placement_matches: 5</div>
                <div>window_expansion_interval: 5.0s</div>
                <div>strict_ping_threshold: 45ms</div>
              </div>
            </div>

            {/* Feature 03 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#38BDF8]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#38BDF8] font-bold">MODULE 03</span>
                <span className="p-2 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
                  <Shield className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                ArenaSafetyHelper 3D Bounding
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                Airtight cubic boundary detection prevents pearls from clipping into bedrock or adjacent arenas. Automatic player jails lock out exploit commands during duel countdowns.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/70 space-y-1">
                <div className="text-white/40">// Boundary Security</div>
                <div className="text-[#38BDF8]">containment_mode: MATHEMATICAL_3D</div>
                <div>anti_pearl_glitch: ENABLED</div>
                <div>combat_command_jail: STRICT</div>
              </div>
            </div>

            {/* Feature 04 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#F43F5E]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#F43F5E] font-bold">MODULE 04</span>
                <span className="p-2 rounded-xl bg-[#F43F5E]/10 text-[#F43F5E]">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Automated Tournaments &amp; Brackets
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                Supports Solo, Party, and Clan tournament formats with automated bracket sequencing. Spectator HUD displays real-time health, potions remaining, and parabolic round rewinds.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/70 space-y-1">
                <div className="text-white/40">// Tournament Engine</div>
                <div className="text-[#F43F5E]">modes: [SOLO, PARTY, CLAN]</div>
                <div>bracket_auto_seed: TRUE</div>
                <div>spectator_hud_sync: 20TPS</div>
              </div>
            </div>

            {/* Feature 05 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#22D3EE]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#22D3EE] font-bold">MODULE 05</span>
                <span className="p-2 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE]">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                20.0 TPS Engine &amp; World Preloading
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                Chunky arena preloading caches 54+ arenas at server boot. HikariCP database pool executes all player stats and match records off the main thread to ensure rock-solid TPS.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/70 space-y-1">
                <div className="text-white/40">// Engine Specs</div>
                <div className="text-[#22D3EE]">hikaricp_pool_size: 10</div>
                <div>async_world_edit: FAWE_PIPELINE</div>
                <div>folia_thread_safety: CERTIFIED</div>
              </div>
            </div>

            {/* Feature 06 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#F59E0B]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#F59E0B] font-bold">MODULE 06</span>
                <span className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Server className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Velocity Limbo &amp; Cross-Server Sync
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                Integrated Redis pub/sub synchronizes match queues across multi-lobby BungeeCord or Velocity proxies, keeping duel arenas clean and isolated on dedicated game nodes.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/70 space-y-1">
                <div className="text-white/40">// Network Sync</div>
                <div className="text-[#F59E0B]">redis_pubsub: ACTIVATED</div>
                <div>limbo_queue_handshake: &lt; 8ms</div>
                <div>cross_proxy_stats: ENABLED</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION D: ADVERTISING IMAGE GALLERY
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7FF3F] uppercase tracking-wider font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Section 04 // Advertising Imagery &amp; Production Proof</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                {product.gallery_title || 'Interactive High-Resolution Product Gallery'}
              </h2>
              <p className="text-white/60 max-w-2xl text-base leading-relaxed font-['Plus_Jakarta_Sans']">
                {product.gallery_description ||
                  'Explore confirmed in-game UI layouts, matchmaking screens, elevator platforms, and arena bounding mechanics captured directly from production deployments.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTo('purchase')}
                className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold"
              >
                Buy FlixCore — {priceFormatted}
              </button>
            </div>
          </div>

          {/* Clean High-Resolution Advertising Gallery */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#08090B] border border-white/10 shadow-2xl">
            <CinematicProductGallery
              images={product.gallery_images || []}
              productName={product.name}
              coverImage={product.cover_image}
            />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION E: COMPATIBILITY & RUNTIME MATRIX
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="compatibility" className="py-20 px-4 md:px-8 border-b border-white/5 bg-[#08090B]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#38BDF8] uppercase tracking-wider font-semibold">
              <Server className="w-4 h-4" />
              <span>Section 05 // Technical Runtime Specifications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {product.compatibility_title || 'Enterprise Multi-Version & Software Matrix'}
            </h2>
            <p className="text-white/60 max-w-3xl text-base leading-relaxed font-['Plus_Jakarta_Sans']">
              {product.compatibility_description ||
                'Engineered with native abstraction layers for protocol translation, multithreaded region compatibility, and thread-safe async persistence.'}
            </p>
          </div>

          {/* 4 Software Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#D7FF3F] bg-[#D7FF3F]/10 px-2 py-0.5 rounded font-bold">
                  CORE PLATFORM
                </span>
                <Server className="w-4 h-4 text-[#D7FF3F]" />
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                PaperMC &amp; Purpur
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Full native integration. Custom event listeners bypass Bukkit overhead for tick-accurate duel hit registration.
              </p>
              <div className="pt-2 font-mono text-[11px] text-white/80 space-y-1 border-t border-white/5">
                <div>Minecraft: <span className="text-[#D7FF3F]">1.8.8 – 1.21.4 (26.40+)</span></div>
                <div>Tick Target: <span className="text-[#D7FF3F]">20.00 TPS</span></div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8B5CFF] bg-[#8B5CFF]/10 px-2 py-0.5 rounded font-bold">
                  MULTITHREADED
                </span>
                <Cpu className="w-4 h-4 text-[#8B5CFF]" />
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Folia Region Engine
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Region-locked arena isolation prevents cross-chunk thread stalls. Lock-free queues synchronize player inventories.
              </p>
              <div className="pt-2 font-mono text-[11px] text-white/80 space-y-1 border-t border-white/5">
                <div>Folia Support: <span className="text-[#8B5CFF]">Certified Thread-Safe</span></div>
                <div>Deadlock Protection: <span className="text-[#8B5CFF]">Zero Locks</span></div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded font-bold">
                  PROXY NETWORK
                </span>
                <Activity className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Velocity &amp; Bungee
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Velocity Limbo handshake teleports waiting players to isolated holding worlds without allocating physical arenas.
              </p>
              <div className="pt-2 font-mono text-[11px] text-white/80 space-y-1 border-t border-white/5">
                <div>Velocity: <span className="text-[#38BDF8]">v3.3.0+ Enterprise</span></div>
                <div>Queue Sync: <span className="text-[#38BDF8]">Redis Pub/Sub</span></div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded font-bold">
                  RUNTIME
                </span>
                <Sliders className="w-4 h-4 text-[#F43F5E]" />
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Java 17 &amp; 21 LTS
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Compiled with vectorized math optimizations. Highly compatible with G1GC, ZGC, and Shenandoah collectors.
              </p>
              <div className="pt-2 font-mono text-[11px] text-white/80 space-y-1 border-t border-white/5">
                <div>Java: <span className="text-[#F43F5E]">64-Bit Java 17/21</span></div>
                <div>Dependencies: <span className="text-[#F43F5E]">FAWE, Chunky (Opt)</span></div>
              </div>
            </div>
          </div>

          {/* Embedded Compatibility Motion Scene */}
          {(product.show_compatibility_motion ?? true) && (
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0C0E14] shadow-xl">
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                  <Activity className="w-4 h-4 text-[#D7FF3F]" />
                  <span>{product.compatibility_title || 'Enterprise Runtime Architecture'}</span>
                </div>
                <span className="font-mono text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded font-bold">
                  Certified 1.8.8 – 1.21.4
                </span>
              </div>
              <MotionPlayer
                scene={FlixCoreCompatibilityScene}
                aspectRatio="21/9"
                className="w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION F: VERIFIED REVIEWS ONLY
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>Section 06 // Community Feedback &amp; Verified Reviews</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                {product.reviews_title || 'Verified Customer Reviews'}
              </h2>
              <p className="text-white/60 max-w-2xl text-base leading-relaxed font-['Plus_Jakarta_Sans']">
                {product.reviews_description ||
                  'Authentic testimonials submitted by production Minecraft server administrators and verified purchasers.'}
              </p>
            </div>

            {/* Scorecard & Verified Buyer Action */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 font-mono">
                <div className="text-3xl font-bold font-['Space_Grotesk'] text-amber-400 leading-none">
                  {averageRating || '—'}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex text-amber-400">
                    {averageRating ? '★'.repeat(Math.round(Number(averageRating))) : '★★★★★'}
                  </div>
                  <div className="text-white/50 text-[10px]">
                    {reviews.length > 0 ? `${reviews.length} VERIFIED REVIEWS` : 'VERIFIED REVIEWS ONLY'}
                  </div>
                </div>
              </div>

              {isEligible && (
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn-primary text-xs px-4 py-3 rounded-xl font-bold font-mono inline-flex items-center gap-2"
                >
                  <Star className="w-3.5 h-3.5 fill-black" />
                  <span>Write Review</span>
                </button>
              )}
            </div>
          </div>

          {/* Reviews List or Strictly Styled Verified Empty State */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 text-sm">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-[#D7FF3F] text-[10px] font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>VERIFIED PURCHASER</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white leading-snug">
                      "{rev.title}"
                    </h3>

                    <p className="text-xs text-white/70 leading-relaxed font-['Plus_Jakarta_Sans']">
                      {rev.content}
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <div>
                      <span className="block text-white font-bold">{rev.customer_name}</span>
                      <span className="text-[10px] text-white/40">{rev.usage_context || 'Verified Server Owner'}</span>
                    </div>
                    <span className="text-white/30">
                      {new Date(rev.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 md:p-14 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 flex items-center justify-center mx-auto text-[#D7FF3F]">
                <Shield className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  {product.reviews_empty_message || 'Be the first verified purchaser to share your experience.'}
                </h3>
                <p className="text-sm text-white/50 max-w-lg mx-auto font-['Plus_Jakarta_Sans'] leading-relaxed">
                  We maintain a 100% genuine review standard. Reviews are strictly limited to confirmed purchasers with active licenses verified by Flix Studios.
                </p>
              </div>

              {isEligible ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="btn-primary text-xs px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 fill-black" />
                    <span>Write a Verified Review</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <PurchaseButton
                    purchaseUrl={product.purchase_url}
                    productName={product.name}
                    variant="primary"
                    label={product.purchase_button_label || `Purchase on BuiltByBit — ${priceFormatted} USD`}
                  />
                  {!user ? (
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#8B5CFF]" />
                      <span>Sign In to Verify License</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-white/40 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                      Purchased FlixCore? Contact admin to activate your verified review permission.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION G: PURCHASE FINALE
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="purchase" className="py-24 px-4 md:px-8 border-b border-white/5 bg-[#08090B] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[350px] bg-[#D7FF3F]/10 blur-[140px] rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[350px] bg-[#8B5CFF]/15 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          {/* Conversion Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0E1015] border-2 border-[#D7FF3F]/40 shadow-2xl shadow-[#D7FF3F]/10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7FF3F] font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>OFFICIAL BUILTBYBIT ESCROW CHECKOUT</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold font-['Space_Grotesk'] text-white">
                  {product.purchase_title || 'Get FlixCore Plugin'}
                </h2>
                <p className="text-sm sm:text-base text-white/60 font-['Plus_Jakarta_Sans']">
                  {product.purchase_description ||
                    'Immediate digital license delivery with complete future update access.'}
                </p>
              </div>

              {/* Price Callout */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-right shrink-0">
                <span className="block text-4xl sm:text-5xl font-bold font-['Space_Grotesk'] text-[#D7FF3F] leading-none">
                  {priceFormatted}
                </span>
                <span className="font-mono text-xs text-white/50 block mt-1">
                  USD // ONE-TIME PURCHASE
                </span>
              </div>
            </div>

            {/* Inclusions List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                <span>Instant binary download &amp; license key</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                <span>Supports 1.8.8 through 1.21.4 (26.40+ compatible)</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                <span>Lifetime free updates &amp; performance patches</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                <span>Complete Java developer API &amp; custom event hooks</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                <span>Discord VIP customer lounge &amp; direct ticket support</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF3F] shrink-0" />
                <span>100% money-back escrow protection via BuiltByBit</span>
              </div>
            </div>

            {/* Dominant CTA Button */}
            <div className="pt-4">
              <PurchaseButton
                purchaseUrl={product.purchase_url}
                productName={product.name}
                isAdmin={isAdmin}
                onOpenAdmin={onOpenAdmin}
                onOpenHireUs={() => onOpenHireUs('plugins')}
                variant="block"
                className="py-5 text-base rounded-2xl shadow-2xl shadow-[#D7FF3F]/30 font-bold"
                label={product.purchase_button_label || `Purchase on BuiltByBit — ${priceFormatted} USD ↗`}
              />
            </div>
          </div>

          {/* Embedded Purchase Finale Motion Companion */}
          {(product.show_purchase_motion ?? true) && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0C0E14] shadow-xl">
              <MotionPlayer
                scene={FlixCorePurchaseFinaleScene}
                aspectRatio="21/9"
                className="w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION H: SUPPORT AND DOCUMENTATION
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="support" className="py-20 px-4 md:px-8 bg-[#0A0B0E]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#8B5CFF] uppercase tracking-wider font-semibold">
              <LifeBuoy className="w-4 h-4" />
              <span>Section 08 // Knowledge Base &amp; Custom Commissions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {product.support_title || 'Official Documentation & Dedicated Support'}
            </h2>
            <p className="text-white/60 max-w-3xl text-base leading-relaxed font-['Plus_Jakarta_Sans']">
              {product.support_description ||
                'Access comprehensive deployment guides, configuration examples, Java event listeners, or commission Flix Studios for custom modifications and bespoke gamemodes.'}
            </p>
          </div>

          {/* 3 Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wiki Documentation */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#D7FF3F]/10 text-[#D7FF3F] w-fit">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Technical Documentation
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                  Complete setup wiki covering FAWE schematics, Chunky preload arguments, MySQL connection pools, and knockback fine-tuning.
                </p>
              </div>
              <a
                href={product.documentation_url || 'https://docs.flixstudios.dev/flixcore'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center justify-between transition-colors border border-white/10 group"
              >
                <span>Read Full Wiki</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D7FF3F] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Discord Support */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#8B5CFF]/10 text-[#8B5CFF] w-fit">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Discord Community &amp; VIP Desk
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                  Join 2,400+ Minecraft server owners. Verified purchasers gain access to priority private tickets and direct patch builds.
                </p>
              </div>
              <a
                href={product.support_url || 'https://discord.gg/flixcore'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center justify-between transition-colors border border-white/10 group"
              >
                <span>Join Discord Lounge</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8B5CFF] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Custom Commission Dispatch */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Need Custom Modifications?
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-['Plus_Jakarta_Sans']">
                  Our core engineering team is available for custom plugin forks, bespoke minigames, and complete network infrastructure setups.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenHireUs('plugins')}
                className="px-4 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf430] text-[#08090B] font-mono text-xs font-bold flex items-center justify-between transition-colors shadow-lg shadow-[#D7FF3F]/15"
              >
                <span>Hire Flix Studios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          STRICT VERIFIED PURCHASER REVIEW MODAL (ONLY ACCESSIBLE TO VERIFIED BUYERS)
      ────────────────────────────────────────────────────────────────────────── */}
      {isEligible && isReviewModalOpen && (
        <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0D0E12] border border-[#D7FF3F]/30 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#D7FF3F]/10 text-[#D7FF3F]">
                  <Shield className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    Submit Verified Customer Review
                  </h3>
                  <p className="text-xs font-mono text-white/50">
                    {user?.email} • Verified License Holder
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback Alert */}
            {reviewFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5 ${
                  reviewFeedback.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {reviewFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{reviewFeedback.message}</span>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating Star Selector */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-2 uppercase">
                  Rating (1 – 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-transform hover:scale-125 focus:outline-none ${
                        star <= reviewRating ? 'text-amber-400' : 'text-white/20'
                      }`}
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="font-mono text-xs text-white/50 ml-2">
                    {reviewRating === 5 && 'Outstanding (5/5)'}
                    {reviewRating === 4 && 'Great (4/5)'}
                    {reviewRating === 3 && 'Average (3/5)'}
                    {reviewRating === 2 && 'Needs Improvement (2/5)'}
                    {reviewRating === 1 && 'Poor (1/5)'}
                  </span>
                </div>
              </div>

              {/* Review Headline / Title */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Flawless 20.0 TPS duel performance on 1.21.4"
                  className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              {/* Usage Context / Server Spec */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase">
                  Server Name / Environment Context
                </label>
                <input
                  type="text"
                  value={reviewContext}
                  onChange={(e) => setReviewContext(e.target.value)}
                  placeholder="e.g. Network Owner (350+ players) / PaperMC 1.21"
                  className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase">
                  Detailed Experience &amp; Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Describe your authentic experience running FlixCore on your server network..."
                  className="w-full bg-[#14151B] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] resize-none leading-relaxed"
                />
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-white/40 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#D7FF3F] shrink-0 mt-0.5" />
                <span>
                  Reviews are authenticated against your registered license record. Submitted reviews are reviewed by administrators before being published publicly.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="btn-primary text-xs px-5 py-2.5 font-bold font-mono inline-flex items-center gap-2"
                >
                  {isSubmittingReview ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Verified Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
