import Image from 'next/image';
import Link from 'next/link';
import { families } from '@/lib/catalog';
import { CategoryArt, Icon, imagePath } from '@/components/playroom/Art';
import CollectionCard from '@/components/playroom/CollectionCard';
import StoreChooser from '@/components/playroom/StoreChooser';

export default function LandingPage() {
  return (
    <div className="route-enter">
      <section className="home-hero" id="hero">
        <div className="container home-hero-grid">
          <div className="home-copy">
            <p className="eyebrow">FNL Playroom Explorer</p>
            <h1>
              A whole little
              <br />
              world of <span className="pink-word">play.</span>
            </h1>
            <p>
              Find a place for every part of childhood. Explore our collections, meet the
              variations, and picture your own little playroom.
            </p>
            <div className="hero-actions">
              <a className="button" href="#collection">
                Explore the collection <Icon name="arrow" size={18} />
              </a>
              <Link className="button secondary" href="/products/party-fence">
                Start with play fences
              </Link>
            </div>
            <div className="small-promise">
              <Icon name="heart" size={15} />
              Made for curious browsing and thoughtful choosing.
            </div>
          </div>
          <div className="home-stage">
            <div className="stage-blob" />
            <div className="stage-main">
              <Image
                src={imagePath('party')}
                alt="Representative FNL Party Fence product photo"
                width={1000}
                height={800}
                priority
                sizes="(max-width: 680px) 90vw, 600px"
              />
              <div className="stage-caption">
                <div>
                  <strong>Make room for imagination.</strong>
                  <span>Explore six product families</span>
                </div>
                <span className="circle-arrow">
                  <Icon name="arrow" size={18} />
                </span>
              </div>
            </div>
            <span className="floating-tag one">
              <span className="tiny-orb">
                <Icon name="spark" size={23} />
              </span>
              A little more play
            </span>
            <span className="floating-tag two">
              <span className="tiny-orb">
                <Icon name="book" size={23} />
              </span>
              A story to discover
            </span>
            <span className="floating-tag three">
              <span className="tiny-orb">
                <CategoryArt slug="storage-rack" size={25} />
              </span>
              A place for everything
            </span>
            <span className="spark one" aria-hidden="true">
              ✳
            </span>
            <span className="spark two" aria-hidden="true">
              ✧
            </span>
          </div>
        </div>
      </section>
      <div className="intro-ribbon">
        <div className="container ribbon-grid">
          {[
            {
              icon: 'compass',
              title: 'Explore six collections',
              body: 'Find the page for your product',
            },
            {
              icon: 'layers',
              title: 'Compare variations',
              body: 'Colors, sets, and configurations',
            },
            { icon: 'bag', title: 'Choose your store', body: 'Confirm your option there' },
          ].map((item) => (
            <div className="ribbon-item" key={item.icon}>
              <Icon name={item.icon} size={27} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="section container" id="collection">
        <span id="featured-products" />
        <div className="section-heading">
          <div>
            <p className="eyebrow">Meet the collections</p>
            <h2>
              Play. Read. Tidy. <span className="pink-word">Repeat.</span>
            </h2>
          </div>
          <p>Every collection has its own page, gallery, details, and space for a closer look.</p>
        </div>
        <div className="category-grid">
          {families.map((family) => (
            <CollectionCard key={family.slug} family={family} />
          ))}
        </div>
      </section>
      <section className="container play-story" id="about-us">
        <div>
          <p className="eyebrow">Faith N Luke Manufacturing Corp.</p>
          <h2>
            Little spaces. <span className="pink-word">Big possibilities.</span>
          </h2>
          <p>
            From play corners to reading nooks, explore FNL Toys from Malolos, Bulacan. Start with
            one collection and make room for more.
          </p>
        </div>
        <div className="story-badges" aria-hidden="true">
          <span>
            <CategoryArt slug="party-fence" size={32} />
          </span>
          <span>
            <CategoryArt slug="carrot-bookshelf" size={32} />
          </span>
          <span>
            <CategoryArt slug="storage-rack" size={32} />
          </span>
        </div>
      </section>
      <section className="section container wholesale-section" id="b2b-wholesale">
        <div>
          <p className="eyebrow">Let’s grow together</p>
          <h2>
            More room for <span className="pink-word">partnership.</span>
          </h2>
          <p>
            Planning a bulk order, retail partnership, or manufacturing inquiry? Message our team
            through an official store with the product, quantity, and delivery location you have in
            mind.
          </p>
        </div>
        <StoreChooser label="Contact an official store" />
      </section>
    </div>
  );
}
