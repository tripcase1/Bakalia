import type { Metadata } from 'next';
import './globals.css';
import { MainLayoutWrapper } from '@/components/shared/MainLayoutWrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://alherafresh.com'),
  title: {
    default: 'Al Hera Fresh | 100% Organic Hilsa Fish, Rajshahi Mangoes & Pure Honey Bangladesh',
    template: '%s | Al Hera Fresh',
  },
  description: 'Al Hera Fresh is the leading organic e-commerce store in Bangladesh for Padma River Hilsa Fish, Deep Sea Pomfret, Rajshahi Katimon Mangoes, and Sundarbans Wild Honey.',
  keywords: [
    'Padma Hilsa Fish',
    'Ilish Fish Price Bangladesh',
    'Rajshahi Katimon Mango',
    'Sundarban Honey',
    'Formalin Free Fish Dhaka',
    'Al Hera Fresh',
    'Organic E-commerce Bangladesh',
  ],
  openGraph: {
    title: 'Al Hera Fresh | Premium Organic Fresh Fish & Fruit Online',
    description: 'Directly sourced Padma River Hilsa, Rajshahi Mangoes, and Sundarbans Honey with 24h express delivery.',
    url: 'https://alherafresh.com',
    siteName: 'Al Hera Fresh',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Al Hera Fresh Padma Hilsa',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Hera Fresh | Premium Organic Fresh Fish',
    description: '100% Formalin-free Padma Hilsa & Sundarban Honey.',
    images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=1200&auto=format&fit=crop'],
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'Al Hera Fresh',
  url: 'https://alherafresh.com',
  description: 'Premium organic e-commerce store for Padma Hilsa, Sea Fish, Rajshahi Mangoes, and Sundarbans Honey.',
  telephone: '+8801700000000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dhanmandi 32',
    addressLocality: 'Dhaka',
    addressCountry: 'BD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}
