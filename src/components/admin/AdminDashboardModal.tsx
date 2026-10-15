import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, INITIAL_PRICING } from '../../lib/db';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Ticket,
  PurchaseRecord,
  Review,
  Product,
  SiteSettings,
  Profile,
  AuditEvent,
  TicketStatus,
  TicketPriority,
  PricingPlan,
  ServiceContentItem,
  ProcessStageItem,
  AboutPillarItem,
  ProductCommand,
  ProductPermission,
} from '../../types/database';
import {
  X,
  LayoutDashboard,
  Ticket as TicketIcon,
  Users,
  ShieldCheck,
  Star,
  Package,
  Settings,
  FileCode,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Eye,
  Plus,
  Trash2,
  Lock,
  Edit,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Database,
  ArrowUp,
  ArrowDown,
  Copy,
  Sparkles,
  Cpu,
  Layers,
  ExternalLink,
  Check,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SERVICES_CONTENT: ServiceContentItem[] = [
  {
    id: 'plugins',
    categoryParam: 'Custom Plugin Development',
    badge: 'SERVER SOFTWARE',
    title: 'Custom Minecraft Plugin Development',
    subtitle: 'Paper, Purpur, and Spigot APIs (1.8.8 – 1.21.4)',
    description:
      'We build plugins according to your exact requirements, including server systems, gameplay mechanics, integrations, custom commands, configuration systems, and other agreed features.',
    highlights: [
      'Custom gameplay mechanics, combat systems & duel rules',
      'Server systems: lobbies, queues, rank management & arenas',
      'Intuitive custom commands, permissions & tab completion',
      'Fully configurable config.yml and customizable language files',
      'Asynchronous storage engines (MySQL / H2) with HikariCP',
      'Third-party integrations: Discord webhooks, Tebex, Vault, PlaceholderAPI',
    ],
    scopeNote: 'Engineered in modern Java 21 with clean architecture and zero main-thread lag.',
  },
  {
    id: 'mods',
    categoryParam: 'Custom Minecraft Mod Development',
    badge: 'CLIENT & SERVER MODS',
    title: 'Custom Minecraft Mod Development',
    subtitle: 'Fabric, NeoForge, and Forge',
    description:
      'We develop custom mods for your ideas and requirements. Supported mod loader, target Minecraft version, dependencies, and technical scope are confirmed for each project.',
    highlights: [
      'Custom items, blocks, weapons, armor & specialized tools',
      'Custom entity AI, animated bosses & procedural behaviors',
      'Bi-directional network packet handling & client/server sync',
      'Custom client HUDs, graphical interfaces & screen overlays',
      'Performance-optimized modpack integrations & server-side logic',
      'Dedicated configuration systems for singleplayer & multiplayer servers',
    ],
    scopeNote: 'Supported mod loader (Fabric/NeoForge/Forge) and version confirmed prior to development.',
  },
  {
    id: 'setup',
    categoryParam: 'Minecraft Server Setup & Configuration',
    badge: 'INFRASTRUCTURE & CONFIG',
    title: 'Minecraft Server Setup & Configuration',
    subtitle: 'Single-Instance to Multi-Server Velocity Proxy Networks',
    description:
      'We help customers set up and configure their servers, install and configure suitable plugins or mods, organize permissions, configure gameplay systems, and implement other agreed server requirements.',
    highlights: [
      'Server core installation & optimized Aikar JVM tuning flags',
      'Plugin/mod installation, dependency resolution & compatibility audits',
      'Granular, secure permission hierarchies configured via LuckPerms',
      'Scoreboard, tablist, chat formatting & spawn protection setup',
      'Cross-server network linking: Velocity, BungeeCord, Redis pub/sub',
      'Automated local/cloud backup routines & security vulnerability checks',
    ],
    scopeNote: 'Turnkey deployment for new servers or full modernization for existing networks.',
  },
];

const DEFAULT_PROCESS_STAGES: ProcessStageItem[] = [
  {
    num: '01',
    title: 'REQUIREMENTS',
    summary: 'Understand the server, goals, requirements, and edge cases.',
    desc: 'We review your gameplay mechanics, player concurrency targets, existing server plugins, and network topology. We map out technical requirements and edge cases before writing a line of code.',
    checklist: ['Gameplay mechanic scoping', 'Version compatibility targets', 'Edge-case boundary mapping'],
  },
  {
    num: '02',
    title: 'ARCHITECTURE',
    summary: 'Plan the plugin structure, configuration, APIs, storage, and permissions.',
    desc: 'Designing the data model (MySQL/H2), event listeners, Redis messaging contracts, and permission hierarchies. Clean architecture guarantees maintainability as your server scales.',
    checklist: ['Thread-safe storage schema', 'Redis pub/sub channel specs', 'Granular permission trees'],
  },
  {
    num: '03',
    title: 'DEVELOPMENT',
    summary: 'Implement readable, maintainable Java using modern APIs.',
    desc: 'Coding in clean, documented Java 21 / Paper API with strict separation of concerns. No monolithic god-classes or unprofiled main-thread operations.',
    checklist: ['Modern Paper/Purpur API', 'Asynchronous task scheduling', 'MiniMessage & Font glyph integration'],
  },
  {
    num: '04',
    title: 'TESTING',
    summary: 'Check functionality, edge cases, permissions, performance risks, and compatibility.',
    desc: 'Subjecting the plugin to high-load packet profiling using Spark, simulated latency variance, inventory desync attacks, and permission inheritance audits.',
    checklist: ['Spark tick & memory profiling', 'Packet-injection stress tests', 'Multi-version cross-verification'],
  },
  {
    num: '05',
    title: 'DELIVERY',
    summary: 'Provide the plugin build, installation instructions, configuration guidance, and agreed docs.',
    desc: 'Providing compiled, optimized JAR builds, annotated YAML configuration files, command cheat sheets, and installation runbooks for your sysadmin team.',
    checklist: ['Optimized production JAR', 'Annotated config.yml templates', 'Admin & permission guide'],
  },
  {
    num: '06',
    title: 'UPDATES',
    summary: 'Handle maintenance, fixes, and updates according to the specific agreement for each project.',
    desc: 'Post-delivery maintenance ensuring compatibility with new Paper/Minecraft releases, emergency hotfixes, and agreed SLA scope adjustments.',
    checklist: ['Agreed SLA hotfix window', 'Major Minecraft update audits', 'Production issue escalation'],
  },
];

const DEFAULT_ABOUT_PARAGRAPHS = [
  'Flix Studios focuses on building Minecraft server plugins, custom client and server mods, and fully configured server experiences tailored strictly to customer requirements.',
  'Rather than assembling throwaway scripts or using fragile workarounds, we treat Minecraft server development as disciplined software engineering. Our plugins utilize modern Paper, Purpur, and Spigot APIs, asynchronous database pools, and clean event architectures designed to scale under heavy player concurrency.',
  'Whether you need an original tournament duel system, a custom modpack mechanic on Fabric or Forge, or an entire multi-server Velocity proxy setup, we prioritize sensible architecture, maintainable implementation, and transparent communication from initial scoping through delivery.',
];

const DEFAULT_ABOUT_PILLARS: AboutPillarItem[] = [
  {
    title: 'Sensible Architecture',
    desc: 'We write clean, modular Java 21 and modloader implementations with asynchronous data handling, clean separation of concerns, and hot-reloadable configurations.',
  },
  {
    title: 'Rigorous Testing',
    desc: 'Every plugin and mod is audited against tick latency, memory leaks, and concurrent player entity loads before it ever reaches your production server.',
  },
  {
    title: 'Clear Communication',
    desc: 'We confirm project scopes, mod loaders, and Minecraft versions in writing before coding. You receive direct progress updates and agreed milestones.',
  },
  {
    title: 'Agreed Delivery Scope',
    desc: 'No false promises of indefinite free rewrites. We establish transparent project briefs, dependable delivery schedules, and dedicated bugfix support.',
  },
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'tickets' | 'members' | 'purchases' | 'reviews' | 'products' | 'pricing' | 'content' | 'settings' | 'audit'
  >('overview');

  // State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReply, setTicketReply] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);

  // Verification form state
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyProductId, setVerifyProductId] = useState('');
  const [verifyReason, setVerifyReason] = useState('Purchased via BuiltByBit - Confirmed in Discord');
  const [verifyTag, setVerifyTag] = useState('Verified Purchaser');
  const [verifyReviewPermitted, setVerifyReviewPermitted] = useState(true);

  // Settings form state
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Website Content state
  const [headlineOverride, setHeadlineOverride] = useState('');
  const [subheadlineOverride, setSubheadlineOverride] = useState('');
  const [ctaPrimaryOverride, setCtaPrimaryOverride] = useState('');
  const [pricingIntroOverride, setPricingIntroOverride] = useState('');
  const [servicesContent, setServicesContent] = useState<ServiceContentItem[]>(DEFAULT_SERVICES_CONTENT);
  const [processStages, setProcessStages] = useState<ProcessStageItem[]>(DEFAULT_PROCESS_STAGES);
  const [aboutParagraphsText, setAboutParagraphsText] = useState(DEFAULT_ABOUT_PARAGRAPHS.join('\n\n'));
  const [aboutPillars, setAboutPillars] = useState<AboutPillarItem[]>(DEFAULT_ABOUT_PILLARS);

  // Pricing plans state
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(INITIAL_PRICING);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  // Search and editing state
  const [purchaserSearch, setPurchaserSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Feedback banner
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedQuery, setCopiedQuery] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllAdminData();
    }
  }, [isOpen, isAdmin]);

  const loadAllAdminData = async () => {
    try {
      const [t, p, r, prods, s, profs, a] = await Promise.all([
        db.getTickets(),
        db.getPurchases(),
        db.getReviews(),
        db.getProducts(),
        db.getSettings(),
        db.getProfiles(),
        db.getAuditLogs(),
      ]);

      setTickets(t);
      setPurchases(p);
      setReviews(r);
      setProducts(prods);
      setSettings(s);
      setProfiles(profs);
      setAuditLogs(a);

      if (prods.length > 0 && !verifyProductId) {
        setVerifyProductId(prods[0].id);
      }

      if (s) {
        setCompanyEmail(s.company_email);
        setCompanyName(s.company_name);
        setTwitterUrl(s.social_links?.twitter || '');
        setInstagramUrl(s.social_links?.instagram || '');
        setGithubUrl(s.social_links?.github || '');
        setLinkedinUrl(s.social_links?.linkedin || '');
        setHeadlineOverride(s.headline_override || '');
        setSubheadlineOverride(s.subheadline_override || '');
        setCtaPrimaryOverride(s.cta_primary_override || '');
        setPricingIntroOverride(s.pricing_intro_override || '');

        if (s.pricing_plans && s.pricing_plans.length > 0) {
          setPricingPlans(s.pricing_plans);
        }
        if (s.services_content && s.services_content.length > 0) {
          setServicesContent(s.services_content);
        }
        if (s.process_stages && s.process_stages.length > 0) {
          setProcessStages(s.process_stages);
        }
        if (s.about_paragraphs && s.about_paragraphs.length > 0) {
          setAboutParagraphsText(s.about_paragraphs.join('\n\n'));
        }
        if (s.about_pillars && s.about_pillars.length > 0) {
          setAboutPillars(s.about_pillars);
        }
      }
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    }
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0D0E12] border border-red-500/30 rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Access Denied</h3>
          <p className="text-xs text-white/50">
            Administrative credentials are required to inspect the Flix Studios management console.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  const handleTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !selectedTicket || !user) return;

    await db.addTicketMessage(selectedTicket.id, {
      sender_id: user.id,
      sender_email: user.email,
      sender_role: 'admin',
      message: ticketReply,
      is_internal_note: isInternalNote,
    });

    setTicketReply('');
    setIsInternalNote(false);
    const refreshed = await db.getTickets();
    setTickets(refreshed);
    const updatedSelected = refreshed.find((t) => t.id === selectedTicket.id);
    if (updatedSelected) setSelectedTicket(updatedSelected);
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: TicketStatus, priority?: TicketPriority) => {
    await db.updateTicketStatus(ticketId, status, priority);
    const refreshed = await db.getTickets();
    setTickets(refreshed);
    if (selectedTicket && selectedTicket.id === ticketId) {
      const target = refreshed.find((t) => t.id === ticketId);
      if (target) setSelectedTicket(target);
    }
  };

  const handleVerifyPurchaser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyEmail.trim() || !verifyProductId || !user) return;

    const prod = products.find((p) => p.id === verifyProductId);
    if (!prod) return;

    await db.verifyPurchaser({
      customer_email: verifyEmail,
      product_id: prod.id,
      product_name: prod.name,
      verified_by: user.email,
      review_permitted: verifyReviewPermitted,
      verification_reason: verifyReason,
      tags: [verifyTag],
    });

    setVerifyEmail('');
    setFeedback({ type: 'success', message: `Verified purchase & review permission granted for ${verifyEmail}` });
    await loadAllAdminData();
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRevokePurchase = async (purchaseId: string) => {
    if (!user) return;
    await db.revokePurchaserPermission(purchaseId, user.email, 'Revoked by admin request');
    setFeedback({ type: 'success', message: 'Purchase and review permissions revoked.' });
    await loadAllAdminData();
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'feature' | 'reject' | 'delete') => {
    if (!user) return;
    await db.moderateReview(reviewId, action, user.email);
    setFeedback({ type: 'success', message: `Review moderated: ${action.toUpperCase()}` });
    await loadAllAdminData();
    setTimeout(() => setFeedback(null), 4000);
  };

  // Product actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await db.saveProduct(editingProduct);
      window.dispatchEvent(new CustomEvent('flix_product_updated', { detail: editingProduct }));
      setFeedback({ type: 'success', message: `Product "${editingProduct.name}" saved successfully.` });
      setEditingProduct(null);
      await loadAllAdminData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      slug: `custom-plugin-${Math.floor(100 + Math.random() * 900)}`,
      name: 'New Minecraft Plugin',
      tagline: 'High-Performance Paper / Purpur Plugin',
      description: 'Comprehensive Minecraft plugin engineered for performance, modularity, and scalability.',
      category: 'Flagship Core System',
      price: '$49.99',
      currency: 'USD',
      pricing_label: 'Lifetime License & Updates',
      is_featured: true,
      cover_image: '/flixcore-logo.png',
      gallery_images: ['/flixcore-logo.png'],
      version: '1.0.0',
      supported_mc_versions: '1.8.8 – 1.21.4',
      server_software: 'Paper, Purpur, Spigot',
      dependencies: 'None',
      documentation_url: 'https://docs.flixcorestudios.com',
      purchase_url: 'https://builtbybit.com/resources/...',
      status: 'published',
      order_index: products.length + 1,
      features: [
        { title: 'Asynchronous Architecture', description: 'Non-blocking multi-threaded database and network I/O.' },
        { title: 'Configuration & Localization', description: 'Configurable YAML and MiniMessage custom font support.' },
      ],
      commands: [
        { command: '/example help', description: 'Displays command reference menu', permission: 'example.user', default: 'true' },
        { command: '/example reload', description: 'Hot-reloads configuration files', permission: 'example.admin', default: 'op' },
      ],
      permissions: [
        { node: 'example.user', description: 'Access to player commands', default: 'true' },
        { node: 'example.admin', description: 'Administrative reload and management', default: 'op' },
      ],
      changelog: [
        { version: '1.0.0', date: new Date().toISOString().split('T')[0], highlights: ['Initial production release'] },
      ],
      created_at: new Date().toISOString(),
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await db.deleteProduct(productId);
      setFeedback({ type: 'success', message: 'Product deleted successfully.' });
      setEditingProduct(null);
      await loadAllAdminData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleMoveProduct = async (productId: string, direction: 'up' | 'down') => {
    const sorted = [...products].sort((a, b) => a.order_index - b.order_index);
    const index = sorted.findIndex((p) => p.id === productId);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentProd = sorted[index];
    const targetProd = sorted[targetIndex];
    const oldOrder = currentProd.order_index;
    currentProd.order_index = targetProd.order_index;
    targetProd.order_index = oldOrder;

    await Promise.all([db.saveProduct(currentProd), db.saveProduct(targetProd)]);
    await loadAllAdminData();
  };

  // Pricing plan actions
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !user) return;

    const existingIdx = pricingPlans.findIndex((p) => p.id === editingPlan.id);
    let updatedPlans: PricingPlan[];
    if (existingIdx >= 0) {
      updatedPlans = [...pricingPlans];
      updatedPlans[existingIdx] = editingPlan;
    } else {
      updatedPlans = [...pricingPlans, editingPlan];
    }

    try {
      await db.updateSettings({ pricing_plans: updatedPlans }, user.email);
      setPricingPlans(updatedPlans);
      setEditingPlan(null);
      setFeedback({ type: 'success', message: `Pricing plan "${editingPlan.service_title}" saved successfully.` });
      await loadAllAdminData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save pricing plan';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to remove this pricing plan?') || !user) return;
    const updatedPlans = pricingPlans.filter((p) => p.id !== planId);
    try {
      await db.updateSettings({ pricing_plans: updatedPlans }, user.email);
      setPricingPlans(updatedPlans);
      setEditingPlan(null);
      setFeedback({ type: 'success', message: 'Pricing plan removed successfully.' });
      await loadAllAdminData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove plan';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleMovePlan = async (planId: string, direction: 'up' | 'down') => {
    if (!user) return;
    const index = pricingPlans.findIndex((p) => p.id === planId);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pricingPlans.length) return;

    const updated = [...pricingPlans];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    await db.updateSettings({ pricing_plans: updated }, user.email);
    setPricingPlans(updated);
    await loadAllAdminData();
  };

  // Website Content actions
  const handleSaveWebsiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const parsedParagraphs = aboutParagraphsText
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    try {
      await db.updateSettings(
        {
          headline_override: headlineOverride || undefined,
          subheadline_override: subheadlineOverride || undefined,
          cta_primary_override: ctaPrimaryOverride || undefined,
          pricing_intro_override: pricingIntroOverride || undefined,
          services_content: servicesContent,
          process_stages: processStages,
          about_paragraphs: parsedParagraphs,
          about_pillars: aboutPillars,
        },
        user.email
      );

      setFeedback({ type: 'success', message: 'Website content overrides published and synchronized successfully.' });
      await loadAllAdminData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update content';
      setFeedback({ type: 'error', message: msg });
    }
  };

  // Studio Settings actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await db.updateSettings(
        {
          company_email: companyEmail,
          company_name: companyName,
          social_links: {
            twitter: twitterUrl,
            instagram: instagramUrl,
            github: githubUrl,
            linkedin: linkedinUrl,
          },
        },
        user.email
      );

      setFeedback({ type: 'success', message: 'Studio business settings updated successfully.' });
      await loadAllAdminData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const copySqlSnippet = () => {
    navigator.clipboard.writeText("UPDATE profiles SET role = 'admin' WHERE email = 'flixcorestudios@gmail.com';");
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#0B0C0E] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 md:px-6 border-b border-white/10 flex items-center justify-between bg-[#111216]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#8B5CFF]/10 text-[#8B5CFF]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Flix Studios Command & Control</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B5CFF]/20 text-[#8B5CFF]">
                  ADMIN CONSOLE
                </span>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    SUPABASE LIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Database className="w-3 h-3 text-amber-400" />
                    LOCAL PREVIEW MODE
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-white/40">Logged in as: {user?.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`px-6 py-2.5 flex items-center gap-2 text-xs font-mono ${
              feedback.type === 'success'
                ? 'bg-green-500/10 border-b border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-b border-red-500/20 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'tickets', label: `Tickets (${tickets.length})`, icon: TicketIcon },
            { id: 'members', label: `Members (${profiles.length})`, icon: Users },
            { id: 'purchases', label: `Purchasers (${purchases.length})`, icon: ShieldCheck },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'pricing', label: `Pricing (${pricingPlans.length})`, icon: DollarSign },
            { id: 'content', label: 'Website Content', icon: FileText },
            { id: 'settings', label: 'Studio Settings', icon: Settings },
            { id: 'audit', label: 'Audit Logs', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setSelectedTicket(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Open Inquiries</span>
                  <div className="text-2xl font-bold text-[#D7FF3F]">
                    {tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length}
                  </div>
                  <span className="text-[11px] font-mono text-white/50">Total: {tickets.length}</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Verified Purchasers</span>
                  <div className="text-2xl font-bold text-white">
                    {purchases.filter((p) => p.verification_status === 'verified').length}
                  </div>
                  <span className="text-[11px] font-mono text-white/50">Active review grants</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Pending Reviews</span>
                  <div className="text-2xl font-bold text-amber-400">
                    {reviews.filter((r) => r.status === 'pending').length}
                  </div>
                  <span className="text-[11px] font-mono text-white/50">Awaiting moderation</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Live Products</span>
                  <div className="text-2xl font-bold text-[#8B5CFF]">{products.length}</div>
                  <span className="text-[11px] font-mono text-white/50">In marketplace catalogue</span>
                </div>
              </div>

              {/* Backend Status Card */}
              <div
                className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSupabaseConfigured
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database
                      className={`w-4 h-4 ${isSupabaseConfigured ? 'text-green-400' : 'text-amber-400'}`}
                    />
                    <h4 className="text-xs font-mono font-bold text-white uppercase">
                      {isSupabaseConfigured
                        ? 'Supabase Cloud Database Connected'
                        : 'Local Mirroring & Staging Mode Active'}
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
                    {isSupabaseConfigured
                      ? 'Live PostgreSQL tables with Row-Level Security are synchronizing your products, tickets, and customer reviews across all production traffic.'
                      : 'All edits to products, pricing tiers, and website copy are preserved persistently in local storage and mirrored instantly across the website. To connect live cloud PostgreSQL, supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'}
                  </p>
                </div>
                {!isSupabaseConfigured && (
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono whitespace-nowrap transition-colors"
                  >
                    View Setup Instructions →
                  </button>
                )}
              </div>

              {/* Recent Activity Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-white/60 uppercase tracking-wider">
                  Recent Administrative Audit Activity
                </h4>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-black/40 text-white/40 border-b border-white/10">
                      <tr>
                        <th className="p-3">TIMESTAMP</th>
                        <th className="p-3">ACTION</th>
                        <th className="p-3">ADMIN</th>
                        <th className="p-3">DETAILS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/70">
                      {auditLogs.slice(0, 6).map((log) => (
                        <tr key={log.id}>
                          <td className="p-3 text-white/40">{new Date(log.created_at).toLocaleTimeString()}</td>
                          <td className="p-3 text-[#D7FF3F] font-bold">{log.action}</td>
                          <td className="p-3">{log.admin_email}</td>
                          <td className="p-3 text-white/60 truncate max-w-xs">{log.details}</td>
                        </tr>
                      ))}
                      {auditLogs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-white/40">
                            No administrative audit events recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TICKETS */}
          {activeTab === 'tickets' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-3 border-r border-white/5 pr-0 md:pr-4">
                <h4 className="text-xs font-mono text-white/60 uppercase">Support & Project Tickets</h4>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTicket?.id === t.id
                          ? 'bg-[#8B5CFF]/15 border-[#8B5CFF]/50 text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-[#D7FF3F] font-bold">{t.ticket_number}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                            t.status === 'open'
                              ? 'bg-green-500/20 text-green-400'
                              : t.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-400'
                              : t.status === 'resolved'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">{t.title}</p>
                      <p className="text-[11px] text-white/40 truncate">{t.customer_email}</p>
                    </div>
                  ))}
                  {tickets.length === 0 && (
                    <p className="text-xs font-mono text-white/40 p-4 text-center">No inquiries submitted yet.</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                {selectedTicket ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#D7FF3F] font-bold">
                            {selectedTicket.ticket_number}
                          </span>
                          <h4 className="text-sm font-bold text-white">{selectedTicket.title}</h4>
                        </div>
                        <p className="text-xs text-white/50">
                          {selectedTicket.customer_name} ({selectedTicket.customer_email}) · Category:{' '}
                          {selectedTicket.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) =>
                            handleUpdateTicketStatus(selectedTicket.id, e.target.value as TicketStatus)
                          }
                          className="bg-[#14151B] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="waiting_for_customer">Waiting on Client</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Initial Brief</span>
                      <p className="text-white/80 whitespace-pre-wrap">{selectedTicket.description}</p>
                      <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-white/50 border-t border-white/5">
                        {selectedTicket.mc_version && <span>Version: {selectedTicket.mc_version}</span>}
                        {selectedTicket.server_software && <span>Software: {selectedTicket.server_software}</span>}
                        {selectedTicket.budget_range && <span>Budget: {selectedTicket.budget_range}</span>}
                        {selectedTicket.timeframe && <span>Timeline: {selectedTicket.timeframe}</span>}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h5 className="text-xs font-mono text-white/60 uppercase">Message Log & Customer Dispatch</h5>
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {(selectedTicket.messages || []).map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              msg.is_internal_note
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                                : msg.sender_role === 'admin'
                                ? 'bg-[#8B5CFF]/15 border border-[#8B5CFF]/20 text-white ml-6'
                                : 'bg-white/5 border border-white/10 text-white/80 mr-6'
                            }`}
                          >
                            <div className="flex justify-between text-[10px] font-mono text-white/40">
                              <span>
                                {msg.sender_email} {msg.is_internal_note && '(STAFF INTERNAL NOTE)'}
                              </span>
                              <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleTicketReply} className="space-y-2 pt-2">
                        <textarea
                          rows={3}
                          value={ticketReply}
                          onChange={(e) => setTicketReply(e.target.value)}
                          placeholder="Type an official response or staff internal note..."
                          className="w-full bg-[#14151B] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-mono text-white/60 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isInternalNote}
                              onChange={(e) => setIsInternalNote(e.target.checked)}
                              className="rounded border-white/20 bg-white/5 text-[#8B5CFF]"
                            />
                            <span>Internal Staff Note Only (Hidden from customer)</span>
                          </label>

                          <button
                            type="submit"
                            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Reply</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-12 text-center text-white/30 text-xs font-mono">
                    Select a ticket from the left panel to inspect requirements or dispatch answers.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Registered Customer & Staff Profiles</h4>
                  <p className="text-xs text-white/50">
                    Accounts stored securely in PostgreSQL auth schema.
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search by email or name..."
                    className="bg-[#14151B] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-black/40 text-white/40 border-b border-white/10">
                    <tr>
                      <th className="p-3">EMAIL</th>
                      <th className="p-3">NAME</th>
                      <th className="p-3">ROLE</th>
                      <th className="p-3">JOINED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {profiles
                      .filter((p) =>
                        p.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        p.full_name?.toLowerCase().includes(memberSearch.toLowerCase())
                      )
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="p-3 text-white font-medium">{p.email}</td>
                          <td className="p-3 text-white/60">{p.full_name || 'N/A'}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                p.role === 'admin'
                                  ? 'bg-[#8B5CFF]/20 text-[#8B5CFF]'
                                  : 'bg-white/10 text-white/60'
                              }`}
                            >
                              {p.role}
                            </span>
                          </td>
                          <td className="p-3 text-white/40">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    {profiles.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-white/40">
                          No profiles registered yet. Users will appear here after signing up.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PURCHASERS */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <form onSubmit={handleVerifyPurchaser} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D7FF3F]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MANUALLY AUTHORIZE VERIFIED PURCHASER & REVIEW PERMISSION</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">CUSTOMER EMAIL *</label>
                    <input
                      type="email"
                      required
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      placeholder="client@servernetwork.net"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">PURCHASED PRODUCT *</label>
                    <select
                      value={verifyProductId}
                      onChange={(e) => setVerifyProductId(e.target.value)}
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">VERIFICATION PROOF / REASON</label>
                    <input
                      type="text"
                      value={verifyReason}
                      onChange={(e) => setVerifyReason(e.target.value)}
                      placeholder="BuiltByBit Transaction #8491 confirmed"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">CUSTOM BADGE TAG</label>
                    <input
                      type="text"
                      value={verifyTag}
                      onChange={(e) => setVerifyTag(e.target.value)}
                      placeholder="Verified Purchaser / Server Owner"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifyReviewPermitted}
                      onChange={(e) => setVerifyReviewPermitted(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                    />
                    <span>Grant Paid-Purchaser Review Submission Permission</span>
                  </label>

                  <button
                    type="submit"
                    className="btn-primary text-xs px-5 py-2.5"
                  >
                    <span>Grant Verified Purchaser Status</span>
                  </button>
                </div>
              </form>

              {/* Verified Purchasers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-white/60 uppercase">
                    Verified Customer Records ({purchases.length})
                  </h4>
                  <input
                    type="text"
                    value={purchaserSearch}
                    onChange={(e) => setPurchaserSearch(e.target.value)}
                    placeholder="Search verified purchasers..."
                    className="bg-[#14151B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30"
                  />
                </div>

                <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-black/40 text-white/40 border-b border-white/10">
                      <tr>
                        <th className="p-3">EMAIL</th>
                        <th className="p-3">PRODUCT</th>
                        <th className="p-3">TAGS</th>
                        <th className="p-3">REVIEW PERMITTED</th>
                        <th className="p-3">VERIFIED BY</th>
                        <th className="p-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {purchases
                        .filter((p) => p.customer_email.toLowerCase().includes(purchaserSearch.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id}>
                            <td className="p-3 text-white font-medium">{p.customer_email}</td>
                            <td className="p-3 text-[#D7FF3F]">{p.product_name}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 text-[10px]">
                                {p.tags.join(', ')}
                              </span>
                            </td>
                            <td className="p-3">
                              {p.review_permitted ? (
                                <span className="text-green-400 font-bold">YES</span>
                              ) : (
                                <span className="text-red-400">REVOKED</span>
                              )}
                            </td>
                            <td className="p-3 text-white/50">{p.verified_by}</td>
                            <td className="p-3 text-right">
                              {p.verification_status === 'verified' && (
                                <button
                                  onClick={() => handleRevokePurchase(p.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-mono transition-colors"
                                >
                                  Revoke
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Customer Reviews Moderation</h4>
                  <p className="text-xs text-white/50">
                    Approve, feature, or remove reviews submitted by verified purchasers.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">{'★'.repeat(rev.rating)}</span>
                          <h5 className="text-sm font-bold text-white">{rev.title}</h5>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                              rev.status === 'featured'
                                ? 'bg-[#8B5CFF]/20 text-[#8B5CFF]'
                                : rev.status === 'approved'
                                ? 'bg-green-500/20 text-green-400'
                                : rev.status === 'pending'
                                ? 'bg-amber-400/20 text-amber-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 font-mono mt-0.5">
                          By {rev.customer_name} ({rev.customer_email}) for {rev.product_name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleModerateReview(rev.id, 'approve')}
                          className="px-2.5 py-1 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-mono"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerateReview(rev.id, 'feature')}
                          className="px-2.5 py-1 rounded-lg bg-[#8B5CFF]/10 hover:bg-[#8B5CFF]/20 text-[#8B5CFF] text-xs font-mono"
                        >
                          Feature
                        </button>
                        <button
                          onClick={() => handleModerateReview(rev.id, 'reject')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-mono"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleModerateReview(rev.id, 'delete')}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed">{rev.content}</p>

                    {rev.images && rev.images.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {rev.images.map((img, iIdx) => (
                          <a
                            key={iIdx}
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-16 h-12 rounded-lg border border-white/10 overflow-hidden block"
                          >
                            <img src={img} alt="Proof" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-xs font-mono text-white/40 p-6 text-center">No reviews submitted yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Marketplace Product Catalogue</h4>
                  <p className="text-xs text-white/50">
                    Add, edit, reorder, and configure products. Published products immediately appear on /products.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Filter products..."
                      className="bg-[#14151B] border border-white/10 rounded-xl pl-8 pr-3 py-1 text-xs text-white"
                    />
                  </div>
                  <button
                    onClick={handleCreateProduct}
                    className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Product</span>
                  </button>
                </div>
              </div>

              {/* Editing Product Form */}
              {editingProduct && (
                <form
                  onSubmit={handleSaveProduct}
                  className="p-5 rounded-2xl bg-white/5 border border-[#8B5CFF]/30 space-y-4 animate-fade-in shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h5 className="text-xs font-mono font-bold text-[#8B5CFF] uppercase flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>EDITING: {editingProduct.name || 'NEW PRODUCT'}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Core Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">PRODUCT NAME *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">URL SLUG (e.g. flixcore-plugin) *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.slug}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                          })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">CATEGORY *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        placeholder="Flagship Core System, Spigot Plugin, Mod"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">VERSION *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.version}
                        onChange={(e) => setEditingProduct({ ...editingProduct, version: e.target.value })}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">DISPLAY ORDER</label>
                      <input
                        type="number"
                        min={1}
                        value={editingProduct.order_index}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, order_index: parseInt(e.target.value) || 1 })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                  </div>

                  {/* Pricing Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                    <div>
                      <label className="block text-[10px] font-mono text-[#D7FF3F] mb-1">PRICE DISPLAY (e.g. $49.99)</label>
                      <input
                        type="text"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        placeholder="$49.99"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/70 mb-1">CURRENCY</label>
                      <input
                        type="text"
                        value={editingProduct.currency || 'USD'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, currency: e.target.value })}
                        placeholder="USD"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/70 mb-1">PRICING LABEL</label>
                      <input
                        type="text"
                        value={editingProduct.pricing_label || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, pricing_label: e.target.value })}
                        placeholder="Lifetime License & Updates"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col justify-end pb-1.5">
                      <label className="flex items-center gap-2 text-xs font-mono text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.is_featured ?? true}
                          onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                          className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                        />
                        <span>Featured Product</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">TAGLINE *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.tagline}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">DESCRIPTION *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">CATALOGUE STATUS</label>
                      <select
                        value={editingProduct.status}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            status: e.target.value as 'published' | 'draft' | 'archived',
                          })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      >
                        <option value="published">Published (Visible in Catalog)</option>
                        <option value="draft">Draft (Hidden)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono text-[#D7FF3F] uppercase flex items-center gap-1.5 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Primary Cover Image</span>
                        </label>
                        <span className="text-[10px] font-mono text-white/40">Displayed in catalog & hero cards</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-24 h-16 rounded-lg bg-[#08090B] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 p-1">
                          {editingProduct.cover_image ? (
                            <img
                              src={editingProduct.cover_image}
                              alt="Cover preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/flixcore-logo.png';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-white/20" />
                          )}
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                          <input
                            type="text"
                            value={editingProduct.cover_image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, cover_image: e.target.value })}
                            placeholder="/products/flixcore/cover.png"
                            className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D7FF3F]"
                          />
                          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                            <span className="text-white/40 py-0.5">Quick picks:</span>
                            <button
                              type="button"
                              onClick={() => setEditingProduct({ ...editingProduct, cover_image: '/products/flixcore/cover.png' })}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#D7FF3F] border border-white/10"
                            >
                              cover.png (Deck)
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProduct({ ...editingProduct, cover_image: '/products/flixcore/1.png' })}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                            >
                              1.png (Kits)
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProduct({ ...editingProduct, cover_image: '/flixcore-logo.png' })}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                            >
                              flixcore-logo.png
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">SUPPORTED MC VERSIONS</label>
                      <input
                        type="text"
                        value={editingProduct.supported_mc_versions}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, supported_mc_versions: e.target.value })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">SERVER SOFTWARE</label>
                      <input
                        type="text"
                        value={editingProduct.server_software}
                        onChange={(e) => setEditingProduct({ ...editingProduct, server_software: e.target.value })}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">DEPENDENCIES & INTEGRATIONS</label>
                    <input
                      type="text"
                      value={editingProduct.dependencies}
                      onChange={(e) => setEditingProduct({ ...editingProduct, dependencies: e.target.value })}
                      placeholder="ProtocolLib, AnvilGUI, Vault, MySQL"
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">DOCUMENTATION URL</label>
                      <input
                        type="url"
                        value={editingProduct.documentation_url || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, documentation_url: e.target.value })}
                        placeholder="https://docs.flixcorestudios.com"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">PURCHASE / MARKETPLACE URL</label>
                      <input
                        type="url"
                        value={editingProduct.purchase_url || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, purchase_url: e.target.value })}
                        placeholder="https://builtbybit.com/resources/..."
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#D7FF3F] mb-1">PURCHASE BUTTON LABEL</label>
                      <input
                        type="text"
                        value={editingProduct.purchase_button_label || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, purchase_button_label: e.target.value })}
                        placeholder="Purchase on BuiltByBit — $49.99 USD"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8B5CFF] mb-1">SUPPORT / DISCORD URL</label>
                      <input
                        type="url"
                        value={editingProduct.support_url || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, support_url: e.target.value })}
                        placeholder="https://discord.gg/flixcore"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                  </div>

                  {/* Visual Gallery Screenshots Manager */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono text-white/80 uppercase font-bold flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#D7FF3F]" />
                          <span>Gallery Showcase Slides ({(editingProduct.gallery_images || []).length})</span>
                        </span>
                        <p className="text-[10px] font-mono text-white/40 mt-0.5">
                          Visual media rendered in the art-directed cinematic gallery and lightbox.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const flixDeck = [
                              '/products/flixcore/1.png',
                              '/products/flixcore/2.png',
                              '/products/flixcore/3.png',
                              '/products/flixcore/4.png',
                              '/products/flixcore/5.png',
                              '/products/flixcore/6.png',
                              '/products/flixcore/7.png',
                              '/products/flixcore/8.png',
                              '/products/flixcore/9.png',
                            ];
                            setEditingProduct({
                              ...editingProduct,
                              gallery_images: flixDeck,
                              cover_image: editingProduct.cover_image || '/products/flixcore/cover.png',
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#8B5CFF]/15 hover:bg-[#8B5CFF]/25 border border-[#8B5CFF]/30 text-[#A78BFA] text-[10px] font-mono flex items-center gap-1 transition-colors"
                          title="Populate with the 9 c1 advertising graphics"
                        >
                          <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                          <span>Load c1 Deck</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const current = editingProduct.gallery_images || [];
                            const nextIndex = current.length + 1;
                            const defaultPath = nextIndex <= 9 ? `/products/flixcore/${nextIndex}.png` : '/products/flixcore/cover.png';
                            setEditingProduct({
                              ...editingProduct,
                              gallery_images: [...current, defaultPath],
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D7FF3F] text-[11px] font-mono flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Slide</span>
                        </button>
                      </div>
                    </div>

                    {/* Slides List with Visual Thumbnails & Controls */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {(editingProduct.gallery_images || []).map((imgUrl, gIdx) => {
                        const isCover = editingProduct.cover_image === imgUrl;
                        return (
                          <div
                            key={gIdx}
                            className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-center gap-3 transition-colors ${
                              isCover
                                ? 'bg-[#D7FF3F]/5 border-[#D7FF3F]/30'
                                : 'bg-[#0D0E12] border-white/10 hover:border-white/20'
                            }`}
                          >
                            {/* Slide Number & Thumbnail */}
                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                              <span className="w-6 text-[10px] font-mono text-white/40 text-center font-bold">
                                #{String(gIdx + 1).padStart(2, '0')}
                              </span>
                              <div className="w-20 h-12 rounded-lg bg-[#08090B] border border-white/10 overflow-hidden flex items-center justify-center p-1 relative group">
                                <img
                                  src={imgUrl}
                                  alt={`Slide ${gIdx + 1}`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/flixcore-logo.png';
                                  }}
                                />
                                {isCover && (
                                  <span className="absolute bottom-0 inset-x-0 bg-[#D7FF3F] text-black text-[8px] font-bold font-mono text-center leading-tight">
                                    COVER
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Image URL input */}
                            <div className="flex-1 w-full space-y-1">
                              <input
                                type="text"
                                value={imgUrl}
                                onChange={(e) => {
                                  const updated = [...(editingProduct.gallery_images || [])];
                                  updated[gIdx] = e.target.value;
                                  setEditingProduct({ ...editingProduct, gallery_images: updated });
                                }}
                                placeholder="/products/flixcore/1.png"
                                className="w-full bg-[#111216] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#D7FF3F]"
                              />
                            </div>

                            {/* Actions toolbar */}
                            <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                              {/* Set as Cover */}
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, cover_image: imgUrl })}
                                className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-colors ${
                                  isCover
                                    ? 'bg-[#D7FF3F] text-black font-bold'
                                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                                }`}
                                title="Set as primary cover image"
                              >
                                {isCover ? <Check className="w-3 h-3 text-black" /> : <Eye className="w-3 h-3" />}
                                <span>{isCover ? 'Cover' : 'Make Cover'}</span>
                              </button>

                              {/* Move Up */}
                              <button
                                type="button"
                                disabled={gIdx === 0}
                                onClick={() => {
                                  if (gIdx === 0) return;
                                  const updated = [...(editingProduct.gallery_images || [])];
                                  const temp = updated[gIdx];
                                  updated[gIdx] = updated[gIdx - 1];
                                  updated[gIdx - 1] = temp;
                                  setEditingProduct({ ...editingProduct, gallery_images: updated });
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 disabled:hover:bg-white/5 transition-colors"
                                title="Move slide up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Move Down */}
                              <button
                                type="button"
                                disabled={gIdx === (editingProduct.gallery_images || []).length - 1}
                                onClick={() => {
                                  const current = editingProduct.gallery_images || [];
                                  if (gIdx >= current.length - 1) return;
                                  const updated = [...current];
                                  const temp = updated[gIdx];
                                  updated[gIdx] = updated[gIdx + 1];
                                  updated[gIdx + 1] = temp;
                                  setEditingProduct({ ...editingProduct, gallery_images: updated });
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 disabled:hover:bg-white/5 transition-colors"
                                title="Move slide down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingProduct.gallery_images || []).filter((_, idx) => idx !== gIdx);
                                  setEditingProduct({ ...editingProduct, gallery_images: updated });
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Remove slide from gallery"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {(!editingProduct.gallery_images || editingProduct.gallery_images.length === 0) && (
                        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs font-mono text-white/40 space-y-2">
                          <p>No gallery images configured.</p>
                          <button
                            type="button"
                            onClick={() => {
                              const flixDeck = [
                                '/products/flixcore/1.png',
                                '/products/flixcore/2.png',
                                '/products/flixcore/3.png',
                                '/products/flixcore/4.png',
                                '/products/flixcore/5.png',
                                '/products/flixcore/6.png',
                                '/products/flixcore/7.png',
                                '/products/flixcore/8.png',
                                '/products/flixcore/9.png',
                              ];
                              setEditingProduct({
                                ...editingProduct,
                                gallery_images: flixDeck,
                                cover_image: editingProduct.cover_image || '/products/flixcore/cover.png',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#D7FF3F]/10 border border-[#D7FF3F]/30 text-[#D7FF3F] text-xs font-mono inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Load 9 FlixCore Advertising Slides</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commands Editor */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/70 uppercase">
                        Commands Reference ({(editingProduct.commands || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingProduct.commands || [];
                          setEditingProduct({
                            ...editingProduct,
                            commands: [
                              ...current,
                              {
                                command: '/cmd <args>',
                                description: 'Command description',
                                permission: 'node.admin',
                                default: 'op',
                              },
                            ],
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D7FF3F] text-[11px] font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Command</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(editingProduct.commands || []).map((cmd, cIdx) => (
                        <div key={cIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={cmd.command}
                            onChange={(e) => {
                              const updated = [...(editingProduct.commands || [])];
                              updated[cIdx] = { ...updated[cIdx], command: e.target.value };
                              setEditingProduct({ ...editingProduct, commands: updated });
                            }}
                            placeholder="/command <arg>"
                            className="bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#D7FF3F] font-mono"
                          />
                          <input
                            type="text"
                            value={cmd.description}
                            onChange={(e) => {
                              const updated = [...(editingProduct.commands || [])];
                              updated[cIdx] = { ...updated[cIdx], description: e.target.value };
                              setEditingProduct({ ...editingProduct, commands: updated });
                            }}
                            placeholder="Description"
                            className="bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white md:col-span-2"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cmd.permission || ''}
                              onChange={(e) => {
                                const updated = [...(editingProduct.commands || [])];
                                updated[cIdx] = { ...updated[cIdx], permission: e.target.value };
                                setEditingProduct({ ...editingProduct, commands: updated });
                              }}
                              placeholder="Permission node"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2 py-1 text-xs text-[#8B5CFF] font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingProduct.commands || []).filter((_, idx) => idx !== cIdx);
                                setEditingProduct({ ...editingProduct, commands: updated });
                              }}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions Editor */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/70 uppercase">
                        Permissions Matrix ({(editingProduct.permissions || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingProduct.permissions || [];
                          setEditingProduct({
                            ...editingProduct,
                            permissions: [
                              ...current,
                              {
                                node: 'flixcore.node',
                                description: 'Permission description',
                                default: 'op',
                              },
                            ],
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D7FF3F] text-[11px] font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Permission</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(editingProduct.permissions || []).map((perm, pIdx) => (
                        <div key={pIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={perm.node}
                            onChange={(e) => {
                              const updated = [...(editingProduct.permissions || [])];
                              updated[pIdx] = { ...updated[pIdx], node: e.target.value };
                              setEditingProduct({ ...editingProduct, permissions: updated });
                            }}
                            placeholder="node.admin"
                            className="bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#8B5CFF] font-mono"
                          />
                          <input
                            type="text"
                            value={perm.description}
                            onChange={(e) => {
                              const updated = [...(editingProduct.permissions || [])];
                              updated[pIdx] = { ...updated[pIdx], description: e.target.value };
                              setEditingProduct({ ...editingProduct, permissions: updated });
                            }}
                            placeholder="Description"
                            className="bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white md:col-span-2"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={perm.default || 'op'}
                              onChange={(e) => {
                                const updated = [...(editingProduct.permissions || [])];
                                updated[pIdx] = { ...updated[pIdx], default: e.target.value };
                                setEditingProduct({ ...editingProduct, permissions: updated });
                              }}
                              placeholder="op / true"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2 py-1 text-xs text-white/50 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingProduct.permissions || []).filter((_, idx) => idx !== pIdx);
                                setEditingProduct({ ...editingProduct, permissions: updated });
                              }}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features Manager */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/70 uppercase">
                        Product Features ({editingProduct.features?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingProduct.features || [];
                          setEditingProduct({
                            ...editingProduct,
                            features: [...current, { title: 'New Feature', description: 'Feature description' }],
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D7FF3F] text-[11px] font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Feature</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(editingProduct.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={feat.title}
                              onChange={(e) => {
                                const updated = [...editingProduct.features];
                                updated[fIdx] = { ...updated[fIdx], title: e.target.value };
                                setEditingProduct({ ...editingProduct, features: updated });
                              }}
                              placeholder="Feature Title"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                            />
                            <textarea
                              rows={2}
                              value={feat.description}
                              onChange={(e) => {
                                const updated = [...editingProduct.features];
                                updated[fIdx] = { ...updated[fIdx], description: e.target.value };
                                setEditingProduct({ ...editingProduct, features: updated });
                              }}
                              placeholder="Feature Description"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg p-2 text-[11px] text-white/80 resize-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProduct.features.filter((_, idx) => idx !== fIdx);
                              setEditingProduct({ ...editingProduct, features: updated });
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Changelog Manager */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/70 uppercase">
                        Changelog Releases ({editingProduct.changelog?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingProduct.changelog || [];
                          setEditingProduct({
                            ...editingProduct,
                            changelog: [
                              {
                                version: '1.1.0',
                                date: new Date().toISOString().split('T')[0],
                                highlights: ['Performance improvements and bugfixes'],
                              },
                              ...current,
                            ],
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D7FF3F] text-[11px] font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Version</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(editingProduct.changelog || []).map((ch, cIdx) => (
                        <div key={cIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={ch.version}
                              onChange={(e) => {
                                const updated = [...editingProduct.changelog];
                                updated[cIdx] = { ...updated[cIdx], version: e.target.value };
                                setEditingProduct({ ...editingProduct, changelog: updated });
                              }}
                              placeholder="v1.0.0"
                              className="w-24 bg-[#0D0E12] border border-white/10 rounded-lg px-2 py-1 text-xs text-[#D7FF3F] font-mono"
                            />
                            <input
                              type="text"
                              value={ch.date}
                              onChange={(e) => {
                                const updated = [...editingProduct.changelog];
                                updated[cIdx] = { ...updated[cIdx], date: e.target.value };
                                setEditingProduct({ ...editingProduct, changelog: updated });
                              }}
                              placeholder="YYYY-MM-DD"
                              className="w-32 bg-[#0D0E12] border border-white/10 rounded-lg px-2 py-1 text-xs text-white/60 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingProduct.changelog.filter((_, idx) => idx !== cIdx);
                                setEditingProduct({ ...editingProduct, changelog: updated });
                              }}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={ch.highlights.join('\n')}
                            onChange={(e) => {
                              const updated = [...editingProduct.changelog];
                              updated[cIdx] = {
                                ...updated[cIdx],
                                highlights: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                              };
                              setEditingProduct({ ...editingProduct, changelog: updated });
                            }}
                            placeholder="Enter highlights (one per line)"
                            className="w-full bg-[#0D0E12] border border-white/10 rounded-lg p-2 text-[11px] text-white/80 font-mono resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Presentation Settings & Motion-as-Code Scene Toggles */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <span className="text-xs font-mono text-[#D7FF3F] uppercase font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Presentation Settings &amp; Motion Toggles</span>
                    </span>
                    <p className="text-[10px] font-mono text-white/50">
                      Enable or disable individual Motion-as-Code video scenes and interactive components on the live product page.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
                      <label className="flex items-center gap-2.5 text-xs font-mono text-white cursor-pointer p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15">
                        <input
                          type="checkbox"
                          checked={editingProduct.show_hero_motion ?? true}
                          onChange={(e) => setEditingProduct({ ...editingProduct, show_hero_motion: e.target.checked })}
                          className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                        />
                        <div>
                          <span className="block font-bold">Hero Motion Player</span>
                          <span className="text-[10px] text-white/40">Cinematic intro scene in hero header</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs font-mono text-white cursor-pointer p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15">
                        <input
                          type="checkbox"
                          checked={editingProduct.show_features_motion ?? true}
                          onChange={(e) => setEditingProduct({ ...editingProduct, show_features_motion: e.target.checked })}
                          className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                        />
                        <div>
                          <span className="block font-bold">Features Motion Player</span>
                          <span className="text-[10px] text-white/40">Storytelling motion scene in features section</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs font-mono text-white cursor-pointer p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15">
                        <input
                          type="checkbox"
                          checked={editingProduct.show_compatibility_motion ?? true}
                          onChange={(e) => setEditingProduct({ ...editingProduct, show_compatibility_motion: e.target.checked })}
                          className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                        />
                        <div>
                          <span className="block font-bold">Compatibility Motion Player</span>
                          <span className="text-[10px] text-white/40">Runtime matrix motion in specifications section</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs font-mono text-white cursor-pointer p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15">
                        <input
                          type="checkbox"
                          checked={editingProduct.show_purchase_motion ?? true}
                          onChange={(e) => setEditingProduct({ ...editingProduct, show_purchase_motion: e.target.checked })}
                          className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                        />
                        <div>
                          <span className="block font-bold">Purchase Finale Motion Player</span>
                          <span className="text-[10px] text-white/40">Bottom checkout finale motion companion</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Section Headings and Editorial Descriptions Editor */}
                  <div className="space-y-4 pt-3 border-t border-white/10">
                    <div>
                      <span className="text-xs font-mono text-[#8B5CFF] uppercase font-bold flex items-center gap-1.5">
                        <Edit className="w-3.5 h-3.5" />
                        <span>Product Page Section Headings &amp; Descriptions</span>
                      </span>
                      <p className="text-[10px] font-mono text-white/50">
                        Customize section titles, descriptive text, and empty states rendered on the customer-facing product detail page.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Overview Section */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[11px] font-mono text-white/80 font-bold block">
                          SECTION 02: OVERVIEW
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">HEADING</label>
                            <input
                              type="text"
                              value={editingProduct.overview_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, overview_title: e.target.value })}
                              placeholder="Why Premier Minecraft Networks Rely on FlixCore"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">EDITORIAL DESCRIPTION</label>
                            <input
                              type="text"
                              value={editingProduct.overview_description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, overview_description: e.target.value })}
                              placeholder="Standard practice plugins suffer from severe performance bottlenecks..."
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Features Section */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[11px] font-mono text-white/80 font-bold block">
                          SECTION 03: FEATURES
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">HEADING</label>
                            <input
                              type="text"
                              value={editingProduct.features_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, features_title: e.target.value })}
                              placeholder="Comprehensive Competitive Feature Matrix"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">SUBTITLE</label>
                            <input
                              type="text"
                              value={editingProduct.features_description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, features_description: e.target.value })}
                              placeholder="Built on genuine configuration parameters verified from production environments."
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gallery Section */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[11px] font-mono text-white/80 font-bold block">
                          SECTION 04: GALLERY
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">HEADING</label>
                            <input
                              type="text"
                              value={editingProduct.gallery_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, gallery_title: e.target.value })}
                              placeholder="Interactive High-Resolution Product Gallery"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">SUBTITLE</label>
                            <input
                              type="text"
                              value={editingProduct.gallery_description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, gallery_description: e.target.value })}
                              placeholder="Explore confirmed in-game UI layouts, matchmaking screens, elevator platforms..."
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Compatibility Section */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[11px] font-mono text-white/80 font-bold block">
                          SECTION 05: COMPATIBILITY &amp; RUNTIME
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">HEADING</label>
                            <input
                              type="text"
                              value={editingProduct.compatibility_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, compatibility_title: e.target.value })}
                              placeholder="Enterprise Multi-Version & Software Matrix"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">SUBTITLE</label>
                            <input
                              type="text"
                              value={editingProduct.compatibility_description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, compatibility_description: e.target.value })}
                              placeholder="Engineered with native abstraction layers for protocol translation..."
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Reviews Section */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[11px] font-mono text-white/80 font-bold block">
                          SECTION 06: VERIFIED REVIEWS &amp; EMPTY STATE
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">HEADING</label>
                            <input
                              type="text"
                              value={editingProduct.reviews_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, reviews_title: e.target.value })}
                              placeholder="Verified Customer Reviews"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">SUBTITLE</label>
                            <input
                              type="text"
                              value={editingProduct.reviews_description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, reviews_description: e.target.value })}
                              placeholder="Authentic testimonials submitted by production server administrators."
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#D7FF3F] mb-0.5">EMPTY-STATE MESSAGE *</label>
                            <input
                              type="text"
                              value={editingProduct.reviews_empty_message || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, reviews_empty_message: e.target.value })}
                              placeholder="Be the first verified purchaser to share your experience."
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Purchase Finale & Support */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[11px] font-mono text-white/80 font-bold block">
                          SECTIONS 07 &amp; 08: PURCHASE FINALE &amp; SUPPORT
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">PURCHASE BOX TITLE</label>
                            <input
                              type="text"
                              value={editingProduct.purchase_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, purchase_title: e.target.value })}
                              placeholder="Get FlixCore Plugin"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-white/60 mb-0.5">SUPPORT SECTION TITLE</label>
                            <input
                              type="text"
                              value={editingProduct.support_title || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, support_title: e.target.value })}
                              placeholder="Official Documentation & Dedicated Support"
                              className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="btn-primary text-xs px-5 py-2.5 font-bold uppercase"
                      >
                        Save Product Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    {products.some((p) => p.id === editingProduct.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(editingProduct.id)}
                        className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Product</span>
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Products List */}
              <div className="space-y-3">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.category.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((p, idx, arr) => (
                    <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{p.name}</h5>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                                p.status === 'published'
                                  ? 'bg-green-500/20 text-green-400'
                                  : p.status === 'draft'
                                  ? 'bg-amber-400/20 text-amber-400'
                                  : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {p.status}
                            </span>
                            {p.price && (
                              <span className="text-xs font-mono font-bold text-[#D7FF3F] bg-[#D7FF3F]/10 px-2 py-0.5 rounded">
                                {p.price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#D7FF3F] font-mono">{p.tagline}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveProduct(p.id, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveProduct(p.id, 'down')}
                              disabled={idx === arr.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#8B5CFF]/20 text-[#8B5CFF]">
                            v{p.version} // {p.category}
                          </span>
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <Edit className="w-3 h-3 text-[#D7FF3F]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed">{p.description}</p>

                      <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-white/40 border-t border-white/5">
                        <span>Slug: /{p.slug}</span>
                        <span>Order: #{p.order_index}</span>
                        <span>Supported: {p.supported_mc_versions}</span>
                        <span>Software: {p.server_software}</span>
                        {p.purchase_url && <span>Marketplace: {p.purchase_url}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Pricing Plans & Quotation Tiers</h4>
                  <p className="text-xs text-white/50">
                    Control rates, billing details, inclusions, and call-to-actions shown in the public pricing section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPlan({
                      id: `plan-${Date.now()}`,
                      category: 'plugin',
                      service_title: 'Custom Feature Package',
                      starting_price: 'From $150',
                      price_model: 'starting_at',
                      currency: 'USD',
                      billing_details: 'Per-project commission',
                      estimated_timeline: '3 – 7 Business Days',
                      summary: 'Dedicated custom plugin module engineered to agreed specifications.',
                      inclusions: [
                        'Custom command & permission setup',
                        'Configurable YAML and messages',
                        'Compiled production JAR + docs',
                        '14-day post-delivery bugfix warranty',
                      ],
                      limitations: ['Scope limited to agreed brief'],
                      complexity_factors: ['Custom GUI menus', 'Database persistence'],
                      hire_action_label: 'Request a Quote',
                      is_published: true,
                      order_index: pricingPlans.length + 1,
                    })
                  }
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Pricing Plan</span>
                </button>
              </div>

              {/* Editing Plan Form */}
              {editingPlan && (
                <form
                  onSubmit={handleSavePlan}
                  className="p-5 rounded-2xl bg-white/5 border border-[#D7FF3F]/40 space-y-4 animate-fade-in shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h5 className="text-xs font-mono font-bold text-[#D7FF3F] uppercase flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>EDITING PRICING PLAN: {editingPlan.service_title}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono text-white/70 mb-1">SERVICE TITLE *</label>
                      <input
                        type="text"
                        required
                        value={editingPlan.service_title}
                        onChange={(e) => setEditingPlan({ ...editingPlan, service_title: e.target.value })}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">CATEGORY</label>
                      <select
                        value={editingPlan.category}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            category: e.target.value as 'plugin' | 'mod' | 'setup' | 'product',
                          })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      >
                        <option value="plugin">Minecraft Plugin Development</option>
                        <option value="mod">Minecraft Mod Development</option>
                        <option value="setup">Minecraft Server Setup</option>
                        <option value="product">Enterprise / Product Architecture</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">PRICE MODEL</label>
                      <select
                        value={editingPlan.price_model}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            price_model: e.target.value as 'starting_at' | 'fixed' | 'range' | 'quote',
                          })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      >
                        <option value="starting_at">Starting At (e.g. From $150)</option>
                        <option value="fixed">Fixed Price (e.g. $90)</option>
                        <option value="range">Price Range (e.g. $150 - $300)</option>
                        <option value="quote">Custom Quote (Request a Quote)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">DISPLAY RATE *</label>
                      <input
                        type="text"
                        required
                        value={editingPlan.starting_price}
                        onChange={(e) => setEditingPlan({ ...editingPlan, starting_price: e.target.value })}
                        placeholder="From $150 or Request a Quote"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">CURRENCY</label>
                      <input
                        type="text"
                        value={editingPlan.currency || 'USD'}
                        onChange={(e) => setEditingPlan({ ...editingPlan, currency: e.target.value })}
                        placeholder="USD"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">ESTIMATED TIMELINE</label>
                      <input
                        type="text"
                        value={editingPlan.estimated_timeline}
                        onChange={(e) => setEditingPlan({ ...editingPlan, estimated_timeline: e.target.value })}
                        placeholder="3 – 7 Business Days"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">BILLING DETAILS</label>
                      <input
                        type="text"
                        value={editingPlan.billing_details || ''}
                        onChange={(e) => setEditingPlan({ ...editingPlan, billing_details: e.target.value })}
                        placeholder="Milestone-based delivery / Fixed setup commission"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">HIRE ACTION BUTTON LABEL</label>
                      <input
                        type="text"
                        value={editingPlan.hire_action_label || ''}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hire_action_label: e.target.value })}
                        placeholder="Request a Plugin Quote"
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">PLAN SUMMARY</label>
                    <textarea
                      rows={2}
                      value={editingPlan.summary}
                      onChange={(e) => setEditingPlan({ ...editingPlan, summary: e.target.value })}
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-xs text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">
                        INCLUSIONS (ONE PER LINE)
                      </label>
                      <textarea
                        rows={4}
                        value={(editingPlan.inclusions || []).join('\n')}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            inclusions: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                          })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-2.5 text-[11px] text-white/90 font-mono resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">
                        SCOPE BOUNDARIES / LIMITATIONS (ONE PER LINE)
                      </label>
                      <textarea
                        rows={4}
                        value={(editingPlan.limitations || []).join('\n')}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            limitations: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                          })
                        }
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-2.5 text-[11px] text-white/90 font-mono resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="btn-primary text-xs px-5 py-2.5 font-bold uppercase"
                      >
                        Save Pricing Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPlan(null)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono"
                      >
                        Cancel
                      </button>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-mono text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingPlan.is_published ?? true}
                        onChange={(e) => setEditingPlan({ ...editingPlan, is_published: e.target.checked })}
                        className="rounded border-white/20 bg-white/5 text-[#D7FF3F]"
                      />
                      <span>Published & Displayed Publicly</span>
                    </label>
                  </div>
                </form>
              )}

              {/* Plans List */}
              <div className="space-y-3">
                {pricingPlans.map((plan, idx) => (
                  <div key={plan.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-white">{plan.service_title}</h5>
                        <span className="text-xs font-mono font-bold text-[#D7FF3F] bg-[#D7FF3F]/10 px-2.5 py-0.5 rounded">
                          {plan.starting_price}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white/60">
                          {plan.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMovePlan(plan.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMovePlan(plan.id, 'down')}
                            disabled={idx === pricingPlans.length - 1}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => setEditingPlan({ ...plan })}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-3 h-3 text-[#D7FF3F]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/70">{plan.summary}</p>

                    <div className="flex flex-wrap gap-4 text-[11px] font-mono text-white/40 pt-1 border-t border-white/5">
                      <span>Timeline: {plan.estimated_timeline}</span>
                      <span>Action Label: {plan.hire_action_label || 'Default'}</span>
                      <span>Inclusions: {plan.inclusions.length} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WEBSITE CONTENT */}
          {activeTab === 'content' && (
            <form onSubmit={handleSaveWebsiteContent} className="space-y-8 max-w-4xl">
              <div>
                <h4 className="text-sm font-bold text-white">Live Website Content & Copywriting</h4>
                <p className="text-xs text-white/50">
                  Update headlines, public calls-to-action, service descriptions, and process stages. Changes save
                  to database and update the website instantly.
                </p>
              </div>

              {/* Homepage Hero Section */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D7FF3F] uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Homepage Hero Section Copy</span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    PRIMARY HERO HEADLINE (Leave blank for default: WE DON'T JUST CREATE. WE MOVE WORLDS.)
                  </label>
                  <input
                    type="text"
                    value={headlineOverride}
                    onChange={(e) => setHeadlineOverride(e.target.value)}
                    placeholder="WE DON'T JUST CREATE. WE MOVE WORLDS."
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    HERO SUPPORTING SUBHEADLINE
                  </label>
                  <textarea
                    rows={2}
                    value={subheadlineOverride}
                    onChange={(e) => setSubheadlineOverride(e.target.value)}
                    placeholder="Flix Studios designs and engineers custom Minecraft server plugins, bespoke client/server mods, and complete server setups..."
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D7FF3F] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      PRIMARY CTA BUTTON LABEL
                    </label>
                    <input
                      type="text"
                      value={ctaPrimaryOverride}
                      onChange={(e) => setCtaPrimaryOverride(e.target.value)}
                      placeholder="HIRE US"
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      PRICING SECTION INTRO PARAGRAPH
                    </label>
                    <input
                      type="text"
                      value={pricingIntroOverride}
                      onChange={(e) => setPricingIntroOverride(e.target.value)}
                      placeholder="No fake crossed-out discounts, no artificial urgency..."
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Three Main Services Section */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8B5CFF] uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Three Core Services Descriptions</span>
                </div>

                <div className="space-y-4">
                  {servicesContent.map((svc, sIdx) => (
                    <div key={svc.id} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white uppercase">{svc.badge}</span>
                        <span className="text-[10px] font-mono text-white/40">{svc.categoryParam}</span>
                      </div>
                      <input
                        type="text"
                        value={svc.title}
                        onChange={(e) => {
                          const updated = [...servicesContent];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          setServicesContent(updated);
                        }}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={svc.description}
                        onChange={(e) => {
                          const updated = [...servicesContent];
                          updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                          setServicesContent(updated);
                        }}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-lg p-2 text-xs text-white/80 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* About Flix Studios */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                  <FileText className="w-4 h-4 text-[#D7FF3F]" />
                  <span>About Section Narrative</span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    STUDIO STORY & PHILOSOPHY (Separate paragraphs with double blank lines)
                  </label>
                  <textarea
                    rows={5}
                    value={aboutParagraphsText}
                    onChange={(e) => setAboutParagraphsText(e.target.value)}
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-xs text-white/90 leading-relaxed resize-none focus:outline-none focus:border-[#D7FF3F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary text-xs px-6 py-3 font-bold uppercase shadow-xl shadow-[#D7FF3F]/20"
              >
                Publish All Content Overrides
              </button>
            </form>
          )}

          {/* TAB: SETTINGS & PROVISIONING */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-sm font-bold text-white">Studio Business Settings</h4>
                <p className="text-xs text-white/50">
                  Changing the contact email or social links updates the public website globally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    COMPANY CONTACT EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Updates contact dispatch and footer.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">COMPANY NAME *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                  />
                </div>
              </div>

              {/* Social Links Section */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h5 className="text-xs font-mono text-white/60 uppercase">
                  Social Channels (Twitter, Instagram, GitHub, LinkedIn)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">X / TWITTER URL</label>
                    <input
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://x.com/flixcore"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">INSTAGRAM URL</label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/flixcore"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">GITHUB URL</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/flixcorestudios"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">LINKEDIN URL</label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/company/flixcore"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>
                </div>
              </div>

              {/* Administrator Security & Database Setup Guide */}
              <div className="p-5 rounded-2xl bg-[#8B5CFF]/10 border border-[#8B5CFF]/30 space-y-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#8B5CFF] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ADMINISTRATOR & DATABASE PROVISIONING GUIDE</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[11px]">
                  Administrator privileges are verified directly against the Supabase database. To configure the primary
                  admin account for <strong>flixcorestudios@gmail.com</strong>:
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-[#D7FF3F]">
                  <code className="select-all">UPDATE profiles SET role = 'admin' WHERE email = 'flixcorestudios@gmail.com';</code>
                  <button
                    type="button"
                    onClick={copySqlSnippet}
                    className="p-1 rounded text-white/50 hover:text-white"
                    title="Copy SQL"
                  >
                    {copiedQuery ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-white/40 text-[10px]">
                  Server-side migration script is available at <code>scripts/provision-admin.mjs</code>.
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary text-xs px-6 py-2.5 font-bold uppercase"
              >
                Save Studio Settings
              </button>
            </form>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Security & Audit History</h4>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                    <div className="flex justify-between text-white/40 text-[10px] mb-1">
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                      <span className="text-[#D7FF3F]">{log.admin_email}</span>
                    </div>
                    <div className="text-white font-bold">{log.action}</div>
                    <div className="text-white/60">{log.details}</div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-xs font-mono text-white/40 p-6 text-center">No audit logs recorded yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
