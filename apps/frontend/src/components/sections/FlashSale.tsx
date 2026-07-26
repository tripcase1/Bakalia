'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';
import { Flame, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const FLASH_PRODUCTS: Product[] = [
  {
    id: '1',
    titleBn: 'পদ্মার তাজা ইলিশ (১.২ - ১.৫ কেজি)',
    titleEn: 'Padma River Fresh Hilsa Fish (1.2kg - 1.5kg)',
    slug: 'padma-river-hilsa-ilish',
    descriptionBn: 'সরাসরি পদ্মার তাজা ইলিশ মাছ। ফরমালিন ও কেমিক্যাল মুক্ত।',
    descriptionEn: 'Authentic Padma River silver Hilsa fish. 100% chemical free.',
    categoryId: 'fresh-fish',
    basePrice: 1850,
    discountPrice: 1690,
    sku: 'FISH-ILISH-01',
    stock: 45,
    unit: 'kg',
    isFlashSale: true,
    images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop'],
    videoUrl: 'https://youtube.com',
    ratingAvg: 4.9,
    ratingCount: 128,
    tags: ['ilish', 'fish'],
  },
  {
    id: '2',
    titleBn: 'সুন্দরবনের প্রাকৃতিক চাক ভাঙা কাঁচা মধু (৫০০ গ্রাম)',
    titleEn: 'Sundarbans Natural Raw Honey (500g)',
    slug: 'sundarban-natural-raw-honey',
    descriptionBn: 'সুন্দরবনের প্রাকৃতিক চাক থেকে সংগৃহীত ১০০% প্রিমিয়াম খাঁটি মধু।',
    descriptionEn: '100% Raw unprocessed organic wild honey.',
    categoryId: 'honey',
    basePrice: 950,
    discountPrice: 850,
    sku: 'HONEY-500G',
    stock: 100,
    unit: 'jar',
    isFlashSale: true,
    images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 5.0,
    ratingCount: 210,
    tags: ['honey', 'sundarbans'],
  },
  {
    id: '3',
    titleBn: 'রাজশাহীর কেমিক্যালমুক্ত মিষ্টি কাটিমন আম (৫ কেজি বক্স)',
    titleEn: 'Rajshahi Katimon Organic Mango (5kg Box)',
    slug: 'rajshahi-katimon-mango',
    descriptionBn: 'গাছ পাকা সুমিষ্ট কাটিমন আম। বাগান থেকে সরাসরি সংগৃহীত।',
    descriptionEn: 'Tree-ripened super sweet Katimon Mangoes.',
    categoryId: 'mango',
    basePrice: 1200,
    discountPrice: 990,
    sku: 'MANGO-5KG',
    stock: 60,
    unit: 'box',
    isFlashSale: true,
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.9,
    ratingCount: 95,
    tags: ['mango', 'rajshahi'],
  },
  {
    id: '4',
    titleBn: 'চট্টগ্রামের প্রিমিয়াম সাদা রূপচাঁদা মাছ',
    titleEn: 'Chittagong Deep Sea White Pomfret',
    slug: 'chittagong-sea-rupchanda',
    descriptionBn: 'বঙ্গোপসাগরের গভীর জলের ফ্রেশ হোয়াইট রূপচাঁদা মাছ।',
    descriptionEn: 'Deep-sea freshly caught white pomfret.',
    categoryId: 'sea-fish',
    basePrice: 1400,
    discountPrice: 1250,
    sku: 'FISH-RUPCHANDA-02',
    stock: 30,
    unit: 'kg',
    isFlashSale: true,
    images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.8,
    ratingCount: 64,
    tags: ['rupchanda', 'sea fish'],
  },
];

export function FlashSale() {
  const { lang } = useLanguageStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

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

  return (
    <section className="py-12 bg-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header with Countdown Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-gold-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'আজকের হট ফ্ল্যাশ সেল' : 'Hot Flash Sale Deals'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'সীমিত সময়ের জন্য বিশেষ মূল্য ছাড়!' : 'Limited time exclusive discounts!'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-slate-400 font-semibold">{lang === 'bn' ? 'মেয়াদ শেষ:' : 'Ends In:'}</span>
            <div className="flex items-center gap-1 text-xs font-mono font-bold">
              <span className="bg-rose-600 text-white px-2 py-1 rounded-md">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="bg-rose-600 text-white px-2 py-1 rounded-md">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="bg-rose-600 text-white px-2 py-1 rounded-md">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLASH_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
