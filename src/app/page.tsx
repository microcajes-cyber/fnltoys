import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import FeaturedProducts from '@/app/components/FeaturedProducts';
import BrandTrustSection from '@/app/components/BrandTrustSection';
import B2BWholesaleSection from '@/app/components/B2BWholesaleSection';

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      {/* Global noise texture */}
      <div
        className="fixed inset-0 noise-overlay pointer-events-none z-50 mix-blend-multiply"
        aria-hidden="true"
      />
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <BrandTrustSection />
      <B2BWholesaleSection />
      <Footer />
    </main>
  );
}