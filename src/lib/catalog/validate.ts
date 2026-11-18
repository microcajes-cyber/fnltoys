import { CATALOG_CONTRACT_VERSION, type CatalogFile } from './types';

const WORKFLOWS = ['draft', 'review', 'approved', 'published'] as const;
const LIFECYCLES = ['draft', 'active', 'archived'] as const;
const VERIFICATION = ['verified', 'needs_review', 'conflict', 'unverified'] as const;
const LINK_VERIFICATION = ['pending', 'verified'] as const;
const GALLERY_KINDS = ['image', 'video'] as const;

const BANNED_KEYS = new Set([
  'stock',
  'onHand',
  'on_hand',
  'reserved',
  'rating',
  'ratings',
  'stars',
  'testimonial',
  'testimonials',
  'reviews',
  'review',
  'reviewCount',
  'inventory',
]);

const SHOPEE_HOSTS = ['shopee.ph', 'www.shopee.ph', 'shope.ee'];
const LAZADA_HOSTS = ['lazada.com.ph', 'www.lazada.com.ph'];
const ASSET_ID = /^[a-zA-Z0-9_-]{1,100}$/;
const PRODUCT_ID = /^[a-z0-9-]{1,80}$/;
const OPTION_ID = /^[a-zA-Z0-9_-]{1,100}$/;
const SKU = /^[A-Z0-9][A-Z0-9._ /-]{0,63}$/;
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const ACCENT = /^#[0-9A-Fa-f]{6}$/;

export class CatalogValidationError extends Error {
  readonly errors: readonly string[];

  constructor(errors: string[]) {
    super(errors.join('\n'));
    this.name = 'CatalogValidationError';
    this.errors = errors;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function at(path: string, key: string): string {
  return path ? `${path}.${key}` : key;
}

function push(errors: string[], message: string) {
  if (errors.length < 40) errors.push(message);
}

function exact(
  value: unknown,
  keys: readonly string[],
  path: string,
  errors: string[]
): value is Record<string, unknown> {
  if (!isObject(value)) {
    push(errors, `${path || 'catalog'} must be an object`);
    return false;
  }
  const allowed = new Set(keys);
  for (const key of Object.keys(value)) {
    if (BANNED_KEYS.has(key)) {
      push(
        errors,
        `${at(path, key)} is not allowed. Do not invent stock, ratings, or testimonials`
      );
    } else if (!allowed.has(key)) {
      push(errors, `${at(path, key)} is not part of the catalog contract`);
    }
  }
  for (const key of keys) {
    if (!(key in value)) push(errors, `${at(path, key)} is required`);
  }
  return errors.length < 40;
}

function text(
  value: unknown,
  path: string,
  errors: string[],
  max: number,
  allowEmpty = true
): string {
  if (typeof value !== 'string' || value !== value.trim() || (!allowEmpty && value.length === 0)) {
    push(errors, `${path} must be a ${allowEmpty ? '' : 'non-empty '}string`.replace('  ', ' '));
    return '';
  }
  if (value.length > max) push(errors, `${path} must be at most ${max} characters`);
  return value;
}

function flag(value: unknown, path: string, errors: string[]): boolean {
  if (typeof value !== 'boolean') {
    push(errors, `${path} must be true or false`);
    return false;
  }
  return value;
}

function enumeration<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[],
  errors: string[]
): T | null {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    push(errors, `${path} must be one of: ${allowed.join(', ')}`);
    return null;
  }
  return value as T;
}

function httpsUrl(value: string, path: string, errors: string[], hosts?: readonly string[]) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    push(errors, `${path} must be a valid HTTPS URL`);
    return;
  }
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.')) {
    push(errors, `${path} must be an HTTPS URL without credentials`);
    return;
  }
  if (hosts && !hosts.includes(url.hostname.toLowerCase())) {
    push(errors, `${path} host must be one of: ${hosts.join(', ')}`);
  }
}

function mediaUrl(value: unknown, path: string, errors: string[]): string | null {
  if (value === null) return null;
  if (typeof value !== 'string' || value.length === 0 || value !== value.trim()) {
    push(errors, `${path} must be an HTTPS URL, a root-relative path, or null`);
    return null;
  }
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  httpsUrl(value, path, errors);
  return value;
}

