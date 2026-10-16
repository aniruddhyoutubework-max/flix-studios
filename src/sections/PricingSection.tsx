import React, { useState } from 'react';
import { PricingPlan } from '../types/database';
import { INITIAL_PRICING } from '../lib/db';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { Check, X as XIcon, HelpCircle, ArrowRight, ShieldCheck, Clock, Layers, DollarSign } from 'lucide-react';

interface PricingSectionProps {
  plans?: PricingPlan[];
  introOverride?: string;
  onOpenHireUsWithCategory: (category: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  plans = INITIAL_PRICING,
  introOverride,
  onOpenHireUsWithCategory,
}) => {
  const [activePlanIdx, setActivePlanIdx] = useState<number>(0);
  const headerRef = useScrollReveal();
  const gridRef = useStaggerReveal(120);

  const categoryParamMap: Record<string, string> = {
    plugin: 'Custom Plugin Development',
    mod: 'Custom Minecraft Mod Development',
    setup: 'Minecraft Server Setup & Configuration',
    product: 'Enterprise Network Architecture',
  };

  const visiblePlans = plans.filter((p) => p.is_published !== false);

  return (
    <section id="pricing" className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div ref={headerRef} data-reveal className="mb-14 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-xs font-mono text-[#00D2FF] mb-4">
          <DollarSign className="w-3.5 h-3.5" />
          <span>FAIR & TRANSPARENT RATES</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
          TRANSPARENT PRICING & QUOTES
        </h2>
        <p className="text-sm md:text-base text-white/60 mt-3 leading-relaxed">
          {introOverride ||
            'No fake crossed-out discounts, no artificial urgency, and no hidden fees. We price every commission realistically based on technical complexity, integrations, and agreed scope.'}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {visiblePlans.map((plan, idx) => {
          const categoryName = categoryParamMap[plan.category] || 'Custom Plugin Development';
          const isFeatured = idx === 0;

          return (
            <div
              key={plan.id}
              data-stagger
              className={`rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative mc-panel hover:-translate-y-1.5 ${
                isFeatured
                  ? 'bg-gradient-to-b from-[#13171F] to-[#0A0B0E] border-2 border-[#00D2FF]/70 shadow-[0_20px_60px_rgba(0,210,255,0.15)]'
                  : 'bg-gradient-to-b from-[#101217] to-[#08090B] border border-white/10 hover:border-white/30'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00D2FF] text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <span>⚔️</span>
                  <span>MOST COMMISSIONED TIER</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Title & Badge */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2">
                    <span className="uppercase">{plan.category} DEVELOPMENT</span>
                    <span className="flex items-center gap-1 text-[#00D2FF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{plan.estimated_timeline}</span>
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {plan.service_title}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
                      {plan.starting_price}
                    </span>
                    <span className="text-xs font-mono text-white/50">/ project-based</span>
                  </div>
                  <p className="text-[11px] font-mono text-white/40">
                    Exact quote agreed after technical requirement scoping
                  </p>
                </div>

                {/* Summary */}
                <p className="text-xs text-white/70 leading-relaxed">{plan.summary}</p>

                {/* Inclusions */}
                <div className="space-y-2.5 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
                    What Is Included:
                  </span>
                  <ul className="space-y-2">
                    {plan.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/80 leading-normal">
                        <Check className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clear Limitations */}
                {plan.limitations && plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
                      Scope Boundaries:
                    </span>
                    <ul className="space-y-1.5">
                      {plan.limitations.map((lim, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/50 leading-relaxed">
                          <XIcon className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-8 mt-8 border-t border-white/10 space-y-3">
                <button
                  onClick={() => onOpenHireUsWithCategory(categoryName)}
                  className={`w-full justify-center text-xs py-3.5 ${
                    isFeatured
                      ? 'btn-primary'
                      : 'btn-secondary hover:border-[#00D2FF]/40 hover:bg-white/10'
                  }`}
                >
                  <span>
                    {plan.hire_action_label ||
                      (plan.price_model === 'quote'
                        ? 'Request a Custom Quote'
                        : `Request a ${plan.category === 'setup' ? 'Setup' : plan.category === 'mod' ? 'Mod' : 'Plugin'} Quote`)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Complexity Factors Notice */}
      <div className="mt-12 p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00D2FF]">
            <HelpCircle className="w-4 h-4" />
            <span>WHAT INFLUENCES PRICE?</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Project scope, custom mechanic depth, multi-version support (e.g. 1.8 through 1.21), and third-party
            database/Redis synchronization determine engineering effort.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-[#8B5CFF]" />
            <span>NO SURPRISE CHARGES</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Every project receives an agreed technical brief before invoices are issued. Scope modifications
            are agreed collaboratively before work begins.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <Layers className="w-4 h-4 text-[#00D2FF]" />
            <span>BUGFIX WARRANTY INCLUDED</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            All custom deliverables include a 14-day warranty to resolve any discrepancies or defects
            relative to the confirmed design specifications.
          </p>
        </div>
      </div>
    </section>
  );
};
