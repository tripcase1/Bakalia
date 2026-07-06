"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import SosOverlay from "@/components/SosOverlay";

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
