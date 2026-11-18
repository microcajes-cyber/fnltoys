#!/usr/bin/env node
/**
 * Converts FNL TOYS Backend v5 `src/catalog.json` into catalog contract v1.
 *
 * This is the legacy-snapshot converter. The admin worker still needs its own
 * export (see docs/catalog-bridge.md) once a product has been approved there.
 *
 * Usage:
 *   node scripts/convert-admin-catalog.mjs <catalog.json> [out.json]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KNOWN_ASSETS = {
  party: 'image/png',
  bookshelf: 'image/jpeg',
  bookshelfRoom: 'image/jpeg',
  rack: 'image/png',
  hippoManual: 'image/png',
  rackVideoPoster: 'image/png',
  rackVideo: 'video/mp4',
};

/**
 * server.js seeds storage-rack.videoAsset = 'rackVideo'. catalog.json does not
 * carry that key; the family details call it a concept animation, not a guide.
 */
const SEEDED_PRODUCT_VIDEOS = {
  'storage-rack': {
    url: null,
    assetId: 'rackVideo',
    mime: 'video/mp4',
    posterAssetId: 'rackVideoPoster',
    caption: 'A 3D concept animation, not an assembly guide',
  },
};

const EXPORTED_AT = '2026-11-18T00:00:00.000Z';

function verificationFromLabel(label) {
  if (label === 'NEEDS REVIEW') return { status: 'needs_review', sourceLabel: label };
  if (label === 'CONFLICT') return { status: 'conflict', sourceLabel: label };
  if (label === 'verified') return { status: 'verified', sourceLabel: label };
  if (label === 'Needs Verification' || label == null || label === '') {
    return { status: 'unverified', sourceLabel: 'Needs Verification' };
  }
  return { status: 'unverified', sourceLabel: String(label) };
}

function rollup(options) {
  if (options.some((option) => option.verification.status === 'conflict')) {
    return { status: 'conflict', sourceLabel: 'CONFLICT' };
  }
  if (options.some((option) => option.verification.status === 'needs_review')) {
    return { status: 'needs_review', sourceLabel: 'NEEDS REVIEW' };
  }
  if (options.every((option) => option.verification.status === 'verified')) {
    return { status: 'verified', sourceLabel: 'verified' };
  }
  return { status: 'unverified', sourceLabel: 'Needs Verification' };
}

function galleryItem(assetId, position, label, productName) {
  const mime = KNOWN_ASSETS[assetId] ?? null;
  const kind = mime?.startsWith('video/') ? 'video' : 'image';
  const caption = label || assetId;
  return {
    position,
    kind,
    url: null,
    assetId,
    mime,
    alt: `${productName} — ${caption}`,
    label: label || null,
  };
}

function galleryFor(family) {
  const keys = Array.isArray(family.galleryKeys) ? family.galleryKeys : [];
  const labels = Array.isArray(family.galleryLabels) ? family.galleryLabels : [];
  const items = keys
    .filter((key) => typeof key === 'string' && key.length > 0)
    .map((key, index) => galleryItem(key, index, labels[index] || null, family.name));
  if (family.mediaKey && !keys.includes(family.mediaKey)) {
    items.push(
      galleryItem(family.mediaKey, items.length, family.mediaKind || null, family.name)
    );
  }
  return items;
}

function optionName(variant) {
  const parts = [variant.color, variant.panel, variant.option].filter((part) => Boolean(part));
  return parts.join(' · ') || variant.id;
}

export function convertAdminCatalog(source) {
  const families = source?.catalog?.families ?? source?.families;
  if (!Array.isArray(families)) {
    throw new Error('Expected catalog.json with a families array');
  }
  const products = families.map((family) => {
    const options = (family.variants ?? []).map((variant, position) => ({
      id: variant.id,
      sku: null,
      name: optionName(variant),
      position,
      active: true,
      attributes: {
        color: variant.color ?? '',
        option: variant.option ?? '',
        panel: variant.panel ?? '',
        match: variant.match ?? '',
      },
      verification: verificationFromLabel(variant.status),
      price: { currency: 'PHP', amountMinor: null, comparisonMinor: null },
      channels: [],
    }));
    return {
      id: family.slug,
      name: family.name,
      publication: { workflow: 'draft', lifecycle: 'active', visible: true },
      verification: rollup(options),
      copy: {
        eyebrow: family.eyebrow ?? '',
        headline: family.headline ?? '',
        intro: family.intro ?? '',
        description: family.description ?? '',
        guideTitle: family.guideTitle ?? '',
        guideBody: family.guideBody ?? '',
        accent: family.accent ?? '#175CFF',
        details: family.details ?? [],
        questions: family.questions ?? [],
      },
      media: {
        gallery: galleryFor(family),
        installationVideoUrl: null,
        productVideo: SEEDED_PRODUCT_VIDEOS[family.slug] ?? null,
      },
      options,
      channels: [],
    };
  });
  const optionCount = products.reduce((sum, product) => sum + product.options.length, 0);
  return {
    contractVersion: 1,
    exportedAt: EXPORTED_AT,
    source: {
      system: 'fnl-toys-backend-v5',
      release: 'rc4',
      snapshotDate: source.snapshotDate ?? null,
      // The admin snapshot links a Google Sheet. Leave that URL out of this public repo.
      sourceUrl: null,
      sourceRecordCount: source.sourceRecordCount ?? null,
      familyCount: products.length,
      optionCount,
      converter: 'scripts/convert-admin-catalog.mjs',
      note: 'Converted from FNL TOYS Backend v5 rc4 src/catalog.json. Every option is still NEEDS REVIEW or CONFLICT. Prices, SKUs, stock, ratings, and Shopee/Lazada links were not in that snapshot and are left empty. publication.workflow is draft because this snapshot is not an approved revision for www.fnltoys.ph. The site renders a product only when workflow is published, the product is active and visible, and verification is verified.',
    },
    products,
  };
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node scripts/convert-admin-catalog.mjs <catalog.json> [out.json]');
    process.exit(1);
  }
  const output = process.argv[3] ?? path.join('src/data/catalog/published-catalog.json');
  const catalog = convertAdminCatalog(JSON.parse(readFileSync(input, 'utf8')));
  writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`);
  const published = catalog.products.filter(
    (product) =>
      product.publication.workflow === 'published' && product.verification.status === 'verified'
  ).length;
  console.info(
    `wrote ${catalog.products.length} products / ${catalog.source.optionCount} options; published+verified ${published}`
  );
}
