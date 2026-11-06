import type { Metadata, Viewport } from 'next';
import { collections, SITE_URL } from '@/lib/catalog';
import PlayroomShell from '@/components/playroom/PlayroomShell';
import '../styles/tailwind.css';
import '../styles/playroom.css';

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#edf8ff' };
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'FNL Toys · A Little World of Play',
  description:
    'Explore FNL Toys play fences, ocean balls, bookshelves, and storage racks. Compare recorded options and shop through our official Philippine stores.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FNL Toys · A Little World of Play',
    description: 'Play. Read. Tidy. Repeat. Explore six FNL Toys collections.',
    url: '/',
    type: 'website',
    locale: 'en_PH',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH">
      <body>
        <PlayroomShell collections={collections}>{children}</PlayroomShell>
        <script
          type="module"
          async
          src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ffnltoys5044back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20"
        />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}
