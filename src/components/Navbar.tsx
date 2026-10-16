import React, { useState, useEffect } from 'react';
import { FlixCoreLogo } from './FlixCoreLogo';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, ArrowRight, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenHireUs: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHireUs,
  onOpenAccount,
  onOpenAdmin,
  onOpenMobileMenu,
}) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'products', 'services', 'pricing', 'process', 'about', 'reviews', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section === 'home' ? 'hero' : section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'pricing', label: 'Pricing', href: '#pricing' },
    { id: 'process', label: 'Process', href: '#process' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'reviews', label: 'Reviews', href: '#reviews' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar (like hxstudios.in) */}
      <div className="bg-[#0284C7] bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0284C7] py-2 px-4 text-center text-xs text-white font-medium shadow-md">
        <span>We have also started to sell Minecraft Plugins, Builds &amp; Setups if you want a custom one you can </span>
        <button
          onClick={onOpenHireUs}
          className="text-[#E0F2FE] underline font-bold hover:text-white transition-colors cursor-pointer ml-1 inline-flex items-center gap-0.5"
        >
          Hire Us
        </button>
      </div>

      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0E17]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
            : 'bg-[#0B0E17]/80 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <a href="/" className="flex items-center gap-3 group">
            <FlixCoreLogo size="md" showWordmark={true} />
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#products" className="hover:text-white transition-colors">
              Products
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="/docs" className="text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-semibold">
              Docs
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
                v1.0.4
              </span>
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#reviews" className="hover:text-white transition-colors">
              Reviews
            </a>
            <button onClick={onOpenHireUs} className="hover:text-white transition-colors cursor-pointer">
              Hire Us
            </button>
          </nav>

          {/* Right Action Controls (hxstudios inspired) */}
          <div className="flex items-center gap-2.5">
            {/* Support button (Cyan) */}
            <button
              onClick={onOpenHireUs}
              className="px-4 py-2 rounded-xl bg-[#00D2FF] hover:bg-[#38BDF8] text-[#08090B] text-xs font-bold font-sans transition-all shadow-md shadow-[#00D2FF]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Support</span>
            </button>

            {/* Account / Login Trigger (White button) */}
            {user ? (
              <button
                onClick={onOpenAccount}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <User className="w-3.5 h-3.5 text-black" />
                <span className="max-w-[100px] truncate">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Login
              </button>
            )}

            {/* Discord Link */}
            <a
              href="https://discord.gg/flixcore"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-[#5865F2] hover:text-white border border-white/10 text-white/70 transition-all"
              title="Join Community Discord"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
