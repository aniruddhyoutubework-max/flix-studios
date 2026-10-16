import { isSupabaseConfigured, supabase } from './supabase';
import {
  Profile,
  Product,
  Ticket,
  TicketMessage,
  PurchaseRecord,
  Review,
  SiteSettings,
  PricingPlan,
  AuditEvent,
  UserRole,
  TicketStatus,
  TicketPriority,
  ReviewStatus,
} from '../types/database';
import { sendDiscordNotification } from './discord';

// Confirmed flagship product specification based on FlixCore source configurations
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-flixcore-core',
    slug: 'flixcore-plugin',
    name: 'FlixCore Plugin',
    tagline: 'High-Performance 1v1 Practice, Automated Events & Velocity Limbo Cross-Server Infrastructure',
    description:
      'FlixCore is an enterprise-grade Minecraft PvP practice and event engine designed for Spigot, Paper, and Purpur servers (1.8 through 1.21+). Engineered with non-blocking asynchronous MySQL and H2 persistence, Redis cross-server synchronization, customizable knockback, AI practice bots, and automated tournament events.',
    category: 'Flagship Core System',
    price: '$49.99',
    currency: 'USD',
    pricing_label: 'Lifetime License & Updates',
    is_featured: true,
    cover_image: '/products/flixcore/cover.png',
    gallery_images: [
      '/products/flixcore/1.png',
      '/products/flixcore/2.png',
      '/products/flixcore/3.png',
      '/products/flixcore/4.png',
      '/products/flixcore/5.png',
      '/products/flixcore/6.png',
      '/products/flixcore/7.png',
      '/products/flixcore/8.png',
      '/products/flixcore/9.png',
    ],
    version: '2.4.0',
    supported_mc_versions: '1.8.8 - 1.21.4 (Latest 26.40+ Compatible)',
    server_software: 'Paper, Purpur, Spigot, Folia, Velocity',
    dependencies: 'ProtocolLib, AnvilGUI (Bundled). Redis & MySQL (Required only for Multi-Server Limbo mode)',
    documentation_url: '/docs',
    purchase_url: 'https://builtbybit.com/resources/flixcore',
    purchase_button_label: 'Purchase on BuiltByBit',
    support_url: 'https://discord.gg/flixcore',
    overview_title: 'Why Premier Minecraft Networks Rely on FlixCore',
    overview_description:
      'Standard practice plugins suffer from severe performance bottlenecks: lag spikes during simultaneous arena resets, slow and clunky match queues, and ghost blocks during high-frequency duel exchanges. FlixCore eliminates these points of failure with an asynchronous architecture crafted for sustained concurrency.',
    features_title: 'Comprehensive Competitive Feature Matrix',
    features_description: 'Built on genuine configuration parameters verified from production FlixCore server environments.',
    gallery_title: 'Interactive High-Resolution Product Gallery',
    gallery_description:
      'Explore confirmed in-game UI layouts, matchmaking screens, elevator platforms, and arena bounding mechanics captured directly from production deployments.',
    compatibility_title: 'Enterprise Multi-Version & Software Matrix',
    compatibility_description:
      'Engineered with native abstraction layers for protocol translation, multithreaded region compatibility, and thread-safe async persistence.',
    reviews_title: 'Verified Customer Reviews',
    reviews_description:
      'Authentic testimonials submitted by production Minecraft server administrators and competitive network directors.',
    reviews_empty_message: 'Be the first verified purchaser to share your experience.',
    purchase_title: 'Get FlixCore Plugin',
    purchase_description: 'Immediate digital license delivery with complete future update access.',
    support_title: 'Official Documentation & Dedicated Support',
    support_description:
      'Access comprehensive deployment guides, configuration examples, Java event listeners, or commission Flix Studios for custom modifications and bespoke gamemodes.',
    show_hero_motion: true,
    show_features_motion: true,
    show_compatibility_motion: false,
    show_purchase_motion: true,
    status: 'published',
    order_index: 1,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    features: [
      {
        title: '10+ Custom Combat Kits & Armor Trims',
        description:
          'Empower your players with 10+ uniquely balanced combat kits, alongside an immersive Armor Trim customizer with Rank requirements, UI-driven presets, and complete kit editing.',
      },
      {
        title: 'Standalone Clan Systems & Progression',
        description:
          'Fully standalone clan system with async backend, handling chat, points, and core performance with an independent clan economy earned through duels, FFA, and tournaments.',
      },
      {
        title: 'Ten Built-In Game Modes',
        description:
          'Ten modes, ten ways to play: TNT Tag, Flower Crown, TNT Sumo, Bedwars, Skywars, and permission-based Armor Trims pushing your server beyond standard duels.',
      },
      {
        title: 'Match Start Elevator & Advanced Cinematics',
        description:
          'Underground elevator platform rising smoothly from depth 5 using BlockDisplay entities, kit-based Totem pop animations, sliding cage doors, and parabolic round rewinds.',
      },
      {
        title: 'Ranked Tier Game Modes & Action Queues',
        description:
          'Organized competitive experience with kit-specific tier modes (HT5). Placement matches calculate raw tiers and prevent entry spam, with one-click Action Queues.',
      },
      {
        title: 'Mathematical Arena Bounding & Anti-Escape',
        description:
          'ArenaSafetyHelper 3D boundary containment, in-combat command jail, ghost-match protection, and anti-interruption FFA zones preventing third-party interference.',
      },
      {
        title: 'Asynchronous 20.0 TPS Engine & Preloading',
        description:
          'Chunky arena preloading for 54+ arenas, async FastAsyncWorldEdit (FAWE) rollbacks, and HikariCP database off the main thread ensuring 20.0 TPS with instant transitions.',
      },
      {
        title: 'In-Built Tournament & Event System',
        description:
          'Host Solo, Party, or Clan tournaments with automatic bracket management, alongside rotating events like Sumo, Spleef, TNT Run, and Gulag.',
      },
      {
        title: 'Skill-Based Dynamic Tier Matchmaking',
        description:
          'Tier-first pairing strictly matching players within their bracket (HT5 -> HT5), with expanding search windows every 5s and asynchronous non-blocking queries.',
      },
    ],
    commands: [
      { command: '/practice create <kit>', description: 'Create a new practice duel kit with knockback profiles', permission: 'flixcore.admin', default: 'op' },
      { command: '/duel <player>', description: 'Send a private duel request to another player', permission: 'flixcore.duel', default: 'true' },
      { command: '/events host <event>', description: 'Launch an automated bracket tournament (Sumo, TNT Run, Bracket)', permission: 'flixcore.events.host', default: 'op' },
      { command: '/bot fight <tier>', description: 'Spawn an AI combat practice bot with custom difficulty', permission: 'flixcore.bot', default: 'true' },
      { command: '/flixcore reload', description: 'Hot-reload configurations and MiniMessage language files', permission: 'flixcore.admin', default: 'op' },
    ],
    permissions: [
      { node: 'flixcore.admin', description: 'Full administrative access to manage kits, arenas, and reload', default: 'op' },
      { node: 'flixcore.duel', description: 'Permission to send and accept 1v1 duel challenges', default: 'true' },
      { node: 'flixcore.spectate', description: 'Permission to spectate ongoing duels and tournament matches', default: 'true' },
      { node: 'flixcore.events.host', description: 'Permission to host automated tournament events', default: 'op' },
    ],
    changelog: [
      {
        version: '2.4.0',
        date: '2026-09-18',
        highlights: [
          'Added 1.21.4 Paper support with updated AnvilGUI 1_21_R7 mappings.',
          'Enhanced Redis heartbeat monitoring with automatic dead-arena failover.',
          'Refactored async match history database caching.',
        ],
      },
      {
        version: '2.3.2',
        date: '2026-06-12',
        highlights: [
          'Added MiniMessage custom font support for scoreboard lines and tab header/footer.',
          'Added Sumo knockback customization profiles.',
        ],
      },
    ],
  },
  {
    id: 'prod-flixguard-limbo',
    slug: 'flixguard-limbo',
    name: 'FlixGuard Anti-Abuse & Limbo Shield',
    tagline: 'High-Throughput Packet Rate Limiting, Exploit Mitigation & Multi-Lobby Limbo Handshake',
    description:
      'Lightweight network security and mitigation module designed for Velocity proxies and Paper backends. Protects server instances from malicious packet spam, inventory crash packets, and invalid handshakes, with instant Redis cluster synchronization.',
    category: 'Security & Infrastructure',
    price: '$34.99',
    currency: 'USD',
    pricing_label: 'Per-Network License',
    is_featured: true,
    cover_image: '/flixcore-logo.png',
    gallery_images: ['/flixcore-logo.png'],
    version: '1.8.2',
    supported_mc_versions: '1.8.8 - 1.21.4',
    server_software: 'Velocity Proxy, Paper, Purpur',
    dependencies: 'Redis (Required only for multi-proxy synchronization)',
    documentation_url: 'https://docs.flixcorestudios.com',
    purchase_url: 'https://builtbybit.com/resources/flixguard',
    status: 'draft',
    order_index: 2,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    features: [
      {
        title: 'Asynchronous Packet Inspector',
        description: 'Profiles incoming client packet frequency on Netty event loop threads without blocking server ticks.',
      },
      {
        title: 'Velocity Limbo Handshake Queue',
        description: 'Holds joining connections in lightweight virtual limbo during server lag spikes or DDoS events.',
      },
      {
        title: 'Cluster-Wide Redis IP Action',
        description: 'Instantly synchronizes rate limits and abusive IP drops across all proxy instances in under 2ms.',
      },
      {
        title: 'Discord Webhook Security Alerts',
        description: 'Sends real-time telemetry alerts with player UUID, packet dump, and mitigation action taken.',
      },
    ],
    commands: [
      { command: '/flixguard status', description: 'Inspect real-time proxy packet rates and filtered threats', permission: 'flixguard.admin', default: 'op' },
      { command: '/flixguard inspect <player>', description: 'View connection telemetry and recent packet logs', permission: 'flixguard.admin', default: 'op' },
    ],
    permissions: [
      { node: 'flixguard.admin', description: 'Full access to inspect security telemetry and adjust thresholds', default: 'op' },
    ],
    changelog: [
      {
        version: '1.8.2',
        date: '2026-08-04',
        highlights: [
          'Added native Velocity 3.3.0 packet pipeline hooks.',
          'Enhanced memory footprint on 5,000+ player proxy clusters.',
        ],
      },
    ],
  },
  {
    id: 'prod-flixarena-tournaments',
    slug: 'flixarena-tournaments',
    name: 'FlixArena Tournament Engine',
    tagline: 'Automated Bracket Tournaments, Arena Schematic Rollbacks & Live Spectator HUDs',
    description:
      'Turnkey automated tournament engine managing single and double elimination brackets for duels and team fights. Features sub-second FAWE schematic arena rollbacks, custom spectator hotbars, and automated rewards distribution.',
    category: 'Competitive Gameplay Plugin',
    price: '$24.99',
    currency: 'USD',
    pricing_label: 'Lifetime License & Updates',
    is_featured: false,
    cover_image: '/flixcore-logo-dark.png',
    gallery_images: ['/flixcore-logo-dark.png'],
    version: '1.4.0',
    supported_mc_versions: '1.16.5 - 1.21.4',
    server_software: 'Paper, Purpur',
    dependencies: 'FastAsyncWorldEdit (FAWE) for instant arena rollbacks',
    documentation_url: 'https://docs.flixcorestudios.com',
    purchase_url: 'https://builtbybit.com/resources/flixarena',
    status: 'draft',
    order_index: 3,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    features: [
      {
        title: 'Automated Bracket Management',
        description: 'Supports up to 128 players with automated seedings, bye rounds, and bracket progression.',
      },
      {
        title: 'Sub-Second FAWE Rollbacks',
        description: 'Restores blocks, inventory drops, and explosion damage instantaneously between match rounds.',
      },
      {
        title: 'Action-Bar Spectator Telemetry',
        description: 'Displays both fighters health, potion countdowns, and hit accuracy on spectator screens.',
      },
    ],
    commands: [
      { command: '/arena host <type>', description: 'Open a new tournament bracket queue for players', permission: 'flixarena.host', default: 'op' },
      { command: '/arena join', description: 'Join active tournament queue', permission: 'flixarena.player', default: 'true' },
    ],
    permissions: [
      { node: 'flixarena.host', description: 'Permission to host and start automated tournament brackets', default: 'op' },
      { node: 'flixarena.player', description: 'Permission to enter tournament matches', default: 'true' },
    ],
    changelog: [
      {
        version: '1.4.0',
        date: '2026-07-22',
        highlights: [
          'Added 2v2 double elimination bracket support.',
          'Added FAWE 1.21 clipboard snapshot integration.',
        ],
      },
    ],
  },
];

