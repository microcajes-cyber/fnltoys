import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat, Fraunces } from 'next/font/google';
import '../styles/tailwind.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'FNL Toys — Safe, Locally Made Kids Play Gear',
  description:
    'FNL Toys crafts non-toxic, durable children\'s play fences, ocean balls, bookshelves, and storage racks — proudly manufactured in Bulacan, Philippines.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${fraunces.variable}`}>
      <body className={fraunces.className}>
        {children}

<script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ffnltoys5044back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
<script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}