import type { MetadataRoute } from 'next';
import { families, SITE_URL, snapshotDate } from '@/lib/catalog';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(snapshotDate), changeFrequency: 'weekly', priority: 1 },
    ...families.map((family) => ({
      url: `${SITE_URL}/products/${family.slug}`,
      lastModified: new Date(snapshotDate),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
