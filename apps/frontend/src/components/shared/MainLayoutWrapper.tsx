'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MobileBottomNav } from '@/components/shared/MobileBottomNav';
import { ToastNotifier } from '@/components/shared/ToastNotifier';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
        <ToastNotifier />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased pb-14 md:pb-0 font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ToastNotifier />
    </div>
  );
}