function optionalHttps(value: unknown, path: string, errors: string[]): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') {
    push(errors, `${path} must be an HTTPS URL or null`);
    return null;
  }
  httpsUrl(value, path, errors);
  return value;
}

function minor(value: unknown, path: string, errors: string[]): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    push(errors, `${path} must be a non-negative integer number of centavos, or null`);
    return null;
  }
  return value;
}

function assetId(value: unknown, path: string, errors: string[]): string | null {
  if (value === null) return null;
  if (typeof value !== 'string' || !ASSET_ID.test(value)) {
    push(errors, `${path} must be an admin asset id or null`);
    return null;
  }
  return value;
}

function nullableString(
  value: unknown,
  path: string,
  errors: string[],
  max: number
): string | null {
  if (value === null) return null;
  return text(value, path, errors, max, false);
}

function checkVerification(value: unknown, path: string, errors: string[]) {
  if (!exact(value, ['status', 'sourceLabel'], path, errors)) return;
  const status = enumeration(value.status, `${path}.status`, VERIFICATION, errors);
  const sourceLabel = text(value.sourceLabel, `${path}.sourceLabel`, errors, 100, false);
  if (sourceLabel === 'CONFLICT' && status && status !== 'conflict') {
    push(errors, `${path}.status must be conflict when sourceLabel is CONFLICT`);
  }
  if (sourceLabel === 'NEEDS REVIEW' && status && status !== 'needs_review') {
    push(errors, `${path}.status must be needs_review when sourceLabel is NEEDS REVIEW`);
  }
  if (status === 'verified' && /conflict|needs review/i.test(sourceLabel)) {
    push(
      errors,
      `${path} cannot be verified while its label still says it needs review or conflicts`
    );
  }
}

function checkPrice(value: unknown, path: string, errors: string[]) {
  if (!exact(value, ['currency', 'amountMinor', 'comparisonMinor'], path, errors)) return;
  if (value.currency !== 'PHP') push(errors, `${path}.currency must be PHP`);
  const amount = minor(value.amountMinor, `${path}.amountMinor`, errors);
  const comparison = minor(value.comparisonMinor, `${path}.comparisonMinor`, errors);
  if (amount === null && comparison !== null) {
    push(errors, `${path}.comparisonMinor requires a selling price`);
  }
  if (amount !== null && comparison !== null && comparison < amount) {
    push(errors, `${path}.comparisonMinor must be at least the selling price`);
  }
}

function checkChannel(value: unknown, path: string, errors: string[], expectedOptionId: string) {
  if (!exact(value, ['channel', 'optionId', 'url', 'listingId', 'verification'], path, errors)) {
    return;
  }
  const channel = enumeration(
    value.channel,
    `${path}.channel`,
    ['shopee', 'lazada'] as const,
    errors
  );
  if (value.optionId !== expectedOptionId) {
    push(
      errors,
      `${path}.optionId must be ${expectedOptionId === '' ? 'empty for a product listing' : expectedOptionId}`
    );
  }
  if (typeof value.url !== 'string' || !value.url) {
    push(errors, `${path}.url is required`);
  } else if (channel === 'shopee') {
    httpsUrl(value.url, `${path}.url`, errors, SHOPEE_HOSTS);
  } else if (channel === 'lazada') {
    httpsUrl(value.url, `${path}.url`, errors, LAZADA_HOSTS);
  }
  nullableString(value.listingId, `${path}.listingId`, errors, 100);
  enumeration(value.verification, `${path}.verification`, LINK_VERIFICATION, errors);
}

function uniqueChannels(links: unknown[], path: string, errors: string[]) {
  const seen = new Set<string>();
  links.forEach((link) => {
    if (!isObject(link)) return;
    const key = `${String(link.channel)}:${String(link.optionId)}`;
    if (seen.has(key)) push(errors, `${path} has more than one ${String(link.channel)} listing`);
    seen.add(key);
  });
}

