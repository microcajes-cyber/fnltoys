import { readFileSync } from 'node:fs';
import path from 'node:path';
import { selectPublished } from './select-published';
import type { CatalogFile, PublishedCatalog } from './types';
import { validateCatalog } from './validate';

export const CATALOG_FILE = path.join(process.cwd(), 'src/data/catalog/published-catalog.json');

let fileCache: CatalogFile | null = null;
let publishedCache: PublishedCatalog | null = null;

export function loadCatalogFile(filePath = CATALOG_FILE): CatalogFile {
  if (filePath === CATALOG_FILE && fileCache) return fileCache;
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  const catalog = validateCatalog(raw);
  if (filePath === CATALOG_FILE) fileCache = catalog;
  return catalog;
}

/** Build-time catalog. Throws if the committed file is invalid. */
export function loadPublishedCatalog(filePath = CATALOG_FILE): PublishedCatalog {
  if (filePath === CATALOG_FILE && publishedCache) return structuredClone(publishedCache);
  const published = selectPublished(loadCatalogFile(filePath));
  if (filePath === CATALOG_FILE) publishedCache = published;
  return structuredClone(published);
}
