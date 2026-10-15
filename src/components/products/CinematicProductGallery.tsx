import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Layers,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface GalleryMetadata {
  title: string;
  category: string;
  caption: string;
}

const DEFAULT_METADATA_MAP: Record<string, GalleryMetadata> = {
  'cover.png': {
    title: 'FlixCore Flagship Edition',
    category: 'COVER OVERVIEW',
    caption: 'Supports latest Minecraft versions (26.40+ compatible). Smooth, stable, and always updated.',
  },
  '1.png': {
    title: '10+ Custom Kits & Armor Trims',
    category: 'KITS & COSMETICS',
    caption: '10+ uniquely balanced combat kits, UI-driven presets, complete kit editor, and armor trim customizer.',
  },
  '2.png': {
    title: 'Clan Systems & 10 Game Modes',
    category: 'CLANS & MODES',
    caption: 'Standalone clan system with async backend, points economy, and 10 modes including TNT Tag, Bedwars & Skywars.',
  },
  '3.png': {
    title: 'Elevator Platforms & Visual Gates',
    category: 'CINEMATICS & IMMERSION',
    caption: 'BlockDisplay underground elevator platforms, kit-based Totem pop animations, and parabolic round rewinds.',
  },
  '4.png': {
    title: 'Ranked Tier Game Modes',
    category: 'TIER MATCHMAKING',
    caption: 'Organized competitive experience with kit-specific tiers (HT5), placement matches, and one-click action queues.',
  },
  '5.png': {
    title: 'Arena Bounding & Asynchronous Engine',
    category: 'SECURITY & 20.0 TPS',
    caption: 'ArenaSafetyHelper mathematical bounding, in-combat command jail, chunky preloading, and async HikariCP.',
  },
  '6.png': {
    title: 'Combat Mastery & Tournament Engine',
    category: 'TOURNAMENTS & COMBAT',
    caption: 'Party play, coinshop kill effects, and built-in Solo/Party/Clan tournaments with auto-brackets for Sumo and Spleef.',
  },
  '7.png': {
    title: 'Skill-Based Tier Matchmaking',
    category: 'DYNAMIC QUEUE EXPANSION',
    caption: 'Tier-first pairing with 5s expanding search windows and asynchronous non-blocking queries.',
  },
  '8.png': {
    title: 'Ranked Kit Ladders & Personal Settings',
    category: 'GAMEPLAY & SETTINGS',
    caption: 'Dedicated tiered queues (Crystal, Nodebuff, Mace) and player toggles for Auto GG, Auto Requeue, and scoreboard.',
  },
  '9.png': {
    title: 'Match Events & Sequencer',
    category: 'MATCH EVENTS',
    caption: 'Arena cage doors opening, blindness cinematic tension, and live countdown timer before teleportation.',
  },
};

interface CinematicProductGalleryProps {
  images: string[];
  productName: string;
  coverImage?: string;
  className?: string;
}

