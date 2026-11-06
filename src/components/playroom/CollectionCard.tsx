import Image from 'next/image';
import Link from 'next/link';
import type { Family } from '@/lib/catalog';
import { accentStyle, CategoryArt, Icon, imagePath } from './Art';

export default function CollectionCard({ family }: { family: Family }) {
  const image = family.mediaKey ? imagePath(family.mediaKey) : '';
  return (
    <Link
      className="category-card"
      href={`/products/${family.slug}`}
      style={accentStyle(family.accent)}
    >
      <div className="category-art">
        {image ? (
          <Image
            src={image}
            alt={`${family.name} — representative product photo`}
            width={520}
            height={380}
            loading="lazy"
          />
        ) : (
          <div className="category-art-icon">
            <CategoryArt slug={family.slug} size={100} />
          </div>
        )}
        <span className="art-type">{image ? 'Family reference' : 'Illustrated collection'}</span>
      </div>
      <div className="category-card-copy">
        <h3>{family.name}</h3>
        <p>{family.intro}</p>
        <div className="category-card-bottom">
          <span>{family.variants.length} recorded options</span>
          <span className="circle-arrow">
            <Icon name="arrow" size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
