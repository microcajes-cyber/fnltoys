'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Collection } from '@/lib/catalog';
import { Brand, CategoryArt, Icon } from './Art';
import StoreChooser, { stores } from './StoreChooser';
import Welcome from './Welcome';

export default function PlayroomShell({
  collections,
  children,
}: {
  collections: Collection[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [motion, setMotion] = useState(false);
  const [intro, setIntro] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const explicitMotion = useRef(false);
  const previousPath = useRef(pathname);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeIntro = useCallback(() => setIntro(false), []);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    setMotion(!query.matches);
    let seen = false;
    try {
      seen = sessionStorage.getItem('fnl-playroom-welcome-v1') === '1';
      sessionStorage.setItem('fnl-playroom-welcome-v1', '1');
    } catch {
      /* Browsing works with storage disabled. */
    }
    if (!seen && !query.matches) setIntro(true);
    const update = () => {
      setReducedMotion(query.matches);
      if (!explicitMotion.current) setMotion(!query.matches);
      if (query.matches) setIntro(false);
    };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion && !reducedMotion ? 'on' : 'off';
  }, [motion, reducedMotion]);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      setMenu(false);
      setIntro(false);
      previousPath.current = pathname;
    }
    document.body.classList.toggle('has-category', pathname.startsWith('/products/'));
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menu]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="review-strip" aria-label="Browsing preferences">
        <div className="review-copy">
          <strong>A little world of play</strong>
          <span>Confirm current options in our official stores</span>
        </div>
        <div className="review-actions">
          <button
            type="button"
            className="review-button"
            aria-pressed={motion}
            onClick={() => {
              explicitMotion.current = true;
              setMotion((value) => !value);
              setIntro(false);
            }}
          >
            <Icon name="motion" size={15} />
            Motion {motion ? 'on' : 'off'}
          </button>
          <button
            type="button"
            className="review-button"
            aria-label="Replay the welcome intro"
            onClick={() => setIntro(true)}
          >
            <Icon name="spark" size={15} />
            Replay intro
          </button>
        </div>
      </aside>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="FNL Toys home">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link className="nav-link" href="/">
              Discover
            </Link>
            <Link className="nav-link" href="/#collection">
              Collections
            </Link>
            <Link className="nav-link" href="/#b2b-wholesale">
              Wholesale
            </Link>
            <StoreChooser label="Official stores" className="button header-shop" />
          </nav>
          <button
            ref={menuButton}
            type="button"
            className="mobile-menu-toggle"
            aria-controls="mobile-nav"
            aria-expanded={menu}
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenu((value) => !value)}
          >
            <Icon name={menu ? 'close' : 'menu'} size={23} />
          </button>
        </div>
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!menu}>
          <div className="mobile-nav-grid">
            <Link href="/" onClick={() => setMenu(false)}>
              Discover
            </Link>
            <Link href="/#b2b-wholesale" onClick={() => setMenu(false)}>
              Wholesale
            </Link>
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/products/${collection.slug}`}
                aria-current={pathname === `/products/${collection.slug}` ? 'page' : undefined}
                onClick={() => setMenu(false)}
              >
                <CategoryArt slug={collection.slug} size={27} />
                {collection.name}
              </Link>
            ))}
          </div>
          <StoreChooser label="Official stores" className="button wide" />
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer id="contact" className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link className="brand" href="/" aria-label="FNL Toys home">
                <Brand />
              </Link>
              <p>
                A place for every kind of play.
                <br />
                Faith N Luke Manufacturing Corp.
                <br />
                55 Mighty Road, Tikay, Malolos City, Bulacan
              </p>
            </div>
            <nav className="footer-links" aria-label="Product collections">
              {collections.map((collection) => (
                <Link key={collection.slug} href={`/products/${collection.slug}`}>
                  {collection.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-store-links">
            {stores.map((store) => (
              <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer">
                {store.name} official store <Icon name="external" size={14} />
              </a>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 FNL Toys · Faith N Luke Manufacturing Corp.</span>
            <span>Make room for imagination.</span>
          </div>
        </div>
      </footer>
      <Welcome open={intro} motion={motion && !reducedMotion} onClose={closeIntro} />
    </>
  );
}
