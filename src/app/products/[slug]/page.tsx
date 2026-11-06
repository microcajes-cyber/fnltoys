import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { families } from '@/lib/catalog';
import { CategoryArt, Icon, imagePath } from '@/components/playroom/Art';
import ProductExplorer from '@/components/playroom/ProductExplorer';

export const dynamicParams = false;
export function generateStaticParams() {
  return families.map((family) => ({ slug: family.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = families.find((item) => item.slug === slug);
  if (!family) return {};
  return {
    title: `${family.name} · FNL Toys`,
    description: family.intro,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${family.name} · FNL Toys`,
      description: family.intro,
      url: `/products/${slug}`,
    },
  };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const family = families.find((item) => item.slug === slug);
  if (!family) notFound();
  return (
    <div className="route-enter">
      <section className="category-top">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <Icon name="home" size={13} />
              Home
            </Link>
            <span>/</span>
            <Link href="/#collection">Products</Link>
            <span>/</span>
            <span aria-current="page">{family.name}</span>
          </nav>
          <div className="category-intro">
            <div>
              <p className="eyebrow">{family.eyebrow}</p>
              <h1>{family.name}</h1>
              <p className="collection-headline">{family.headline}</p>
              <p>{family.intro}</p>
            </div>
            <div className="category-badge" style={{ background: `${family.accent}20` }}>
              <CategoryArt slug={slug} size={58} />
            </div>
          </div>
          <nav className="section-nav" aria-label="On this page">
            {[
              { id: 'product-gallery', label: 'Gallery & options' },
              { id: 'variations', label: 'All variations' },
              { id: 'product-description', label: 'Description' },
              { id: 'product-video', label: 'Product video' },
              { id: 'product-questions', label: 'Questions' },
            ].map((item) => (
              <a className="section-nav-link" key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
      <ProductExplorer key={slug} family={family} />
      <section className="section about-section" id="product-description">
        <div className="container about-grid">
          <div className="about-text">
            <p className="eyebrow">About the collection</p>
            <h2>
              {family.name},<br />a little closer.
            </h2>
            <p>{family.description}</p>
          </div>
          <div className="guide-card">
            <span className="guide-icon">
              <Icon name="compass" size={26} />
            </span>
            <h3>{family.guideTitle}</h3>
            <p>{family.guideBody}</p>
            <dl className="details-list">
              {family.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>
                    {detail.value
                      .replace(/in this draft/g, 'for this collection')
                      .replace(/your product master/g, 'our product catalog')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="section container" id="product-video">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Product video</p>
            <h2>
              A closer look, <span className="pink-word">at your pace.</span>
            </h2>
          </div>
        </div>
        <div className="video-layout">
          <div className="video-surface">
            {slug === 'storage-rack' ? (
              <>
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={imagePath('rackVideoPoster')}
                  aria-label="Storage rack concept animation"
                >
                  <source src={imagePath('rackVideo')} type="video/mp4" />
                  Your browser cannot play this video.
                </video>
                <div className="video-file-note">
                  <span>
                    <strong>Storage rack concept animation</strong>
                    <br />
                    3D concept · Not an assembly guide or exact-variation demonstration. No spoken
                    audio.
                  </span>
                </div>
              </>
            ) : (
              <div className="video-placeholder">
                <span className="video-glyph">
                  <Icon name="camera" size={44} />
                </span>
                <strong>Product video is being prepared.</strong>
                <p>
                  Check our official stores for the latest {family.name} photographs and footage.
                </p>
              </div>
            )}
          </div>
          <div className="video-copy">
            <p className="eyebrow">{family.name}</p>
            <h3>
              See the details.
              <br />
              Picture the possibilities.
            </h3>
            <p>
              {slug === 'storage-rack'
                ? 'This short rotating concept introduces the rack design. Confirm the selected model, color, dimensions, and included bins in the official listing.'
                : 'A dedicated space for a closer look at the product. Product footage will appear here when it is ready.'}
            </p>
          </div>
        </div>
      </section>
      <section className="section container faq-section" id="product-questions">
        <div className="faq-grid">
          <div className="faq-title">
            <p className="eyebrow">A few helpful details</p>
            <h2>Before you choose.</h2>
            <p>Clear answers to help you move from browsing to choosing.</p>
          </div>
          <div className="faq-list">
            {family.questions.map((question) => (
              <details key={question.q}>
                <summary>
                  {question.q}
                  <Icon name="plus" size={18} />
                </summary>
                <div className="faq-answer">{question.a}</div>
              </details>
            ))}
            <details>
              <summary>
                Will my choices transfer to the store?
                <Icon name="plus" size={18} />
              </summary>
              <div className="faq-answer">
                Store links open the official shop or profile. Re-select and confirm your exact
                option there; choices are not transferred automatically.
              </div>
            </details>
          </div>
        </div>
      </section>
      <section className="section container related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep exploring</p>
            <h2>More for your little world.</h2>
          </div>
        </div>
        <div className="related-grid">
          {families
            .filter((item) => item.slug !== slug)
            .slice(0, 3)
            .map((item) => (
              <Link className="related-card" key={item.slug} href={`/products/${item.slug}`}>
                <span className="related-icon">
                  <CategoryArt slug={item.slug} size={36} />
                </span>
                <div>
                  <strong>{item.name}</strong>
                  <span>Explore the collection</span>
                </div>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
