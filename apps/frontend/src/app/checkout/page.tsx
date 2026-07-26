'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { PaymentMethod } from '@/types';
import { ShieldCheck, CheckCircle2, ArrowRight, Printer, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { lang } = useLanguageStore();
  const { items, getSubtotal, getTotal, getDiscountAmount, couponCode, discountAmount, clearCart } = useCartStore();
  const { placeOrder, coupons } = useAdminDataStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    phone: '',
    division: 'ঢাকা',
    district: '',
    upazila: '',
    street: '',
    trxId: '',
    note: '',
  });

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = getTotal();

  // ── Form Validation ──────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim() || form.name.trim().length < 3) {
      errors.name = lang === 'bn' ? 'সঠিক নাম লিখুন (কমপক্ষে ৩ অক্ষর)' : 'Enter a valid name (min 3 chars)';
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      errors.phone = lang === 'bn' ? 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন (01XXXXXXXXX)' : 'Enter valid BD mobile number (01XXXXXXXXX)';
    }

    if (!form.district.trim()) {
      errors.district = lang === 'bn' ? 'জেলা লিখুন' : 'Enter your district';
    }

    if (!form.street.trim() || form.street.trim().length < 10) {
      errors.street = lang === 'bn' ? 'বিস্তারিত ঠিকানা লিখুন (কমপক্ষে ১০ অক্ষর)' : 'Enter detailed address (min 10 chars)';
    }

    if (paymentMethod !== 'COD' && !form.trxId.trim()) {
      errors.trxId = lang === 'bn' ? 'ট্রানজেকশন আইডি দিন' : 'Transaction ID is required';
    }

    if (items.length === 0) {
      errors.cart = lang === 'bn' ? 'কার্ট খালি রয়েছে' : 'Cart is empty';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Create real order via admin store
    const orderNumber = placeOrder({
      subTotal: subtotal,
      deliveryFee,
      discount: discountAmount,
      totalAmount: total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      trxId: form.trxId || undefined,
      items: [...items],
      shippingDetail: {
        recipientName: form.name.trim(),
        phone: form.phone.trim(),
        division: form.division,
        district: form.district.trim(),
        upazila: form.upazila.trim() || form.district.trim(),
        streetAddress: form.street.trim(),
        note: form.note.trim() || undefined,
      },
    });

    // Small delay for UX feel
    await new Promise(r => setTimeout(r, 600));

    setCreatedOrderNumber(orderNumber);
    setOrderSuccess(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-slate-300 mx-auto" />
          <h1 className="text-xl font-bold text-slate-700">
            {lang === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
          </h1>
          <p className="text-sm text-slate-500">
            {lang === 'bn' ? 'কেনাকাটা করুন তারপর চেকআউটে আসুন' : 'Add items to your cart before checkout'}
          </p>
          <Link href="/products" className="inline-block bg-brand-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-700 transition">
            {lang === 'bn' ? 'শপিং করুন' : 'Shop Now'}
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-brand-600 text-xs font-bold uppercase tracking-wider">
              {lang === 'bn' ? '✅ অর্ডার সফল হয়েছে!' : '✅ Order Placed Successfully!'}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {lang === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'} {createdOrderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {lang === 'bn'
                ? 'ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। ঢাকার ভেতরে ২৪ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হবে।'
                : 'Thank you! Your order has been received. Expected delivery within 24 hours inside Dhaka.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'প্রাপক:' : 'Recipient:'}</span>
              <span className="font-bold text-slate-800">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'মোবাইল:' : 'Mobile:'}</span>
              <span className="font-bold text-slate-800">{form.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>
              <span className="font-bold text-slate-800 text-right max-w-[60%]">{form.street}, {form.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'পেমেন্ট:' : 'Payment:'}</span>
              <span className="font-bold text-brand-600">{paymentMethod}</span>
            </div>
            {form.trxId && (
              <div className="flex justify-between">
                <span className="text-slate-500">TrxID:</span>
                <span className="font-mono font-bold text-slate-800">{form.trxId}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>{lang === 'bn' ? 'সর্বমোট প্রদানযোগ্য:' : 'Total Paid:'}</span>
              <span className="text-brand-700 text-sm">৳ {total}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ইনভয়েস প্রিন্ট' : 'Print Invoice'}</span>
            </button>
            <Link
              href="/"
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>{lang === 'bn' ? 'হোমে যান' : 'Go Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          {lang === 'bn' ? 'অর্ডার চেকআউট' : 'Order Checkout'}
        </h1>
        <p className="text-xs text-slate-500 mb-8 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          {lang === 'bn' ? 'নিরাপদ ও এনক্রিপ্টেড পেমেন্ট সিস্টেম' : 'Secure & encrypted checkout'}
        </p>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                {lang === 'bn' ? '১. ডেলিভারির ঠিকানা' : '1. Delivery Address'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'প্রাপকের নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormErrors(prev => ({ ...prev, name: '' })); }}
                    placeholder={lang === 'bn' ? 'আপনার পুরো নাম' : 'Your full name'}
                    className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 ${formErrors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
                  />
                  {formErrors.name && <p className="text-rose-500 text-[11px] mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setFormErrors(prev => ({ ...prev, phone: '' })); }}
                    placeholder="01XXXXXXXXX"
                    className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 ${formErrors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
                  />
                  {formErrors.phone && <p className="text-rose-500 text-[11px] mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'বিভাগ *' : 'Division *'}
                  </label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm({ ...form, division: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                  >
                    <option value="ঢাকা">ঢাকা</option>
                    <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                    <option value="রাজশাহী">রাজশাহী</option>
                    <option value="সিলেট">সিলেট</option>
                    <option value="খুলনা">খুলনা</option>
                    <option value="বরিশাল">বরিশাল</option>
                    <option value="রংপুর">রংপুর</option>
                    <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'জেলা *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => { setForm({ ...form, district: e.target.value }); setFormErrors(prev => ({ ...prev, district: '' })); }}
                    placeholder={lang === 'bn' ? 'যেমন: ঢাকা, গাজীপুর' : 'e.g., Dhaka, Gazipur'}
                    className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 ${formErrors.district ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
                  />
                  {formErrors.district && <p className="text-rose-500 text-[11px] mt-1">{formErrors.district}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'উপজেলা / থানা' : 'Upazila / Thana'}
                  </label>
                  <input
                    type="text"
                    value={form.upazila}
                    onChange={(e) => setForm({ ...form, upazila: e.target.value })}
                    placeholder={lang === 'bn' ? 'যেমন: ধানমন্ডি, মিরপুর' : 'e.g., Dhanmondi, Mirpur'}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'বিস্তারিত ঠিকানা *' : 'Street / House / Flat *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.street}
                    onChange={(e) => { setForm({ ...form, street: e.target.value }); setFormErrors(prev => ({ ...prev, street: '' })); }}
                    placeholder={lang === 'bn' ? 'বাসা নং, রোড নং, এলাকা বিস্তারিত লিখুন' : 'House no, Road no, Area details'}
                    className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 ${formErrors.street ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
                  />
                  {formErrors.street && <p className="text-rose-500 text-[11px] mt-1">{formErrors.street}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'বিশেষ নির্দেশনা (ঐচ্ছিক)' : 'Delivery Note (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder={lang === 'bn' ? 'যেমন: বিকাল ৫টার পর ডেলিভারি দিন' : 'e.g. Deliver after 5pm'}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                {lang === 'bn' ? '২. পেমেন্ট মেথড নির্বাচন করুন' : '2. Payment Method'}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { id: 'BKASH', name: 'bKash', color: 'bg-pink-50 border-pink-300 text-pink-700' },
                  { id: 'NAGAD', name: 'Nagad', color: 'bg-orange-50 border-orange-300 text-orange-700' },
                  { id: 'ROCKET', name: 'Rocket', color: 'bg-purple-50 border-purple-300 text-purple-700' },
                  { id: 'COD', name: lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery', color: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
                ].map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-3 rounded-xl border-2 font-bold text-center transition active:scale-95 ${
                      paymentMethod === pm.id
                        ? `${pm.color} shadow-md scale-[1.02]`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>

              {paymentMethod !== 'COD' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                  <p className="font-bold text-amber-900">
                    📱 {lang === 'bn'
                      ? `আমাদের ${paymentMethod} মার্চেন্ট নম্বর: 01700-000000`
                      : `Send to our ${paymentMethod} merchant: 01700-000000`}
                  </p>
                  <p className="text-amber-700">
                    {lang === 'bn'
                      ? `পেমেন্টের পর ট্রানজেকশন আইডি (TrxID) নিচে লিখুন:`
                      : 'After payment, enter your Transaction ID below:'}
                  </p>
                  <input
                    type="text"
                    value={form.trxId}
                    onChange={(e) => { setForm({ ...form, trxId: e.target.value.toUpperCase() }); setFormErrors(prev => ({ ...prev, trxId: '' })); }}
                    placeholder="TrxID যেমন: 9B7X2M1A"
                    className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white font-mono uppercase ${formErrors.trxId ? 'border-rose-400' : 'border-amber-300'}`}
                  />
                  {formErrors.trxId && <p className="text-rose-500 text-[11px]">{formErrors.trxId}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              {lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
            </h3>

            {/* Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => {
                const title = lang === 'bn' ? item.product.titleBn : item.product.titleEn;
                const price = item.product.discountPrice ?? item.product.basePrice;
                return (
                  <div key={item.product.id} className="flex justify-between text-xs text-slate-600">
                    <span className="line-clamp-1 flex-1">{title} × {item.quantity}</span>
                    <span className="font-bold text-slate-800 ml-2">৳ {price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-bold text-slate-800">৳ {subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{lang === 'bn' ? `কুপন ডিসকাউন্ট (${couponCode})` : `Coupon (${couponCode})`}</span>
                  <span className="font-bold">-৳ {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'ডেলিভারি ফি' : 'Delivery Fee'}</span>
                <span className="font-bold text-slate-800">৳ {deliveryFee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>{lang === 'bn' ? 'সর্বমোট' : 'Total'}</span>
                <span className="text-brand-700 text-base">৳ {total}</span>
              </div>
            </div>

            {Object.keys(formErrors).length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{lang === 'bn' ? 'সব তথ্য সঠিকভাবে পূরণ করুন' : 'Please fix the errors above'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  {lang === 'bn' ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'Processing...'}
                </span>
              ) : (
                <>
                  <span>{lang === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              {lang === 'bn' ? '১০০% নিরাপদ ও ফরমালিন মুক্ত পণ্য' : '100% secure & formalin-free products'}
            </p>
          </div>
        </form>

        {/* Floating Mobile Sticky Payment Bar — Never Hidden on Mobile */}
        <div className="fixed bottom-[56px] sm:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-2xl lg:hidden flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 block leading-tight font-medium">{lang === 'bn' ? 'সর্বমোট প্রদানযোগ্য' : 'Total Payable'}</span>
            <span className="text-base font-black text-brand-700">৳ {total}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              const formEl = document.querySelector('form');
              if (formEl) formEl.requestSubmit();
            }}
            disabled={isSubmitting}
            className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-60 text-white py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/30 transition max-w-[200px]"
          >
            {isSubmitting ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            ) : (
              <>
                <span>{lang === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