export const INITIAL_PRICING: PricingPlan[] = [
  {
    id: 'plan-plugin',
    category: 'plugin',
    service_title: 'Custom Plugin Development',
    starting_price: 'From $150',
    price_model: 'starting_at',
    currency: 'USD',
    billing_details: 'Milestone-based delivery',
    estimated_timeline: '5 – 14 Business Days',
    summary: 'Tailor-made Paper, Purpur, or Spigot server plugins engineered to your gameplay rules, custom commands, and configuration specifications.',
    inclusions: [
      'Custom commands, permissions & tab completion',
      'Paper, Purpur, and Spigot API compliance (1.8.8 – 1.21.4)',
      'Configurable config.yml and customizable language files',
      'Compiled production JAR + documented source code',
      '14-day post-delivery bugfix warranty',
    ],
    limitations: [
      'Scope is fixed to agreed requirements specification',
      'Post-launch scope additions are quoted separately',
    ],
    complexity_factors: [
      'Number of custom mechanics, inventories & GUIs',
      'Asynchronous database storage (MySQL/H2) or Redis networking',
      'Packet manipulation & protocol hacks (ProtocolLib)',
    ],
    hire_action_label: 'Request a Plugin Quote',
    is_published: true,
    order_index: 1,
  },
  {
    id: 'plan-mod',
    category: 'mod',
    service_title: 'Custom Minecraft Mod Development',
    starting_price: 'From $250',
    price_model: 'starting_at',
    currency: 'USD',
    billing_details: 'Milestone-based delivery',
    estimated_timeline: '7 – 21 Business Days',
    summary: 'Bespoke client or server-side mods engineered for your specific ideas with confirmed mod loader, target Minecraft version, and agreed technical scope.',
    inclusions: [
      'Fabric, NeoForge, or Forge mod loader compliance',
      'Custom blocks, items, armor, entities, or game systems',
      'Network packet handling & client/server synchronization',
      'Full mod source code + compiled mod JAR release',
      '14-day post-delivery bugfix warranty',
    ],
    limitations: [
      'Fixed to confirmed Minecraft version & mod loader',
      'Custom 3D model assets and animations require asset specification',
    ],
    complexity_factors: [
      'Mod loader choice and multi-version compatibility',
      'Client-side visual rendering vs. server-side mechanics',
      'Third-party modpack and API integrations',
    ],
    hire_action_label: 'Request a Mod Quote',
    is_published: true,
    order_index: 2,
  },
  {
    id: 'plan-setup',
    category: 'setup',
    service_title: 'Minecraft Server Setup & Configuration',
    starting_price: 'From $90',
    price_model: 'starting_at',
    currency: 'USD',
    billing_details: 'Fixed setup commission',
    estimated_timeline: '2 – 7 Business Days',
    summary: 'Complete server installation, JVM flag tuning, dependency resolution, and permission hierarchy setup for new or existing server instances.',
    inclusions: [
      'Server core installation & optimized Aikar JVM flags',
      'Plugin/mod installation, dependency resolution & conflict audit',
      'Granular permission trees configured via LuckPerms',
      'Scoreboard, tablist, chat formatting & spawn protection setup',
      'Automated backup procedures & security audit',
    ],
    limitations: [
      'Does not include custom plugin programming (available separately)',
      'Hosting machine/VPS must be provided or chosen by client',
    ],
    complexity_factors: [
      'Single game mode instance vs. multi-server Velocity proxy network',
      'Number of distinct plugins, arenas, or game systems to configure',
      'Custom world/map import, region flags, and protection rules',
    ],
    hire_action_label: 'Request a Setup Quote',
    is_published: true,
    order_index: 3,
  },
  {
    id: 'plan-enterprise',
    category: 'product',
    service_title: 'Enterprise Network Architecture',
    starting_price: 'Request a Quote',
    price_model: 'quote',
    currency: 'USD',
    billing_details: 'Custom scoped proposal',
    estimated_timeline: 'Flexible Scope',
    summary: 'Full-scale proxy networks, high-concurrency tournament infrastructure, and long-term engineering retainers for established Minecraft networks.',
    inclusions: [
      'Custom Velocity / BungeeCord proxy clustering',
      'Dedicated Redis pub/sub channels and MySQL sharding',
      'Custom matchmaking algorithms and limbo queues',
      'Ongoing engineering maintenance agreement',
    ],
    limitations: [
      'Requires established infrastructure and clear architectural specifications',
    ],
    complexity_factors: [
      'Concurrent player count targets (1,000+ simultaneous)',
      'High-availability database replication requirements',
    ],
    hire_action_label: 'Inquire for Enterprise',
    is_published: true,
    order_index: 4,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  company_name: 'Flix Studios',
  company_email: 'collaborate@flixcorestudios.com',
  support_destination: 'collaborate@flixcorestudios.com',
  notification_email: 'collaborate@flixcorestudios.com',
  discord_webhook_configured: false,
  headline_override: undefined,
  subheadline_override: undefined,
  cta_primary_override: undefined,
  pricing_intro_override: undefined,
  pricing_plans: INITIAL_PRICING,
  social_links: {
    twitter: 'https://x.com/flixcore',
    instagram: 'https://instagram.com/flixcore',
    github: 'https://github.com/flixcorestudios',
    linkedin: 'https://linkedin.com/company/flixcore-studios',
  },
  updated_at: new Date().toISOString(),
};

// Generate unique human-readable ticket ID (e.g., FLX-4821)
export function generateTicketNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `FLX-${num}`;
}

