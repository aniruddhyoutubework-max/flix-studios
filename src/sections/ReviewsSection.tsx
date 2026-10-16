import React, { useState } from 'react';
import { Review } from '../types/database';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { Star, ShieldCheck, CheckCircle, Image as ImageIcon, MessageSquare, ArrowRight } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenAccount: () => void;
  onOpenHireUs: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onOpenAccount,
  onOpenHireUs,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const headerRef = useScrollReveal();
  const reviewsGridRef = useStaggerReveal(100);

  // Filter only approved and featured reviews
  const publicReviews = reviews.filter((r) => r.status === 'approved' || r.status === 'featured');

  return (
    <section id="reviews" className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div ref={headerRef} data-reveal className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-xs font-mono text-[#00D2FF] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAID-PURCHASER VERIFICATION REQUIRED</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            VERIFIED REVIEWS
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-xl mt-3 leading-relaxed">
            Reviews on Flix Studios are strictly limited to confirmed customers who purchased our
            plugins or commissioned bespoke development.
          </p>
        </div>

        <button
          onClick={onOpenAccount}
          className="btn-secondary self-start md:self-auto text-xs px-5 py-2.5"
        >
          <span>Submit Review via Account</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00D2FF]" />
        </button>
      </div>

      {publicReviews.length === 0 ? (
        <div className="p-10 rounded-3xl border border-dashed border-white/10 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/30 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Public Reviews Published Yet</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            To prevent fake testimonials, all reviews must be submitted by accounts verified through
            marketplace purchase notifications or direct studio invoices.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onOpenAccount}
              className="btn-primary text-xs px-5 py-2.5"
            >
              Access Customer Portal
            </button>
            <button
              onClick={onOpenHireUs}
              className="btn-secondary text-xs px-5 py-2.5"
            >
              Commission Custom Plugin
            </button>
          </div>
        </div>
      ) : (
        <div ref={reviewsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicReviews.map((rev) => (
            <div
              key={rev.id}
              data-stagger
              className="p-6 rounded-3xl bg-[#0B0C0E] border border-white/10 hover:border-[#00D2FF]/30 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Verified Purchaser Badge */}
                  {rev.is_verified_purchaser && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-[10px] font-mono text-[#00D2FF]">
                      <CheckCircle className="w-3 h-3" />
                      <span>VERIFIED PURCHASER</span>
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white tracking-tight">{rev.title}</h4>
                <p className="text-xs text-white/70 leading-relaxed">{rev.content}</p>

                {/* Optional Customer Screenshot */}
                {rev.images && rev.images.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedImage(rev.images[0])}
                      className="group relative rounded-xl overflow-hidden border border-white/10 block w-full aspect-video bg-black/60"
                    >
                      <img
                        src={rev.images[0]}
                        alt="Customer Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-mono text-white gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span>Enlarge Proof</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="text-white font-medium">{rev.customer_name}</span>
                <span>{rev.product_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for customer screenshots */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedImage}
            alt="Enlarged Proof"
            className="max-w-4xl max-h-[85vh] rounded-2xl border border-white/20 shadow-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
};
