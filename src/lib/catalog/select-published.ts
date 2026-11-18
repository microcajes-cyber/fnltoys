import {
  CATALOG_CONTRACT_VERSION,
  type CatalogFile,
  type CatalogProduct,
  type PublishedCatalog,
} from './types';

function isPublicProduct(product: CatalogProduct): boolean {
  return (
    product.publication.workflow === 'published' &&
    product.publication.lifecycle === 'active' &&
    product.publication.visible === true &&
    product.verification.status === 'verified'
  );
}

/**
 * Keeps products the site is allowed to render.
 * A row must be published, active, visible, and verified.
 * NEEDS REVIEW, unverified, and CONFLICT rows are dropped.
 * Pending channel links are dropped. Prices are copied as recorded, including null.
 */
export function selectPublished(catalog: CatalogFile): PublishedCatalog {
  const products: CatalogProduct[] = [];
  for (const product of catalog.products) {
    if (!isPublicProduct(product) || product.verification.status === 'conflict') continue;
    const next = structuredClone(product);
    next.options = next.options.filter(
      (option) => option.active && option.verification.status === 'verified'
    );
    if (next.options.length === 0) continue;
    for (const option of next.options) {
      option.channels = option.channels.filter((link) => link.verification === 'verified');
    }
    next.channels = next.channels.filter((link) => link.verification === 'verified');
    products.push(next);
  }
  return { contractVersion: CATALOG_CONTRACT_VERSION, products };
}
