'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Headset, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const { lang } = useLanguageStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Features Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {lang === 'bn' ? '১০০% খাঁটি পণ্য' : '100% Organic & Pure'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ফরমালিন ও কেমিক্যাল মুক্ত' : 'Chemical-free guaranteed'}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {lang === 'bn' ? 'দ্রুত ডেলিভারি' : 'Express Delivery'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ঢাকার ভিতরে ২৪ ঘণ্টার মধ্যে' : 'Within 24h in Dhaka city'}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {lang === 'bn' ? 'সহজ রিটার্ন পলিসি' : 'Easy Return Policy'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'পণ্য পছন্দ না হলে তাৎক্ষণিক পরিবর্তন' : 'Instant return on delivery'}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {lang === 'bn' ? '২৪/৭ কাস্টমার সাপোর্ট' : '24/7 Support'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? '+৮৮০ ১৭০০-০০০০০০' : '+880 1700-000000'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 text-white p-2 rounded-xl font-black text-xl">AHF</div>
              <span className="font-extrabold text-xl text-white">Al Hera <span className="text-brand-400">Fresh</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn' 
                ? 'পদ্মার তাজা ইলিশ, সুস্বাদু সামুদ্রিক মাছ, শুঁটকি, রাজশাহীর আম এবং সুন্দরবনের খাঁটি মধুর বিশ্বাসযোগ্য অনলাইন প্ল্যাটফর্ম।'
                : 'Your most trusted fresh e-commerce platform for Padma Hilsa, deep-sea fish, Rajshahi mangoes, and wild Sundarban honey.'}
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=fresh-fish" className="hover:text-brand-400 transition">{lang === 'bn' ? 'পদ্মার ইলিশ ও মিঠা পানির মাছ' : 'Fresh Water Fish & Hilsa'}</Link></li>
              <li><Link href="/products?category=sea-fish" className="hover:text-brand-400 transition">{lang === 'bn' ? 'সামুদ্রিক রূপচাঁদা ও চিংড়ি' : 'Deep Sea Fish & Shrimp'}</Link></li>
              <li><Link href="/products?category=mango" className="hover:text-brand-400 transition">{lang === 'bn' ? 'রাজশাহীর কেমিক্যালমুক্ত আম' : 'Rajshahi Organic Mangoes'}</Link></li>
              <li><Link href="/products?category=honey" className="hover:text-brand-400 transition">{lang === 'bn' ? 'সুন্দরবনের খাঁটি কাঁচা মধু' : 'Sundarbans Wild Honey'}</Link></li>
              <li><Link href="/products?category=dry-fish" className="hover:text-brand-400 transition">{lang === 'bn' ? 'কক্সবাজারের বিষমুক্ত শুঁটকি' : 'Cox\'s Bazar Dry Fish'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{lang === 'bn' ? 'গুরুত্বপূর্ণ লিঙ্ক' : 'Quick Links'}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-brand-400 transition">{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</Link></li>
              <li><Link href="/blog" className="hover:text-brand-400 transition">{lang === 'bn' ? 'ব্লগ ও অর্গানিক টিপস' : 'Blog & Organic Tips'}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400 transition">{lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}</Link></li>
              <li><Link href="/terms" className="hover:text-brand-400 transition">{lang === 'bn' ? 'শর্তাবলী ও পলিসি' : 'Terms & Conditions'}</Link></li>
              <li><Link href="/admin" className="hover:text-gold-400 transition font-semibold">{lang === 'bn' ? 'এডমিন প্যানেল' : 'Admin Panel'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Methods'}</h4>
            <p className="text-xs text-slate-400 mb-3">
              {lang === 'bn' ? 'আমরা বিকাশ, নগদ, রকেট এবং ক্যাশ অন ডেলিভারি সাপোর্ট করি।' : 'We support bKash, Nagad, Rocket, and Cash on Delivery.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-pink-900/60 text-pink-300 font-bold text-[11px] rounded border border-pink-700/50">bKash</span>
              <span className="px-2.5 py-1 bg-orange-900/60 text-orange-300 font-bold text-[11px] rounded border border-orange-700/50">Nagad</span>
              <span className="px-2.5 py-1 bg-purple-900/60 text-purple-300 font-bold text-[11px] rounded border border-purple-700/50">Rocket</span>
              <span className="px-2.5 py-1 bg-emerald-900/60 text-emerald-300 font-bold text-[11px] rounded border border-emerald-700/50">COD</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Al Hera Fresh. All rights reserved. Built for enterprise performance.</p>
        </div>
      </div>
    </footer>
  );
}
