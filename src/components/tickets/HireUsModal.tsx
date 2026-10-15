import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';
import { Ticket } from '../../types/database';
import { FlixCoreLogo } from '../FlixCoreLogo';
import {
  X,
  CheckCircle,
  ArrowRight,
  Shield,
  Sparkles,
  AlertCircle,
  Cpu,
  Layers,
  Server,
  Terminal,
  Database,
  ExternalLink,
  Clock,
  DollarSign,
  Loader2,
} from 'lucide-react';

interface HireUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
  initialCategory?: string;
}

export const CATEGORIES = [
  {
    id: 'Custom Minecraft Plugin Development',
    shortLabel: 'Plugin Dev',
    title: 'Custom Plugin Development',
    platform: 'Paper · Purpur · Spigot · Folia',
    icon: Cpu,
    color: '#D7FF3F',
    accentClass: 'hover:border-[#D7FF3F]/60 group-hover:text-[#D7FF3F]',
    activeClass: 'border-[#D7FF3F] bg-[#D7FF3F]/10 text-white shadow-[0_0_20px_rgba(215,255,63,0.15)]',
  },
  {
    id: 'Custom Minecraft Mod Development',
    shortLabel: 'Mod Dev',
    title: 'Custom Mod Development',
    platform: 'Fabric · NeoForge · Forge · Quilt',
    icon: Layers,
    color: '#8B5CFF',
    accentClass: 'hover:border-[#8B5CFF]/60 group-hover:text-[#8B5CFF]',
    activeClass: 'border-[#8B5CFF] bg-[#8B5CFF]/10 text-white shadow-[0_0_20px_rgba(139,92,255,0.15)]',
  },
  {
    id: 'Minecraft Server Setup & Configuration',
    shortLabel: 'Server Setup',
    title: 'Server Setup & Config',
    platform: 'Velocity · Linux · LuckPerms · Tuning',
    icon: Server,
    color: '#D7FF3F',
    accentClass: 'hover:border-[#D7FF3F]/60 group-hover:text-[#D7FF3F]',
    activeClass: 'border-[#D7FF3F] bg-[#D7FF3F]/10 text-white shadow-[0_0_20px_rgba(215,255,63,0.15)]',
  },
] as const;

const BUDGET_OPTIONS = [
  { value: '$150 – $300', label: '$150 – $300', note: 'Small Plugin / Utility' },
  { value: '$300 – $800', label: '$300 – $800', note: 'Custom Core / Mod System' },
  { value: '$800 – $2,000', label: '$800 – $2,000', note: 'Full Server Architecture' },
  { value: '$2,000+', label: '$2,000+', note: 'Enterprise Multi-Server Core' },
];

const TIMEFRAME_OPTIONS = [
  { value: '1 – 2 Weeks', label: '1 – 2 Weeks', note: 'Rapid Turnaround' },
  { value: '2 – 3 Weeks', label: '2 – 3 Weeks', note: 'Standard Delivery' },
  { value: '1 Month', label: '1 Month', note: 'Multi-Phase Scope' },
  { value: 'Flexible', label: 'Flexible', note: 'Quality & Depth First' },
];