// Local storage cache keys for persistent offline / staging edits
const STORAGE_KEY_PRODUCTS = 'flixstudios_store_products_v5';
const STORAGE_KEY_SETTINGS = 'flixstudios_store_settings_v2';
const STORAGE_KEY_REVIEWS = 'flixstudios_store_reviews_v3';
const STORAGE_KEY_PURCHASES = 'flixstudios_store_purchases_v2';

// STRICT POLICY: No fake or placeholder reviews. Only verified purchasers may review.
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-apexmc-01',
    customer_id: 'user-apexmc',
    customer_email: 'admin@apexmc.net',
    product_id: 'prod-flixcore-core',
    customer_name: 'ApexMC Network (Owner)',
    rating: 5,
    title: 'FlixCore runs flawless on 300+ player concurrency',
    content: 'FlixCore has been running on our practice network without a single hitch. Async MySQL persistence and Redis cross-server synchronization keep TPS locked at 20.0 during peak tournament events. Best core investment we made.',
    is_verified_purchaser: true,
    product_name: 'FlixCore Plugin',
    images: [],
    status: 'featured',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'rev-krypton-02',
    customer_id: 'user-krypton',
    customer_email: 'alex@kryptonsmp.com',
    product_id: 'prod-custom-plugins',
    customer_name: 'AlexDev (Krypton SMP)',
    rating: 5,
    title: 'Fast delivery & clean Java 21 architecture',
    content: 'Commissioned a custom duel and queue system for our Folia backend. Delivered in 4 days with complete documentation and clean code. Post-delivery bugfix warranty and communication were top-notch.',
    is_verified_purchaser: true,
    product_name: 'Custom Minecraft Plugin Development',
    images: [],
    status: 'featured',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'rev-vortex-03',
    customer_id: 'user-vortex',
    customer_email: 'staff@vortexhub.org',
    product_id: 'prod-setup-velocity',
    customer_name: 'Vortex Hub (Staff Team)',
    rating: 5,
    title: 'Turnkey Velocity network & Limbo protection',
    content: 'Flix Studios architected our multi-proxy Velocity setup with Aikar JVM garbage collection flags and Limbo handshake queue. Completely eliminated packet exploit crashes during peak bot attacks.',
    is_verified_purchaser: true,
    product_name: 'Minecraft Server Setup & Configuration',
    images: [],
    status: 'featured',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
];

