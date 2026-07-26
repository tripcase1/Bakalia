'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Product, ProductVariant } from '@/types';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Heart, Video, CheckCircle2 } from 'lucide-react';

const SAMPLE_PRODUCT: Product = {
  id: 'p1',
  titleBn: 'পদ্মার তাজা প্রিমিয়াম রূপালী ইলিশ মাছ (১.২ - ১.৫ কেজি)',
  titleEn: 'Padma River Fresh Silver Hilsa Fish (1.2kg - 1.5kg)',
  slug: 'padma-river-hilsa-ilish',
  descriptionBn: 'সরাসরি পদ্মার তাজা কেমিক্যালমুক্ত রূপালী ইলিশ মাছ। আমাদের প্রতিটি মাছ ঢাকা মেট্রোর ভেতরে সরাসরি বরফ সহ কোল্ড বক্সে ডেলিভারি করা হয়। ১০০% ফরমালিন মুক্ত গ্যারান্টি।',
  descriptionEn: 'Authentic Padma River silver Hilsa fish directly sourced from river fishermen. 100% formalin-free guaranteed and delivered in temperature-controlled boxes.',
  categoryId: 'fresh-fish',
  basePrice: 1850,
  discountPrice: 1690,
  sku: 'FISH-PADMA-ILISH-01',
  stock: 45,
  unit: 'kg',
  isFeatured: true,
  images: [
    'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
  ],
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ratingAvg: 4.9,
  ratingCount: 128,
  tags: ['hilsa', 'padma', 'ilish'],
  variants: [
    { id: 'v1', nameBn: '১.২ কেজি সাইজ', nameEn: '1.2 kg size', sku: 'ILISH-1.2', price: 1690, stock: 20 },
    { id: 'v2', nameBn: '১.৫ কেজি সাইজ (বড় ডিমওয়ালা)', nameEn: '1.5 kg size (Big size)', sku: 'ILISH-1.5', price: 2150, stock: 25 },
  ],
  reviews: [
    { id: 'r1', userName: 'কামরুল হাসান', rating: 5, comment: 'পদ্মার মাছের স্বাদ অনন্য! কোনো ফরমালিন ছিল না।', createdAt: '২০২৬-০৭-২০' },
    { id: 'r2', userName: 'সাবরিনা সুলতানা', rating: 5, comment: 'অরিজিনাল ইলিশ মাছ, ফ্রেশনেস অসাধারণ।', createdAt: '২০২৬-০৭-২২' },
  ],
};

export default function ProductDetailPage() {
  const { lang } = useLanguageStore();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    SAMPLE_PRODUCT.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const product = SAMPLE_PRODUCT;
  const isWishlisted = isInWishlist(product.id);
  const title = lang === 'bn' ? product.titleBn : product.titleEn;
  const desc = lang === 'bn' ? product.descriptionBn : product.descriptionEn;

  const currentPrice = selectedVariant 
    ? selectedVariant.price 
    : product.discountPrice ?? product.basePrice;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Gallery & Video */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.images[activeImage]}
                alt={title}
                className="w-full h-full object-cover"
              />

              {product.videoUrl && (
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-xs hover:bg-rose-600 transition"
                >
                  <Video className="w-4 h-4 text-gold-400" />
                  <span>{lang === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}</span>
                </button>
              )}
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details & Buy Options */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-gold-500 text-xs font-bold mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
                <span>{product.ratingAvg}</span>
                <span className="text-slate-400">({product.ratingCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {title}
              </h1>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-black text-brand-700">৳ {currentPrice}</span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">৳ {product.basePrice}</span>
                )}
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                  {lang === 'bn' ? 'স্টক আছে' : 'In Stock'}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4">
              {desc}
            </p>

            {/* Variants Selector */}
            {product.variants && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-900 block">
                  {lang === 'bn' ? 'সাইজ ভ্যারিয়েন্ট নির্বাচন করুন:' : 'Select Size Variant:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedVariant?.id === variant.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {lang === 'bn' ? variant.nameBn : variant.nameEn} - ৳ {variant.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 font-bold text-slate-700 hover:bg-slate-200 rounded-l-xl text-sm"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 font-bold text-slate-700 hover:bg-slate-200 rounded-r-xl text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addItem(product, selectedVariant, quantity)}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition ${
                  isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-brand-600 mb-1" />
                <span>১০০% খাঁটি পণ্য</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-brand-600 mb-1" />
                <span>২৪ ঘণ্টার ডেলিভারি</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-5 h-5 text-brand-600 mb-1" />
                <span>ফ্রি রিটার্ন সাপোর্ট</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white text-slate-900 p-2 rounded-full font-bold z-10"
              >
                ✕
              </button>
              <iframe
                src={product.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
