'use client';

import { Product } from '@/types';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/components/shared/ToastNotifier';
import { Heart, ShoppingBag, Star, Video, Eye, Sparkles } from 'lucide-react';
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
  const optimizedImageUrl = product.images[0]?.includes('unsplash.com')
    ? `${product.images[0].split('?')[0]}?q=75&w=600&auto=format&fit=crop`
    : product.images[0] ?? 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=600&auto=format&fit=crop';

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
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between relative">
      {/* Product Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {hasDiscount && (
          <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
            -{discountPct}%
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 animate-pulse">
            ⚡ {lang === 'bn' ? 'ফ্ল্যাশ সেল' : 'FLASH SALE'}
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
            ⭐ {lang === 'bn' ? 'স্পেশাল' : 'FEATURED'}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Wishlist"
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 shadow-md backdrop-blur-xs transition transform hover:scale-110 active:scale-90"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-4/3 bg-slate-100">
        <img
          src={optimizedImageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.videoUrl && (
          <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs font-semibold">
            <Video className="w-3 h-3 text-gold-400" />
            {lang === 'bn' ? 'ভিডিও' : 'Video'}
          </span>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.ratingAvg ?? 5.0}</span>
            <span className="text-slate-400 text-[10px]">({product.ratingCount ?? 0})</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>

          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium">
            {lang === 'bn' ? `একক: ${product.unit}` : `Unit: ${product.unit}`}
          </p>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through block leading-none">
                ৳ {product.basePrice}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-brand-700">
              ৳ {price}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title={lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={handleAddToCart}
              className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-md shadow-brand-600/20 shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'যোগ করুন' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
