'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Home, ShoppingBag, ShoppingCart, ShieldCheck } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { lang } = useLanguageStore();
  const { toggleCart, getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  // Hide on admin routes to prevent cluttering admin view
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around text-[10px] font-semibold text-slate-600">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition ${
            pathname === '/' ? 'text-brand-600 font-extrabold' : 'hover:text-brand-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
        </Link>

        {/* Shop */}
        <Link
          href="/products"
          className={`flex flex-col items-center gap-1 transition ${
            pathname.startsWith('/products') ? 'text-brand-600 font-extrabold' : 'hover:text-brand-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{lang === 'bn' ? 'পণ্যসমূহ' : 'Shop'}</span>
        </Link>

        {/* Cart Drawer Toggle */}
        <button
          onClick={toggleCart}
          className="flex flex-col items-center gap-1 relative text-slate-600 hover:text-brand-600 transition"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale">
                {cartCount}
              </span>
            )}
          </div>
          <span>{lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
        </button>

        {/* Admin Console */}
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 transition ${
            pathname.startsWith('/admin') ? 'text-brand-600 font-extrabold' : 'hover:text-brand-600'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>{lang === 'bn' ? 'এডমিন' : 'Admin'}</span>
        </Link>
      </div>
    </div>
  );
}
