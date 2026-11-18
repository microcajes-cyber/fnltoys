/**
 * Catalog contract v1.
 *
 * The admin app exports this shape. The website validates it at build time
 * and renders nothing from it unless a row is published and verified.
 * Prices are PHP centavos. Null means unknown — never a guessed number.
 * Stock, ratings, and testimonials are intentionally absent.
 */

export const CATALOG_CONTRACT_VERSION = 1 as const;

export type CatalogWorkflow = 'draft' | 'review' | 'approved' | 'published';
export type CatalogLifecycle = 'draft' | 'active' | 'archived';
export type VerificationStatus = 'verified' | 'needs_review' | 'conflict' | 'unverified';
export type ChannelId = 'shopee' | 'lazada';
export type GalleryKind = 'image' | 'video';

export interface Verification {
  status: VerificationStatus;
  /** Original admin label, kept so a reviewer can see NEEDS REVIEW or CONFLICT. */
  sourceLabel: string;
}

export interface PhpPrice {
  currency: 'PHP';
  /** Centavos. ₱1.00 is 100. Null means the price was not recorded. */
  amountMinor: number | null;
  /** Centavos. Null when there is no comparison price. */
  comparisonMinor: number | null;
}

export interface ChannelLink {
  channel: ChannelId;
  /**
   * Option id this listing buys. An empty string is the product-level
   * fallback (the admin stores that as variation_id '').
   */
  optionId: string;
  url: string;
  listingId: string | null;
  verification: 'pending' | 'verified';
}

export interface GalleryItem {
  /** Zero-based order. A video may occupy position 0. */
  position: number;
  kind: GalleryKind;
  /** Public URL. Null until the admin publishes a real file URL. */
  url: string | null;
  assetId: string | null;
  mime: string | null;
  alt: string;
  label: string | null;
}

export interface ProductVideo {
  url: string | null;
  assetId: string | null;
  mime: string | null;
  posterAssetId: string | null;
  caption: string | null;
}

export interface CatalogOption {
  id: string;
  /** Null when the admin has no SKU. The stable id is not a SKU. */
  sku: string | null;
  name: string;
  position: number;
  active: boolean;
  attributes: {
    color: string;
    option: string;
    panel: string;
    match: string;
  };
  verification: Verification;
  price: PhpPrice;
  channels: ChannelLink[];
}

export interface CatalogCopy {
  eyebrow: string;
  headline: string;
  intro: string;
  description: string;
  guideTitle: string;
  guideBody: string;
  accent: string;
  details: { label: string; value: string }[];
  questions: { q: string; a: string }[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  publication: {
    workflow: CatalogWorkflow;
    lifecycle: CatalogLifecycle;
    visible: boolean;
  };
  verification: Verification;
  copy: CatalogCopy;
  media: {
    gallery: GalleryItem[];
    /** How-to / assembly clip. Null when the admin has not recorded one. */
    installationVideoUrl: string | null;
    /** Separate product clip, such as a concept animation. Not an assembly guide. */
    productVideo: ProductVideo | null;
  };
  options: CatalogOption[];
  channels: ChannelLink[];
}

export interface CatalogSource {
  system: string;
  release: string;
  snapshotDate: string | null;
  sourceUrl: string | null;
  sourceRecordCount: number | null;
  familyCount: number;
  optionCount: number;
  converter: string;
  note: string;
}

export interface CatalogFile {
  contractVersion: typeof CATALOG_CONTRACT_VERSION;
  exportedAt: string;
  source: CatalogSource;
  products: CatalogProduct[];
}

/** Records the loader may hand to a page. Unverified and conflict rows are already removed. */
export interface PublishedCatalog {
  contractVersion: typeof CATALOG_CONTRACT_VERSION;
  products: CatalogProduct[];
}
