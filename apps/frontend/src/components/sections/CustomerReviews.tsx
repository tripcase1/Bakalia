'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { Star, Quote, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'তানভীর আহমেদ',
    location: 'ধানমন্ডি, ঢাকা',
    comment: 'পদ্মার ১.৫ কেজি সাইজের ইলিশ অর্ডার করেছিলাম। ডিমের ভরা ডিমওয়ালা তাজা ইলিশ ছিল, স্বাদে একদম অরিজিনাল পদ্মার মাছের মত!',
    rating: 5,
    date: '২ দিন আগে',
  },
  {
    id: 2,
    name: 'ফারহানা ইয়াসমিন',
    location: 'উত্তরা, ঢাকা',
    comment: 'সুন্দরবনের খলিসা ফুলের মধু সত্যিই অসাধারণ। ঘন ও প্রাকৃতিক সুবাস আছে। ডেলিভারিও খুব দ্রুত ছিল।',
    rating: 5,
    date: '১ সপ্তাহ আগে',
  },
  {
    id: 3,
    name: 'ইমতিয়াজ হোসেন',
    location: 'গুলশান, ঢাকা',
    comment: 'রাজশাহীর কাটিমন আম এবং কক্সবাজারের লোট্টা শুঁটকি দুটোই একদম কেমিক্যাল ফ্রি ফ্রেশ। আল হেরা ফ্রেশ সার্ভিস দারুণ!',
    rating: 5,
    date: '৩ দিন আগে',
  },
];

export function CustomerReviews() {
  const { lang } = useLanguageStore();

  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-brand-600 text-xs font-bold uppercase tracking-wider">
            {lang === 'bn' ? 'গ্রাহকদের মূল্যায়ন' : 'Customer Reviews'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {lang === 'bn' ? 'আমাদের সন্তুষ্ট গ্রাহকদের মতামত' : 'What Our Customers Say'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            {lang === 'bn' ? '১০,০০০+ গ্রাহকের বিশ্বস্ততায় আল হেরা ফ্রেশ' : 'Trusted by over 10,000+ satisfied households'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-brand-100 absolute top-4 right-4" />
              <div>
                <div className="flex items-center gap-1 text-gold-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    {rev.name}
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600 fill-brand-100" />
                  </h4>
                  <span className="text-[11px] text-slate-400">{rev.location}</span>
                </div>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
