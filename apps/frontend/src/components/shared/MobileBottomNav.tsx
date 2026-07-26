'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Home, Store, ShoppingBag, Heart, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { lang } = useLanguageStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around text-[10px] font-semibold text-slate-600">
      <Link
        href="/"
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
          pathname === '/' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
      </Link>

      <Link
        href="/products"
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
          pathname.startsWith('/products') ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
        }`}
      >
        <Store className="w-5 h-5 mb-0.5" />
        <span>{lang === 'bn' ? 'বাজার' : 'Shop'}</span>
      </Link>

      <button
        onClick={toggleCart}
        className="flex flex-col items-center py-1 px-3 rounded-xl hover:text-brand-600 relative transition"
      >
        <ShoppingBag className="w-5 h-5 mb-0.5 text-brand-600" />
        <span>{lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 bg-brand-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      <Link
        href="/wishlist"
        className={`flex flex-col items-center py-1 px-3 rounded-xl relative transition ${
          pathname === '/wishlist' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
        }`}
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span>{lang === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-2 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        href="/dashboard"
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
          pathname === '/dashboard' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>{lang === 'bn' ? 'প্রোফাইল' : 'Account'}</span>
      </Link>
    </nav>
  );
}
