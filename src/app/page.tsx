"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Shield, Bell, Droplet, AlertTriangle, Home, Briefcase, 
  ShoppingCart, Calendar, ChevronRight, Users, ShieldCheck, 
  Award, Heart, LayoutGrid, Flame, School, Hospital, ArrowRight,
  Newspaper, Info, Star
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getPrayerTimes, getNextPrayer, fetchLivePrayerTimes, PrayerTimes } from "@/lib/prayerTimes";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Custom Mosque SVG Icon
const MosqueIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2v3M12 5c-2.5 0-4.5 2-4.5 4.5V19h9V9.5C16.5 7 14.5 5 12 5z" />
    <path d="M3 21h18M6 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5M15 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5" />
    <path d="M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

// Custom realistic emergency siren beacon icon
const SirenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M4 20h16a1 1 0 0 0 1-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1z" />
    <path d="M8 15v-4a4 4 0 0 1 8 0v4" />
    <path d="M12 2v3M5 6l2.2 2.2M19 6l-2.2 2.2M2 12h3M19 12h3" />
  </svg>
);
export default function HomePage() {
  const { 
    theme, language, t,
    setIsSearchOpen,
    setAuthMode, setShowAuthModal,
    isPrayerExpanded, setIsPrayerExpanded,
    triggerSOS, sosActive, sosCountdown,
    gpsCoords
  } = useAppContext();

  const [activeMobileTab, setActiveMobileTab] = useState<"news" | "nearby" | "highlights">("news");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(getPrayerTimes(new Date()));

  // Dynamic Prayer Times Loader
  useEffect(() => {
    const loadPrayers = async () => {
      const live = await fetchLivePrayerTimes(gpsCoords?.lat, gpsCoords?.lng);
      if (live) {
        setPrayerTimes(live);
      }
    };
    loadPrayers();
  }, [gpsCoords]);

  const [dbNews, setDbNews] = useState<any[]>([]);

  // Live News Firestore Subscription Sync
  useEffect(() => {
    const q = query(collection(db, "news"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: language === "en" ? (data.title || data.titleBn) : (data.titleBn || data.title),
          category: language === "en" ? (data.category || "General") : (data.categoryBn || data.category || "সাধারণ"),
          categoryColor: data.categoryColor || "bg-blue-50 text-blue-600 dark:bg-[#04142F] dark:text-[#4A89DA] border border-blue-100 dark:border-[#4A89DA]/20",
          time: data.time || (language === "en" ? "Just now" : "এইমাত্র"),
          views: data.views || (language === "en" ? "0 views" : "০ ভিউ"),
          createdAt: data.createdAt
        });
      });
      if (items.length > 0) {
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setDbNews(items);
      }
    }, (error) => {
      console.warn("News subscription failed:", error);
    });
    return () => unsubscribe();
  }, [language]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isLight = theme === "light";

  // Data lists
  const newsItems = [
    {
      title: language === "en" 
        ? "Youth coordination campaign to ensure purity in Bakalia Area"
        : "বাকলিয়ায় যুব সমাজের উদ্যোগে পরিচ্ছন্নতা অভিযান পরিচালনা",
      category: language === "en" ? "Civic Activity" : "নাগরিক উদ্যোগ",
      categoryColor: "bg-emerald-50 text-emerald-600 dark:bg-[#22444B] dark:text-[#0CA671] border border-emerald-100 dark:border-[#0CA671]/20",
      time: language === "en" ? "2 hours ago" : "২ ঘণ্টা আগে",
      views: language === "en" ? "1,240 views" : "১,২৪০ ভিউ",
    },
    {
      title: language === "en" 
        ? "Chittagong Mayor visits Ward 17 to review municipal development works"
        : "ওয়ার্ড ১৭ পরিদর্শনে চসিক মেয়র, উন্নয়ন কার্যক্রম তদারকি",
      category: language === "en" ? "Official Update" : "সরকারি নোটিশ",
      categoryColor: "bg-blue-50 text-blue-600 dark:bg-[#04142F] dark:text-[#4A89DA] border border-blue-100 dark:border-[#4A89DA]/20",
      time: language === "en" ? "5 hours ago" : "৫ ঘণ্টা আগে",
      views: language === "en" ? "856 views" : "৮৫৬ ভিউ",
    }
  ];

  // Quick Access items mapping
  const quickAccessServices = [
    { 
      id: "complaints", 
      icon: Shield, 
      title: t("complaints"), 
      desc: t("complaintsDesc"),
      iconBg: isLight ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#22444B] text-[#0CA671] border border-[#0CA671]/20",
      href: "/complaints"
    },
    { 
      id: "notices", 
      icon: Bell, 
      title: t("policeNotices"), 
      desc: t("policeNoticesDesc"),
      iconBg: isLight ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-[#04142F] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/police"
    },
    { 
      id: "lost-found", 
      icon: Search, 
      title: t("lostFound"), 
      desc: t("lostFoundDesc"),
      iconBg: isLight ? "bg-slate-50 text-slate-600 border border-slate-100" : "bg-[#04142F] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/lost-found"
    },
    { 
      id: "blood", 
      icon: Droplet, 
      title: t("bloodDonation"), 
      desc: t("bloodDonationDesc"),
      iconBg: isLight ? "bg-red-50 text-red-600 border border-red-100" : "bg-[#481C21] text-red-500 border border-red-500/10",
      href: "/blood"
    },
    { 
      id: "tolet", 
      icon: Home, 
      title: t("houseRent"), 
      desc: t("houseRentDesc"),
      iconBg: isLight ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#22444B] text-[#0CA671] border border-[#0CA671]/20",
      href: "/house-rent"
    },
    { 
      id: "jobs", 
      icon: Briefcase, 
      title: t("jobs"), 
      desc: t("jobsDesc"),
      iconBg: isLight ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-[#01205B] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/jobs"
    },
    { 
      id: "marketplace", 
      icon: ShoppingCart, 
      title: t("marketplace"), 
      desc: t("marketplaceDesc"),
      iconBg: isLight ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-[#0D1B2A] text-amber-500 border border-[#D3D9E2]/10",
      href: "/marketplace"
    },
    { 
      id: "mosques", 
      icon: MosqueIcon, 
      title: t("mosques"), 
      desc: t("mosquesDesc"),
      iconBg: isLight ? "bg-teal-50 text-teal-600 border border-teal-100" : "bg-[#22444B] text-teal-400 border border-teal-500/20",
      href: "/mosque"
    },
    { 
      id: "events", 
      icon: Calendar, 
      title: t("events"), 
      desc: t("eventsDesc"),
      iconBg: isLight ? "bg-violet-50 text-violet-600 border border-violet-100" : "bg-[#01205B] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/events"
    }
  ];

  // Mobile navigation grid elements (4 hardcoded cards)
  const mobileServicesList = [
    { key: "policeHelp", title: t("policeHelp"), desc: t("policeHelpDesc"), icon: Shield, color: "text-blue-500 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#04142F]", href: "/police" },
    { key: "emergencyServices", title: t("emergencyServices"), desc: t("emergencyServicesDesc"), icon: AlertTriangle, color: "text-red-500 bg-red-50 dark:text-rose-500 dark:bg-[#481C21]", href: "/emergency" },
    { key: "mosquesNearYou", title: t("mosquesNearYou"), desc: t("mosquesNearYouDesc"), icon: MosqueIcon, color: "text-emerald-500 bg-emerald-50 dark:text-[#0CA671] dark:bg-[#22444B]", href: "/mosque" },
    { key: "marketplaceBuySell", title: t("marketplaceBuySell"), desc: t("marketplaceBuySellDesc"), icon: ShoppingCart, color: "text-amber-500 bg-amber-50 dark:text-amber-550 dark:bg-[#01205B]", href: "/marketplace" },
    { key: "jobsFind", title: t("jobsFind"), desc: t("jobsFindDesc"), icon: Briefcase, color: "text-purple-500 bg-purple-50 dark:text-[#4A89DA] dark:bg-[#01205B]", href: "/jobs" },
    { key: "bloodDonors", title: t("bloodDonors"), desc: t("bloodDonorsDesc"), icon: Droplet, color: "text-rose-500 bg-rose-50 dark:text-rose-500 dark:bg-[#481C21]", href: "/blood" },
    { key: "documents", title: t("documents"), desc: t("documentsDesc"), icon: Newspaper, color: "text-teal-500 bg-teal-50 dark:text-teal-400 dark:bg-[#22444B]", href: "/documents" },
    { key: "community", title: t("community"), desc: t("communityDesc"), icon: Users, color: "text-blue-500 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#04142F]", href: "/community" }
  ];

  // Formatting date for widgets
  const formatDateOnly = () => {
    return currentTime.toLocaleDateString(language === "en" ? "en-US" : "bn-BD", { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDayName = () => {
    return currentTime.toLocaleDateString(language === "en" ? "en-US" : "bn-BD", { weekday: 'long' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[#F4F6F9] dark:bg-[#010818]">
      
      {/* ==================== MOBILE LANDING PAGE VIEW (md:hidden) ==================== */}
      <div className="md:hidden flex flex-col min-h-screen bg-[#F4F6F9] dark:bg-[#010818] pb-20 relative text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* 2. Hero Search Box */}
        <div className="px-4 py-5 bg-gradient-to-b from-white to-slate-50/50 dark:from-[#010818] dark:to-[#04142F]/30 transition-colors">
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-black tracking-tight text-slate-905 dark:text-white leading-tight">
              {language === "en" ? "Smart Community Operating System" : "স্মার্ট কমিউনিটি অপারেটিং সিস্টেম"}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
              {language === "en" ? "Bakalia Ward, Chattogram" : "বাকলিয়া ওয়ার্ড, চট্টগ্রাম"}
            </p>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full mt-4 flex items-center justify-between bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm text-left active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4.5 h-4.5 text-slate-400 dark:text-[#0CA671] shrink-0" />
                <span className="text-[11px] text-slate-400 font-semibold">{t("searchPlaceholder")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>
          </div>
        </div>

        {/* 3. Hero Prayer & Info Grid Card */}
        <div className="px-4 -mt-2">
          <div className="glass-card bg-white/95 dark:bg-[#01205B]/85 border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-lg relative overflow-hidden text-slate-850 dark:text-white max-w-md mx-auto">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-[#0CA671]" />
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <MosqueIcon className="w-5 h-5 text-[#0CA671]" />
                <div>
                  <span className="block text-xs font-black leading-none">{t("prayerTimesTitle")}</span>
                  <span className="block text-[9px] text-slate-400 dark:text-slate-350 mt-1 leading-none">{t("prayerTimesLoc")}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[9.5px] text-slate-500 dark:text-slate-400 leading-none">{formatDateOnly()}</span>
                <span className="text-[11px] font-bold font-mono text-emerald-600 dark:text-[#0CA671] leading-none mt-1 block">
                  {currentTime.toLocaleTimeString(language === "en" ? "en-US" : "bn-BD", { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit', 
                    hour12: true 
                  })}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2 text-center text-[10px]">
              {[
                { name: t("fajr"), time: prayerTimes.Fajr },
                { name: t("dhuhr"), time: prayerTimes.Dhuhr },
                { name: t("asr"), time: prayerTimes.Asr },
                { name: t("maghrib"), time: prayerTimes.Maghrib },
                { name: t("isha"), time: prayerTimes.Isha }
              ].map((p, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#04142F]/50 border border-slate-150/50 dark:border-slate-800/30">
                  <span className="block text-slate-400 dark:text-slate-400 font-extrabold uppercase text-[8px] tracking-wider leading-none">{p.name}</span>
                  <span className="block font-black text-slate-800 dark:text-slate-205 font-mono text-[9.5px] mt-1 leading-none">{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Quick Mobile Services Grid */}
        <div className="px-4 mt-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("quickServices")}
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {mobileServicesList.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <a 
                    key={idx}
                    href={item.href}
                    onClick={(e) => {
                      if (item.key === "emergencyServices") {
                        e.preventDefault();
                        alert(language === "en" 
                          ? "Emergency Helplines:\n- National Help Desk: 999\n- Fire Service: +880-31-713356\n- Ambulance: +880-31-2521526" 
                          : "জরুরি হেল্পলাইন নম্বরসমূহ:\n- জাতীয় জরুরি সেবা: ৯৯৯\n- ফায়ার সার্ভিস: +৮৮০-৩১-৭১৩৩৫৬\n- অ্যাম্বুলেন্স: +৮৮০-৩১-২৫২১৫২৬"
                        );
                      }
                    }}
                    className="flex flex-col items-center text-center p-2 rounded-2xl bg-white dark:bg-[#01205B] border border-slate-200/50 dark:border-slate-800/30 shadow-sm active:scale-95 transition-all"
                  >
                    <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center ${item.color} shadow-sm shrink-0`}>
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[9.5px] font-black text-slate-800 dark:text-slate-200 leading-tight mt-1.5 truncate w-full">{item.title}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Mobile Dynamic Columns (News, Highlights) */}
        <div className="px-4 mt-7">
          <div className="max-w-md mx-auto">
            <div className="flex p-0.5 bg-slate-100 dark:bg-[#04142F]/60 border border-slate-200/50 dark:border-slate-800/30 rounded-lg mb-4 text-[10px] font-bold">
              {[
                { key: "news", label: t("latestNews") },
                { key: "nearby", label: t("nearbyServices") },
                { key: "highlights", label: t("communityHighlights") }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveMobileTab(tab.key as any)}
                  className={`flex-1 py-1.5 rounded transition-all text-center ${
                    activeMobileTab === tab.key 
                      ? "bg-white dark:bg-[#01205B] text-blue-650 dark:text-white shadow-sm" 
                      : "text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Tab Contents */}
            {activeMobileTab === "news" && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                {(dbNews.length > 0 ? dbNews : newsItems).map((news, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-[#01205B] border border-slate-200/50 dark:border-slate-800/30 rounded-xl shadow-sm">
                    <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${news.categoryColor}`}>
                      {news.category}
                    </span>
                    <h3 className="text-[11.5px] font-black text-slate-850 dark:text-slate-100 mt-2 leading-snug">
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] text-slate-400 mt-2.5 font-bold">
                      <span>{news.time}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{news.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMobileTab === "nearby" && (
              <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                {[
                  { label: t("hospitals"), count: 3, icon: Hospital, bg: "bg-red-50 text-red-500 dark:bg-rose-500/10 dark:text-rose-455" },
                  { label: t("policeStation"), count: 2, icon: Shield, bg: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-[#4A89DA]" },
                  { label: t("schools"), count: 8, icon: School, bg: "bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400" },
                  { label: t("fireService"), count: 1, icon: Flame, bg: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-500" }
                ].map((n, idx) => {
                  const Icon = n.icon;
                  return (
                    <div key={idx} className="p-3 bg-white dark:bg-[#01205B] border border-slate-200/50 dark:border-slate-800/30 rounded-xl shadow-sm flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-black text-slate-800 dark:text-slate-200 truncate max-w-[80px]">{n.label}</span>
                        <span className="block text-[9px] text-[#0CA671] dark:text-[#0CA671] font-bold mt-1.5">{n.count} {t("nearbySuffix")}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeMobileTab === "highlights" && (
              <div className="p-3.5 bg-white dark:bg-[#01205B] border border-slate-200/50 dark:border-slate-800/30 rounded-xl shadow-sm text-center py-7 animate-in fade-in duration-200">
                <Award className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200">
                  {language === "en" ? "Leaderboard Commencing Soon" : "লিডারবোর্ড শীঘ্রই শুরু হচ্ছে"}
                </h4>
                <p className="text-[9px] text-slate-400 mt-1 max-w-xs mx-auto">
                  {language === "en" ? "Community volunteers tracking will launch with ward milestones." : "ওয়ার্ড মাইলস্টোনের সাথে কমিউনিটি স্বেচ্ছাসেবক ট্র্যাকিং চালু করা হবে।"}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ==================== DESKTOP LANDING PAGE VIEW (hidden md:block) ==================== */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left: Hero Title & CTA buttons */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#04142F] border border-blue-100 dark:border-[#4A89DA]/20 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-[#4A89DA]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>{t("systemTag")}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4.5xl font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight">
              <span className="block">{t("heroTitle")}</span>
              <span className="inline-flex gap-2.5">
                <span className="text-emerald-500 dark:text-[#0CA671] font-black">{t("safer")}</span>
                <span className="text-blue-600 dark:text-[#4A89DA] font-black">{t("bakalia")}</span>
              </span>
            </h1>

            <p className="max-w-lg mx-auto lg:mx-0 text-slate-600 dark:text-slate-350 text-xs sm:text-[12.5px] leading-relaxed">
              {t("heroDesc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
              <button 
                onClick={() => {
                  const el = document.getElementById("quick-access");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-750 dark:bg-[#0CA671] dark:hover:bg-[#0CA671]/95 transition-all text-xs font-black shadow-md shadow-blue-500/10 dark:shadow-[#0CA671]/10 flex items-center justify-center gap-1.5 active:scale-[0.98] select-none"
              >
                <LayoutGrid className="w-4 h-4" />
                {t("exploreServices")}
              </button>
            </div>
          </div>

          {/* Desktop Right: Prayer times widget */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-card bg-white/95 dark:bg-[#01205B]/85 border-slate-200 dark:border-slate-800/80 rounded-xl p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden text-slate-850 dark:text-white">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-[#0CA671]" />
              
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
                  <MosqueIcon className="w-5.5 h-5.5 text-[#0CA671]" />
                  <div>
                    <span className="block text-sm font-black leading-none">{t("prayerTimesTitle")}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-350 mt-1 leading-none">{t("prayerTimesLoc")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-none">{formatDateOnly()}</span>
                  <span className="text-[12px] font-bold font-mono text-emerald-600 dark:text-[#0CA671] leading-none mt-1 block">
                    {currentTime.toLocaleTimeString(language === "en" ? "en-US" : "bn-BD", { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit', 
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4.5 space-y-2">
                {[
                  { name: t("fajr"), time: prayerTimes.Fajr, icon: "🌅" },
                  { name: t("dhuhr"), time: prayerTimes.Dhuhr, icon: "☀️" },
                  { name: t("asr"), time: prayerTimes.Asr, icon: "🌤️" },
                  { name: t("maghrib"), time: prayerTimes.Maghrib, icon: "🌇" },
                  { name: t("isha"), time: prayerTimes.Isha, icon: "🌙" }
                ].map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#04142F]/50 border border-slate-150/50 dark:border-slate-800/30 hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#01205B]/80 transition-all font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{p.icon}</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{p.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 font-mono">{p.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 3. STATISTICS SECTION & EMERGENCY SOS */}
        <section className="py-10 bg-white dark:bg-[#010818] border-y border-slate-200 dark:border-slate-905 mt-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Stats list (9 columns) */}
            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t("registeredCitizens"), value: "125,430", growth: "+2.4% " + t("thisMonth"), icon: Users, iconColor: "text-blue-500 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#4A89DA]/10" },
                { label: t("resolvedComplaints"), value: "1,824", growth: "+18% " + t("thisMonth"), icon: ShieldCheck, iconColor: isLight ? "text-emerald-600 bg-emerald-50" : "text-[#0CA671] bg-[#0CA671]/10" },
                { label: t("activeVolunteers"), value: "450", growth: "+35 " + t("thisMonth"), icon: Award, iconColor: isLight ? "text-purple-650 bg-purple-50" : "text-[#0CA671] bg-[#0CA671]/10" },
                { label: t("dailyVisitors"), value: "14,230", growth: "+6.3% " + t("thisWeek"), icon: Heart, iconColor: isLight ? "text-amber-600 bg-amber-50" : "text-[#0CA671] bg-[#0CA671]/10" }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-350">{stat.label}</span>
                      <span className="block text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{stat.value}</span>
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-[#0CA671] mt-0.5 block">{stat.growth}</span>
                    </div>
                    <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center shrink-0 ${stat.iconColor} border border-slate-200 dark:border-slate-800`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Emergency SOS Card (3 columns) */}
            <div className="lg:col-span-3">
              <button 
                onClick={triggerSOS}
                className={`w-full h-full text-left p-4.5 rounded-xl border transition-all flex items-center justify-between group relative overflow-hidden active:scale-[0.99] ${
                  isLight 
                    ? "bg-white border-slate-200 shadow-sm hover:border-red-300"
                    : "bg-[#481C21] border-[#481C21]/60 shadow-lg shadow-rose-950/20 hover:border-red-500/40 text-white"
                }`}
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 dark:bg-[#EF4444]/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
                
                <div className="flex-1 mr-3">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-red-500 animate-pulse">{t("emergencyWidgetTitle")}</span>
                  <span className="block text-[11px] font-black text-slate-850 dark:text-slate-100 mt-1 leading-snug">{t("emergencyWidgetDesc")}</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-600 dark:text-rose-350 mt-2 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-900/30 select-none">
                    <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
                    <span>{t("tapForSos")}</span>
                  </span>
                </div>
                
                <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/30 relative border border-white/10 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
                  <SirenIcon className="w-5.5 h-5.5 text-white relative z-10 animate-pulse" />
                </div>
              </button>
            </div>

          </div>
        </section>

        {/* 4. QUICK ACCESS SERVICES */}
        <section id="quick-access" className="py-12 bg-[#F4F6F9] dark:bg-[#010818] mt-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                {t("quickAccessTitle")}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t("quickAccessDesc")}
              </p>
            </div>
            
            <button 
              onClick={() => alert("All services are loading...")}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-[#01205B] transition-all flex items-center gap-1 shadow-sm select-none"
            >
              <span>{t("viewAllServices")}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-450" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickAccessServices.map((service) => {
              const Icon = service.icon;
              return (
                <a 
                  key={service.id} 
                  href={service.href}
                  className="group flex flex-col items-center justify-center p-3 sm:flex-row sm:items-start sm:justify-start sm:p-4 bg-white dark:bg-[#01205B] border border-slate-200/80 dark:border-slate-800/80 rounded-xl transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${service.iconBg}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-start justify-center min-w-0 mt-2 sm:mt-0 sm:ml-3">
                    <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#0CA671] transition-colors leading-tight text-center sm:text-left truncate max-w-[120px] sm:max-w-none">
                      {service.title}
                    </h3>
                    <p className="hidden sm:block mt-1 text-[10px] text-slate-450 dark:text-[#859798] leading-snug group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {service.desc}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 5. MULTI-COLUMN SECTIONS (News, Nearby, Highlights) */}
        <section className="py-10 border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-[#010818]/30">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Latest News */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{t("latestNews")}</span>
                <a href="/news" className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">
                  {t("viewAll")} <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="space-y-4">
                {(dbNews.length > 0 ? dbNews : newsItems).map((news, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#01205B] border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <span className={`inline-block px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase rounded ${news.categoryColor}`}>
                      {news.category}
                    </span>
                    <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 mt-2.5 leading-snug">
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-3.5 text-[9.5px] text-slate-405 dark:text-slate-450 mt-3.5 font-bold">
                      <span>{news.time}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <span>{news.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Nearby Services */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{t("nearbyServices")}</span>
                <a href="/map" className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">
                  {t("viewMap")} <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t("hospitals"), count: 3, icon: Hospital, bg: "bg-red-50 text-red-500 dark:bg-rose-500/10 dark:text-rose-455" },
                  { label: t("policeStation"), count: 2, icon: Shield, bg: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-[#4A89DA]" },
                  { label: t("schools"), count: 8, icon: School, bg: "bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400" },
                  { label: t("fireService"), count: 1, icon: Flame, bg: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-500" }
                ].map((n, idx) => {
                  const Icon = n.icon;
                  return (
                    <div key={idx} className="p-3 bg-white dark:bg-[#01205B] border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                      <div className="min-w-0">
                        <span className="block text-[10.5px] font-bold text-slate-800 dark:text-slate-250 truncate">{n.label}</span>
                        <span className="block text-[9.5px] text-[#0CA671] dark:text-[#0CA671] font-extrabold mt-1.5">{n.count} {t("nearbySuffix")}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Leaderboard Highlights */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{t("communityHighlights")}</span>
              </div>
              <div className="p-4 bg-white dark:bg-[#01205B] border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm text-center py-8">
                <Award className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {language === "en" ? "Leaderboard Commencing Soon" : "লিডারবোর্ড শীঘ্রই শুরু হচ্ছে"}
                </h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  {language === "en" ? "Volunteers leaderboard tracking and points tally will go live shortly." : "স্বেচ্ছাসেবকদের লিডারবোর্ড ট্র্যাকিং এবং পয়েন্ট তালিকা শীঘ্রই চালু হবে।"}
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}
