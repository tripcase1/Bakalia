'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { Star, Quote, CheckCircle2, Award } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'তানভীর আহমেদ',
    location: 'ধানমন্ডি, ঢাকা',
    comment: 'পদ্মার ১.৫ কেজি সাইজের ইলিশ অর্ডার করেছিলাম। ডিমের ভরা ডিমওয়ালা তাজা ইলিশ ছিল, স্বাদে একদম অরিজিনাল পদ্মার মাছের মত!',
    rating: 5,
    date: '২ দিন আগে',
    verified: true,
  },
  {
    id: 2,
    name: 'ফারহানা ইয়াসমিন',
    location: 'উত্তরা, ঢাকা',
    comment: 'সুন্দরবনের খলিসা ফুলের মধু সত্যিই অসাধারণ। ঘন ও প্রাকৃতিক সুবাস আছে। ডেলিভারিও খুব দ্রুত ছিল।',
    rating: 5,
    date: '১ সপ্তাহ আগে',
    verified: true,
  },
  {
    id: 3,
    name: 'ইমতিয়াজ হোসেন',
    location: 'গুলশান, ঢাকা',
    comment: 'রাজশাহীর কাটিমন আম এবং কক্সবাজারের লোট্টা শুঁটকি দুটোই একদম কেমিক্যাল ফ্রি ফ্রেশ। আল হেরা ফ্রেশ সার্ভিস দারুণ!',
    rating: 5,
    date: '৩ দিন আগে',
    verified: true,
  },
];

export function CustomerReviews() {
  const { lang } = useLanguageStore();

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'bn' ? '১০,০০০+ সন্তুষ্ট পরিবার' : '10,000+ Happy Households'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            {lang === 'bn' ? 'আমাদের সন্তুষ্ট গ্রাহকদের মতামত' : 'What Our Customers Say'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {lang === 'bn' ? 'ফরমালিন মুক্ত অরিজিনাল পণ্য ও দ্রুততম হোম ডেলিভারির বাস্তব অভিজ্ঞতা' : 'Real reviews from families across Dhaka'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-slate-50/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between group">
              <Quote className="w-8 h-8 text-slate-200 absolute top-5 right-5 group-hover:text-emerald-200 transition" />
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      {rev.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <span className="text-[10px] text-slate-400 block">{rev.location}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
