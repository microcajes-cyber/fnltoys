# Catalog bridge

The admin app (FNL TOYS Backend v5) is the source of product data for www.fnltoys.ph. This site does not read the admin database. It reads one committed file:

`src/data/catalog/published-catalog.json`

That file is catalog contract **v1**. Faith reviews every change to it in a pull request before it can reach the live site.

The product page that will render these records is a later step. This bridge only loads and filters the file.

## What the site will show

A product is public only when all of these are true:

- `publication.workflow` is `published`
- `publication.lifecycle` is `active`
- `publication.visible` is `true`
- `verification.status` is `verified`
- at least one option is active and `verified`

Anything else stays in the file for review and is not rendered. That includes:

- `draft`, `review`, and `approved` workflow
- `needs_review` (the admin label **NEEDS REVIEW**)
- `unverified` (the admin label **Needs Verification**)
- `conflict` (the admin label **CONFLICT**), on the product or on an option

Pending Shopee or Lazada links are removed even when the product itself is public. A verified link is kept.

Prices are PHP centavos (`amountMinor`: ₱249.00 is `24900`). `null` means the price was not recorded. The site must not replace null with a number. The contract has no stock, rating, or testimonial fields; a file that adds them is rejected.

Gallery items are ordered. Item 0 may be a video. `installationVideoUrl` is a separate optional HTTPS link for an assembly clip. A concept animation is `media.productVideo`, not an installation video.

## Current export

The committed file was converted from the admin snapshot `src/catalog.json` (5 November 2026, release candidate 4). The snapshot's spreadsheet link is not copied into this public repository.

|                                          | Count |
| ---------------------------------------- | ----- |
| Spreadsheet rows in the snapshot         | 367   |
| Collections                              | 6     |
| Options                                  | 206   |
| NEEDS REVIEW options                     | 102   |
| CONFLICT options                         | 104   |
| Recorded prices, SKUs, and channel links | none  |
| Products the site may render             | 0     |

The homepage still uses its existing featured-product copy. No new public products are added.

Regenerate that snapshot conversion with:

```bash
node scripts/convert-admin-catalog.mjs path/to/catalog.json src/data/catalog/published-catalog.json
```

Check the result with:

```bash
npm test
npm run catalog:check
```

`npm run build` also validates the file, because the homepage loads it while the page is generated.

## How Faith publishes a catalog change

1. The admin export (below) writes a contract v1 file. Until that export exists, use the converter only for the legacy snapshot.
2. Replace `src/data/catalog/published-catalog.json` and open a pull request.
3. Read the diff. Unverified and conflict rows may be in the file, but they stay off the site.
4. Merge only after the preview looks right. The product page is not part of this bridge, so a preview of `/` stays the current homepage until a later change starts rendering public rows.

## What the admin app needs to add

Do this in the admin repo, not in this website. The admin package is not part of this pull request.

Add either of these, both returning the same JSON:

- `GET /api/admin/catalog/site-export` for a publisher or owner
- `node scripts/export-site-catalog.mjs`, writing the contract file from D1

Build each product from `readProduct` in `src/products-server.js`:

| Admin                                   | Contract                                                            |
| --------------------------------------- | ------------------------------------------------------------------- |
| `id`, `name`                            | `id`, `name`                                                        |
| `workflow`                              | `publication.workflow` (`draft`, `review`, `approved`, `published`) |
| `status`                                | `publication.lifecycle` (`draft`, `active`, `archived`)             |
| `visible`                               | `publication.visible`                                               |
| `verificationStatus`                    | `verification.status` using the map below                           |
| `info` copy, details, questions         | `copy`                                                              |
| variations in `position` order          | `options`                                                           |
| blank `sku`                             | `sku: null` (do not copy the variation id into the SKU)             |
| `price.amountMinor` / `comparisonMinor` | same integers, currency `PHP`; leave nulls null                     |
| `links`                                 | `channels`                                                          |
| gallery keys, in order                  | `media.gallery`                                                     |
| a saved installation URL                | `media.installationVideoUrl`                                        |
| `videoAsset` such as `rackVideo`        | `media.productVideo`                                                |

Verification map:

| Admin label                   | `verification.status` |
| ----------------------------- | --------------------- |
| `verified`                    | `verified`            |
| `NEEDS REVIEW`                | `needs_review`        |
| `CONFLICT`                    | `conflict`            |
| `Needs Verification` or blank | `unverified`          |

If any option is `conflict`, the product status is `conflict` too.

Channel rules already enforced by the admin:

- Shopee URLs must be `https://shopee.ph`, `https://www.shopee.ph`, or `https://shope.ee`.
- A link stays `pending` until `verify-link` is confirmed. Editing the URL clears verification.
- The current database allows only the `shopee` channel. Emit `lazada` only after a real Lazada listing is stored. Do not copy the website's marketing buttons into this file.
- One listing per product or option per channel. An empty `optionId` is the product-level fallback (`variation_id` `''`).

Media rules:

- Keep gallery order. If the pinned file is `video/*`, the gallery item kind is `video`. Position 0 may be that video.
- Put a public `https` URL or a root-relative path on each gallery item before a verified product is included. Asset ids alone are not enough for a public row.
- Set `installationVideoUrl` only from a URL saved as the assembly clip. Do not point it at the storage-rack concept animation. That clip is `productVideo`, and the catalog text says it is not an assembly guide.
- Do not add stock, ratings, or testimonials. Stock stays in the inventory ledger until a later, separate feed.

The loader in `src/lib/catalog/load-published-catalog.ts` is the website side of this contract.
