'use client';

import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

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
    discountAmount,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // iOS Safari & Android Chrome robust position-fixed body scroll lock to prevent scroll bleed
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        const top = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (top) {
          window.scrollTo(0, parseInt(top || '0', 10) * -1);
        }
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) toggleCart();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, toggleCart]);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(inputCoupon);
    if (!result.success) {
      setCouponMsg({ ok: false, text: result.error ?? 'Invalid code' });
    } else {
      setCouponMsg({ ok: true, text: lang === 'bn' ? 'কুপন সফলভাবে প্রয়োগ হয়েছে!' : 'Coupon applied!' });
      setInputCoupon('');
    }
  };

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-[100] flex touch-none">
      {/* Backdrop — prevents scroll touch bleed */}
      <div
        onClick={toggleCart}
        className="flex-1 bg-slate-950/60 backdrop-blur-sm"
        aria-label="Close cart"
      />

      {/* Drawer Panel — full height, right side, padded for mobile bottom nav bar */}
      <div
        ref={drawerRef}
        className="w-full max-w-sm sm:max-w-md bg-white flex flex-col h-full shadow-2xl overflow-hidden touch-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-400" />
            <h2 className="font-bold text-base">
              {lang === 'bn' ? 'আপনার কার্ট' : 'Shopping Cart'}
            </h2>
            {items.length > 0 && (
              <span className="ml-1 bg-brand-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={toggleCart}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition active:scale-90"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items — scrollable middle section */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-16 px-6">
              <ShoppingBag className="w-16 h-16 text-slate-200" />
              <p className="font-semibold text-slate-600 text-sm text-center">
                {lang === 'bn' ? 'আপনার কার্ট এখন খালি' : 'Your cart is empty'}
              </p>
              <button
                onClick={toggleCart}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-md active:scale-95"
              >
                {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-1">
              {items.map((item) => {
                const title = lang === 'bn' ? item.product.titleBn : item.product.titleEn;
                const price = item.selectedVariant
                  ? item.selectedVariant.price
                  : item.product.discountPrice ?? item.product.basePrice;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedVariant?.id}`}
                    className="py-3 flex gap-3 border-b border-slate-100 last:border-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={title}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-xs leading-tight line-clamp-2 text-slate-800">{title}</h4>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-0.5">
                            {lang === 'bn' ? item.selectedVariant.nameBn : item.selectedVariant.nameEn}
                          </span>
                        )}
                        <p className="text-brand-600 font-extrabold text-sm mt-1">৳ {price}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-base active:bg-slate-200 transition"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-base active:bg-slate-200 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Item total + remove */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">৳ {price * item.quantity}</span>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition active:scale-90 rounded-lg"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — padded pb-20 on mobile so Proceed to Checkout button NEVER overlaps bottom nav bar */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 pt-3 pb-20 sm:pb-6 space-y-3 shadow-lg">
            {/* Coupon */}
            {!couponCode ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => { setInputCoupon(e.target.value.toUpperCase()); setCouponMsg(null); }}
                    placeholder={lang === 'bn' ? 'কুপন কোড' : 'Coupon code'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition active:scale-95 shrink-0"
                >
                  {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-xl flex items-center justify-between font-medium border border-emerald-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {couponCode}
                </span>
                <span className="font-black">-৳ {discountAmount}</span>
              </div>
            )}

            {couponMsg && (
              <p className={`text-[11px] flex items-center gap-1 ${couponMsg.ok ? 'text-emerald-600' : 'text-rose-500'}`}>
                {couponMsg.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {couponMsg.text}
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-semibold text-slate-700">৳ {subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{lang === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Coupon discount'}</span>
                  <span className="font-semibold">-৳ {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery fee'}</span>
                <span className="font-semibold text-slate-700">৳ {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-1.5 mt-1">
                <span>{lang === 'bn' ? 'সর্বমোট' : 'Total'}</span>
                <span className="text-brand-600 text-base">৳ {total}</span>
              </div>
            </div>

            {/* Checkout CTA — Large, fully visible above bottom nav bar */}
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-center py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition"
            >
              <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
