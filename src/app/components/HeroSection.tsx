'use client';
import React, { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const slides = [
{
  id: 'slide-1',
  headline: 'Creating Safe Spaces for Little Explorers to Grow',
  product: 'Playfence',
  src: "/assets/images/12-1788326293586.jpg",
  alt: 'Child playing safely inside a colourful, sturdy play fence in a bright Philippine home — warm natural light, toddler smiling'
},
{
  id: 'slide-2',
  headline: 'Turn Ordinary Days Into Magical Adventures at Home',
  product: 'Ocean Balls',
  src: "https://images.unsplash.com/photo-1646148327678-cfdd17a8d95d",
  alt: 'Toddler laughing and diving into a vibrant pit of colourful crush-proof ocean balls — bright cheerful playroom background'
},
{
  id: 'slide-3',
  headline: 'Inspiring a Lifelong Love for Reading and Clean Rooms',
  product: 'Bookshelf & Storage Rack',
  src: "/assets/images/10-1788326308610.jpg",
  alt: 'Cozy organised children\'s nook with front-facing bookshelf and toy organiser — soft warm lighting, clutter-free room'
}];


const marketplaceLinks = [
{
  platform: 'Shopee',
  label: 'Buy on Shopee',
  href: 'https://shopee.ph/fnl_toys?categoryId=100632&entryPoint=ShopByPDP&itemId=3484639432',
  bg: 'bg-[#EE4D2D]',
  text: 'text-white'
},
{
  platform: 'TikTok',
  label: 'Buy on TikTok',
  href: 'https://tiktok.com/@fnltoys',
  bg: 'bg-foreground',
  text: 'text-background'
},
{
  platform: 'Lazada',
  label: 'Buy on Lazada',
  href: 'https://www.lazada.com.ph/shop/fnl-toys/?spm=a2o4l.pdp_revamp.seller.1.24a51e72uLyMUh&itemId=5242481635&channelSource=pdp',
  bg: 'bg-[#0F146D]',
  text: 'text-white'
}];


export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (idx: number) => {
    setCurrent(idx);
    startInterval();
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="FNL Toys hero">
      
      {/* Slideshow background */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, i) =>
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          i === current ? 'opacity-100' : 'opacity-0'}`
          }
          aria-hidden={i !== current}>
          
            <AppImage
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center" />
          
            {/* Scrim: dark overlay for white text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
          </div>
        )}
      </div>

      {/* Atmospheric depth blobs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 blob-orange pointer-events-none opacity-40" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 blob-green pointer-events-none opacity-30" aria-hidden="true" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Eyebrow label */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-soft" />
          <span className="section-label text-white/90 font-medium tracking-widest">
            Proudly Made in Bulacan, Philippines
          </span>
        </div>

        {/* Massive display headline */}
        <h1 className="font-display text-hero-display font-bold leading-none tracking-tight text-white mb-8 animate-scale-in">
          FNL
          <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Toys</span>
        </h1>

        {/* Slide headline — transitions with slide */}
        <div className="relative h-16 sm:h-12 mb-4 overflow-hidden">
          {slides.map((slide, i) =>
          <p
            key={slide.id}
            className={`absolute inset-0 text-white/90 text-base sm:text-lg font-medium leading-snug max-w-md transition-all duration-700 ${
            i === current ?
            'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`
            }>
            
              {slide.headline}
            </p>
          )}
        </div>

        {/* Subtitle */}
        <p className="text-white/70 text-sm sm:text-base font-normal max-w-sm mb-10 leading-relaxed">
          Safe, durable, and thoughtfully crafted essentials built for your
          family&apos;s precious moments.
        </p>

        {/* Marketplace CTA buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {marketplaceLinks.map((m, idx) =>
          <a
            key={m.platform}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-xl shimmer-btn relative overflow-hidden shadow-lg ${m.bg} ${m.text} animate-fade-in`}
            style={{ animationDelay: `${idx * 100}ms` }}>
            
              {m.label}
            </a>
          )}
        </div>

        {/* Slide dots */}
        <div className="flex items-center gap-2">
          {slides.map((slide, i) =>
          <button
            key={slide.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}: ${slide.product}`}
            className={`transition-all duration-300 rounded-full ${
            i === current ?
            'w-8 h-2 bg-primary' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`
            } />

          )}
          <span className="ml-3 text-white/50 text-xs font-mono">
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Bottom wave SVG */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto">
          
          <path
            fill="#FFFDF9"
            d="M0,48L60,42.7C120,37,240,27,360,32C480,37,600,59,720,64C840,69,960,59,1080,48C1200,37,1320,27,1380,21.3L1440,16L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z" />
          
        </svg>
      </div>
    </section>);

}