'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function Newsletter() {
  const { lang } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-14 bg-gradient-to-r from-brand-700 to-brand-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-4 backdrop-blur-xs">
          <Mail className="w-6 h-6 text-gold-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
          {lang === 'bn' ? 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন' : 'Subscribe to Our Fresh Newsletter'}
        </h2>
        <p className="text-brand-100 text-xs sm:text-sm max-w-lg mx-auto mb-6">
          {lang === 'bn' 
            ? 'পদ্মার তাজা ইলিশ ও রাজশাহীর আম আসার সাথে সাথেই অফার আপডেট ও ১০% কুপন ডিসকাউন্ট পান।'
            : 'Get instant updates when fresh Padma Hilsa arrives + receive 10% promo discounts.'}
        </p>

        {subscribed ? (
          <div className="bg-white/10 text-white p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 border border-white/20">
            <CheckCircle2 className="w-5 h-5 text-gold-400" />
            <span className="text-xs font-bold">
              {lang === 'bn' ? 'ধন্যবাদ! আপনার সাবস্ক্রিপশন সম্পন্ন হয়েছে।' : 'Thank you! You are subscribed.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={lang === 'bn' ? 'আপনার ইমেইল এড্রেস লিখুন...' : 'Enter your email address...'}
              className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-slate-950 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg"
            >
              <span>{lang === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
