'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export function HeroBanner() {
  const { lang } = useLanguageStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 text-white py-10 lg:py-16">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Column: Content */}
        <div className="space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>{lang === 'bn' ? '১০০% তাজা ও কেমিক্যাল মুক্ত অনলাইন বাজার' : '100% Organic & Chemical Free Online Market'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {lang === 'bn' ? (
              <>
                পদ্মার তাজা <span className="text-brand-400 underline decoration-gold-500 decoration-wavy decoration-2">ইলিশ</span>, আম ও খাঁটি মধুর সেরা বিশ্বাসী ব্র্যান্ড
              </>
            ) : (
              <>
                Fresh Padma <span className="text-brand-400">Hilsa</span>, Mangoes & Pure Sundarban Honey
              </>
            )}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {lang === 'bn' 
              ? 'সরাসরি নদী ও বাগান থেকে সংগৃহীত। ঢাকা মেট্রোতে সর্বোচ্চ ২৪ ঘণ্টার মধ্যে হোম ডেলিভারি।'
              : 'Directly sourced from river waters & organic orchards. 24h express home delivery in Dhaka.'}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/products"
              className="bg-brand-600 hover:bg-brand-500 text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-brand-600/30 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>{lang === 'bn' ? 'এখনই কেনাকাটা করুন' : 'Shop Fresh Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=fresh-fish"
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition"
            >
              {lang === 'bn' ? 'পদ্মার ইলিশ দেখুন' : 'Browse Hilsa Fish'}
            </Link>
          </div>

          {/* Quick Features List */}
          <div className="pt-3 flex flex-wrap justify-center lg:justify-start gap-5 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              {lang === 'bn' ? 'তাৎক্ষণিক ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              {lang === 'bn' ? 'বিকাশ/নগদে সহজ পেমেন্ট' : 'bKash/Nagad Support'}
            </span>
          </div>
        </div>

        {/* Right Column: Hero Visual Card */}
        <div className="relative">
          <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/60 p-2.5">
            <img
              src="https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=700&auto=format&fit=crop"
              alt="Fresh Hilsa Fish"
              loading="eager"
              decoding="async"
              className="w-full h-72 sm:h-80 object-cover rounded-2xl"
            />
            {/* Flash Banner Overlay */}
            <div className="absolute top-5 left-5 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'আজকের স্পেশাল অফার' : 'Today Special Deal'}
            </div>
            
            <div className="p-3.5 flex items-center justify-between text-left">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  {lang === 'bn' ? 'পদ্মার তাজা প্রিমিয়াম ইলিশ' : 'Padma Fresh Premium Hilsa'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? '১.২ - ১.৫ কেজি সাইজ | ফরমালিন মুক্ত' : '1.2kg - 1.5kg | Formalin Free'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] line-through text-slate-400">৳ ১৮৫০</span>
                <p className="text-base sm:text-lg font-black text-gold-400">৳ ১৬৯০</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
