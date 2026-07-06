"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, authLoading } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user is authorized for admin panel
    const isAuthorized = role === "super_admin" || role === "admin";
    if (!isAuthorized) {
      router.push("/");
      return;
    }

    // Check 2FA for super admin
    if (adminEmail && user.email === adminEmail) {
      const verified = localStorage.getItem("admin_2fa_verified");
      if (verified !== "true") {
        router.push("/login");
      }
    }
  }, [user, role, authLoading, router, adminEmail, mounted]);

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#090D16]">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-[#0CA671] animate-spin" />
      </div>
    );
  }

  if (!user || (role !== "super_admin" && role !== "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#090D16] p-6 text-center">
        <div className="max-w-md p-8 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This dashboard panel requires super admin or admin credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <div className="flex flex-1 relative md:overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-grow flex flex-col min-h-screen md:h-screen md:overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="p-4 md:p-6 w-full max-w-7xl mx-auto flex-grow flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