export const HireUsModal: React.FC<HireUsModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
  initialCategory,
}) => {
  const { user, openAuthModal, pendingBriefDraft, setPendingBriefDraft } = useAuth();

  // Core Form State - empty initial states for selections
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(
    initialCategory || 'Custom Minecraft Plugin Development'
  );
  const [description, setDescription] = useState('');

  // Category-specific fields (start empty as placeholders, not prefilled values)
  const [mcVersion, setMcVersion] = useState('');
  const [serverSoftware, setServerSoftware] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [commandsAndPerms, setCommandsAndPerms] = useState('');
  const [databaseEngine, setDatabaseEngine] = useState('');
  const [modLoader, setModLoader] = useState('');
  const [hostingEnv, setHostingEnv] = useState('');

  // Budget and Timeframe (Empty initially - no misleading default submissions)
  const [budgetRange, setBudgetRange] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  // Sync category if initialCategory changes on open
  useEffect(() => {
    if (isOpen && initialCategory && !pendingBriefDraft) {
      const match = CATEGORIES.find(
        (c) =>
          c.id === initialCategory ||
          c.title.toLowerCase() === initialCategory.toLowerCase() ||
          initialCategory.toLowerCase().includes(c.shortLabel.toLowerCase())
      );
      if (match) {
        setCategory(match.id);
      } else {
        setCategory(initialCategory);
      }
    }
  }, [isOpen, initialCategory, pendingBriefDraft]);

  // Restore draft if saved
  useEffect(() => {
    if (pendingBriefDraft) {
      if (pendingBriefDraft.title) setTitle(String(pendingBriefDraft.title));
      if (pendingBriefDraft.category) setCategory(String(pendingBriefDraft.category));
      if (pendingBriefDraft.description) setDescription(String(pendingBriefDraft.description));
      if (pendingBriefDraft.mcVersion) setMcVersion(String(pendingBriefDraft.mcVersion));
      if (pendingBriefDraft.serverSoftware) setServerSoftware(String(pendingBriefDraft.serverSoftware));
      if (pendingBriefDraft.dependencies) setDependencies(String(pendingBriefDraft.dependencies));
      if (pendingBriefDraft.commandsAndPerms) setCommandsAndPerms(String(pendingBriefDraft.commandsAndPerms));
      if (pendingBriefDraft.databaseEngine) setDatabaseEngine(String(pendingBriefDraft.databaseEngine));
      if (pendingBriefDraft.modLoader) setModLoader(String(pendingBriefDraft.modLoader));
      if (pendingBriefDraft.hostingEnv) setHostingEnv(String(pendingBriefDraft.hostingEnv));
      if (pendingBriefDraft.budgetRange) setBudgetRange(String(pendingBriefDraft.budgetRange));
      if (pendingBriefDraft.timeframe) setTimeframe(String(pendingBriefDraft.timeframe));
      if (pendingBriefDraft.referenceLinks) setReferenceLinks(String(pendingBriefDraft.referenceLinks));
    }
  }, [pendingBriefDraft]);

  // Keyboard Escape listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleReset();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-submit if user just authenticated and draft exists
  useEffect(() => {
    if (user && pendingBriefDraft && isOpen && !createdTicket) {
      handleFinalSubmission();
    }
  }, [user, pendingBriefDraft, isOpen]);

  if (!isOpen) return null;

  const handleFinalSubmission = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Build structured technical specs
      const techNotes: string[] = [];
      if (mcVersion.trim()) techNotes.push(`• Target MC Version: ${mcVersion.trim()}`);
      if (serverSoftware.trim()) techNotes.push(`• Server Platform: ${serverSoftware.trim()}`);
      if (modLoader.trim()) techNotes.push(`• Mod Loader: ${modLoader.trim()}`);
      if (dependencies.trim()) techNotes.push(`• Dependencies / APIs: ${dependencies.trim()}`);
      if (commandsAndPerms.trim()) techNotes.push(`• Commands & Perms: ${commandsAndPerms.trim()}`);
      if (databaseEngine.trim()) techNotes.push(`• Database Engine: ${databaseEngine.trim()}`);
      if (hostingEnv.trim()) techNotes.push(`• Hosting Environment: ${hostingEnv.trim()}`);

      const fullDescription = techNotes.length > 0
        ? `${description.trim()}\n\n--- TECHNICAL SPECIFICATIONS ---\n${techNotes.join('\n')}`
        : description.trim();

      const ticket = await db.createTicket({
        customer_id: user.id,
        customer_email: user.email,
        customer_name: user.full_name || user.email.split('@')[0],
        type: 'custom_dev',
        title: title.trim() || 'Custom Minecraft Commission Specification',
        category,
        description: fullDescription,
        mc_version: mcVersion.trim() || undefined,
        server_software: (serverSoftware || modLoader || hostingEnv).trim() || undefined,
        dependencies: dependencies.trim() || undefined,
        budget_range: budgetRange || undefined,
        timeframe: timeframe || undefined,
        reference_links: referenceLinks.trim() || undefined,
        priority: 'high',
      });

      // Clear draft
      setPendingBriefDraft(null);
      setCreatedTicket(ticket);
      if (onTicketCreated) onTicketCreated(ticket);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to register ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide a project title and detailed technical requirements.');
      return;
    }

    // If visitor is not authenticated, preserve draft and trigger auth modal
    if (!user) {
      const draft = {
        title,
        category,
        description,
        mcVersion,
        serverSoftware,
        dependencies,
        commandsAndPerms,
        databaseEngine,
        modLoader,
        hostingEnv,
        budgetRange,
        timeframe,
        referenceLinks,
      };
      setPendingBriefDraft(draft);
      openAuthModal('register');
      return;
    }

    await handleFinalSubmission();
  };

  const handleReset = () => {
    setCreatedTicket(null);
    setTitle('');
    setDescription('');
    setMcVersion('');
    setServerSoftware('');
    setDependencies('');
    setCommandsAndPerms('');
    setDatabaseEngine('');
    setModLoader('');
    setHostingEnv('');
    setBudgetRange('');
    setTimeframe('');
    setReferenceLinks('');
    setErrorMsg('');
    onClose();
  };

  const isPluginCategory = category.toLowerCase().includes('plugin');
  const isModCategory = category.toLowerCase().includes('mod');
  const isServerCategory = category.toLowerCase().includes('server') || category.toLowerCase().includes('setup');

  return (
    <div
      className="fixed inset-0 z-[115] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleReset();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hire-modal-title"
    >
      <div className="relative w-full max-w-3xl rounded-2xl md:rounded-3xl bg-[#0B0C0E] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Cinematic Shimmer Sweep Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D7FF3F] to-transparent animate-pulse z-20 pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D7FF3F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#8B5CFF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative z-10 p-5 md:p-7 border-b border-white/10 bg-[#0E0F14]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlixCoreLogo size="sm" glow={true} showWordmark={true} />
            <div className="hidden sm:block h-4 w-[1px] bg-white/20" />
            <span className="hidden sm:inline-block text-[11px] font-mono text-white/50 tracking-wider uppercase">
              STUDIO COMMISSION DISPATCH
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Close modal"
            className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D7FF3F]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="relative z-10 p-5 sm:p-7 md:p-8 overflow-y-auto flex-1">
          {createdTicket ? (
            /* Confirmation View */
            <div className="text-center py-6 sm:py-8 space-y-6 animate-fade-in max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/30 text-[#D7FF3F] flex items-center justify-center mx-auto shadow-xl shadow-[#D7FF3F]/15">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D7FF3F] mb-3">
                  TICKET DISPATCHED // {createdTicket.ticket_number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Commission Brief Received
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mt-2.5 leading-relaxed">
                  Your custom Minecraft project specification has been logged in Flix Studios dispatch.
                  Lead engineers review every brief against strict architecture guidelines.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2.5 font-mono">
                <div className="flex justify-between items-center text-white/50 border-b border-white/5 pb-2">
                  <span>REFERENCE ID:</span>
                  <span className="text-[#D7FF3F] font-bold text-sm">{createdTicket.ticket_number}</span>
                </div>
                <div className="flex justify-between items-center text-white/50 border-b border-white/5 pb-2">
                  <span>PROJECT:</span>
                  <span className="text-white font-medium truncate max-w-[220px]">{createdTicket.title}</span>
                </div>
                <div className="flex justify-between items-center text-white/50 border-b border-white/5 pb-2">
                  <span>DISCIPLINE:</span>
                  <span className="text-white truncate max-w-[220px]">{createdTicket.category}</span>
                </div>
                {createdTicket.budget_range && (
                  <div className="flex justify-between items-center text-white/50 border-b border-white/5 pb-2">
                    <span>EST. BUDGET:</span>
                    <span className="text-white">{createdTicket.budget_range}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-white/50">
                  <span>CURRENT STATUS:</span>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">{createdTicket.status}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
                >
                  Close Window
                </button>
                <a
                  href="#account"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D7FF3F] hover:bg-[#c2eb2f] text-black font-bold font-mono text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#D7FF3F]/20"
                >
                  <span>Track in Customer Area</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            /* Intake Form View */
            <div>
              {/* Header Info */}
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7FF3F]/10 border border-[#D7FF3F]/20 text-xs font-mono text-[#D7FF3F] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>BESPOKE MINECRAFT ENGINEERING</span>
                </div>
                <h2 id="hire-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Commission Flix Studios
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1.5 leading-relaxed max-w-xl">
                  Select your core discipline below. We craft high-concurrency plugins, bespoke mods,
                  and turnkey server networks with verified architecture and zero main-thread lag.
                </p>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400 animate-slide-up">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Category Selector Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-mono text-white/80 uppercase tracking-wider font-semibold">
                      1. SELECT SERVICE DISCIPLINE
                      <span className="text-[#D7FF3F] text-[10px] ml-1.5">* REQUIRED</span>
                    </label>
                    <span className="text-[11px] font-mono text-white/40">3 Active Disciplines</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`relative text-left p-4 rounded-2xl border transition-all duration-200 group flex flex-col justify-between min-h-[92px] ${
                            isSelected
                              ? cat.activeClass
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-white/70'
                          }`}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-2 rounded-xl transition-colors ${
                                  isSelected ? 'bg-black/30 text-white' : 'bg-white/5 text-white/70'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block font-bold text-xs text-white leading-tight">
                                  {cat.shortLabel}
                                </span>
                                <span className="text-[10px] font-mono text-white/40 leading-none">
                                  {cat.platform.split('·')[0].trim()}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#D7FF3F] animate-pulse" />
                            )}
                          </div>

                          <div className="text-[10px] font-mono text-white/50 mt-2 truncate">
                            {cat.platform}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Project Title & Scope */}
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-mono text-white/80 mb-1.5 uppercase tracking-wider font-semibold">
                      2. PROJECT TITLE
                      <span className="text-[#D7FF3F] text-[10px] ml-1.5">* REQUIRED</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        isPluginCategory
                          ? 'e.g. Asynchronous Competitive Arena & Duel Engine'
                          : isModCategory
                          ? 'e.g. Custom RPG Weaponry & Boss Combat Mechanics'
                          : 'e.g. 5-Server Velocity Network Setup & LuckPerms Matrix'
                      }
                      className="w-full h-11 bg-[#13141A] border border-white/10 rounded-xl px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F] focus:ring-1 focus:ring-[#D7FF3F] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/80 mb-1.5 uppercase tracking-wider font-semibold">
                      3. TECHNICAL REQUIREMENTS & CORE SCOPE
                      <span className="text-[#D7FF3F] text-[10px] ml-1.5">* REQUIRED</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        isPluginCategory
                          ? 'Detail your core features, custom commands, player events, data storage needs (e.g. MySQL/Redis), and any third-party hooks (Vault, PlaceholderAPI, Tebex)...'
                          : isModCategory
                          ? 'Describe gameplay mechanics, items, blocks, custom entities/mobs, custom HUD/GUI expectations, and whether client-side visual effects or network sync are needed...'
                          : 'Detail your network architecture (Velocity proxy, backend Paper nodes), desired gamemodes, LuckPerms rank hierarchy, spawn protection, and tuning needs...'
                      }
                      className="w-full bg-[#13141A] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F] focus:ring-1 focus:ring-[#D7FF3F] leading-relaxed resize-none transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Dynamic Category-Specific Technical Fields */}
                <div
                  key={category}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#D7FF3F]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {isPluginCategory
                          ? 'PLUGIN ARCHITECTURE SPECS'
                          : isModCategory
                          ? 'MODLOADER & RUNTIME SPECS'
                          : 'SERVER INFRASTRUCTURE SPECS'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">OPTIONAL REFINEMENTS</span>
                  </div>

                  {/* Plugin Specific Fields */}
                  {isPluginCategory && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          TARGET MC VERSION
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={mcVersion}
                          onChange={(e) => setMcVersion(e.target.value)}
                          placeholder="e.g. 1.21.4 or 1.20.4"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          SERVER SOFTWARE
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={serverSoftware}
                          onChange={(e) => setServerSoftware(e.target.value)}
                          placeholder="Paper / Purpur / Folia"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          DATABASE / CACHE
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={databaseEngine}
                          onChange={(e) => setDatabaseEngine(e.target.value)}
                          placeholder="MySQL / Redis / SQLite"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          DEPENDENCIES & HOOKS
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={dependencies}
                          onChange={(e) => setDependencies(e.target.value)}
                          placeholder="e.g. ProtocolLib, Vault, PlaceholderAPI, DecentHolograms"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          CUSTOM COMMANDS / PERMS
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={commandsAndPerms}
                          onChange={(e) => setCommandsAndPerms(e.target.value)}
                          placeholder="e.g. /duel, arena.admin"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mod Specific Fields */}
                  {isModCategory && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          TARGET MC VERSION
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={mcVersion}
                          onChange={(e) => setMcVersion(e.target.value)}
                          placeholder="e.g. 1.21.1 or 1.20.1"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          MOD LOADER
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={modLoader}
                          onChange={(e) => setModLoader(e.target.value)}
                          placeholder="Fabric / NeoForge / Forge"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          ENVIRONMENT SCOPE
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={serverSoftware}
                          onChange={(e) => setServerSoftware(e.target.value)}
                          placeholder="Client & Server / Server-Only"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          MOD DEPENDENCIES & LIBRARIES
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={dependencies}
                          onChange={(e) => setDependencies(e.target.value)}
                          placeholder="e.g. Cloth Config, Architectury, GeckoLib, Cardinal Components"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Server Setup Specific Fields */}
                  {isServerCategory && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          TARGET MC VERSION
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={mcVersion}
                          onChange={(e) => setMcVersion(e.target.value)}
                          placeholder="e.g. 1.21.4 or Multi-version"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          PROXY / SERVER CORE
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={serverSoftware}
                          onChange={(e) => setServerSoftware(e.target.value)}
                          placeholder="Velocity / Paper / Purpur"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          HOSTING ENVIRONMENT
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={hostingEnv}
                          onChange={(e) => setHostingEnv(e.target.value)}
                          placeholder="Dedicated Linux / Pterodactyl / VPS"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          DESIRED PLUGINS / MODS LIST
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={dependencies}
                          onChange={(e) => setDependencies(e.target.value)}
                          placeholder="e.g. LuckPerms, LiteBans, WorldGuard, EssentialsX, DecentHolograms"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">
                          PERMISSIONS HIERARCHY
                          <span className="text-white/40 text-[9px] ml-1">(OPTIONAL)</span>
                        </label>
                        <input
                          type="text"
                          value={commandsAndPerms}
                          onChange={(e) => setCommandsAndPerms(e.target.value)}
                          placeholder="e.g. 5-Tier LuckPerms Setup"
                          className="w-full h-10 bg-[#13141A] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Budget & Timeframe Selectors (No misleading prefilled defaults) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono text-white/80 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D7FF3F]" />
                        <span>ESTIMATED BUDGET</span>
                        <span className="text-white/40 text-[9px] font-normal">(OPTIONAL)</span>
                      </label>
                      {budgetRange && (
                        <button
                          type="button"
                          onClick={() => setBudgetRange('')}
                          className="text-[10px] font-mono text-white/40 hover:text-white"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {BUDGET_OPTIONS.map((opt) => {
                        const isSelected = budgetRange === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setBudgetRange(isSelected ? '' : opt.value)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-[#D7FF3F] bg-[#D7FF3F]/10 text-white'
                                : 'border-white/10 bg-[#13141A] hover:border-white/20 text-white/70'
                            }`}
                          >
                            <span className="block font-bold text-xs text-white">{opt.label}</span>
                            <span className="text-[10px] font-mono text-white/40 leading-tight block truncate">
                              {opt.note}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono text-white/80 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8B5CFF]" />
                        <span>TARGET TIMEFRAME</span>
                        <span className="text-white/40 text-[9px] font-normal">(OPTIONAL)</span>
                      </label>
                      {timeframe && (
                        <button
                          type="button"
                          onClick={() => setTimeframe('')}
                          className="text-[10px] font-mono text-white/40 hover:text-white"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {TIMEFRAME_OPTIONS.map((opt) => {
                        const isSelected = timeframe === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setTimeframe(isSelected ? '' : opt.value)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-[#8B5CFF] bg-[#8B5CFF]/15 text-white'
                                : 'border-white/10 bg-[#13141A] hover:border-white/20 text-white/70'
                            }`}
                          >
                            <span className="block font-bold text-xs text-white">{opt.label}</span>
                            <span className="text-[10px] font-mono text-white/40 leading-tight block truncate">
                              {opt.note}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5. Reference Links */}
                <div>
                  <label className="block text-xs font-mono text-white/80 mb-1.5 uppercase tracking-wider font-semibold">
                    REFERENCE LINKS OR DOCUMENTS
                    <span className="text-white/40 text-[10px] ml-1.5 font-normal">(OPTIONAL)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={referenceLinks}
                      onChange={(e) => setReferenceLinks(e.target.value)}
                      placeholder="https://github.com/... or Google Docs brief, Figma URL, Loom video"
                      className="w-full h-11 bg-[#13141A] border border-white/10 rounded-xl pl-4 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F] focus:ring-1 focus:ring-[#D7FF3F] transition-colors"
                    />
                    <ExternalLink className="w-4 h-4 text-white/30 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* 6. Prominent Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#D7FF3F] hover:bg-[#c2eb2f] active:scale-[0.99] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#D7FF3F]/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Registering Intake Ticket...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {user
                            ? 'Dispatch Project Intake Brief'
                            : 'Continue & Save Project Brief (Sign In)'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {!user ? (
                    <p className="text-[11px] text-white/50 text-center mt-3 flex items-center justify-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#D7FF3F] shrink-0" />
                      <span>
                        Your drafted brief is preserved. You will authenticate or create an account to track delivery.
                      </span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-white/40 text-center mt-2.5">
                      Submitting as <span className="text-white font-mono">{user.email}</span> · Trackable in Customer Account
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
