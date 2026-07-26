'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { Package, Clock, CheckCircle2, MapPin, User, ShieldCheck } from 'lucide-react';

const CUSTOMER_ORDERS = [
  {
    id: 'AHF-849201',
    date: '২৬ জুলাই, ২০২৬',
    items: 'পদ্মার তাজা প্রিমিয়াম ইলিশ (১.৫ কেজি) x ১',
    total: 1950,
    status: 'PROCESSING',
    statusBn: 'প্রসেসিং হচ্ছে',
    paymentMethod: 'bKash',
  },
  {
    id: 'AHF-710294',
    date: '১৮ জুলাই, ২০২৬',
    items: 'সুন্দরবনের খাঁটি কাঁচা মধু (৫০০ গ্রাম) x ২',
    total: 1700,
    status: 'DELIVERED',
    statusBn: 'ডেলিভারি সম্পন্ন',
    paymentMethod: 'COD',
  },
];

export default function DashboardPage() {
  const { lang } = useLanguageStore();

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* User Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            এম
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">মো: তানভীর হাসান</h1>
              <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {lang === 'bn' ? 'ভেরিফাইড কাস্টমার' : 'Verified Customer'}
              </span>
            </div>
            <p className="text-xs text-slate-500">মোবাইল: +৮৮০ ১৭১২-৩৪NT৭৮ | ইমেইল: tanveer@gmail.com</p>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5" />
              ধানমন্ডি ২৭, ঢাকা-১২০৯
            </p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Package className="w-5 h-5 text-brand-600" />
            <h2 className="font-extrabold text-base text-slate-900">
              {lang === 'bn' ? 'আমার সাম্প্রতিক অর্ডারসমূহ' : 'My Recent Orders'}
            </h2>
          </div>

          <div className="space-y-4">
            {CUSTOMER_ORDERS.map((order) => (
              <div key={order.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{order.id}</span>
                    <span className="text-slate-400">({order.date})</span>
                  </div>
                  <p className="text-slate-700 font-medium">{order.items}</p>
                  <p className="text-slate-500">পেমেন্ট মেথড: <span className="font-bold text-slate-800">{order.paymentMethod}</span></p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <span className="text-base font-black text-brand-700">৳ {order.total}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    order.status === 'DELIVERED' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status === 'DELIVERED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {order.statusBn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
