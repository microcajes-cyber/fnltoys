---
title: Playroom Explorer redesign
status: draft
ai_access: public
ai_generated: true
review_status: draft
---

# Playroom Explorer redesign

This change brings the supplied Draft 04 design into the existing Next.js App Router site. The homepage and six product collections are rendered as real pages, with the product pages statically generated at build time.

## Routes and catalog

- `/products/party-fence` — 31 recorded variations
- `/products/hippo-fence` — 61
- `/products/octopus-fence` — 62
- `/products/ocean-balls` — 36
- `/products/carrot-bookshelf` — 2
- `/products/storage-rack` — 14

The 206-row snapshot is dated 5 November 2026. It is a record of combinations, not a live stock or price feed. Dependent selectors preserve upstream choices and always resolve to an existing row. Selecting a variation updates `?variant=...`; reload and browser Back restore it. Canonical URLs omit the query.

## Media and shopping

Recovered still images are optimized WebP assets. Exact-variation photography is not available for every option. Hippo imagery is an assembly reference; Octopus and Ocean Balls use labeled illustrations. The rack MP4 is a concept animation, not an assembly demonstration. The other five video areas remain labeled placeholders.

The store chooser displays the selected option and opens the official Shopee, TikTok, or Lazada shop/profile. Options are not transferred automatically; availability and order details must be confirmed there.

The welcome animation runs once per tab, with Skip, Escape, Replay, reduced-motion handling, and focus restoration. Motion can be turned off. Mobile pages include a persistent store chooser.

## Existing site integration

- Preserves favicon/app icons and the existing Rocket analytics scripts.
- Uses `https://www.fnltoys.ph` explicitly for canonical URLs, robots, and sitemap, avoiding the previous builder-domain environment fallback.
- Replaces the homepage's simulated wholesale submission with a clear official-store contact path. The old component remains in source for future backend integration.
- Removes placeholder policy links from the rendered footer. Approved legal copy and a verified inquiry backend remain future work.
- Does not include the independent 11.11 sale-banner change in PR #2. The homepage/layout/SEO changes overlap; reconcile them if both PRs are merged.
- Includes a dependency lockfile; patches Next.js and PostCSS without a major framework migration. Build-time TypeScript errors are enforced.

## Validation

Requires Node.js 22.6+ for the built-in TypeScript test runner (verified with Node 24). Run `npm ci`, `npm test`, `npm run lint`, `npm run type-check`, and `npm run build`. Run `npm start -- --port 4028` to serve the production build.

15 catalog tests cover every selectable transition, reachability, snapshot totals, unavailable mat combinations, and invalid input. Local Chromium/Edge flow checks cover all product routes, dialogs, Back, invalid deep links, filters, zoom, video playback, mobile 390/320 px, reduced motion, robots, sitemap, and 404 handling. The browser checks block external Rocket telemetry; third-party analytics delivery and marketplace checkout are outside those checks.

Remaining catalog uncertainties and missing media are presented on the site. Six moderate development-tool audit findings remain in the TypeScript ESLint/minimatch dependency chain; the checked dependency tree has no high or critical audit findings.
