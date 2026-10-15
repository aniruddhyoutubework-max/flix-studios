import React from 'react';
import { ShoppingBag, ExternalLink, AlertTriangle, ArrowRight } from 'lucide-react';

interface PurchaseButtonProps {
  purchaseUrl?: string;
  productName?: string;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onOpenHireUs?: () => void;
  variant?: 'primary' | 'compact' | 'block' | 'card';
  className?: string;
  label?: string;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  purchaseUrl,
  productName = 'Product',
  isAdmin = false,
  onOpenAdmin,
  onOpenHireUs,
  variant = 'primary',
  className = '',
  label = 'Purchase on BuiltByBit',
}) => {
  const trimmedUrl = purchaseUrl?.trim() || '';
  const isValidHttpsUrl = /^https:\/\/[^\s$.?#].[^\s]*$/i.test(trimmedUrl);

  // If valid purchase URL configured: render official outbound redirect
  if (isValidHttpsUrl) {
    const baseClasses =
      variant === 'compact'
        ? 'px-3.5 py-2 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-1.5'
        : variant === 'block'
        ? 'w-full px-5 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2'
        : variant === 'card'
        ? 'w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2'
        : 'px-5 py-2.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-2';

    return (
      <a
        href={trimmedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} bg-[#D7FF3F] hover:bg-[#cbf430] active:scale-[0.98] text-[#08090B] shadow-lg shadow-[#D7FF3F]/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D7FF3F]/50 group ${className}`}
        title={`Purchase ${productName} on BuiltByBit`}
      >
        <ShoppingBag className="w-3.5 h-3.5 text-black transition-transform group-hover:scale-110" />
        <span>{label}</span>
        <ExternalLink className="w-3 h-3 text-black/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    );
  }

  // If URL not configured and current user is an Admin:
  if (isAdmin) {
    return (
      <button
        type="button"
        onClick={onOpenAdmin}
        className={`px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-2 transition-all group ${
          variant === 'block' ? 'w-full justify-center' : ''
        } ${className}`}
        title="Admin Alert: Click to configure the BuiltByBit URL in Admin Dashboard"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span>Configure Purchase URL</span>
        <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded uppercase">Admin</span>
      </button>
    );
  }

  // If URL not configured for regular visitors: offer bespoke commission / custom modification inquiry
  return (
    <button
      type="button"
      onClick={onOpenHireUs}
      className={`px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
        variant === 'block' ? 'w-full justify-center' : ''
      } ${className}`}
      title="Request custom licensing or commission modification"
    >
      <ShoppingBag className="w-3.5 h-3.5 text-[#D7FF3F]" />
      <span>Request Custom License</span>
      <ArrowRight className="w-3 h-3 text-white/50" />
    </button>
  );
};
