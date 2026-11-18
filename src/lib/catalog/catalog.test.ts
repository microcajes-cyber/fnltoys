import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadCatalogFile, loadPublishedCatalog } from './load-published-catalog';
import { selectPublished } from './select-published';
import type { CatalogFile, CatalogOption, CatalogProduct, VerificationStatus } from './types';
import { CatalogValidationError, validateCatalog } from './validate';

function verification(status: VerificationStatus): CatalogProduct['verification'] {
  const labels: Record<VerificationStatus, string> = {
    verified: 'verified',
    needs_review: 'NEEDS REVIEW',
    conflict: 'CONFLICT',
    unverified: 'Needs Verification',
  };
  return { status, sourceLabel: labels[status] };
}

function option(overrides: Partial<CatalogOption> = {}): CatalogOption {
  const id = overrides.id ?? 'opt-blue';
  return {
    id,
    sku: null,
    name: 'Blue · 10+2 · Without playmat',
    position: 0,
    active: true,
    attributes: { color: 'Blue', option: 'Without playmat', panel: '10+2', match: 'Yes' },
    verification: verification('verified'),
    price: { currency: 'PHP', amountMinor: null, comparisonMinor: null },
    channels: [],
    ...overrides,
  };
}

function product(overrides: Partial<CatalogProduct> = {}): CatalogProduct {
  const id = overrides.id ?? 'play-fence';
  return {
    id,
    name: 'Play Fence',
    publication: { workflow: 'published', lifecycle: 'active', visible: true },
    verification: verification('verified'),
    copy: {
      eyebrow: 'MAKE SPACE FOR PLAY',
      headline: 'A little world of their own.',
      intro: 'A recorded introduction.',
      description: 'A recorded description.',
      guideTitle: 'Plan your play corner',
      guideBody: 'Compare the recorded options.',
      accent: '#F571AD',
      details: [{ label: 'Choose by', value: 'Color and panel set' }],
      questions: [{ q: 'What is included?', a: 'Confirm the listing.' }],
    },
    media: {
      gallery: [
        {
          position: 0,
          kind: 'image',
          url: 'https://cdn.example.com/play-fence.jpg',
          assetId: 'party',
          mime: 'image/jpeg',
          alt: 'Play fence',
          label: 'Family reference',
        },
      ],
      installationVideoUrl: null,
      productVideo: null,
    },
    options: [option({ id: `${id}-blue` })],
    channels: [],
    ...overrides,
  };
}

function catalog(products: CatalogProduct[]): CatalogFile {
  return {
    contractVersion: 1,
    exportedAt: '2026-11-18T00:00:00.000Z',
    source: {
      system: 'test',
      release: 'test',
      snapshotDate: null,
      sourceUrl: null,
      sourceRecordCount: null,
      familyCount: products.length,
      optionCount: products.reduce((sum, item) => sum + item.options.length, 0),
      converter: 'catalog.test.ts',
      note: 'Fixture for the catalog contract.',
    },
    products,
  };
}

function rejection(mutate: (file: CatalogFile) => void, pattern: RegExp) {
  const file = catalog([product()]);
  mutate(file);
  assert.throws(
    () => validateCatalog(file),
    (error: unknown) => {
      assert.ok(error instanceof CatalogValidationError);
      assert.match(error.message, pattern);
      return true;
    }
  );
}

