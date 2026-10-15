import React, { useEffect } from 'react';
import { X, ArrowRight, Mail, User, ShieldCheck } from 'lucide-react';
import { FlixCoreLogo } from './FlixCoreLogo';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHireUs: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  companyEmail: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenHireUs,
  onOpenAccount,
  onOpenAdmin,
  companyEmail,
}) => {
  const { user, isAdmin, openAuthModal } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Engineering Process', href: '#process' },
    { label: 'About FlixCore', href: '#about' },
    { label: 'Verified Reviews', href: '#reviews' },
    { label: 'Contact & Dispatch', href: '#contact' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08090B] p-6 sm:p-10 animate-fadeIn"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <a href="/" onClick={onClose}>
          <FlixCoreLogo size="md" />
        </a>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-[#111216] border border-white/10 text-white hover:border-white/30 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="my-auto py-6">
        <ul className="space-y-4">
          {links.map((item, idx) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={onClose}
                className="group flex items-baseline justify-between text-xl sm:text-2xl font-display font-bold uppercase text-[#F4F3EE] hover:text-[#D7FF3F] transition-colors"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-[#5E6270] group-hover:text-[#D7FF3F]">
                  0{idx + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Studio Utilities */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap gap-2">

          {user ? (
            <button
              onClick={() => {
                onClose();
                onOpenAccount();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Customer Portal</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70"
            >
              Customer Sign In
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#8B5CFF]/20 border border-[#8B5CFF]/40 text-xs font-mono text-[#8B5CFF] font-bold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <button
          onClick={() => {
            onClose();
            onOpenHireUs();
          }}
          className="w-full py-3.5 rounded-full bg-[#D7FF3F] text-black font-display font-black text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(215,255,63,0.3)]"
        >
          <span>HIRE US (START INTAKE)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <a
          href={`mailto:${companyEmail}`}
          className="w-full py-3 rounded-full bg-[#111216] border border-white/10 text-xs font-mono text-[#9FA2AD] flex items-center justify-center gap-2"
        >
          <Mail className="w-3.5 h-3.5 text-[#D7FF3F]" />
          <span>{companyEmail}</span>
        </a>
      </div>
    </div>
  );
};
