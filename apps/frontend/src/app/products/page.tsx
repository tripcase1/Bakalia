'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/sections/ProductCard';
import { Product } from '@/types';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

const CATALOG_PRODUCTS: Product[] = [
  {
    id: '1',
    titleBn: 'পদ্মার তাজা ডিমওয়ালা বড় ইলিশ (১.৫ কেজি)',
    titleEn: 'Padma Big Silver Hilsa Fish (1.5kg)',
    slug: 'padma-river-hilsa-ilish',
    descriptionBn: 'সরাসরি পদ্মার তাজা মাছ।',
    descriptionEn: 'Authentic Padma River silver Hilsa.',
    categoryId: 'fresh-fish',
    basePrice: 2200,
    discountPrice: 1950,
    sku: 'ILISH-1.5',
    stock: 25,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.9,
    ratingCount: 154,
    tags: ['ilish'],
  },
  {
    id: '2',
    titleBn: 'চট্টগ্রামের প্রিমিয়াম সাদা রূপচাঁদা',
    titleEn: 'Chittagong Deep Sea White Pomfret',
    slug: 'chittagong-sea-rupchanda',
    descriptionBn: 'বঙ্গোপসাগরের রূপচাঁদা।',
    descriptionEn: 'Deep sea fresh white pomfret.',
    categoryId: 'sea-fish',
    basePrice: 1400,
    discountPrice: 1250,
    sku: 'RUPCHANDA-01',
    stock: 30,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.8,
    ratingCount: 88,
    tags: ['sea fish'],
  },
  {
    id: '3',
    titleBn: 'সুন্দরবনের খলিসা ফুলের খাঁটি মধু',
    titleEn: 'Sundarbans Kholisa Pure Raw Honey',
    slug: 'sundarban-natural-raw-honey',
    descriptionBn: 'সুন্দরবনের অর্গানিক কাঁচা মধু।',
    descriptionEn: '100% Raw unprocessed Sundarbans honey.',
    categoryId: 'honey',
    basePrice: 950,
    discountPrice: 850,
    sku: 'HONEY-KHOLISA',
    stock: 50,
    unit: 'jar',
    images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 5.0,
    ratingCount: 310,
    tags: ['honey'],
  },
  {
    id: '4',
    titleBn: 'রাজশাহীর মিষ্টি আম্রপালি আম (৫ কেজি)',
    titleEn: 'Rajshahi Organic Amrapali Mango (5kg)',
    slug: 'rajshahi-amrapali-mango',
    descriptionBn: 'গাছ পাকা সুমিষ্ট আম্রপালি।',
    descriptionEn: 'Sweet Amrapali mangoes from Rajshahi.',
    categoryId: 'mango',
    basePrice: 1100,
    discountPrice: 890,
    sku: 'MANGO-AMRAPALI',
    stock: 80,
    unit: 'box',
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.9,
    ratingCount: 142,
    tags: ['mango'],
  },
  {
    id: '5',
    titleBn: 'কক্সবাজারের বিষমুক্ত শুঁটকি (লইট্যা)',
    titleEn: 'Cox\'s Bazar Organic Dry Loitta Fish (500g)',
    slug: 'coxs-bazar-dry-loitta',
    descriptionBn: 'বিষমুক্ত প্রিমিয়াম শুঁটকি।',
    descriptionEn: 'Chemical free dry Loitta fish.',
    categoryId: 'dry-fish',
    basePrice: 650,
    discountPrice: 580,
    sku: 'DRY-LOITTA',
    stock: 40,
    unit: 'pack',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.7,
    ratingCount: 52,
    tags: ['dry fish'],
  },
  {
    id: '6',
    titleBn: 'ফার্মের তাজা অর্গানিক মিষ্টি কুমড়া',
    titleEn: 'Organic Fresh Sweet Pumpkin',
    slug: 'organic-sweet-pumpkin',
    descriptionBn: 'তাজা মিষ্টি কুমড়া।',
    descriptionEn: 'Fresh sweet pumpkin from local farm.',
    categoryId: 'vegetables',
    basePrice: 120,
    discountPrice: 99,
    sku: 'VEG-PUMPKIN',
    stock: 120,
    unit: 'piece',
    images: ['https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.6,
    ratingCount: 34,
    tags: ['vegetables'],
  },
];

export default function ProductsPage() {
  const { lang } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  const filteredProducts = CATALOG_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.categoryId === selectedCategory;
    const title = lang === 'bn' ? prod.titleBn : prod.titleEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.discountPrice ?? a.basePrice) - (b.discountPrice ?? b.basePrice);
    if (sortBy === 'price-high') return (b.discountPrice ?? b.basePrice) - (a.discountPrice ?? a.basePrice);
    if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
    return 0;
  });

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Breadcrumb & Search */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 mb-8 shadow-xs">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            {lang === 'bn' ? 'সকল খাঁটি অর্গানিক পণ্য' : 'All Fresh Organic Products'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {lang === 'bn' ? 'ফরমালিন মুক্ত নদী ও সামুদ্রিক মাছ, আম ও সুন্দরবনের মধু' : 'Chemical-free fresh fish, fruits, honey & vegetables'}
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'পণ্য অনুসন্ধান করুন...' : 'Search products...'}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none"
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
              <h3 className="font-bold text-sm text-slate-900">{lang === 'bn' ? 'ক্যাটাগরি ফিল্টার' : 'Category Filter'}</h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 'all', nameBn: 'সব পণ্য', nameEn: 'All Categories' },
                { id: 'fresh-fish', nameBn: 'মিঠা পানির মাছ', nameEn: 'Fresh Fish' },
                { id: 'sea-fish', nameBn: 'সামুদ্রিক মাছ', nameEn: 'Sea Fish' },
                { id: 'dry-fish', nameBn: 'শুঁটকি মাছ', nameEn: 'Dry Fish' },
                { id: 'mango', nameBn: 'রাজশাহীর আম', nameEn: 'Mango' },
                { id: 'honey', nameBn: 'খাঁটি মধু', nameEn: 'Pure Honey' },
                { id: 'vegetables', nameBn: 'তাজা শাকসবজি', nameEn: 'Vegetables' },
              ].map((cat) => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center text-slate-400 space-y-3">
                <p className="font-bold text-slate-600">{lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}</p>
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
