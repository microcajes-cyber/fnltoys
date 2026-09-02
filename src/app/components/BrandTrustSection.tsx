'use client';
import React, { useRef, useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const trustBadges = [
{
  id: 'non-toxic',
  title: '100% Non-Toxic & Child-Safe',
  description: 'Strictly tested for chemical and physical safety standards. Every product is safe for children aged 0 and above.',
  icon: 'ShieldCheckIcon' as const,
  color: 'text-accent',
  bg: 'bg-accent/10'
},
{
  id: 'local-made',
  title: 'Locally Manufactured in Bulacan',
  description: 'Proudly Philippine-made at our Malolos City facility with reliable domestic inventory and fast local supply.',
  icon: 'BuildingOffice2Icon' as const,
  color: 'text-primary',
  bg: 'bg-primary/10'
},
{
  id: 'fast-dispatch',
  title: 'Fast Local Dispatch',
  description: 'Quick order processing and reliable transport nationwide. Most Metro Manila orders arrive within 1–3 days.',
  icon: 'TruckIcon' as const,
  color: 'text-accent',
  bg: 'bg-accent/10'
},
{
  id: 'verified-seller',
  title: 'Verified Marketplace Seller',
  description: 'Trusted by thousands of Filipino families across Shopee, TikTok Shop, and Lazada with consistent 4.8+ star ratings.',
  icon: 'StarIcon' as const,
  color: 'text-primary',
  bg: 'bg-primary/10'
}];


function TrustBadge({ badge, index }: {badge: typeof trustBadges[0];index: number;}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) {setVisible(true);observer.disconnect();}},
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal flex flex-col gap-3 p-5 sm:p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 ${
      visible ? 'reveal-animate' : 'opacity-0'}`
      }
      style={{ animationDelay: `${index * 80}ms` }}>
      
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${badge.bg} shadow-sm`}>
        <Icon name={badge.icon} size={22} variant="outline" className={badge.color} />
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-1">{badge.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
      </div>
    </div>);

}

export default function BrandTrustSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const targets = [
    { ref: headingRef, setter: setHeadingVisible },
    { ref: imageRef, setter: setImageVisible }];

    const observers = targets.map(({ ref, setter }) => {
      const el = ref.current;
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {if (entry.isIntersecting) {setter(true);observer.disconnect();}},
        { threshold: 0.15 }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section
      id="about-us"
      className="py-16 sm:py-20 bg-muted relative overflow-hidden"
      aria-labelledby="trust-heading">
      
      {/* Atmospheric blob */}
      <div className="absolute -top-24 -right-24 w-96 h-96 blob-orange opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <span className="section-label text-primary mb-3 block">02 — OUR STORY</span>

        {/* Asymmetric 60/40 split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Left: Brand story (60%) */}
          <div
            ref={headingRef}
            className={`lg:col-span-3 reveal ${headingVisible ? 'reveal-animate' : 'opacity-0'}`}>
            
            <h2
              id="trust-heading"
              className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-6">
              
              Why Parents &
              <br />
              <span className="italic text-primary">Retailers Choose</span>
              <br />
              FNL Toys
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
              At FNL Toys, we are dedicated to creating functional, high-quality
              kids&apos; furniture and play equipment that keeps homes organised
              while inspiring children&apos;s imagination and safe play.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
              { value: '5,000+', label: 'Happy Families' },
              { value: '4.8★', label: 'Avg. Rating' },
              { value: '100%', label: 'Non-Toxic' }].
              map((stat) =>
              <div key={stat.label} className="text-center p-4 bg-card rounded-xl border border-border">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              )}
            </div>

            {/* Image — lifestyle photo */}
            <div
              ref={imageRef}
              className={`reveal relative rounded-2xl overflow-hidden aspect-[16/9] ${
              imageVisible ? 'reveal-animate' : 'opacity-0'}`
              }>
              
              <AppImage
                src="/assets/images/ElevenLabs_image_gpt-image-1-5_Create_me_an..._2026-03-27T10_05_16-1788325991587.png"
                alt="Filipino mother and toddler playing together with FNL Toys products — bright, warm home environment in the Philippines"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 hover:scale-105" />
              
              {/* Fig label */}
              <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-mono border border-border rounded">
                Fig. 01 — Safe Play
              </div>
            </div>
          </div>

          {/* Right: Trust badges (40%) */}
          {/* BENTO GRID AUDIT:
               Array: [NonToxic, LocalMade, FastDispatch, VerifiedSeller]
               Row 1: [NonToxic cs-1] [LocalMade cs-1]
               Row 2: [FastDispatch cs-1] [VerifiedSeller cs-1]
               Placed 4/4 ✓
            */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {trustBadges.map((badge, i) =>
            <TrustBadge key={badge.id} badge={badge} index={i} />
            )}
          </div>
        </div>
      </div>
    </section>);

}