import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const quickLinks = [
  { label: 'Shopee Official Store', href: 'https://shopee.ph/fnl_toys?categoryId=100632&entryPoint=ShopByPDP&itemId=19595045327' },
  { label: 'TikTok Official Shop',  href: 'https://www.tiktok.com/@fnltoys?fbclid=IwY2xjawUEldBwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMU9JWm1HaTVJT3o4c2NqOXFzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe0cOOgcPVmEYiHgNEI-6mVaqy1Vk_KCo3-kII3YL1E9D03cCntKhIafV4WiM_aem_hDZIcRWLPPTyS9mYArlKVg' },
  { label: 'Lazada Official Store', href: 'https://www.lazada.com.ph/shop/fnl-toys/?spm=a2o4l.pdp_revamp.seller.1.68e35df942b4gp&itemId=4339751833&channelSource=pdp' },
  { label: 'Privacy Policy',        href: '#' },
  { label: 'Terms',                 href: '#' },
];

const socials = [
  { platform: 'Facebook',  href: 'https://facebook.com/fnltoys',  icon: 'GlobeAltIcon' as const },
  { platform: 'Instagram', href: 'https://instagram.com/fnltoys', icon: 'CameraIcon' as const },
  { platform: 'TikTok',    href: 'https://tiktok.com/@fnltoys',   icon: 'VideoCameraIcon' as const },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-border bg-background pt-14 pb-10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Arc Pattern 7 — logo/tagline left, links right */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10 mb-10">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2">
              <AppLogo size={32} />
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                FNL Toys
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Safe, locally-made kids&apos; play gear.
              <br />
              Proudly manufactured in Bulacan, Philippines.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              55 Mighty Road, Tikay, Malolos City, Bulacan
            </p>
          </div>

          {/* Right: Links + socials */}
          <div className="flex flex-col sm:items-end gap-5">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {quickLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Icon name={s.icon} size={18} variant="outline" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2026 FNL Toys · Faith N Luke Manufacturing Corp. All rights reserved.</p>
          <p>Made with care in Bulacan, Philippines 🇵🇭</p>
        </div>
      </div>
    </footer>
  );
}