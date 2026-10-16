import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const MinecraftFaqSection: React.FC<{ onOpenHireUs: () => void }> = ({ onOpenHireUs }) => {
  const containerRef = useScrollReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I receive my license key after purchasing FlixCore?',
      a: 'Your license key is instantly generated and delivered to your BuiltByBit account and your Flix Studios customer portal. Simply paste it into `plugins/FlixCore/config.yml` under `license-key` and start your server. Verification completes in less than 500ms.',
    },
    {
      q: 'Does FlixCore support Paper 1.21.x and Folia regionized threads?',
      a: 'Yes! FlixCore is built natively using modern Java 21 LTS with full support for Paper, Purpur, and Folia 1.21.x. It also maintains backward compatibility down to 1.8.8 for legacy practice and duel servers.',
    },
    {
      q: 'What is included in custom plugin and mod commissions?',
      a: 'Every custom commission includes a detailed requirements specification, clean Java 21 source code (on request), fully commented YAML configuration files, permissions guide, and a 14-day post-delivery bugfix warranty.',
    },
    {
      q: 'What happens if a new Minecraft or Paper update breaks something?',
      a: 'Our products feature an automatic background update checker (`/fc update`) that downloads and verifies hotfixes directly from our release servers. Custom commissions also receive dedicated patch support during their warranty period.',
    },
    {
      q: 'How can I get technical support or request custom features?',
      a: 'You can open a support ticket at any time in our official Discord community (discord.gg/flixcore) or right here on our website. Our developers typically respond in under 24 business hours.',
    },
    {
      q: 'Can I test FlixCore or view the in-game documentation before buying?',
      a: 'Yes! You can explore the complete, official usage manual, command reference, and PlaceholderAPI guide anytime at /docs.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-20">
      <div ref={containerRef} data-reveal className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-xs font-mono text-[#38BDF8]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-minecraft">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about licensing, custom plugin commissions, Folia compatibility, and updates.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? 'bg-[#11141E] border-[#38BDF8]/50 shadow-lg shadow-[#38BDF8]/5'
                    : 'bg-[#11141E]/70 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-white font-sans flex items-center gap-3">
                    <span className="text-xs font-mono text-[#38BDF8]">0{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#38BDF8]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Discord / Support Prompt */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#11141E] to-[#161B29] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white font-minecraft">Have more questions about your server?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Chat directly with our lead developers in Discord or start a commission intake ticket.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenHireUs}
              className="px-4 py-2.5 rounded-xl bg-[#00D2FF] hover:bg-[#38BDF8] text-[#08090B] font-minecraft text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 font-bold shadow-md shadow-[#00D2FF]/20"
            >
              <span>HIRE US</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="https://discord.gg/flixcore"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-minecraft text-xs transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
