'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { ProductCard } from './ProductCard';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

export function FlashSale() {
  const { lang } = useLanguageStore();
  const { products } = useAdminDataStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  // Get live flash sale products from store
  const flashProducts = useMemo(() => {
    const explicitlyFlagged = products.filter(p => p.isFlashSale);
    if (explicitlyFlagged.length > 0) return explicitlyFlagged;
    // Fallback: products with discount
    return products.filter(p => p.discountPrice && p.discountPrice < p.basePrice).slice(0, 4);
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { hours: Math.max(0, prev.hours - 1), minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-12 bg-slate-950 text-white relative overflow-hidden border-y border-slate-800/80">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Countdown Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/10 animate-bounce">
              <Flame className="w-7 h-7 fill-rose-400 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {lang === 'bn' ? 'আজকের হট ফ্ল্যাশ সেল' : '⚡ Hot Flash Sale Deals'}
                </h2>
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn'
                  ? 'সীমিত সময়ের জন্য বিশেষ ডিল — সরাসরি ক্যাশ অন ডেলিভারি!'
                  : 'Limited-time offer — Direct cash on delivery available!'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl shadow-inner">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-slate-400 font-semibold">{lang === 'bn' ? 'মেয়াদ শেষ:' : 'Offer Ends In:'}</span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-black">
              <span className="bg-rose-600 text-white px-2.5 py-1 rounded-lg shadow-sm">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span className="text-rose-400">:</span>
              <span className="bg-rose-600 text-white px-2.5 py-1 rounded-lg shadow-sm">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span className="text-rose-400">:</span>
              <span className="bg-rose-600 text-white px-2.5 py-1 rounded-lg shadow-sm">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