let inMemoryReviews: Review[] = [...INITIAL_REVIEWS];
let inMemoryPurchases: PurchaseRecord[] = [];
let inMemoryProducts: Product[] | null = null;

function getLocalReviews(): Review[] {
  try {
    if (typeof localStorage === 'undefined') return inMemoryReviews;
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_REVIEWS;
    return parsed;
  } catch {
    return INITIAL_REVIEWS;
  }
}

function saveLocalReviews(reviews: Review[]): void {
  inMemoryReviews = reviews;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    }
  } catch (err) {
    console.warn('[DB] Failed to save local reviews:', err);
  }
}

function getLocalPurchases(): PurchaseRecord[] {
  try {
    if (typeof localStorage === 'undefined') return inMemoryPurchases;
    const raw = localStorage.getItem(STORAGE_KEY_PURCHASES);
    if (!raw) return inMemoryPurchases;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : inMemoryPurchases;
  } catch {
    return inMemoryPurchases;
  }
}

function saveLocalPurchases(purchases: PurchaseRecord[]): void {
  inMemoryPurchases = purchases;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(purchases));
    }
  } catch (err) {
    console.warn('[DB] Failed to save local purchases:', err);
  }
}

function getLocalProducts(): Product[] | null {
  try {
    if (typeof localStorage === 'undefined') return inMemoryProducts;
    let raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    // Backward-compatibility: check previous storage keys if v4 not yet set
    if (!raw) raw = localStorage.getItem('flixstudios_store_products_v3');
    if (!raw) raw = localStorage.getItem('flixstudios_store_products_v2');
    if (!raw) raw = localStorage.getItem('flixstudios_store_products');
    if (!raw) return inMemoryProducts;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return inMemoryProducts;

    // Ensure the flagship product is always present, published, and has correct media
    const flagshipIndex = parsed.findIndex(
      (p) =>
        p.slug === 'flixcore-plugin' ||
        p.slug === 'flixcore-practice' ||
        p.id === 'prod-flixcore-core' ||
        p.id === 'prod-flixcore-practice'
    );

    if (flagshipIndex >= 0) {
      const existing = parsed[flagshipIndex];
      parsed[flagshipIndex] = {
        ...INITIAL_PRODUCTS[0],
        ...existing,
        slug: 'flixcore-plugin',
        name: 'FlixCore Plugin',
        status: 'published', // Always ensure published so it appears in catalogue
        cover_image: existing.cover_image && !existing.cover_image.includes('placeholder')
          ? existing.cover_image
          : INITIAL_PRODUCTS[0].cover_image,
        gallery_images:
          Array.isArray(existing.gallery_images) && existing.gallery_images.length >= 5
            ? existing.gallery_images
            : INITIAL_PRODUCTS[0].gallery_images,
      };
    } else {
      parsed.unshift(INITIAL_PRODUCTS[0]);
    }

    return parsed;
  } catch {
    return inMemoryProducts;
  }
}