function checkGallery(value: unknown, path: string, errors: string[]) {
  if (!Array.isArray(value)) {
    push(errors, `${path} must be an ordered list`);
    return;
  }
  if (value.length > 40) push(errors, `${path} has too many items`);
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (
      !exact(item, ['position', 'kind', 'url', 'assetId', 'mime', 'alt', 'label'], itemPath, errors)
    ) {
      return;
    }
    if (item.position !== index) {
      push(errors, `${itemPath}.position must be ${index} so the gallery stays in order`);
    }
    const kind = enumeration(item.kind, `${itemPath}.kind`, GALLERY_KINDS, errors);
    mediaUrl(item.url, `${itemPath}.url`, errors);
    const id = assetId(item.assetId, `${itemPath}.assetId`, errors);
    if (item.url === null && id === null) {
      push(errors, `${itemPath} needs a url or an admin asset id`);
    }
    if (item.mime !== null && typeof item.mime !== 'string') {
      push(errors, `${itemPath}.mime must be a string or null`);
    } else if (typeof item.mime === 'string') {
      if (kind === 'video' && !item.mime.startsWith('video/')) {
        push(errors, `${itemPath}.mime must be a video type when kind is video`);
      }
      if (kind === 'image' && !item.mime.startsWith('image/')) {
        push(errors, `${itemPath}.mime must be an image type when kind is image`);
      }
    }
    text(item.alt, `${itemPath}.alt`, errors, 300, false);
    if (item.label !== null) text(item.label, `${itemPath}.label`, errors, 160, false);
  });
}

function checkProductVideo(value: unknown, path: string, errors: string[]) {
  if (value === null) return;
  if (!exact(value, ['url', 'assetId', 'mime', 'posterAssetId', 'caption'], path, errors)) {
    return;
  }
  mediaUrl(value.url, `${path}.url`, errors);
  const id = assetId(value.assetId, `${path}.assetId`, errors);
  if (value.url === null && id === null) push(errors, `${path} needs a url or an admin asset id`);
  if (value.mime !== null && (typeof value.mime !== 'string' || !value.mime.startsWith('video/'))) {
    push(errors, `${path}.mime must be a video type or null`);
  }
  assetId(value.posterAssetId, `${path}.posterAssetId`, errors);
  if (value.caption !== null) text(value.caption, `${path}.caption`, errors, 200, false);
}

function checkOption(
  value: unknown,
  path: string,
  errors: string[],
  skuSeen: Set<string>,
  idSeen: Set<string>
) {
  if (
    !exact(
      value,
      [
        'id',
        'sku',
        'name',
        'position',
        'active',
        'attributes',
        'verification',
        'price',
        'channels',
      ],
      path,
      errors
    )
  ) {
    return;
  }
  if (typeof value.id !== 'string' || !OPTION_ID.test(value.id)) {
    push(errors, `${path}.id must be a stable variation id`);
  } else if (idSeen.has(value.id)) {
    push(errors, `${path}.id duplicates ${value.id}`);
  } else {
    idSeen.add(value.id);
  }
  if (value.sku !== null && (typeof value.sku !== 'string' || !SKU.test(value.sku))) {
    push(errors, `${path}.sku must be an uppercase admin SKU or null`);
  } else if (typeof value.sku === 'string') {
    const key = value.sku.toUpperCase();
    if (skuSeen.has(key)) push(errors, `${path}.sku duplicates ${value.sku}`);
    skuSeen.add(key);
  }
  text(value.name, `${path}.name`, errors, 160, false);
  flag(value.active, `${path}.active`, errors);
  if (
    !exact(value.attributes, ['color', 'option', 'panel', 'match'], `${path}.attributes`, errors)
  ) {
    return;
  }
  for (const key of ['color', 'option', 'panel', 'match'] as const) {
    text(value.attributes[key], `${path}.attributes.${key}`, errors, 160);
  }
  checkVerification(value.verification, `${path}.verification`, errors);
  checkPrice(value.price, `${path}.price`, errors);
  if (!Array.isArray(value.channels)) {
    push(errors, `${path}.channels must be a list`);
    return;
  }
  value.channels.forEach((link, index) => {
    checkChannel(link, `${path}.channels[${index}]`, errors, String(value.id));
  });
  uniqueChannels(value.channels, `${path}.channels`, errors);
}

