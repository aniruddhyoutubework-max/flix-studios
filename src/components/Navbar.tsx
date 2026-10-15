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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090B]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a href="/" className="flex items-center gap-3 group">
          <FlixCoreLogo size="md" showWordmark={true} />
        </a>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeSection === link.id
                  ? 'bg-[#D7FF3F] text-black font-bold shadow-md shadow-[#D7FF3F]/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Account / Admin Trigger */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 rounded-full bg-[#8B5CFF]/20 hover:bg-[#8B5CFF]/30 border border-[#8B5CFF]/40 text-[#8B5CFF] text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Admin</span>
                </button>
              )}
              <button
                onClick={onOpenAccount}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span className="max-w-[100px] truncate">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-all"
            >
              Sign In
            </button>
          )}

          {/* Primary "Hire Us" CTA */}
          <button
            onClick={onOpenHireUs}
            className="px-4 md:px-5 py-2 rounded-full bg-[#D7FF3F] hover:bg-[#c2eb2f] text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-[#D7FF3F]/25 hover:scale-105 active:scale-95"
          >
            <span>HIRE US</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

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
  );
};
