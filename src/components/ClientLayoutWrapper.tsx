"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });
const SosOverlay = dynamic(() => import("@/components/SosOverlay"), { ssr: false });

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <SearchModal />
      <AuthModal />
      <SosOverlay />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
