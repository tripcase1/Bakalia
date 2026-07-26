'use client';

import { useState, useMemo } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { ProductCard } from '@/components/sections/ProductCard';
import { Filter, SlidersHorizontal, Search, Sparkles, Flame } from 'lucide-react';

export default function ProductsPage() {
  const { lang } = useLanguageStore();
  const { products, categories } = useAdminDataStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      let matchesCat = true;
      if (selectedCategory === 'featured') {
        matchesCat = Boolean(prod.isFeatured);
      } else if (selectedCategory === 'flash') {
        matchesCat = Boolean(prod.isFlashSale);
      } else if (selectedCategory !== 'all') {
        matchesCat = prod.categoryId === selectedCategory;
      }

      const title = lang === 'bn' ? prod.titleBn : prod.titleEn;
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.discountPrice ?? a.basePrice) - (b.discountPrice ?? b.basePrice);
      if (sortBy === 'price-high') return (b.discountPrice ?? b.basePrice) - (a.discountPrice ?? a.basePrice);
      if (sortBy === 'rating') return (b.ratingAvg ?? 5) - (a.ratingAvg ?? 5);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy, lang]);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Breadcrumb & Search */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 mb-8 shadow-xs">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            {lang === 'bn' ? 'সকল খাঁটি অর্গানিক পণ্য' : 'All Fresh Organic Products'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {lang === 'bn' ? 'ফরমালিন মুক্ত নদী ও সামুদ্রিক মাছ, ঘি, মধু ও ডিম' : 'Chemical-free fresh fish, ghee, honey, eggs & produce'}
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'পণ্য অনুসন্ধান করুন...' : 'Search products...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none font-semibold"
              >
                <option value="default">{lang === 'bn' ? 'ডিফল্ট সাজানো' : 'Default Sorting'}</option>
                <option value="price-low">{lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-high">{lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="rating">{lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rating'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Filter className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-sm text-slate-900">{lang === 'bn' ? 'ফিল্টার করুন' : 'Filter Products'}</h3>
            </div>

            <div className="space-y-1.5 text-xs">
              {/* Quick Specials */}
              <div className="pb-2 mb-2 border-b border-slate-100 space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition flex justify-between font-semibold ${
                    selectedCategory === 'all'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{lang === 'bn' ? 'সব পণ্য' : 'All Products'}</span>
                  <span className="text-[11px] opacity-80">{products.length}</span>
                </button>

                <button
                  onClick={() => setSelectedCategory('featured')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between font-semibold ${
                    selectedCategory === 'featured'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 fill-amber-400" /> {lang === 'bn' ? 'স্পেশাল কালেকশন' : '⭐ Featured Produce'}</span>
                  <span className="text-[11px] opacity-80">{products.filter(p => p.isFeatured).length}</span>
                </button>

                <button
                  onClick={() => setSelectedCategory('flash')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between font-semibold ${
                    selectedCategory === 'flash'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">⚡ {lang === 'bn' ? 'ফ্ল্যাশ সেল ডিল' : 'Flash Sale Deals'}</span>
                  <span className="text-[11px] opacity-80">{products.filter(p => p.isFlashSale).length}</span>
                </button>
              </div>

              {/* Dynamic Categories */}
              <p className="text-[10px] text-slate-400 uppercase font-bold px-1 mb-1">{lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</p>
              {categories.map((cat) => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex justify-between font-semibold ${
                      selectedCategory === cat.id
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{lang === 'bn' ? cat.nameBn : cat.nameEn}</span>
                    <span className="text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-3">
                <p className="font-bold text-slate-600 text-base">{lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}</p>
                <p className="text-xs text-slate-400">Try changing your search or category filter.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-brand-500 transition"
                >
                  {lang === 'bn' ? 'সব ফিল্টার রিমুভ করুন' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
