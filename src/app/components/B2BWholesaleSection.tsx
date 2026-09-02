'use client';
import React, { useRef, useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const processSteps = [
  {
    step: 1,
    name: 'Material Sourcing & Safety Screening',
    description:
      'Certified, non-toxic, child-safe plastics, smooth-finished woods, and eco-friendly components — every material is screened before production.',
    icon: 'MagnifyingGlassIcon' as const,
  },
  {
    step: 2,
    name: 'Precision Fabrication',
    description:
      'Advanced moulding, cutting, and structural reinforcement designed specifically to endure active toddler use and years of play.',
    icon: 'WrenchScrewdriverIcon' as const,
  },
  {
    step: 3,
    name: 'Rigorous Quality Control (QC)',
    description:
      'Every batch undergoes manual inspection for sharp edges, load-bearing stability, and chemical safety compliance.',
    icon: 'ClipboardDocumentCheckIcon' as const,
  },
  {
    step: 4,
    name: 'Sustainable Local Packaging & Transport',
    description:
      'Packaged efficiently for bulk transport, minimising transit damage and ensuring ready-to-ship inventory for regional partners.',
    icon: 'TruckIcon' as const,
  },
];

const inquiryTypes = [
  'Wholesale Purchase',
  'Distribution Partnership',
  'Custom Manufacturing / White-Label',
  'Corporate Gifting',
];

export default function B2BWholesaleSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [formState, setFormState] = useState({
    full_name: '',
    company_name: '',
    email: '',
    inquiry_type: '',
    quantity_and_message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeadingVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit handler — connect to backend/formspree here
    setSubmitted(true);
  };

  return (
    <section
      id="b2b-wholesale"
      className="py-16 sm:py-20 bg-foreground text-primary-foreground relative overflow-hidden"
      aria-labelledby="b2b-heading"
    >
      {/* Atmospheric depth */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-full h-full" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 100 C 35 30 65 30 100 100 Z" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,79,0,0.6) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div
          ref={headingRef}
          className={`reveal mb-14 ${headingVisible ? 'reveal-animate' : 'opacity-0'}`}
        >
          <span className="section-label text-white/50 mb-3 block">03 — B2B & WHOLESALE</span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              id="b2b-heading"
              className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight"
            >
              Partner
              <br />
              <span className="italic text-primary">With Us</span>
            </h2>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed sm:text-right">
              Bulk orders, distribution partnerships, white-label manufacturing
              — discover how we build locally in Bulacan.
            </p>
          </div>
        </div>

        {/* Two-column: process steps + form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Manufacturing process */}
          <div>
            <div className="mb-8">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Locally Made Baby Essentials
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Proudly manufactured at our state-of-the-art facility in
                Malolos City, Bulacan — combining strict safety standards with
                dependable local supply chain reliability.
              </p>
            </div>

            {/* Process steps — asymmetric layout, NOT a numbered vertical timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {processSteps.map((step, i) => (
                <ProcessCard key={step.step} step={step} index={i} />
              ))}
            </div>

            {/* Facility contact */}
            <div className="mt-8 p-5 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-xs text-white/40 font-mono mb-3 uppercase tracking-widest">
                Facility & B2B Contact
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Icon name="MapPinIcon" size={14} variant="outline" className="text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-white/70">55 Mighty Road, Tikay, Malolos City, Bulacan</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="EnvelopeIcon" size={14} variant="outline" className="text-primary shrink-0" />
                  <a
                    href="mailto:fnltoys.b2b@email.com"
                    className="text-xs text-white/70 hover:text-white transition-colors"
                  >
                    fnltoys.b2b@email.com
                  </a>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  Responds to wholesale inquiries within 24–48 business hours.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Inquiry form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h3 className="font-display text-2xl font-bold text-white mb-1">
              Send Wholesale Inquiry
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Fill out the form and our team will get back to you within 24–48 business hours.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Icon name="CheckCircleIcon" size={32} variant="solid" className="text-accent" />
                </div>
                <h4 className="font-display text-xl font-bold text-white">Inquiry Sent!</h4>
                <p className="text-sm text-white/60 max-w-xs">
                  Thank you for your interest. Our B2B team will contact you within 24–48 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="B2B wholesale inquiry form">
                <div>
                  <label htmlFor="full_name" className="block text-xs font-semibold text-white/60 mb-1.5">
                    Full Name & Job Title <span className="text-primary">*</span>
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formState.full_name}
                    onChange={handleChange}
                    placeholder="e.g., Maria Santos, Procurement Manager"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-xs font-semibold text-white/60 mb-1.5">
                    Company / Business Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    value={formState.company_name}
                    onChange={handleChange}
                    placeholder="e.g., Early Childhood Learning Center"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-white/60 mb-1.5">
                    Work Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry_type" className="block text-xs font-semibold text-white/60 mb-1.5">
                    Inquiry Type <span className="text-primary">*</span>
                  </label>
                  <select
                    id="inquiry_type"
                    name="inquiry_type"
                    required
                    value={formState.inquiry_type}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-foreground">
                      Select inquiry type...
                    </option>
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type} className="bg-foreground">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity_and_message" className="block text-xs font-semibold text-white/60 mb-1.5">
                    Order Quantity / Project Details <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="quantity_and_message"
                    name="quantity_and_message"
                    required
                    rows={4}
                    value={formState.quantity_and_message}
                    onChange={handleChange}
                    placeholder="Please describe your quantity requirements or partnership scope..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:opacity-90 transition-all duration-300 shimmer-btn relative overflow-hidden flex items-center justify-center gap-2 mt-1"
                >
                  Send Wholesale Inquiry
                  <Icon name="PaperAirplaneIcon" size={16} variant="solid" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: typeof processSteps[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 ${
        visible ? 'reveal-animate' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Icon name={step.icon} size={16} variant="outline" className="text-primary" />
        </div>
        <span className="text-xs font-mono text-white/30 font-semibold">
          STEP {String(step.step).padStart(2, '0')}
        </span>
      </div>
      <h4 className="font-semibold text-white text-sm mb-2">{step.name}</h4>
      <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
    </div>
  );
}