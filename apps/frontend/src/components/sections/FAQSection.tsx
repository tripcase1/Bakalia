'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    questionBn: 'আপনারা মাছের ফ্রেশনেস এবং ফরমালিন মুক্ততা কীভাবে নিশ্চিত করেন?',
    questionEn: 'How do you guarantee fish freshness & formalin-free quality?',
    answerBn: 'আমরা সরাসরি পদ্মার জেলেদের কাছ থেকে মাছ সংগ্রহ করে আইস কন্টেইনারে ঢাকা পাঠাই। কোনো প্রকার রাসায়নিক বা ফরমালিন ব্যবহার করা হয় না। ডেলিভারির সময় মাছ চেক করে নিশ্চিত হতে পারবেন।',
    answerEn: 'We source directly from river fishermen and transport in temperature-controlled ice boxes without any chemicals or formalin.',
  },
  {
    questionBn: 'ডেলিভারি চার্জ কত এবং কত সময়ের মধ্যে ডেলিভারি দেওয়া হয়?',
    questionEn: 'What is the delivery fee and delivery timeline?',
    answerBn: 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ২৪ ঘণ্টার মধ্যে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি প্রদান করা হয়।',
    answerEn: 'Standard delivery fee inside Dhaka is BDT 60, delivered within 24 hours via Cash on Delivery.',
  },
  {
    questionBn: 'কী কী পেমেন্ট মেথড সাপোর্ট করেন?',
    questionEn: 'Which payment methods do you accept?',
    answerBn: 'আমরা ক্যাশ অন ডেলিভারি (COD), বিকাশ (bKash), নগদ (Nagad), ও রকেট (Rocket) সাপোর্ট করি।',
    answerEn: 'We support Cash on Delivery, bKash, Nagad, and Rocket MFS payments.',
  },
  {
    questionBn: 'পণ্য পছন্দ না হলে কি রিটার্ন করা সম্ভব?',
    questionEn: 'Can I return a product if I am not satisfied?',
    answerBn: 'হ্যাঁ, রাইডার ডেলিভারি দেওয়ার সময় আপনি মাছ বা আম যাচাই করে না পছন্দ হলে সাথে সাথেই সম্পূর্ণ বিনামূল্যে ফেরত দিতে পারবেন।',
    answerEn: 'Yes! You can inspect products upon delivery and return instantly with the rider if unsatisfied.',
  },
];

export function FAQSection() {
  const { lang } = useLanguageStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            {lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Have Any Questions?'}
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const q = lang === 'bn' ? faq.questionBn : faq.questionEn;
            const a = lang === 'bn' ? faq.answerBn : faq.answerEn;

            return (
              <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={`w-full p-4 text-left font-bold text-xs sm:text-sm flex items-center justify-between transition-colors ${
                    isOpen ? 'bg-emerald-50/50 text-emerald-950 font-extrabold' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className="pr-4 leading-snug">{q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                </button>

                {isOpen && (
                  <div className="p-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