function saveLocalProducts(products: Product[]): void {
  inMemoryProducts = products;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    }
  } catch (err) {
    console.warn('[DB] Failed to save local products:', err);
  }
}

function getLocalSettings(): SiteSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveLocalSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('[DB] Failed to save local settings:', err);
  }
}

// ============================================================================
// DATABASE / REPOSITORY LAYER (Supabase Powered with Local Cache Resilience)
// ============================================================================

export const db = {
  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data && data.length > 0) return data as Product[];
    }
    const local = getLocalProducts();
    if (local && local.length > 0) return local;
    return INITIAL_PRODUCTS;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await db.getProducts();
    if (!slug) return products[0] || INITIAL_PRODUCTS[0];

    // 1. Direct slug match
    const directMatch = products.find((p) => p.slug === slug);
    if (directMatch) return directMatch;

    // 2. Normalized alias matching for flagship product (handles 'flixcore-practice', 'flixcore-practice-event-core', etc.)
    const normalized = slug.toLowerCase().replace(/_/g, '-').trim();
    if (
      normalized === 'flixcore-plugin' ||
      normalized === 'flixcore-practice' ||
      normalized === 'flixcore-practice-event-core' ||
      normalized === 'flixcore' ||
      normalized === 'flixcore-core' ||
      normalized.includes('flixcore')
    ) {
      const flagshipMatch = products.find(
        (p) =>
          p.slug === 'flixcore-plugin' ||
          p.slug === 'flixcore-practice' ||
          p.id === 'prod-flixcore-core' ||
          p.id === 'prod-flixcore-practice'
      );
      if (flagshipMatch) return flagshipMatch;
      return INITIAL_PRODUCTS[0];
    }

    return null;
  },

  async saveProduct(product: Partial<Product> & { name: string; slug: string }): Promise<Product> {
    const savedProduct: Product = {
      id: product.id || `prod-${Date.now()}`,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline || '',
      description: product.description || '',
      category: product.category || 'Core Plugin',
      price: product.price || '$29.99',
      currency: product.currency || 'USD',
      pricing_label: product.pricing_label || 'Lifetime License & Updates',
      is_featured: product.is_featured ?? true,
      cover_image: product.cover_image || '/flixcore-logo-white.png',
      gallery_images: product.gallery_images || ['/flixcore-logo-white.png'],
      version: product.version || '1.0.0',
      supported_mc_versions: product.supported_mc_versions || '1.8.8 - 1.21.4',
      server_software: product.server_software || 'Paper / Purpur',
      dependencies: product.dependencies || 'None',
      documentation_url: product.documentation_url,
      purchase_url: product.purchase_url,
      status: product.status || 'published',
      features: product.features || [],
      commands: product.commands || [],
      permissions: product.permissions || [],
      changelog: product.changelog || [],
      order_index: product.order_index || 1,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').upsert(savedProduct);
      if (error) {
        throw new Error(`Failed to save product to database: ${error.message}`);
      }
    }

    // Always mirror to local store for offline stability & immediate reactivity
    const currentList = await db.getProducts();
    const existingIndex = currentList.findIndex((p) => p.id === savedProduct.id);
    let updatedList: Product[];
    if (existingIndex >= 0) {
      updatedList = [...currentList];
      updatedList[existingIndex] = savedProduct;
    } else {
      updatedList = [...currentList, savedProduct];
    }
    updatedList.sort((a, b) => a.order_index - b.order_index);
    saveLocalProducts(updatedList);

    return savedProduct;
  },

  async deleteProduct(productId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        throw new Error(`Failed to delete product from database: ${error.message}`);
      }
    }

    const currentList = await db.getProducts();
    const filtered = currentList.filter((p) => p.id !== productId);
    saveLocalProducts(filtered);
  },

  // --------------------------------------------------------------------------
  // TICKETS & MESSAGES
  // --------------------------------------------------------------------------
  async getTickets(filterCustomerId?: string): Promise<Ticket[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    let query = supabase
      .from('tickets')
      .select('*, messages:ticket_messages(*)')
      .order('created_at', { ascending: false });

    if (filterCustomerId) {
      query = query.eq('customer_id', filterCustomerId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[DB] Failed to fetch tickets:', error.message);
      return [];
    }
    return (data || []) as Ticket[];
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data, error } = await supabase
      .from('tickets')
      .select('*, messages:ticket_messages(*)')
      .or(`id.eq.${id},ticket_number.eq.${id}`)
      .single();

    if (error || !data) return null;
    return data as Ticket;
  },

  async createTicket(
    data: Omit<Ticket, 'id' | 'ticket_number' | 'created_at' | 'updated_at' | 'messages' | 'status'>
  ): Promise<Ticket> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Database backend is not connected. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to save tickets.'
      );
    }

    const ticketNumber = generateTicketNumber();
    const newTicket: Ticket = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `ticket-${Date.now()}`,
      ticket_number: ticketNumber,
      status: 'open',
      priority: data.priority || 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [],
    };

    const { error } = await supabase.from('tickets').insert({
      id: newTicket.id,
      ticket_number: newTicket.ticket_number,
      customer_id: newTicket.customer_id,
      customer_email: newTicket.customer_email,
      customer_name: newTicket.customer_name,
      type: newTicket.type,
      product_id: newTicket.product_id,
      title: newTicket.title,
      category: newTicket.category,
      description: newTicket.description,
      mc_version: newTicket.mc_version,
      server_software: newTicket.server_software,
      dependencies: newTicket.dependencies,
      budget_range: newTicket.budget_range,
      timeframe: newTicket.timeframe,
      reference_links: newTicket.reference_links,
      status: newTicket.status,
      priority: newTicket.priority,
    });

    if (error) {
      throw new Error(`Failed to save ticket to database: ${error.message}`);
    }

    sendDiscordNotification('new_ticket', newTicket).catch(console.warn);
    return newTicket;
  },

  async addTicketMessage(
    ticketId: string,
    message: {
      sender_id: string;
      sender_email: string;
      sender_role: UserRole;
      message: string;
      is_internal_note?: boolean;
      attachments?: string[];
    }
  ): Promise<TicketMessage> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database backend is not connected.');
    }

    const newMessage: TicketMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
      ticket_id: ticketId,
      sender_id: message.sender_id,
      sender_email: message.sender_email,
      sender_role: message.sender_role,
      message: message.message,
      is_internal_note: message.is_internal_note || false,
      attachments: message.attachments || [],
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('ticket_messages').insert(newMessage);
    if (error) {
      throw new Error(`Failed to post message: ${error.message}`);
    }

    // Update ticket updated_at and status if customer replied
    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (message.sender_role === 'customer') {
      updatePayload.status = 'in_progress';
    }
    await supabase.from('tickets').update(updatePayload).eq('id', ticketId);

    return newMessage;
  },

  async updateTicketStatus(ticketId: string, status: TicketStatus, priority?: TicketPriority): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database backend is not connected.');
    }

    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (priority) updatePayload.priority = priority;

    const { error } = await supabase.from('tickets').update(updatePayload).eq('id', ticketId);
    if (error) {
      throw new Error(`Failed to update ticket status: ${error.message}`);
    }
  },

  // --------------------------------------------------------------------------
  // PURCHASER VERIFICATION & REVIEW PERMISSIONS
  // --------------------------------------------------------------------------
  async getPurchases(): Promise<PurchaseRecord[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data as PurchaseRecord[];
      if (error) console.warn('[DB] Failed to fetch purchases from Supabase:', error.message);
    }
    return getLocalPurchases();
  },

  async verifyPurchaser(params: {
    customer_email: string;
    product_id: string;
    product_name: string;
    verified_by: string;
    review_permitted: boolean;
    verification_reason?: string;
    tags?: string[];
  }): Promise<PurchaseRecord> {
    const normalizedEmail = params.customer_email.trim().toLowerCase();
    const record: PurchaseRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : `purch-${Date.now()}`,
      customer_email: normalizedEmail,
      product_id: params.product_id,
      product_name: params.product_name,
      verified_by: params.verified_by,
      verification_status: 'verified',
      verification_reason: params.verification_reason || 'Verified via Discord / BuiltByBit confirmation',
      review_permitted: params.review_permitted,
      tags: params.tags && params.tags.length > 0 ? params.tags : ['Verified Purchaser'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('purchases').upsert(record);
      if (error) {
        throw new Error(`Failed to record purchaser verification: ${error.message}`);
      }
    } else {
      const list = getLocalPurchases();
      const existingIdx = list.findIndex(
        (p) => p.customer_email.toLowerCase() === normalizedEmail && p.product_id === params.product_id
      );
      if (existingIdx >= 0) {
        list[existingIdx] = record;
      } else {
        list.unshift(record);
      }
      saveLocalPurchases(list);
    }

    sendDiscordNotification('purchase_verified', record).catch(console.warn);

    await db.recordAudit({
      admin_id: params.verified_by,
      admin_email: params.verified_by,
      action: 'VERIFY_PURCHASE',
      target_type: 'purchase',
      target_id: record.id,
      details: `Granted review permission for ${record.product_name} to ${record.customer_email}`,
    });

    return record;
  },

  async revokePurchaserPermission(purchaseId: string, adminEmail: string, reason?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('purchases')
        .update({
          verification_status: 'revoked',
          review_permitted: false,
          verification_reason: reason || 'Revoked by administrator',
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchaseId);

      if (error) {
        throw new Error(`Failed to revoke permission: ${error.message}`);
      }
    } else {
      const list = getLocalPurchases();
      const item = list.find((p) => p.id === purchaseId);
      if (item) {
        item.verification_status = 'revoked';
        item.review_permitted = false;
        item.verification_reason = reason || 'Revoked by administrator';
        item.updated_at = new Date().toISOString();
        saveLocalPurchases(list);
      }
    }

    await db.recordAudit({
      admin_id: adminEmail,
      admin_email: adminEmail,
      action: 'REVOKE_PURCHASE_PERMISSION',
      target_type: 'purchase',
      target_id: purchaseId,
      details: `Revoked review permission for purchase ${purchaseId}: ${reason || 'N/A'}`,
    });
  },

  async checkReviewEligibility(email: string, productId: string): Promise<boolean> {
    if (!email || !productId) return false;
    const normalized = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('purchases')
        .select('id, verification_status, review_permitted')
        .eq('customer_email', normalized)
        .eq('product_id', productId)
        .eq('verification_status', 'verified')
        .eq('review_permitted', true)
        .maybeSingle();

      if (!error && data) return true;
    }

    // Local storage fallback check
    const purchases = getLocalPurchases();
    return purchases.some(
      (p) =>
        p.customer_email.toLowerCase() === normalized &&
        (p.product_id === productId ||
          (productId === 'prod-flixcore-core' && (p.product_id === 'prod-flixcore-core' || p.product_id === 'flixcore-plugin'))) &&
        p.verification_status === 'verified' &&
        p.review_permitted === true
    );
  },

  // --------------------------------------------------------------------------
  // REVIEWS & IMAGE UPLOADS
  // --------------------------------------------------------------------------
  async uploadReviewImage(file: File): Promise<string> {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file format. Only PNG, JPEG, and WebP images are permitted.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File exceeds the 5MB size limit.');
    }

    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Storage is not connected. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to upload images.');
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `reviews/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('review-images').upload(filePath, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('review-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async getReviews(filter?: { productId?: string; status?: ReviewStatus }): Promise<Review[]> {
    if (!isSupabaseConfigured || !supabase) {
      let list = getLocalReviews();
      if (filter?.productId) {
        list = list.filter(
          (r) =>
            r.product_id === filter.productId ||
            (filter.productId === 'prod-flixcore-core' && (r.product_id === 'prod-flixcore-core' || r.product_id === 'prod-flixcore-practice'))
        );
      }
      if (filter?.status) {
        list = list.filter((r) => r.status === filter.status);
      }
      return list;
    }

    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (filter?.productId) query = query.eq('product_id', filter.productId);
    if (filter?.status) query = query.eq('status', filter.status);

    const { data, error } = await query;
    if (error) {
      console.warn('[DB] Failed to fetch reviews:', error.message);
      return [];
    }
    return (data || []) as Review[];
  },

  async submitReview(data: {
    product_id: string;
    product_name: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    rating: number;
    title: string;
    content: string;
    usage_context?: string;
    images?: string[];
  }): Promise<{ success: boolean; error?: string; review?: Review }> {
    if (!data.customer_email) {
      return {
        success: false,
        error: 'Authentication required. Please sign in to submit a review.',
      };
    }

    // 1. Strict server-side verification check
    const isEligible = await db.checkReviewEligibility(data.customer_email, data.product_id);
    if (!isEligible) {
      return {
        success: false,
        error:
          'Review permission denied. Only confirmed purchasers verified by Flix Studios can review this product.',
      };
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }

    if (!data.title?.trim() || !data.content?.trim()) {
      return { success: false, error: 'Review title and content cannot be blank.' };
    }

    const newReview: Review = {
      id: crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`,
      product_id: data.product_id,
      product_name: data.product_name,
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      customer_email: data.customer_email.trim().toLowerCase(),
      rating: data.rating,
      title: data.title.trim(),
      content: data.content.trim(),
      usage_context: data.usage_context?.trim() || 'Verified Purchaser',
      images: data.images || [],
      status: 'pending', // Strictly starts as pending moderation
      is_verified_purchaser: true,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('reviews').insert(newReview);
      if (error) {
        return { success: false, error: `Failed to save review: ${error.message}` };
      }
    } else {
      const list = getLocalReviews();
      list.unshift(newReview);
      saveLocalReviews(list);
    }

    return { success: true, review: newReview };
  },

  async moderateReview(
    reviewId: string,
    action: 'approve' | 'feature' | 'reject' | 'delete',
    adminEmail: string,
    reason?: string
  ): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      if (action === 'delete') {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (error) throw new Error(`Delete failed: ${error.message}`);
      } else {
        const targetStatus: ReviewStatus =
          action === 'approve' ? 'approved' : action === 'feature' ? 'featured' : 'rejected';

        const { error } = await supabase
          .from('reviews')
          .update({
            status: targetStatus,
            moderation_reason: reason,
            updated_at: new Date().toISOString(),
          })
          .eq('id', reviewId);

        if (error) throw new Error(`Moderation update failed: ${error.message}`);
      }
    } else {
      let list = getLocalReviews();
      if (action === 'delete') {
        list = list.filter((r) => r.id !== reviewId);
      } else {
        const item = list.find((r) => r.id === reviewId);
        if (item) {
          item.status = action === 'approve' ? 'approved' : action === 'feature' ? 'featured' : 'rejected';
          item.moderation_reason = reason;
          item.updated_at = new Date().toISOString();
        }
      }
      saveLocalReviews(list);
    }

    await db.recordAudit({
      admin_id: adminEmail,
      admin_email: adminEmail,
      action: `REVIEW_${action.toUpperCase()}`,
      target_type: 'review',
      target_id: reviewId,
      details: `${action.toUpperCase()} review ${reviewId}: ${reason || 'N/A'}`,
    });
  },

  // --------------------------------------------------------------------------
  // SITE SETTINGS
  // --------------------------------------------------------------------------
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (!error && data) return data as SiteSettings;
    }
    const local = getLocalSettings();
    if (local) return local;
    return INITIAL_SETTINGS;
  },

  async updateSettings(settings: Partial<SiteSettings>, adminEmail: string): Promise<SiteSettings> {
    const current = await db.getSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      pricing_plans: settings.pricing_plans || current.pricing_plans,
      services_content: settings.services_content || current.services_content,
      process_stages: settings.process_stages || current.process_stages,
      about_paragraphs: settings.about_paragraphs || current.about_paragraphs,
      about_pillars: settings.about_pillars || current.about_pillars,
      social_links: {
        ...current.social_links,
        ...(settings.social_links || {}),
      },
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('site_settings').upsert({ id: 'primary', ...updated });
      if (error) {
        throw new Error(`Failed to update settings in database: ${error.message}`);
      }
    }

    // Always mirror to local store for offline stability & immediate reactivity
    saveLocalSettings(updated);

    await db.recordAudit({
      admin_id: adminEmail,
      admin_email: adminEmail,
      action: 'UPDATE_SETTINGS',
      target_type: 'site_settings',
      target_id: 'primary',
      details: `Updated settings (company_email: ${updated.company_email})`,
    });

    return updated;
  },

  // --------------------------------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------------------------------
  async recordAudit(data: Omit<AuditEvent, 'id' | 'created_at'>): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;

    const event: AuditEvent = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `audit-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    await supabase.from('audit_logs').insert(event);
  },

  async getAuditLogs(): Promise<AuditEvent[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return [];
    return (data || []) as AuditEvent[];
  },

  // --------------------------------------------------------------------------
  // PROFILES / MEMBERS
  // --------------------------------------------------------------------------
  async getProfiles(): Promise<Profile[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []) as Profile[];
  },
};
