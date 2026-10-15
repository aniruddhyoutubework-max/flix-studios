import React from 'react';
import { FlixCoreLogo } from '../components/FlixCoreLogo';
import { SiteSettings } from '../types/database';
import { ArrowUp, Github, Linkedin, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenHireUs: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenHireUs,
  onOpenAccount,
  onOpenAdmin,
  isAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = settings.social_links || {};

  return (
    <footer className="border-t border-white/10 bg-[#08090B] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Wordmark */}
          <div className="md:col-span-5 space-y-4">
            <FlixCoreLogo size="lg" showWordmark={true} />
            <p className="text-xs text-white/50 max-w-sm leading-relaxed">
              Engineering enterprise-grade Minecraft server plugins, automated tournament engines, and
              multi-server network architecture.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#D7FF3F]">
              <span className="w-2 h-2 rounded-full bg-[#D7FF3F] animate-pulse" />
              <span>DISPATCH OPERATIONAL // 2026</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest">NAVIGATION</h4>
            <ul className="space-y-2 text-xs font-mono text-white/70">
              <li>
                <a href="#services" className="hover:text-[#D7FF3F] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-[#D7FF3F] transition-colors">
                  Products Catalog
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#D7FF3F] transition-colors">
                  Pricing & Scope
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#D7FF3F] transition-colors">
                  Engineering Process
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D7FF3F] transition-colors">
                  About Flix Studios
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#D7FF3F] transition-colors">
                  Verified Reviews
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenHireUs}
                  className="hover:text-[#D7FF3F] transition-colors text-left"
                >
                  Hire Flix Studios
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio Links & Socials */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest">
              STUDIO CHANNELS & ACCESS
            </h4>
            <div className="flex items-center gap-2">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#D7FF3F] transition-colors"
                  title="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#D7FF3F] transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#D7FF3F] transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#D7FF3F] transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-1 text-xs font-mono">
              <button
                onClick={onOpenAccount}
                className="text-white/60 hover:text-white transition-colors text-left"
              >
                Customer Portal & Tickets →
              </button>
              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-[#8B5CFF] hover:underline transition-colors text-left font-bold"
                >
                  Administrator Console →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            © {new Date().getFullYear()} {settings.company_name}. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
