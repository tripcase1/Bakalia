'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Search, ShoppingBag, Heart, User, Globe, Menu, X, PhoneCall, ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const { lang, toggleLang } = useLanguageStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80">
        {/* Top Banner Bar (Compact on mobile) */}
        <div className="bg-brand-700 text-white text-[10px] sm:text-xs py-1 px-4 font-medium flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 container mx-auto">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="line-clamp-1">{lang === 'bn' ? '১০০% ফরমালিন মুক্ত খাঁটি পণ্য' : '100% Formalin Free Organic Produce'}</span>
            </span>
            <span className="hidden md:inline text-brand-200">|</span>
            <span className="hidden md:flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'হটলাইন: +880 1700-000000' : 'Hotline: +880 1700-000000'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 bg-brand-800 hover:bg-brand-900 px-2 py-0.5 rounded transition text-[11px] font-semibold"
            >
              <Globe className="w-3 h-3 text-gold-400" />
              {lang === 'bn' ? 'EN' : 'BN'}
            </button>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Mobile Menu Trigger & Brand Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-slate-700 hover:text-brand-600 p-1.5 rounded-xl hover:bg-slate-100 transition active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="bg-brand-600 text-white p-1.5 sm:p-2 rounded-xl font-black text-base sm:text-xl tracking-wider shadow-md">
                AHF
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-xl leading-none text-slate-900 tracking-tight">
                  Al Hera <span className="text-brand-600">Fresh</span>
                </span>
                <span className="text-[9px] text-slate-500 font-medium tracking-widest uppercase hidden sm:block">
                  {lang === 'bn' ? 'প্রিমিয়াম ই-কমার্স' : 'Organic E-Commerce'}
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'ইলিশ মাছ, কাটিমন আম বা খাঁটি মধু খুঁজুন...' : 'Search Hilsa fish, Katimon mango, Pure honey...'}
              className="w-full pl-9 pr-16 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Link href={`/products?search=${encodeURIComponent(searchQuery)}`} className="absolute right-1 top-1 bottom-1 bg-brand-600 hover:bg-brand-700 text-white px-3 rounded-full text-[11px] font-semibold transition flex items-center">
              {lang === 'bn' ? 'খুঁজুন' : 'Search'}
            </Link>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href="/wishlist" className="relative p-2 text-slate-700 hover:text-brand-600 transition rounded-full hover:bg-slate-100" title="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleCart}
              className="relative bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-full transition flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 border border-brand-200/60"
            >
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {cartCount}
                </span>
              )}
            </button>

            <Link href="/admin/login" className="p-2 text-slate-700 hover:text-brand-600 transition rounded-full hover:bg-slate-100 flex items-center gap-1 text-xs font-semibold" title="Admin Login">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">{lang === 'bn' ? 'লগইন' : 'Login'}</span>
            </Link>
          </div>
        </div>

        {/* Desktop Category Navigation Bar (Hidden on Mobile to save vertical space) */}
        <nav className="hidden md:block bg-slate-900 text-slate-200 text-xs font-medium border-t border-slate-800">
          <div className="container mx-auto px-4 flex items-center space-x-6 py-2.5 whitespace-nowrap overflow-x-auto">
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
      </header>

      {/* Mobile Drawer (High Z-Index z-[70] Portal above all headers and bottom bars) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden flex">
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <div className="relative bg-slate-900 text-white w-4/5 max-w-xs h-full flex flex-col p-5 shadow-2xl z-10 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-brand-600 text-white p-1 rounded-lg font-black text-sm">AHF</div>
                <span className="font-extrabold text-base text-white">Al Hera Fresh</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto space-y-2 text-xs font-semibold">
              <Link 
                href="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-between items-center p-3 rounded-xl bg-brand-600 text-white font-bold shadow-md"
              >
                <span>🔥 {lang === 'bn' ? 'সব পণ্য ব্রাউজ করুন' : 'Browse All Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products?category=fresh-fish" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-200">
                🐟 {lang === 'bn' ? 'মিঠা পানির তাজা মাছ' : 'Fresh Water Fish'}
              </Link>
              <Link href="/products?category=sea-fish" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-200">
                🦐 {lang === 'bn' ? 'সামুদ্রিক মাছ ও রূপচাঁদা' : 'Deep Sea Fish'}
              </Link>
              <Link href="/products?category=dry-fish" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-200">
                🐠 {lang === 'bn' ? 'কক্সবাজারের শুঁটকি' : 'Dry Fish (Shutki)'}
              </Link>
              <Link href="/products?category=mango" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-200">
                🥭 {lang === 'bn' ? 'রাজশাহীর মিষ্টি আম' : 'Rajshahi Mangoes'}
              </Link>
              <Link href="/products?category=honey" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-200">
                🍯 {lang === 'bn' ? 'সুন্দরবনের কাঁচা মধু' : 'Sundarbans Pure Honey'}
              </Link>
              <Link href="/products?category=vegetables" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-200">
                🥦 {lang === 'bn' ? 'ফার্মের তাজা শাকসবজি' : 'Organic Vegetables'}
              </Link>
            </div>

            {/* Auth / Admin Console Button in Mobile Menu */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-bold text-xs transition"
              >
                <LogIn className="w-4 h-4 text-brand-400" />
                <span>{lang === 'bn' ? 'এডমিন প্যানেল লগইন' : 'Admin Console Login'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
