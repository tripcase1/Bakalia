import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

// Drop Geist_Mono — not used in UI, saves ~30KB
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const BASE_URL = "https://bakalia.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Bakalia Community Portal — Smart Community Operating System",
    template: "%s | Bakalia Community Portal",
  },
  description:
    "A digital bridge connecting Bakalia citizens, Ward Councilors, and local Thana Police. View prayer times, report civic issues, submit tenant forms, check blood donors, and view emergency details.",
  keywords: [
    "Bakalia", "বাকলিয়া", "Chattogram", "Chittagong City Corporation",
    "Smart Community", "Citizen Portal", "Bakalia Police", "Ward 17", "Ward 18", "Ward 19",
    "নাগরিক সেবা", "জরুরি সেবা", "রক্তদান", "মসজিদ",
  ],
  authors: [{ name: "Bakalia Municipal Council", url: BASE_URL }],
  creator: "Bakalia Municipal Council",
  publisher: "Bakalia Community Portal",
  category: "Government & Community",
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Bakalia Community Portal",
    title: "Bakalia Community Portal — Smart Community Operating System",
    description:
      "Digital operating system connecting Bakalia citizens, Ward Councilors, and Thana Police.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Bakalia Community Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bakalia Community Portal",
    description: "Smart community platform for Bakalia, Chattogram.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google7c1cc9d9a077a42e",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1F5F9" },
    { media: "(prefers-color-scheme: dark)",  color: "#010818" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${notoSansBengali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />

        {/* Leaflet CSS — only needed on /map, loaded lazily via dynamic import */}
        {/* Prefetch critical pages */}
        <link rel="prefetch" href="/emergency" as="document" />
        <link rel="prefetch" href="/police" as="document" />
        <link rel="prefetch" href="/blood" as="document" />

        {/* RSS autodiscovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Bakalia Community Portal RSS Feed"
          href="/rss.xml"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              name: "Bakalia Community Portal",
              url: BASE_URL,
              logo: `${BASE_URL}/icon-192.png`,
              description:
                "Smart community platform for Bakalia, Chattogram connecting citizens with local government and police.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bakalia",
                addressRegion: "Chattogram",
                addressCountry: "BD",
              },
              sameAs: [BASE_URL],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <AppProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