function checkCopy(value: unknown, path: string, errors: string[]) {
  if (
    !exact(
      value,
      [
        'eyebrow',
        'headline',
        'intro',
        'description',
        'guideTitle',
        'guideBody',
        'accent',
        'details',
        'questions',
      ],
      path,
      errors
    )
  ) {
    return;
  }
  text(value.eyebrow, `${path}.eyebrow`, errors, 80);
  text(value.headline, `${path}.headline`, errors, 160);
  text(value.intro, `${path}.intro`, errors, 500);
  text(value.description, `${path}.description`, errors, 2000);
  text(value.guideTitle, `${path}.guideTitle`, errors, 120);
  text(value.guideBody, `${path}.guideBody`, errors, 2000);
  if (typeof value.accent !== 'string' || !ACCENT.test(value.accent)) {
    push(errors, `${path}.accent must be a #RRGGBB color`);
  }
  if (!Array.isArray(value.details) || value.details.length > 20) {
    push(errors, `${path}.details must be a list of at most 20 facts`);
  } else {
    value.details.forEach((detail, index) => {
      const detailPath = `${path}.details[${index}]`;
      if (!exact(detail, ['label', 'value'], detailPath, errors)) return;
      text(detail.label, `${detailPath}.label`, errors, 80, false);
      text(detail.value, `${detailPath}.value`, errors, 500, false);
    });
  }
  if (!Array.isArray(value.questions) || value.questions.length > 20) {
    push(errors, `${path}.questions must be a list of at most 20 questions`);
  } else {
    value.questions.forEach((question, index) => {
      const questionPath = `${path}.questions[${index}]`;
      if (!exact(question, ['q', 'a'], questionPath, errors)) return;
      text(question.q, `${questionPath}.q`, errors, 200, false);
      text(question.a, `${questionPath}.a`, errors, 800, false);
    });
  }
}

function publicReady(product: Record<string, unknown>): boolean {
  if (!isObject(product.publication) || !isObject(product.verification)) return false;
  return (
    product.publication.workflow === 'published' &&
    product.publication.lifecycle === 'active' &&
    product.publication.visible === true &&
    product.verification.status === 'verified'
  );
}

function checkProduct(
  value: unknown,
  path: string,
  errors: string[],
  skuSeen: Set<string>,
  optionIds: Set<string>,
  productIds: Set<string>
) {
  if (
    !exact(
      value,
      ['id', 'name', 'publication', 'verification', 'copy', 'media', 'options', 'channels'],
      path,
      errors
    )
  ) {
    return;
  }
  if (typeof value.id !== 'string' || !PRODUCT_ID.test(value.id)) {
    push(errors, `${path}.id must use lowercase letters, numbers, and hyphens`);
  } else if (productIds.has(value.id)) {
    push(errors, `${path}.id duplicates ${value.id}`);
  } else {
    productIds.add(value.id);
  }
  text(value.name, `${path}.name`, errors, 140, false);
  if (
    !exact(value.publication, ['workflow', 'lifecycle', 'visible'], `${path}.publication`, errors)
  )
    return;
  const workflow = enumeration(
    value.publication.workflow,
    `${path}.publication.workflow`,
    WORKFLOWS,
    errors
  );
  const lifecycle = enumeration(
    value.publication.lifecycle,
    `${path}.publication.lifecycle`,
    LIFECYCLES,
    errors
  );
  flag(value.publication.visible, `${path}.publication.visible`, errors);
  checkVerification(value.verification, `${path}.verification`, errors);
  checkCopy(value.copy, `${path}.copy`, errors);
  if (
    !exact(
      value.media,
      ['gallery', 'installationVideoUrl', 'productVideo'],
      `${path}.media`,
      errors
    )
  )
    return;
  checkGallery(value.media.gallery, `${path}.media.gallery`, errors);
  optionalHttps(value.media.installationVideoUrl, `${path}.media.installationVideoUrl`, errors);
  checkProductVideo(value.media.productVideo, `${path}.media.productVideo`, errors);
  if (!Array.isArray(value.options) || value.options.length < 1 || value.options.length > 500) {
    push(errors, `${path}.options must contain 1 to 500 options`);
    return;
  }
  value.options.forEach((option, index) => {
    if (isObject(option) && option.position !== index) {
      push(errors, `${path}.options[${index}].position must be ${index}`);
    }
    checkOption(option, `${path}.options[${index}]`, errors, skuSeen, optionIds);
  });
  if (isObject(value.verification) && value.verification.status === 'verified') {
    value.options.forEach((option, index) => {
      if (
        isObject(option) &&
        isObject(option.verification) &&
        option.verification.status !== 'verified'
      ) {
        push(errors, `${path}.options[${index}] must be verified when the product is verified`);
      }
    });
  }
  const anyConflict = value.options.some(
    (option) =>
      isObject(option) && isObject(option.verification) && option.verification.status === 'conflict'
  );
  if (anyConflict && isObject(value.verification) && value.verification.status !== 'conflict') {
    push(errors, `${path}.verification.status must be conflict when any option is conflict`);
  }
  if (workflow === 'published' && lifecycle === 'draft') {
    push(errors, `${path} cannot be published while its lifecycle is still draft`);
  }
  const activeOption = value.options.some((option) => isObject(option) && option.active === true);
  if (workflow === 'published' && lifecycle === 'active' && !activeOption) {
    push(errors, `${path} needs an active option before it can be published as active`);
  }
  if (!Array.isArray(value.channels)) {
    push(errors, `${path}.channels must be a list`);
    return;
  }
  value.channels.forEach((link, index) =>
    checkChannel(link, `${path}.channels[${index}]`, errors, '')
  );
  uniqueChannels(value.channels, `${path}.channels`, errors);
  if (publicReady(value)) {
    if (Array.isArray(value.media.gallery)) {
      value.media.gallery.forEach((item, index) => {
        if (isObject(item) && item.url === null) {
          push(
            errors,
            `${path}.media.gallery[${index}].url is required before a verified product can be public`
          );
        }
      });
    }
    if (isObject(value.media.productVideo) && value.media.productVideo.url === null) {
      push(
        errors,
        `${path}.media.productVideo.url is required before a verified product can be public`
      );
    }
  }
}

