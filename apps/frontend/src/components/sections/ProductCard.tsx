'use client';

import { Product } from '@/types';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/components/shared/ToastNotifier';
import { Heart, ShoppingBag, Star, Video, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguageStore();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const showToast = useToastStore((state) => state.showToast);

  const title = lang === 'bn' ? product.titleBn : product.titleEn;
  const isWishlisted = isInWishlist(product.id);

  const price = product.discountPrice ?? product.basePrice;
  const hasDiscount = product.discountPrice && product.discountPrice < product.basePrice;
  const discountPct = hasDiscount 
    ? Math.round(((product.basePrice - product.discountPrice!) / product.basePrice) * 100)
    : 0;

  // Fast optimized image URL
  const optimizedImageUrl = product.images[0].includes('unsplash.com')
    ? `${product.images[0].split('?')[0]}?q=75&w=600&auto=format&fit=crop`
    : product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    showToast(
      lang === 'bn' 
        ? `"${title}" কার্টে যোগ করা হয়েছে` 
        : `Added "${title}" to cart`,
      'cart'
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    showToast(
      isWishlisted
        ? (lang === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist')
        : (lang === 'bn' ? 'উইশলিস্টে যোগ করা হয়েছে' : 'Saved to wishlist'),
      'wishlist'
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
      {/* Product Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {hasDiscount && (
          <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
            -{discountPct}%
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-gold-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
            {lang === 'bn' ? 'ফ্ল্যাশ সেল' : 'FLASH SALE'}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Wishlist"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-md backdrop-blur-xs transition transform hover:scale-110"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image with skeleton fallback */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-4/3 bg-slate-100">
        <img
          src={optimizedImageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.videoUrl && (
          <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-xs">
            <Video className="w-3 h-3 text-gold-400" />
            {lang === 'bn' ? 'ভিডিও' : 'Video'}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-gold-500 text-xs font-semibold mb-1">
            <Star className="w-3.5 h-3.5 fill-gold-500" />
            <span>{product.ratingAvg}</span>
            <span className="text-slate-400 text-[11px]">({product.ratingCount})</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>

          <p className="text-[11px] text-slate-500 mt-1">
            {lang === 'bn' ? `একক: ${product.unit}` : `Unit: ${product.unit}`}
          </p>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through block leading-none">
                ৳ {product.basePrice}
              </span>
            )}
            <span className="text-base font-extrabold text-brand-700">
              ৳ {price}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title={lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={handleAddToCart}
              className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white p-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-1 shadow-md shadow-brand-600/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'যোগ করুন' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
