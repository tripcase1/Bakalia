'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    slug: 'fresh-fish',
    nameBn: 'মিঠা পানির তাজা মাছ',
    nameEn: 'Fresh Water Fish',
    icon: '🐟',
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=400&auto=format&fit=crop',
    count: '১৮টি পণ্য',
  },
  {
    slug: 'sea-fish',
    nameBn: 'সামুদ্রিক রূপচাঁদা ও মাছ',
    nameEn: 'Deep Sea Fish',
    icon: '🦐',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop',
    count: '১২টি পণ্য',
  },
  {
    slug: 'mango',
    nameBn: 'রাজশাহীর কেমিক্যালমুক্ত আম',
    nameEn: 'Rajshahi Mangoes',
    icon: '🥭',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop',
    count: '১৫টি পণ্য',
  },
  {
    slug: 'honey',
    nameBn: 'সুন্দরবনের খাঁটি কাঁচা মধু',
    nameEn: 'Sundarbans Pure Honey',
    icon: '🍯',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=400&auto=format&fit=crop',
    count: '৮টি পণ্য',
  },
  {
    slug: 'dry-fish',
    nameBn: 'কক্সবাজারের বিষমুক্ত শুঁটকি',
    nameEn: 'Dry Fish (Shutki)',
    icon: '🐠',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop',
    count: '১০টি পণ্য',
  },
  {
    slug: 'vegetables',
    nameBn: 'ফার্মের তাজা অর্গানিক সবজি',
    nameEn: 'Organic Vegetables',
    icon: '🥦',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=400&auto=format&fit=crop',
    count: '২৫টি পণ্য',
  },
];

export function FeaturedCategories() {
  const { lang } = useLanguageStore();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-brand-600 text-xs font-bold uppercase tracking-wider">
              {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Top Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {lang === 'bn' ? 'পছন্দের ক্যাটাগরি ব্রাউজ করুন' : 'Browse Featured Categories'}
            </h2>
          </div>
          <Link href="/products" className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1">
            <span>{lang === 'bn' ? 'সব ক্যাটাগরি' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 p-4 text-center flex flex-col items-center justify-between"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-brand-500/20 group-hover:border-brand-500 transition">
                <img src={cat.image} alt={cat.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-brand-600 transition line-clamp-1">
                {lang === 'bn' ? cat.nameBn : cat.nameEn}
              </h3>
              <span className="text-[10px] text-slate-400 mt-1">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
