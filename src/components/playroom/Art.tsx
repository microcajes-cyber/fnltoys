import Image from 'next/image';
/* These SVG strings are static artwork extracted from the supplied Draft 04. */
import artwork from '@/data/playroom-icons.json';
import media from '@/data/playroom-media.json';
import type { CSSProperties } from 'react';

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const svg = artwork.icons[name as keyof typeof artwork.icons] || artwork.icons.arrow;
  return (
    <span
      className="playroom-icon"
      aria-hidden="true"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function CategoryArt({ slug, size = 52 }: { slug: string; size?: number }) {
  const svg = artwork.categories[slug as keyof typeof artwork.categories];
  return svg ? (
    <span
      className="playroom-icon category-illustration"
      aria-hidden="true"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  ) : null;
}

export function Brand() {
  return (
    <>
      <span className="brand-symbol">
        <Image src={media.logo} alt="" width={80} height={80} />
      </span>
      <span className="brand-word">
        FNL TOYS<span className="brand-sub">A little world of play</span>
      </span>
    </>
  );
}

export const accentStyle = (accent: string): CSSProperties =>
  ({ '--card-accent': `${accent}20`, '--gallery-accent': `${accent}15` }) as CSSProperties;
export const imagePath = (key: string) => media[key as keyof typeof media] || '';
