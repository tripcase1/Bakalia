import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bakalia Community Portal - Smart Community Operating System",
  description: "A digital bridge connecting Bakalia citizens, Ward Councilors, and local Thana Police. View prayer times, report civic issues, submit tenant forms, check blood donors, and view emergency details.",
  keywords: ["Bakalia", "Chattogram", "Chittagong City Corporation", "Smart Community", "Citizen Portal", "Bakalia Police", "Ward 17", "Ward 18", "Ward 19"],
  authors: [{ name: "Bakalia Municipal Council" }],
  openGraph: {
    title: "Bakalia Smart Community Portal",
    description: "Digital operating system connecting Bakalia citizens and administrative units.",
    url: "https://bakalia-ctg.firebaseapp.com",
    siteName: "Bakalia Smart Portal",
    type: "website"
  }
};

import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="anonymous" 
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
