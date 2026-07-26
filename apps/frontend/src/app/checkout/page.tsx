'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { PaymentMethod } from '@/types';
import { ShieldCheck, CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { lang } = useLanguageStore();
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  const [form, setForm] = useState({
    name: 'মো: তানভীর হাসান',
    phone: '01712345678',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'ধানমন্ডি',
    street: 'রোড নং ২৭, বাসা নং ১৫/এ',
    trxId: '',
  });

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = getTotal();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = 'AHF-' + Math.floor(100000 + Math.random() * 900000);
    setCreatedOrderNumber(orderNum);
    setOrderSuccess(true);
    clearCart();
  };

  if (orderSuccess) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-brand-600 text-xs font-bold uppercase tracking-wider">
              {lang === 'bn' ? 'অর্ডার সফল হয়েছে!' : 'Order Placed Successfully!'}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {lang === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'} {createdOrderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              {lang === 'bn' 
                ? 'ধন্যবাদ! আপনার অর্ডারের ইনভয়েস এসএমএস ও ইমেইলে পাঠানো হয়েছে। ঢাকার ভেতরে ২৪ ঘণ্টার মধ্যে পৌঁছে যাবে।'
                : 'Thank you! Your order invoice has been sent. Delivery expected within 24 hours.'}
            </p>
          </div>

          {/* Invoice Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">প্রাপক:</span>
              <span className="font-bold text-slate-800">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">মোবাইল:</span>
              <span className="font-bold text-slate-800">{form.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পেমেন্ট মেথড:</span>
              <span className="font-bold text-brand-600">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>সর্বমোট প্রদানযোগ্য:</span>
              <span className="text-brand-700 text-sm">৳ {total}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>ইনভয়েস ডাউনলোড</span>
            </button>
            <Link 
              href="/"
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>হোম পেজে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-8">
          {lang === 'bn' ? 'অর্ডার চেকআউট' : 'Order Checkout'}
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                {lang === 'bn' ? '১. ডেলিভারির ঠিকানা' : '1. Delivery Address'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রাপকের নাম</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">বিভাগ</label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm({ ...form, division: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                  >
                    <option value="ঢাকা">ঢাকা</option>
                    <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                    <option value="রাজশাহী">রাজশাহী</option>
                    <option value="সিলেট">সিলেট</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">জেলা / থানা</label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">বিস্তারিত ঠিকানা (বাসা নং, রোড নং)</label>
                  <textarea
                    rows={2}
                    required
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                {lang === 'bn' ? '২. পেমেন্ট মেথড নির্বাচন করুন' : '2. Payment Method'}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { id: 'BKASH', name: 'bKash (বিকাশ)', color: 'bg-pink-50 border-pink-200 text-pink-700' },
                  { id: 'NAGAD', name: 'Nagad (নগদ)', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                  { id: 'ROCKET', name: 'Rocket (রকেট)', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                  { id: 'COD', name: 'Cash on Delivery', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                ].map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-3 rounded-xl border font-bold text-center transition ${
                      paymentMethod === pm.id
                        ? `${pm.color} ring-2 ring-brand-500`
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>

              {paymentMethod !== 'COD' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">
                    আমাদের মার্চেন্ট নম্বরে (01700-000000) পেমেন্ট করে ট্রানজেকশন আইডি (TrxID) প্রদান করুন:
                  </p>
                  <input
                    type="text"
                    required
                    value={form.trxId}
                    onChange={(e) => setForm({ ...form, trxId: e.target.value })}
                    placeholder="TrxID লিখুন (যেমন: 9B7X2M1A)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              {lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>পণ্যের সাবটোটাল</span>
                <span className="font-bold text-slate-800">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি ফি (ঢাকা মেট্রো)</span>
                <span className="font-bold text-slate-800">৳ {deliveryFee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>সর্বমোট</span>
                <span className="text-brand-700 text-base">৳ {total}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition"
            >
              <span>{lang === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
