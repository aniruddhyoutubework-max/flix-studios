export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export type ProductStatus = 'published' | 'draft' | 'archived';

export interface ProductFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductChangelog {
  version: string;
  date: string;
  highlights: string[];
}

export interface ProductCommand {
  command: string;
  description: string;
  permission?: string;
  default?: string;
}

export interface ProductPermission {
  node: string;
  description: string;
  default?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  long_description?: string;
  category: string;
  price?: string;
  currency?: string;
  pricing_label?: string;
  purchase_button_label?: string;
  is_featured?: boolean;
  cover_image: string;
  gallery_images: string[];
  gallery_metadata?: Record<string, { title: string; caption: string; category?: string }>;
  version: string;
  supported_mc_versions: string;
  server_software: string;
  dependencies: string;
  documentation_url?: string;
  support_url?: string;
  purchase_url?: string;
  status: ProductStatus;
  features: ProductFeature[];
  commands?: ProductCommand[];
  permissions?: ProductPermission[];
  changelog: ProductChangelog[];
  order_index: number;

  // Customizable Page Sections
  overview_title?: string;
  overview_description?: string;
  features_title?: string;
  features_description?: string;
  gallery_title?: string;
  gallery_description?: string;
  compatibility_title?: string;
  compatibility_description?: string;
  reviews_title?: string;
  reviews_description?: string;
  reviews_empty_message?: string;
  purchase_title?: string;
  purchase_description?: string;
  support_title?: string;
  support_description?: string;

  // Media & Presentation Toggles
  show_hero_motion?: boolean;
  show_features_motion?: boolean;
  show_compatibility_motion?: boolean;
  show_purchase_motion?: boolean;

  created_at: string;
  updated_at?: string;
}

export type TicketType = 'custom_dev' | 'product_support';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_email: string;
  sender_role: UserRole;
  message: string;
  is_internal_note: boolean;
  attachments?: string[];
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string; // e.g. "FLX-8492"
  customer_id: string;
  customer_email: string;
  customer_name: string;
  type: TicketType;
  product_id?: string;
  title: string;
  category: string;
  description: string;
  mc_version?: string;
  server_software?: string;
  dependencies?: string;
  budget_range?: string;
  timeframe?: string;
  reference_links?: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

export type VerificationStatus = 'verified' | 'unverified' | 'revoked';

export interface PurchaseRecord {
  id: string;
  customer_email: string;
  customer_id?: string;
  product_id: string;
  product_name: string;
  verified_by: string;
  verification_status: VerificationStatus;
  verification_reason?: string;
  review_permitted: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'featured';

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  usage_context?: string;
  images: string[];
  status: ReviewStatus;
  moderation_reason?: string;
  is_verified_purchaser: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PricingPlan {
  id: string;
  category: 'plugin' | 'mod' | 'setup' | 'product';
  service_title: string;
  starting_price: string;
  price_model: 'starting_at' | 'fixed' | 'range' | 'quote';
  currency?: string;
  billing_details?: string;
  estimated_timeline: string;
  summary: string;
  inclusions: string[];
  limitations: string[];
  complexity_factors: string[];
  hire_action_label?: string;
  is_published?: boolean;
  order_index?: number;
}

export interface ServiceContentItem {
  id: string;
  categoryParam: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  scopeNote: string;
}

export interface ProcessStageItem {
  num: string;
  title: string;
  summary: string;
  desc: string;
  checklist: string[];
}

export interface AboutPillarItem {
  title: string;
  desc: string;
}

export interface SiteSettings {
  company_name: string;
  company_email: string;
  support_destination: string;
  notification_email: string;
  discord_webhook_configured: boolean;
  headline_override?: string;
  subheadline_override?: string;
  cta_primary_override?: string;
  pricing_intro_override?: string;
  pricing_plans?: PricingPlan[];
  services_content?: ServiceContentItem[];
  process_stages?: ProcessStageItem[];
  about_paragraphs?: string[];
  about_pillars?: AboutPillarItem[];
  social_links: {
    twitter: string;
    instagram: string;
    github: string;
    linkedin: string;
  };
  updated_at: string;
}

export interface AuditEvent {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  created_at: string;
}