function checkSource(value: unknown, path: string, errors: string[], products: unknown[]) {
  if (
    !exact(
      value,
      [
        'system',
        'release',
        'snapshotDate',
        'sourceUrl',
        'sourceRecordCount',
        'familyCount',
        'optionCount',
        'converter',
        'note',
      ],
      path,
      errors
    )
  ) {
    return;
  }
  text(value.system, `${path}.system`, errors, 80, false);
  text(value.release, `${path}.release`, errors, 40, false);
  if (value.snapshotDate !== null)
    text(value.snapshotDate, `${path}.snapshotDate`, errors, 40, false);
  if (value.sourceUrl !== null) optionalHttps(value.sourceUrl, `${path}.sourceUrl`, errors);
  if (
    value.sourceRecordCount !== null &&
    (!Number.isSafeInteger(value.sourceRecordCount) || Number(value.sourceRecordCount) < 0)
  ) {
    push(errors, `${path}.sourceRecordCount must be a non-negative integer or null`);
  }
  const optionCount = products.reduce<number>((sum, product) => {
    if (isObject(product) && Array.isArray(product.options)) return sum + product.options.length;
    return sum;
  }, 0);
  if (value.familyCount !== products.length) {
    push(errors, `${path}.familyCount must match the product list`);
  }
  if (value.optionCount !== optionCount) {
    push(errors, `${path}.optionCount must match the option list`);
  }
  text(value.converter, `${path}.converter`, errors, 160, false);
  text(value.note, `${path}.note`, errors, 2000, false);
}

export function validateCatalog(input: unknown): CatalogFile {
  const errors: string[] = [];
  if (!exact(input, ['contractVersion', 'exportedAt', 'source', 'products'], '', errors)) {
    throw new CatalogValidationError(errors);
  }
  if (input.contractVersion !== CATALOG_CONTRACT_VERSION) {
    push(errors, `contractVersion must be ${CATALOG_CONTRACT_VERSION}`);
  }
  if (typeof input.exportedAt !== 'string' || !ISO_TIME.test(input.exportedAt)) {
    push(errors, 'exportedAt must be an ISO timestamp');
  }
  if (!Array.isArray(input.products)) {
    push(errors, 'products must be a list');
    throw new CatalogValidationError(errors);
  }
  const skuSeen = new Set<string>();
  const optionIds = new Set<string>();
  const productIds = new Set<string>();
  input.products.forEach((product, index) => {
    checkProduct(product, `products[${index}]`, errors, skuSeen, optionIds, productIds);
  });
  checkSource(input.source, 'source', errors, input.products);
  if (errors.length > 0) throw new CatalogValidationError(errors);
  return input as unknown as CatalogFile;
}
