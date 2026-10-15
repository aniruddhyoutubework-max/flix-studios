import React, { useState } from 'react';
import { X, Mail, Check, Copy, ArrowUpRight, Send } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState('Web Experience / Flagship');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');

  if (!isOpen) return null;

  const services = [
    'Web Experience / Flagship',
    '3D WebGL / Spatial UI',
    'Motion & Visual Direction',
    'Experimental Digital R&D'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SITE_CONFIG.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Flix Studios Project Inquiry: ${selectedService}`);
    const body = encodeURIComponent(
      `Hello Flix Studios,\n\nName: ${name || 'Prospective Collaborator'}\nEmail: ${email || 'Not specified'}\nDiscipline: ${selectedService}\n\nProject Overview:\n${idea || 'We would like to discuss creating an extraordinary digital experience.'}\n\nSent via Flix Studios Interactive Portal.`
    );
    window.location.href = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#111216] p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="Close contact modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7FF3F] tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3F]" />
            <span>HIRE US</span>
          </div>
          <h3 id="contact-modal-title" className="font-display font-extrabold text-2xl sm:text-3xl uppercase text-[#F4F3EE]">
            LET'S MOVE WORLDS.
          </h3>
          <p className="text-sm text-[#9FA2AD] mt-1">
            Fill out your concept or reach out directly to our studio dispatch.
          </p>
        </div>

        {/* Direct Email Shortcut Bar */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#181A20] border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate font-mono text-xs text-[#F4F3EE]">
            <Mail className="w-4 h-4 text-[#D7FF3F] shrink-0" />
            <span className="truncate">{SITE_CONFIG.contact.email}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-mono text-white transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

        {/* Real Actionable Email Composer */}
        <form onSubmit={handleLaunchEmail} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9FA2AD] mb-2">
              DISCIPLINE FOCUS
            </label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((svc) => (
                <button
                  type="button"
                  key={svc}
                  onClick={() => setSelectedService(svc)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-colors ${
                    selectedService === svc
                      ? 'border-[#D7FF3F] bg-[#D7FF3F]/10 text-[#F4F3EE]'
                      : 'border-white/10 bg-[#14161C] text-[#9FA2AD] hover:border-white/20'
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9FA2AD] mb-1.5">
                YOUR NAME / STUDIO
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-sm text-[#F4F3EE] placeholder-[#5E6270] focus:border-[#D7FF3F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9FA2AD] mb-1.5">
                RETURN EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-sm text-[#F4F3EE] placeholder-[#5E6270] focus:border-[#D7FF3F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9FA2AD] mb-1.5">
              THE VISION / BRIEF
            </label>
            <textarea
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Tell us what you are looking to create..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-sm text-[#F4F3EE] placeholder-[#5E6270] focus:border-[#D7FF3F] focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#D7FF3F] text-[#08090B] font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#C5F028] transition-all duration-200 shadow-[0_0_25px_rgba(215,255,63,0.3)] active:scale-95"
          >
            <span>LAUNCH EMAIL DISPATCH</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center text-[11px] font-mono text-[#5E6270]">
          {SITE_CONFIG.contact.placeholderEmailNotice}
        </div>
      </div>
    </div>
  );
};
