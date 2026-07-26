import { HeroBanner } from '@/components/sections/HeroBanner';
import { FeaturedCategories } from '@/components/sections/FeaturedCategories';
import { FlashSale } from '@/components/sections/FlashSale';
import { CustomerReviews } from '@/components/sections/CustomerReviews';
import { FAQSection } from '@/components/sections/FAQSection';
import { Newsletter } from '@/components/sections/Newsletter';
import { ProductCard } from '@/components/sections/ProductCard';
import { Product } from '@/types';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    titleBn: 'পদ্মার তাজা ডিমওয়ালা বড় ইলিশ (১.৫ কেজি)',
    titleEn: 'Padma Big Silver Hilsa Fish (1.5kg)',
    slug: 'padma-river-hilsa-ilish',
    descriptionBn: 'সরাসরি পদ্মার আসল ইলিশ মাছ।',
    descriptionEn: 'Authentic Padma River silver Hilsa.',
    categoryId: 'fresh-fish',
    basePrice: 2200,
    discountPrice: 1950,
    sku: 'ILISH-1.5',
    stock: 25,
    unit: 'kg',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop'],
    videoUrl: 'https://youtube.com',
    ratingAvg: 4.9,
    ratingCount: 154,
    tags: ['ilish'],
  },
  {
    id: 'p2',
    titleBn: 'চট্টগ্রামের প্রিমিয়াম সাদা রূপচাঁদা',
    titleEn: 'Chittagong Deep Sea White Pomfret',
    slug: 'chittagong-sea-rupchanda',
    descriptionBn: 'বঙ্গোপসাগরের গভীর জলের রূপচাঁদা।',
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
    id: 'p3',
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
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 5.0,
    ratingCount: 310,
    tags: ['honey'],
  },
  {
    id: 'p4',
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
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop'],
    ratingAvg: 4.9,
    ratingCount: 142,
    tags: ['mango'],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <HeroBanner />

      {/* Categories Showcase */}
      <FeaturedCategories />

      {/* Flash Sale Banner */}
      <FlashSale />

      {/* Featured Products Showcase */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-brand-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                আজকের সেরা কালেকশন
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                সেরা বিক্রিত খাঁটি পণ্যসমূহ
              </h2>
            </div>
            <Link href="/products" className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1">
              <span>সব দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
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