describe('catalog contract', () => {
  it('rejects bad data', () => {
    rejection((file) => {
      (file as { contractVersion: number }).contractVersion = 2;
    }, /contractVersion/);
    rejection((file) => {
      (file.products[0] as CatalogProduct & { rating?: number }).rating = 5;
    }, /rating/);
    rejection((file) => {
      (file.products[0].options[0] as CatalogOption & { stock?: number }).stock = 3;
    }, /stock/);
    rejection((file) => {
      (file.products[0] as CatalogProduct & { testimonials?: string[] }).testimonials = ['Great'];
    }, /testimonials/);
    rejection((file) => {
      file.products[0].options[0].price.amountMinor = 19.5;
    }, /amountMinor/);
    rejection((file) => {
      file.products[0].options[0].price.amountMinor = -1;
    }, /amountMinor/);
    rejection((file) => {
      (file.products[0].options[0].price as { currency: string }).currency = 'USD';
    }, /PHP/);
    rejection((file) => {
      file.products[0].options[0].price.amountMinor = 1000;
      file.products[0].options[0].price.comparisonMinor = 900;
    }, /comparisonMinor/);
    rejection((file) => {
      file.products[0].options[0].price.comparisonMinor = 1000;
    }, /comparisonMinor/);
    rejection((file) => {
      file.products[0].media.gallery[0].kind = 'video';
      file.products[0].media.gallery[0].mime = 'image/png';
    }, /video type/);
    rejection((file) => {
      file.products[0].media.gallery.push({
        ...file.products[0].media.gallery[0],
        position: 2,
      });
    }, /position must be 1/);
    rejection((file) => {
      file.products[0].channels.push({
        channel: 'shopee',
        optionId: '',
        url: 'https://shopee.com/not-ph',
        listingId: null,
        verification: 'verified',
      });
    }, /shopee\.ph/);
    rejection((file) => {
      file.products[0].media.installationVideoUrl = 'http://cdn.example.com/install.mp4';
    }, /HTTPS/);
    rejection((file) => {
      file.products[0].options[0].verification = verification('needs_review');
    }, /must be verified/);
    rejection((file) => {
      file.products[0].verification = verification('needs_review');
      file.products[0].options[0].verification = verification('conflict');
    }, /must be conflict/);
    rejection((file) => {
      file.products.push(
        product({ id: 'ocean-balls', options: [option({ id: 'shared', sku: 'SAME-1' })] })
      );
      file.products[0].options[0].sku = 'SAME-1';
      file.source.familyCount = 2;
      file.source.optionCount = 2;
    }, /duplicates SAME-1/);
  });

  it('allows a video as the first gallery item and an installation video URL', () => {
    const file = catalog([
      product({
        media: {
          gallery: [
            {
              position: 0,
              kind: 'video',
              url: 'https://cdn.example.com/assembly.mp4',
              assetId: 'assembly',
              mime: 'video/mp4',
              alt: 'How to set up the play fence',
              label: 'Installation',
            },
            {
              position: 1,
              kind: 'image',
              url: '/media/play-fence.jpg',
              assetId: 'party',
              mime: 'image/jpeg',
              alt: 'Play fence in a room',
              label: 'Family reference',
            },
          ],
          installationVideoUrl: 'https://cdn.example.com/assembly.mp4',
          productVideo: null,
        },
      }),
    ]);
    const validated = validateCatalog(file);
    assert.equal(validated.products[0].media.gallery[0].kind, 'video');
    assert.equal(
      validated.products[0].media.installationVideoUrl,
      'https://cdn.example.com/assembly.mp4'
    );
    const published = selectPublished(validated);
    assert.equal(published.products.length, 1);
    assert.equal(published.products[0].media.gallery[0].position, 0);
    assert.equal(published.products[0].options[0].price.amountMinor, null);
    assert.equal(JSON.stringify(published).includes('"stock"'), false);
    assert.equal(JSON.stringify(published).includes('rating'), false);
    assert.equal(JSON.stringify(published).includes('testimonial'), false);
  });

  it('filters unverified, conflict, and unpublished rows', () => {
    const ready = product({ id: 'play-fence' });
    ready.channels = [
      {
        channel: 'lazada',
        optionId: '',
        url: 'https://www.lazada.com.ph/products/play-fence',
        listingId: null,
        verification: 'pending',
      },
    ];
    ready.options[0].channels = [
      {
        channel: 'shopee',
        optionId: ready.options[0].id,
        url: 'https://shopee.ph/play-fence',
        listingId: '8046169224',
        verification: 'verified',
      },
    ];
    ready.options[0].price = { currency: 'PHP', amountMinor: 24900, comparisonMinor: null };

    const needsReview = product({
      id: 'hippo-fence',
      verification: verification('needs_review'),
    });
    needsReview.options[0].verification = verification('needs_review');

    const conflicted = product({
      id: 'octopus-fence',
      verification: verification('conflict'),
    });
    conflicted.options[0].verification = verification('conflict');

    const draft = product({
      id: 'storage-rack',
      publication: { workflow: 'draft', lifecycle: 'active', visible: true },
    });
    const hidden = product({
      id: 'carrot-bookshelf',
      publication: { workflow: 'published', lifecycle: 'active', visible: false },
    });
    const approvedOnly = product({
      id: 'ocean-balls',
      publication: { workflow: 'approved', lifecycle: 'active', visible: true },
    });

    const published = selectPublished(
      validateCatalog(catalog([ready, needsReview, conflicted, draft, hidden, approvedOnly]))
    );

    assert.deepEqual(
      published.products.map((item) => item.id),
      ['play-fence']
    );
    assert.equal(published.products[0].channels.length, 0);
    assert.equal(published.products[0].options[0].channels.length, 1);
    assert.equal(published.products[0].options[0].channels[0].channel, 'shopee');
    assert.equal(published.products[0].options[0].price.amountMinor, 24900);
    assert.equal(Object.prototype.hasOwnProperty.call(published.products[0], 'stock'), false);
  });
});

describe('committed admin export', () => {
  it('keeps every current row private', () => {
    const file = loadCatalogFile();
    const published = loadPublishedCatalog();
    const options = file.products.flatMap((item) => item.options);
    assert.equal(file.contractVersion, 1);
    assert.equal(file.products.length, 6);
    assert.equal(options.length, 206);
    assert.equal(options.filter((item) => item.verification.status === 'needs_review').length, 102);
    assert.equal(options.filter((item) => item.verification.status === 'conflict').length, 104);
    assert.equal(file.products.filter((item) => item.verification.status === 'conflict').length, 5);
    assert.equal(published.products.length, 0);
    assert.ok(file.products.every((item) => item.publication.workflow === 'draft'));
    assert.ok(file.products.every((item) => item.verification.status !== 'verified'));
    assert.ok(options.every((item) => item.price.amountMinor === null));
    assert.ok(options.every((item) => item.price.comparisonMinor === null));
    assert.ok(options.every((item) => item.sku === null));
    assert.ok(options.every((item) => item.channels.length === 0));
    assert.ok(file.products.every((item) => item.media.installationVideoUrl === null));
    const rack = file.products.find((item) => item.id === 'storage-rack');
    assert.ok(rack);
    assert.equal(rack.verification.status, 'needs_review');
    assert.equal(rack.media.gallery[0].kind, 'image');
    assert.equal(rack.media.productVideo?.assetId, 'rackVideo');
    assert.equal(rack.media.productVideo?.mime, 'video/mp4');
    const balls = file.products.find((item) => item.id === 'ocean-balls');
    assert.equal(balls?.media.gallery[0].assetId, 'balls');
    assert.equal(balls?.media.gallery[0].mime, null);
    assert.equal(JSON.stringify(published).includes('"stock"'), false);

    const broken = structuredClone(file) as unknown as { products: Array<Record<string, unknown>> };
    broken.products[0].stock = 4;
    assert.throws(() => validateCatalog(broken), /stock/);
  });
});
