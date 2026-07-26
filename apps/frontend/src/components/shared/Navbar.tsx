'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Search, ShoppingBag, Heart, User, Globe, Menu, X, PhoneCall, ShieldCheck } from 'lucide-react';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const { lang, toggleLang } = useLanguageStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Banner Bar */}
      <div className="bg-brand-700 text-white text-xs py-1.5 px-4 font-medium flex justify-between items-center">
        <div className="flex items-center space-x-3 container mx-auto">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            {lang === 'bn' ? '১০০% ফরমালিন ও কেমিক্যাল মুক্ত পণ্য' : '100% Formalin & Chemical Free Products'}
          </span>
          <span className="hidden md:inline text-brand-200">|</span>
          <span className="hidden md:flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'হটলাইন: +880 1700-000000' : 'Hotline: +880 1700-000000'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 bg-brand-800 hover:bg-brand-900 px-2 py-0.5 rounded transition text-xs font-semibold"
          >
            <Globe className="w-3 h-3 text-gold-400" />
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>
        </div>
      </div>

      {/* Main Glass Navigation Header */}
      <div className="glass-header border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-slate-700 hover:text-brand-600 p-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-brand-600 text-white p-2 rounded-xl font-black text-xl tracking-wider shadow-md">
                AHF
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-none text-slate-900 tracking-tight">
                  Al Hera <span className="text-brand-600">Fresh</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                  {lang === 'bn' ? 'প্রিমিয়াম ই-কমার্স' : 'Organic E-Commerce'}
                </span>
              </div>
            </Link>
          </div>

          {/* Live Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'ইলিশ মাছ, কাটিমন আম বা খাঁটি মধু খুঁজুন...' : 'Search Hilsa fish, Katimon mango, Pure honey...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <button className="absolute right-1 top-1 bottom-1 bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-full text-xs font-semibold transition">
              {lang === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </div>

          {/* Actions (Wishlist, Cart, User Account) */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/wishlist" className="relative p-2 text-slate-700 hover:text-brand-600 transition">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleCart}
              className="relative p-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-full transition flex items-center gap-2 font-semibold text-xs px-3 py-2 border border-brand-200/50"
            >
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="bg-brand-600 text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <Link href="/dashboard" className="p-2 text-slate-700 hover:text-brand-600 transition">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Category Navigation Ribbon */}
        <nav className="bg-slate-900 text-slate-200 text-xs font-medium overflow-x-auto border-t border-slate-800">
          <div className="container mx-auto px-4 flex items-center space-x-6 py-2.5 whitespace-nowrap">
            <Link href="/products" className="text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1">
              🔥 {lang === 'bn' ? 'সব পণ্য' : 'All Products'}
            </Link>
            <Link href="/products?category=fresh-fish" className="hover:text-brand-400 transition">
              🐟 {lang === 'bn' ? 'মিঠা পানির মাছ' : 'Fresh Fish'}
            </Link>
            <Link href="/products?category=sea-fish" className="hover:text-brand-400 transition">
              🦐 {lang === 'bn' ? 'সামুদ্রিক মাছ' : 'Sea Fish'}
            </Link>
            <Link href="/products?category=dry-fish" className="hover:text-brand-400 transition">
              🐠 {lang === 'bn' ? 'শুঁটকি মাছ' : 'Dry Fish'}
            </Link>
            <Link href="/products?category=mango" className="hover:text-brand-400 transition">
              🥭 {lang === 'bn' ? 'রাজশাহীর আম' : 'Mango'}
            </Link>
            <Link href="/products?category=honey" className="hover:text-brand-400 transition">
              🍯 {lang === 'bn' ? 'সুন্দরবনের মধু' : 'Pure Honey'}
            </Link>
            <Link href="/products?category=vegetables" className="hover:text-brand-400 transition">
              🥦 {lang === 'bn' ? 'তাজা শাকসবজি' : 'Vegetables'}
            </Link>
          </div>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
