'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const navLinks = [
  { label: 'Shop Best-Sellers',        href: '#featured-products' },
  { label: 'Our Story',                href: '#about-us' },
  { label: 'Wholesale & Manufacturing',href: '#b2b-wholesale' },
  { label: 'Contact Us',               href: '#contact' },
];

export default function Header() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-warm shadow-sm border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2 group">
            <AppLogo
              size={36}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-xl font-bold tracking-tight text-foreground hidden sm:block">
              FNL TOYS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navLinks?.map((link) => (
              <a
                key={link?.href}
                href={link?.href}
                className="hover:text-foreground transition-colors duration-200"
              >
                {link?.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#featured-products"
            className="hidden md:inline-flex items-center gap-2 bg-[#007FFF] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:shadow-lg shimmer-btn relative overflow-hidden"
          >
            Shop Official Stores
          </a>

          {/* Mobile Hamburger */}
          <button
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span
              className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-foreground transition-opacity duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-6 text-center">
          {navLinks?.map((link) => (
            <a
              key={link?.href}
              href={link?.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-2xl font-semibold italic text-foreground hover:text-primary transition-colors"
            >
              {link?.label}
            </a>
          ))}
          <a
            href="#featured-products"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-semibold tracking-wide shimmer-btn relative overflow-hidden"
          >
            Shop Official Stores
          </a>
        </nav>
      </div>
    </>
  );
}