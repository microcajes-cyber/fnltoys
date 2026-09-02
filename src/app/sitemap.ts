import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    {
      url: base,
      lastModified: new Date('2026-09-02'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/#featured-products`,
      lastModified: new Date('2026-09-02'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/#about-us`,
      lastModified: new Date('2026-09-02'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/#b2b-wholesale`,
      lastModified: new Date('2026-09-02'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}