export const CinematicProductGallery: React.FC<CinematicProductGalleryProps> = ({
  images,
  productName,
  coverImage,
  className = '',
}) => {
  // Combine cover and gallery images, filtering duplicates and empty paths
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (coverImage && coverImage.trim()) list.push(coverImage.trim());
    if (images && Array.isArray(images)) {
      images.forEach((img) => {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list.length > 0 ? list : ['/products/flixcore/cover.png'];
  }, [coverImage, images]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  // Safely clamp currentIndex if images change
  const activeIndex = Math.min(Math.max(0, currentIndex), allImages.length - 1);
  const activeImage = allImages[activeIndex] || allImages[0];

  const getImageMeta = useCallback((imgUrl: string, idx: number): GalleryMetadata => {
    const filename = imgUrl.split('/').pop() || '';
    if (DEFAULT_METADATA_MAP[filename]) {
      return DEFAULT_METADATA_MAP[filename];
    }
    return {
      title: `${productName} Showcase Slide ${idx + 1}`,
      category: idx === 0 ? 'COVER OVERVIEW' : 'FEATURE SHOWCASE',
      caption: 'Official product media and interface screenshots from production server builds.',
    };
  }, [productName]);

  const activeMeta = getImageMeta(activeImage, activeIndex);

  // Manual Navigation (NO auto-advance!)
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  }, [allImages.length]);

  // Keyboard navigation for gallery & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Secondary indices for layered depth previews
  const prevIndex = activeIndex > 0 ? activeIndex - 1 : allImages.length - 1;
  const nextIndex = activeIndex < allImages.length - 1 ? activeIndex + 1 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gallery Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-[#D7FF3F]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Art-Directed Media Gallery</h3>
            <p className="text-xs font-mono text-white/50">
              {allImages.length} Genuine Advertising & Gameplay Showcase Slides
            </p>
          </div>
        </div>

        {/* Counter & Lightbox Launcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/60 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            SLIDE <span className="text-[#D7FF3F] font-bold">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(allImages.length).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Cinematic Main Stage with Layered Depth Previews */}
      <div className="relative py-2 select-none">
        {/* Ambient Backlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CFF]/10 via-[#D7FF3F]/10 to-[#8B5CFF]/10 rounded-3xl blur-3xl opacity-60 pointer-events-none" />

        <div className="relative flex items-center justify-center gap-4 lg:gap-6">
          {/* Left Secondary Layered Depth Card (Desktop) */}
          {allImages.length > 1 && (
            <div
              onClick={handlePrev}
              className="hidden lg:block w-[18%] aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-[#0E0F14] opacity-40 hover:opacity-80 transition-all duration-300 transform -scale-90 -rotate-2 cursor-pointer shrink-0 shadow-xl group hover:border-[#8B5CFF]/40"
              title="Click to view previous slide"
            >
              <img
                src={allImages[prevIndex]}
                alt="Previous slide preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
          )}

          {/* Primary Focal Exhibition Display */}
          <div
            className="relative w-full lg:w-[68%] rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-[#0A0B0E] shadow-[0_20px_60px_rgba(0,0,0,0.85)] group cursor-pointer aspect-[16/9] flex items-center justify-center"
            onClick={() => setIsLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* The High-Resolution Real Product Image */}
            <img
              key={activeImage}
              src={activeImage}
              alt={activeMeta.title}
              className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.01]"
              loading="eager"
            />

            {/* Top Badge Overlay */}
            <div className="absolute top-3.5 left-3.5 md:top-5 md:left-5 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-mono font-bold text-[#D7FF3F] tracking-wider uppercase">
                {activeMeta.category}
              </span>
            </div>

            {/* Top Right Enlarge Indicator */}
            <div className="absolute top-3.5 right-3.5 md:top-5 md:right-5 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/70 group-hover:text-white group-hover:scale-110 transition-all">
              <Maximize2 className="w-4 h-4 text-[#D7FF3F]" />
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-[2px] transition-opacity">
              <h4 className="text-base md:text-xl font-bold text-white tracking-tight">
                {activeMeta.title}
              </h4>
              <p className="text-xs md:text-sm text-white/70 mt-1 max-w-2xl line-clamp-2 leading-relaxed">
                {activeMeta.caption}
              </p>
            </div>

            {/* Subtle Navigation Arrows inside hero on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#D7FF3F] text-white hover:text-black border border-white/10 transition-all opacity-80 md:opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#D7FF3F] text-white hover:text-black border border-white/10 transition-all opacity-80 md:opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Secondary Layered Depth Card (Desktop) */}
          {allImages.length > 1 && (
            <div
              onClick={handleNext}
              className="hidden lg:block w-[18%] aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-[#0E0F14] opacity-40 hover:opacity-80 transition-all duration-300 transform scale-90 rotate-2 cursor-pointer shrink-0 shadow-xl group hover:border-[#D7FF3F]/40"
              title="Click to view next slide"
            >
              <img
                src={allImages[nextIndex]}
                alt="Next slide preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Filmstrip / Thumbnails Deck */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-white/50">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span>Select Slide to Inspect:</span>
          </span>
          <span>Click any thumbnail to jump</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10">
          {allImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            const meta = getImageMeta(img, idx);

            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`group relative shrink-0 w-28 sm:w-36 aspect-[16/9] rounded-xl overflow-hidden border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#D7FF3F] shadow-[0_0_15px_rgba(215,255,63,0.3)] ring-1 ring-[#D7FF3F]'
                    : 'border-white/10 bg-[#0D0E12] opacity-60 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <img
                  src={img}
                  alt={meta.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />

                {/* Number Badge */}
                <span
                  className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    isSelected ? 'bg-[#D7FF3F] text-black' : 'bg-black/70 text-white/80'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Selected Indicator Check */}
                {isSelected && (
                  <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D7FF3F] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Product Media Lightbox"
        >
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-xs font-mono font-bold text-[#D7FF3F]">
                SLIDE {String(activeIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
              </span>
              <span className="text-sm font-bold text-white hidden sm:inline">
                {activeMeta.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div className="relative flex-1 flex items-center justify-center p-2 md:p-6 select-none max-h-[82vh]">
            <img
              src={activeImage}
              alt={activeMeta.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform"
            />

            {/* Previous Control */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-2 md:left-6 p-3.5 rounded-full bg-black/70 hover:bg-[#D7FF3F] text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Control */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-2 md:right-6 p-3.5 rounded-full bg-black/70 hover:bg-[#D7FF3F] text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Caption Bar */}
          <div className="p-4 rounded-2xl bg-[#0D0E12]/90 border border-white/10 max-w-3xl mx-auto w-full text-center space-y-1">
            <h4 className="text-base font-bold text-white">{activeMeta.title}</h4>
            <p className="text-xs text-white/60 leading-relaxed font-sans">{activeMeta.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};
