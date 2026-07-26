'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    slug: 'fresh-fish',
    nameBn: 'মিঠা পানির মাছ',
    nameEn: 'Fresh Fish',
    icon: '🐟',
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=400&auto=format&fit=crop',
    count: '১৮টি পণ্য',
  },
  {
    slug: 'sea-fish',
    nameBn: 'সামুদ্রিক মাছ',
    nameEn: 'Sea Fish',
    icon: '🦐',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop',
    count: '১২টি পণ্য',
  },
  {
    slug: 'mango',
    nameBn: 'রাজশাহীর আম',
    nameEn: 'Rajshahi Mango',
    icon: '🥭',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop',
    count: '১৫টি পণ্য',
  },
  {
    slug: 'honey',
    nameBn: 'খাঁটি কাঁচা মধু',
    nameEn: 'Sundarban Honey',
    icon: '🍯',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=400&auto=format&fit=crop',
    count: '৮টি পণ্য',
  },
  {
    slug: 'dry-fish',
    nameBn: 'বিষমুক্ত শুঁটকি',
    nameEn: 'Dry Fish',
    icon: '🐠',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop',
    count: '১০টি পণ্য',
  },
  {
    slug: 'vegetables',
    nameBn: 'অর্গানিক সবজি',
    nameEn: 'Organic Veg',
    icon: '🥦',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=400&auto=format&fit=crop',
    count: '২৫টি পণ্য',
  },
];

export function FeaturedCategories() {
  const { lang } = useLanguageStore();

  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-brand-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">
              {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Top Categories'}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
              {lang === 'bn' ? 'পছন্দের ক্যাটাগরি' : 'Browse Categories'}
            </h2>
          </div>
          <Link href="/products" className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1">
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Swipeable Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-6 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group shrink-0 w-24 sm:w-auto rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 p-3 text-center flex flex-col items-center justify-between"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 border-2 border-brand-500/20 group-hover:border-brand-500 transition shadow-xs">
                <img src={cat.image} alt={cat.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              </div>
              <h3 className="font-bold text-[11px] sm:text-xs text-slate-900 group-hover:text-brand-600 transition line-clamp-1 leading-snug">
                {lang === 'bn' ? cat.nameBn : cat.nameEn}
              </h3>
              <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
