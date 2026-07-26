'use client';

import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { X, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function CartDrawer() {
  const { lang } = useLanguageStore();
  const { 
    items, 
    isOpen, 
    toggleCart, 
    removeItem, 
    updateQuantity, 
    getSubtotal, 
    getTotal, 
    applyCoupon, 
    couponCode,
    discountAmount 
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);

  // Lock background body scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError(true);
    } else {
      setCouponError(false);
    }
  };

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={toggleCart} 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
              <h2 className="font-bold text-base sm:text-lg">
                {lang === 'bn' ? 'আপনার শপিং কার্ট' : 'Shopping Cart'}
              </h2>
            </div>
            <button 
              onClick={toggleCart} 
              className="p-2 text-slate-400 hover:text-white rounded-xl transition"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 touch-pan-y">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3 py-10">
                <ShoppingBag className="w-16 h-16 text-slate-200" />
                <p className="font-medium text-slate-600 text-sm">
                  {lang === 'bn' ? 'আপনার কার্ট খালি রয়েছে' : 'Your cart is empty'}
                </p>
                <button 
                  onClick={toggleCart}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-md"
                >
                  {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const title = lang === 'bn' ? item.product.titleBn : item.product.titleEn;
                const price = item.selectedVariant
                  ? item.selectedVariant.price
                  : item.product.discountPrice ?? item.product.basePrice;

                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id}`} className="py-4 flex gap-3">
                    <img 
                      src={item.product.images[0]} 
                      alt={title} 
                      className="w-16 h-16 object-cover rounded-xl border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm line-clamp-1 text-slate-800">{title}</h4>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {lang === 'bn' ? item.selectedVariant.nameBn : item.selectedVariant.nameEn}
                          </span>
                        )}
                        <p className="text-brand-600 font-extrabold text-xs sm:text-sm mt-0.5">৳ {price} </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                            className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg font-bold text-sm min-h-[36px]"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                            className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg font-bold text-sm min-h-[36px]"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder={lang === 'bn' ? 'কুপন কোড (ALHERAFRESH10)' : 'Coupon (ALHERAFRESH10)'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </form>

              {couponCode && (
                <div className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg flex justify-between items-center font-medium">
                  <span>কুপন প্রয়োগ করা হয়েছে: {couponCode}</span>
                  <span className="font-bold">-৳ {discountAmount}</span>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-500">
                  {lang === 'bn' ? 'অবৈধ কুপন কোড' : 'Invalid promo code'}
                </p>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-semibold text-slate-800">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ (ঢাকা)' : 'Delivery Fee (Dhaka)'}</span>
                  <span className="font-semibold text-slate-800">৳ {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>{lang === 'bn' ? 'সর্বমোট' : 'Total Amount'}</span>
                  <span className="text-brand-600 text-base">৳ {total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={toggleCart}
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 transition"
              >
                <span>{lang === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
