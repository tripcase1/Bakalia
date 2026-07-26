'use client';

import { useMemo } from 'react';
import { HeroBanner } from '@/components/sections/HeroBanner';
import { FeaturedCategories } from '@/components/sections/FeaturedCategories';
import { FlashSale } from '@/components/sections/FlashSale';
import { CustomerReviews } from '@/components/sections/CustomerReviews';
import { FAQSection } from '@/components/sections/FAQSection';
import { Newsletter } from '@/components/sections/Newsletter';
import { ProductCard } from '@/components/sections/ProductCard';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { products } = useAdminDataStore();
  const { lang } = useLanguageStore();

  const featuredItems = useMemo(() => {
    const explicitlyFeatured = products.filter(p => p.isFeatured);
    if (explicitlyFeatured.length > 0) return explicitlyFeatured.slice(0, 8);
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <HeroBanner />

      {/* Categories Showcase */}
      <FeaturedCategories />

      {/* Live Flash Sale Banner */}
      <FlashSale />

      {/* Featured Products Showcase */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-brand-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-brand-600" />
                {lang === 'bn' ? 'আজকের স্পেশাল কালেকশন' : '⭐ Featured Produce'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {lang === 'bn' ? 'সেরা বিক্রিত খাঁটি পণ্যসমূহ' : 'Best-Selling Organic Collection'}
              </h2>
            </div>
            <Link href="/products?filter=featured" className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1">
              <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
