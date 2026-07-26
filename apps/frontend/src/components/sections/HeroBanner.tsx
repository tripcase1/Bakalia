'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export function HeroBanner() {
  const { lang } = useLanguageStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white py-4 sm:py-8 lg:py-16">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Mobile Top Visual Feature Card (< lg screens) */}
        <div className="lg:hidden mb-4">
          <Link
            href="/products/padma-river-hilsa-ilish"
            className="block relative rounded-2xl overflow-hidden border border-brand-500/30 bg-slate-900 shadow-xl group"
          >
            <div className="relative h-44 sm:h-56 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=700&auto=format&fit=crop"
                alt="Fresh Hilsa Fish"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Badge */}
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lang === 'bn' ? 'আজকের স্পেশাল অফার' : 'Today Special Deal'}
              </span>

              {/* Offer overlay text */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                    {lang === 'bn' ? 'পদ্মার তাজা প্রিমিয়াম ইলিশ' : 'Padma Fresh Premium Hilsa'}
                  </h3>
                  <p className="text-[10px] text-brand-300 font-semibold mt-0.5">
                    {lang === 'bn' ? '১.২ - ১.৫ কেজি | ১০০% কেমিক্যাল মুক্ত' : '1.2–1.5kg | 100% Formalin Free'}
                  </p>
                </div>
                <div className="text-right shrink-0 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-800">
                  <span className="text-[9px] line-through text-slate-400 block">৳ ২২০০</span>
                  <span className="text-xs font-black text-brand-400">৳ ১৯৫০</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Content */}
          <div className="space-y-3 sm:space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-[10px] sm:text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'bn' ? '১০০% তাজা ও কেমিক্যাল মুক্ত অনলাইন বাজার' : '100% Organic & Chemical Free Market'}</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
              {lang === 'bn' ? (
                <>
                  পদ্মার তাজা <span className="text-brand-400 underline decoration-gold-500 decoration-wavy decoration-2">ইলিশ</span>, আম ও খাঁটি মধু
                </>
              ) : (
                <>
                  Fresh Padma <span className="text-brand-400">Hilsa</span>, Mangoes & Pure Honey
                </>
              )}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {lang === 'bn' 
                ? 'সরাসরি নদী ও বাগান থেকে সংগৃহীত। ঢাকা মেট্রোতে ২৪ ঘণ্টার মধ্যে হোম ডেলিভারি।'
                : 'Directly sourced from Padma river & organic orchards. Express 24h home delivery.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/products"
                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-brand-600/30 transition active:scale-95"
              >
                <span>{lang === 'bn' ? 'এখনই কেনাকাটা করুন' : 'Shop Fresh Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products?category=fresh-fish"
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition"
              >
                {lang === 'bn' ? 'পদ্মার ইলিশ দেখুন' : 'Browse Hilsa'}
              </Link>
            </div>

            {/* Quick Features List */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-[11px] sm:text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                {lang === 'bn' ? 'বিকাশ/নগদ পেমেন্ট' : 'bKash/Nagad Support'}
              </span>
            </div>
          </div>

          {/* Right Column: Desktop Visual Card (lg screens only) */}
          <div className="hidden lg:block relative">
            <Link
              href="/products/padma-river-hilsa-ilish"
              className="block relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/60 p-2.5 group cursor-pointer transition hover:border-brand-500/60 hover:shadow-brand-500/20"
            >
              <img
                src="https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=700&auto=format&fit=crop"
                alt="Fresh Hilsa Fish"
                loading="eager"
                decoding="async"
                className="w-full h-80 object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute top-5 left-5 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'আজকের স্পেশাল অফার' : 'Today Special Deal'}
              </div>

              <div className="p-3.5 flex items-center justify-between text-left">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-brand-300 transition">
                    {lang === 'bn' ? 'পদ্মার তাজা প্রিমিয়াম ইলিশ' : 'Padma Fresh Premium Hilsa'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'bn' ? '১.২ - ১.৫ কেজি | ফরমালিন মুক্ত' : '1.2–1.5kg | Formalin Free'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] line-through text-slate-400">৳ ২২০০</span>
                  <p className="text-lg font-black text-gold-400">৳ ১৯৫০</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
